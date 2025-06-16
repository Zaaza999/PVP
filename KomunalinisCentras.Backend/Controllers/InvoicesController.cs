using System.Linq;
using System.Threading.Tasks;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var invoices = await _db.Invoices.Include(i => i.Payments).ToListAsync();
            var dtos = invoices.Select(i =>
            {
                var paid = i.Payments.Sum(p => p.Amount);
                return new InvoiceDto(
                    Id:        i.Id.ToString(),
                    Amount:    i.Amount,
                    Remaining: i.Amount - paid,
                    Currency:  i.Currency,
                    Topic:     i.Topic,
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
                        p.UpdatedAt))
                );
            });
            return Ok(dtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var inv = await _db.Invoices.Include(i => i.Payments).FirstOrDefaultAsync(i => i.Id == id);
            if (inv == null) return NotFound();

            var paid = inv.Payments.Sum(p => p.Amount);
            var dto = new InvoiceDto(
                Id:        inv.Id.ToString(),
                Amount:    inv.Amount,
                Remaining: inv.Amount - paid,
                Currency:  inv.Currency,
                Topic:     inv.Topic,
                DueDate:   inv.DueDate,
                Status:    inv.Status.ToString(),
                PaidAt:    inv.PaidAt,
                Payments:  inv.Payments.Select(p => new PaymentDto(
                    p.Id,
                    p.Amount,
                    p.Currency,
                    p.Provider,
                    p.ProviderTxnId,
                    p.Status.ToString(),
                    p.CreatedAt,
                    p.UpdatedAt))
            );
            return Ok(dto);
        }
    }
}