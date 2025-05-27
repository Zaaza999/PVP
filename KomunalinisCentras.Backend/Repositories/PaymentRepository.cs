using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly KomunalinisDbContext _ctx;
    public PaymentRepository(KomunalinisDbContext ctx) => _ctx = ctx;

    public async Task<Payment?> GetByIdAsync(int id) =>
        await _ctx.Payments.Include(p => p.Invoice).FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Payment?> GetByProviderTxnAsync(string provider, string providerTxnId) =>
        await _ctx.Payments.Include(p => p.Invoice).FirstOrDefaultAsync(p => p.Provider == provider && p.ProviderTxnId == providerTxnId);

    public async Task CreateAsync(Payment payment) { await _ctx.Payments.AddAsync(payment); await _ctx.SaveChangesAsync(); }
    public async Task UpdateAsync(Payment payment) { _ctx.Payments.Update(payment); await _ctx.SaveChangesAsync(); }
}