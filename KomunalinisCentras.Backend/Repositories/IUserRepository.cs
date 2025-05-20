using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(string id);
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(string id);
        Task<IEnumerable<User>> GetUsersForRoleAsync(string roleId);
        Task<IEnumerable<User>> GetAllWorkers();
        Task<IEnumerable<Role>> GetAllRoles();
    }
}
