// Controllers/PaymentsController.cs
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Dtos;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Services;   // for IEmailService

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("invoices/{invoiceId:int}/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly KomunalinisDbContext _db;
        private readonly IEmailService        _mail;

        public PaymentsController(
            KomunalinisDbContext db,
            IEmailService mail          // inject email service
        ) {
            _db   = db;
            _mail = mail;
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            int invoiceId,
            [FromBody] CreatePaymentDto dto
        )
        {
            if (dto is null)
                return BadRequest("Body negali būti tuščias");

            // 1) Gauname sąskaitą kartu su jau atliktais mokėjimais
            var invoice = await _db.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.Id == invoiceId);

            if (invoice is null)
                return NotFound($"Sąskaita #{invoiceId} nerasta");  // :contentReference[oaicite:0]{index=0}

            // 2) Apskaičiuojame, kiek jau sumokėta ir kiek liko
            var paidSoFar = invoice.Payments.Sum(p => p.Amount);
            var remaining = invoice.Amount - paidSoFar;
            if (dto.Amount <= 0 || dto.Amount > remaining)
                return BadRequest($"Galima apmokėti 0 < suma ≤ {remaining:F2}");

            // 3) Sukuriame naują mokėjimo įrašą
            var payment = new Payment
            {
                InvoiceId     = invoiceId,
                Amount        = dto.Amount,
                Currency      = invoice.Currency,
                Provider      = "manual",
                ProviderTxnId = Guid.NewGuid().ToString(),
                Status        = PaymentStatus.Succeeded,
                CreatedAt     = DateTime.UtcNow,
                UpdatedAt     = DateTime.UtcNow
            };
            _db.Payments.Add(payment);

            // 4) Jei pilnai apmokėta, atnaujiname sąskaitos statusą
            if (dto.Amount == remaining)
            {
                invoice.Status = InvoiceStatus.Paid;
                invoice.PaidAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();

            // 5) Išsiunčiame el. laišką apie atliktą mokėjimą
            var user = await _db.Users.FindAsync(invoice.UserId);
            if (user != null && !string.IsNullOrWhiteSpace(user.Email))
            {
                var newRemaining = remaining - dto.Amount;
                var subject = $"Apmokėjimas sąskaitai #{invoice.Id}";
                var body = $@"
<p>Sveiki, {user.FirstName}!</p>

<p>Jūs neseniai apmokėjote <strong>{payment.Amount:F2} {invoice.Currency}</strong>
sąskaitai <strong>#{invoice.Id}</strong> (tema: {invoice.Topic}).</p>

<p>Dabar likutis: <strong>{newRemaining:F2} {invoice.Currency}</strong>.</p>

<p>Ačiū, kad naudojatės mūsų paslaugomis!</p>";
                
                await _mail.SendAsync(user.Email, subject, body);  // :contentReference[oaicite:1]{index=1}
            }

            // 6) Grąžiname naujai sukurtą mokėjimo DTO su statusu 201 Created
            var result = new PaymentDto(
                payment.Id,
                payment.Amount,
                payment.Currency,
                payment.Provider,
                payment.ProviderTxnId,
                payment.Status.ToString(),
                payment.CreatedAt,
                payment.UpdatedAt
            );

            return CreatedAtAction(
                actionName: nameof(InvoicesController.GetById),
                controllerName: "Invoices",
                routeValues: new { id = invoiceId },
                value: result
            );
        }
    }
}
