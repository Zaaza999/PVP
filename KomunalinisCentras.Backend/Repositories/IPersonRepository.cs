using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories;

public interface IPersonRepository
{
    Task<IEnumerable<Person>> GetAllAsync();
    Task<Person?> GetByIdAsync(int id);
    Task CreateAsync(Person person);
    Task UpdateAsync(Person person);
    Task DeleteAsync(int id);
}
