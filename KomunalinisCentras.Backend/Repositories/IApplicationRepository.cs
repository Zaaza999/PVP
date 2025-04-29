using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<Application>> GetAllAsync();
        Task<Application?> GetByIdAsync(int id);
        Task CreateAsync(Application application);
        Task UpdateAsync(Application application);
        Task DeleteAsync(int id);
    }
}
