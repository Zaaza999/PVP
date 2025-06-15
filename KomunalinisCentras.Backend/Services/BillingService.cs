using System;
using System.Linq;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;

namespace KomunalinisCentras.Backend.Services
{
    public class BillingService : IBillingService
    {
        private readonly IInvoiceRepository _invoiceRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IPaymentGateway    _gateway;

        public BillingService(
            IInvoiceRepository invoiceRepo,
            IPaymentRepository paymentRepo,
            IPaymentGateway    gateway)
        {
            _invoiceRepo = invoiceRepo;
            _paymentRepo = paymentRepo;
            _gateway     = gateway;
        }

        public async Task<string> InitiatePaymentAsync(int invoiceId, decimal amount)
        {
            var invoice = await _invoiceRepo.GetByIdAsync(invoiceId)
                ?? throw new KeyNotFoundException("Invoice not found");

            if (invoice.Status == InvoiceStatus.Paid)
                throw new InvalidOperationException("Invoice already paid");

            var paidTotal = invoice.Payments
                ?.Where(p => p.Status == PaymentStatus.Succeeded)
                .Sum(p => p.Amount) ?? 0m;

            var remaining = invoice.Amount - paidTotal;
            if (amount <= 0 || amount > remaining)
                throw new ArgumentOutOfRangeException(nameof(amount), $"Amount must be between 0 and {remaining:0.00}");

            var payment = new Payment
            {
                InvoiceId = invoice.Id,
                Provider  = "Paysera",
                Amount    = amount,
                Currency  = invoice.Currency,
                Status    = PaymentStatus.Initiated,
                CreatedAt = DateTime.UtcNow
            };
            await _paymentRepo.CreateAsync(payment);

            var redirect = await _gateway.StartPaymentAsync(invoice, payment);

            invoice.Status = InvoiceStatus.Pending;
            await _invoiceRepo.UpdateAsync(invoice);

            return redirect;
        }

        public async Task HandleProviderCallbackAsync(string provider, string payload)
        {
            var (txnId, status, raw) = _gateway.ParseCallback(payload);

            var payment = await _paymentRepo.GetByProviderTxnAsync(provider, txnId)
                ?? throw new KeyNotFoundException("Payment not found");

            payment.Status     = status;
            payment.ProviderTxnId = txnId;
            payment.UpdatedAt  = DateTime.UtcNow;
            payment.RawPayload = raw;
            await _paymentRepo.UpdateAsync(payment);

            var invoice = await _invoiceRepo.GetByIdAsync(payment.InvoiceId)
                ?? throw new KeyNotFoundException("Invoice not found");

            if (status == PaymentStatus.Succeeded)
            {
                var totalPaid = invoice.Payments
                    .Where(p => p.Status == PaymentStatus.Succeeded)
                    .Sum(p => p.Amount);

                if (totalPaid >= invoice.Amount)
                {
                    invoice.Status = InvoiceStatus.Paid;
                    invoice.PaidAt = DateTime.UtcNow;
                }
                else
                {
                    invoice.Status = InvoiceStatus.Pending;
                }
            }
            else if (status == PaymentStatus.Failed)
            {
                var anySucceeded = invoice.Payments
                    .Any(p => p.Status == PaymentStatus.Succeeded);
                invoice.Status = anySucceeded ? InvoiceStatus.Pending : InvoiceStatus.Issued;
            }

            await _invoiceRepo.UpdateAsync(invoice);
        }
    }
}
