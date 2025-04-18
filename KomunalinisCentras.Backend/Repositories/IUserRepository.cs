using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
    }
}
