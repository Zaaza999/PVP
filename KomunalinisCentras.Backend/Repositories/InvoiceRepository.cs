using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly KomunalinisDbContext _ctx;
    public InvoiceRepository(KomunalinisDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Invoice>> GetAllAsync() =>
        await _ctx.Invoices.Include(i => i.Payments).AsNoTracking().ToListAsync();

    public async Task<Invoice?> GetByIdAsync(int id) =>
        await _ctx.Invoices.Include(i => i.Payments).FirstOrDefaultAsync(i => i.Id == id);

    public async Task<IEnumerable<Invoice>> GetByUserAsync(string userId) =>
        await _ctx.Invoices.Where(i => i.UserId == userId).Include(i => i.Payments).AsNoTracking().ToListAsync();

    public async Task CreateAsync(Invoice invoice) { await _ctx.Invoices.AddAsync(invoice); await _ctx.SaveChangesAsync(); }
    public async Task UpdateAsync(Invoice invoice) { _ctx.Invoices.Update(invoice); await _ctx.SaveChangesAsync(); }
}