using System;
using System.Linq;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Dtos;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Gateways;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("invoices/{invoiceId:int}/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly KomunalinisDbContext _db;
        private readonly IStripeGateway _stripe;

        public PaymentsController(KomunalinisDbContext db, IStripeGateway stripe)
        {
            _db = db;
            _stripe = stripe;
        }

        [HttpPost]
        public async Task<IActionResult> Create(int invoiceId, [FromBody] CreatePaymentDto dto)
        {
            if (dto == null) return BadRequest("Body negali būti tuščias");

            var invoice = await _db.Invoices.Include(i => i.Payments).FirstOrDefaultAsync(i => i.Id == invoiceId);
            if (invoice == null) return NotFound();

            var paid = invoice.Payments.Where(p => p.Status == PaymentStatus.Succeeded).Sum(p => p.Amount);
            var remaining = invoice.Amount - paid;
            if (dto.Amount <= 0 || dto.Amount > remaining)
                return BadRequest($"Galima apmokėti 0 < suma ≤ {remaining:F2}");

            // 1. Sukuriame Stripe sesiją
            var (url, sessionId) = await _stripe.CreateCheckoutSessionAsync(invoice, dto.Amount);

            // 2. Įrašome Payment su sessionId
            var payment = new Payment
            {
                InvoiceId = invoiceId,
                Amount = dto.Amount,
                Currency = invoice.Currency,
                Provider = "Stripe",
                ProviderTxnId = sessionId,
                Status = PaymentStatus.Initiated,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            return Ok(new { redirectUrl = url });
        } 
        [HttpGet("by-session/{sessionId}")]
        public async Task<IActionResult> BySession(string sessionId)
        {
            var list = await _db.Payments
                .Where(p => p.Provider == "Stripe" &&
                            p.ProviderTxnId.StartsWith(sessionId))
                .Select(p => new
                {
                    p.InvoiceId,
                    p.Amount,
                    p.Currency,
                    p.Status
                })
                .ToListAsync();

            return Ok(list);
        }
    }
}