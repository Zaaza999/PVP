using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IWasteTypeRepository
    {
        Task<IEnumerable<WasteType>> GetAllAsync();
        Task<WasteType?> GetByIdAsync(int id);
        Task CreateAsync(WasteType wasteType);
        Task UpdateAsync(WasteType wasteType);
        Task DeleteAsync(int id);
    }
}
