using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(int id);
    Task<Payment?> GetByProviderTxnAsync(string provider, string providerTxnId);
    Task CreateAsync(Payment payment);
    Task UpdateAsync(Payment payment);
}