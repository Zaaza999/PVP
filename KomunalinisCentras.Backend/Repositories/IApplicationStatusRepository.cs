using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IApplicationStatusRepository
    {
        Task<IEnumerable<ApplicationStatus>> GetAllAsync();
        Task<ApplicationStatus?> GetByIdAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
