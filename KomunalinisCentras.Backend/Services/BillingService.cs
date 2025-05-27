// Services/BillingService.cs
using System;
using System.Linq;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using KomunalinisCentras.Backend.Services;

namespace KomunalinisCentras.Backend.Services
{
    public class BillingService : IBillingService
    {
        private readonly IInvoiceRepository _invoiceRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IPaymentGateway _gateway;

        public BillingService(
            IInvoiceRepository invoiceRepo,
            IPaymentRepository paymentRepo,
            IPaymentGateway gateway)
        {
            _invoiceRepo = invoiceRepo;
            _paymentRepo = paymentRepo;
            _gateway     = gateway;
        }

        public async Task<string> InitiatePaymentAsync(int invoiceId, string provider)
        {
            var invoice = await _invoiceRepo.GetByIdAsync(invoiceId)
                ?? throw new KeyNotFoundException("Invoice not found");

            if (invoice.Status == InvoiceStatus.Paid)
                throw new InvalidOperationException("Invoice already paid");

            // Sukuriame Payment įrašą
            var payment = new Payment
            {
                InvoiceId = invoice.Id,
                Provider  = provider,
                Amount    = invoice.Amount,
                Currency  = invoice.Currency,
                Status    = PaymentStatus.Initiated,
                CreatedAt = DateTime.UtcNow
            };

            await _paymentRepo.CreateAsync(payment);

            // Gauname peradresavimo URL iš gateway
            var redirectUrl = await _gateway.StartPaymentAsync(invoice, payment);

            // Pažymime sąskaitą „Pending“ ir išsaugome
            invoice.Status = InvoiceStatus.Pending;
            await _invoiceRepo.UpdateAsync(invoice);

            return redirectUrl;
        }

        public async Task HandleProviderCallbackAsync(string provider, string payload)
        {
            // Iš providerio gauname tranzakcijos ID ir statusą
            var (providerTxnId, status, raw) = _gateway.ParseCallback(payload);

            // Randame Payment pagal providerTxnId
            var payment = await _paymentRepo.GetByProviderTxnAsync(provider, providerTxnId)
                ?? throw new KeyNotFoundException("Payment not found");

            // Atnaujiname mokėjimo statusą
            payment.Status = status;
            payment.UpdatedAt = DateTime.UtcNow;
            payment.RawPayload = raw;
            await _paymentRepo.UpdateAsync(payment);

            // Jei sėkminga – pažymime ir sąskaitą „Paid“
            if (status == PaymentStatus.Succeeded)
            {
                var invoice = await _invoiceRepo.GetByIdAsync(payment.InvoiceId)
                    ?? throw new KeyNotFoundException("Invoice not found");

                invoice.Status = InvoiceStatus.Paid;
                invoice.PaidAt  = DateTime.UtcNow;
                await _invoiceRepo.UpdateAsync(invoice);
            }
        }

        public Task<string> InitiatePaymentAsync(int invoiceId, decimal amount)
        {
            throw new NotImplementedException();
        }
    }
}
