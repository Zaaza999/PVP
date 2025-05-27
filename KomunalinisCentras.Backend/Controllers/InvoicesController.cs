// Controllers/InvoicesController.cs
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("invoices")]
    public class InvoicesController : ControllerBase
    {
        private readonly KomunalinisDbContext _db;
        public InvoicesController(KomunalinisDbContext db) => _db = db;

        // GET /invoices
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var invoices = await _db.Invoices
                .Include(i => i.Payments)
                .ToListAsync();

            var dtos = invoices.Select(i => {
                var paidSoFar = i.Payments.Sum(p => p.Amount);
                return new InvoiceDto(
                    Id: i.Id,
                    Amount:    i.Amount,
                    Remaining: i.Amount - paidSoFar,         // ← čia
                    Currency:  i.Currency,
                    DueDate:   i.DueDate,
                    Status:    i.Status.ToString(),
                    PaidAt:    i.PaidAt,
                    Payments:  i.Payments.Select(p => new PaymentDto(
                        p.Id,
                        p.Amount,
                        p.Currency,
                        p.Provider,
                        p.ProviderTxnId,
                        p.Status.ToString(),
                        p.CreatedAt,
                        p.UpdatedAt
                    ))
                );
            });

            return Ok(dtos);
        }
        // GET /invoices/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var invoice = await _db.Invoices
                .Include(inv => inv.Payments)
                .FirstOrDefaultAsync(inv => inv.Id == id);

            if (invoice is null) 
                return NotFound();

            // Kiek jau sumokėta
            var paidSoFar = invoice.Payments.Sum(p => p.Amount);

            // Kiek liko susimokėti
            var remaining = invoice.Amount - paidSoFar;

            var dto = new InvoiceDto(
                Id:        invoice.Id,
                Amount:    invoice.Amount,
                Remaining: remaining,           // ← perduodame apskaičiuotą likutį
                Currency:  invoice.Currency,
                DueDate:   invoice.DueDate,
                Status:    invoice.Status.ToString(),
                PaidAt:    invoice.PaidAt,
                Payments:  invoice.Payments.Select(p => new PaymentDto(
                    p.Id,
                    p.Amount,
                    p.Currency,
                    p.Provider,
                    p.ProviderTxnId,
                    p.Status.ToString(),
                    p.CreatedAt,
                    p.UpdatedAt
                ))
            );

            return Ok(dto);
        }
    }
}
