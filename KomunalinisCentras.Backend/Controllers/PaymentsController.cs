// Controllers/PaymentsController.cs
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Dtos;
using KomunalinisCentras.Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("invoices/{invoiceId:int}/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly KomunalinisDbContext _db;
        public PaymentsController(KomunalinisDbContext db) => _db = db;

        [HttpPost]
        public async Task<IActionResult> Create(int invoiceId, [FromBody] CreatePaymentDto dto)
        {
            if (dto is null)
                return BadRequest("Body negali būti tuščias");

            var invoice = await _db.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.Id == invoiceId);

            if (invoice is null)
                return NotFound($"Sąskaita #{invoiceId} nerasta");

            var paidSoFar = invoice.Payments.Sum(p => p.Amount);
            var remaining = invoice.Amount - paidSoFar;
            if (dto.Amount <= 0 || dto.Amount > remaining)
                return BadRequest($"Galima apmokėti 0 < suma ≤ {remaining:F2}");

            var payment = new Payment
            {
                InvoiceId = invoiceId,
                Amount = dto.Amount,
                Currency = invoice.Currency,
                Provider = "manual",
                ProviderTxnId = Guid.NewGuid().ToString(),
                Status = PaymentStatus.Succeeded,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Payments.Add(payment);

            if (dto.Amount == remaining)
            {
                invoice.Status = InvoiceStatus.Paid;
                invoice.PaidAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();

            // wrap up as a DTO
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

            // return 201 Created at the GET /invoices/{id} for convenience
            return CreatedAtAction(
                actionName: nameof(InvoicesController.GetById),
                controllerName: "Invoices",
                routeValues: new { id = invoiceId },
                value: result
            );
        } 
        
        
    }
}
