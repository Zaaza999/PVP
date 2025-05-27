using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories;

public interface IInvoiceRepository
{
    Task<IEnumerable<Invoice>> GetAllAsync();
    Task<Invoice?> GetByIdAsync(int id);
    Task<IEnumerable<Invoice>> GetByUserAsync(string userId);
    Task CreateAsync(Invoice invoice);
    Task UpdateAsync(Invoice invoice);
}
