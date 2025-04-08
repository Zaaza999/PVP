using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore; 
using KomunalinisCentras.Backend.Repositories;

namespace KomunalinisCentras.Backend.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly KomunalinisDbContext _context;

    public PersonRepository(KomunalinisDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _context.People
            .OrderByDescending(p => p.CreatedOn)
            .ToListAsync();
    }

    public async Task<Person?> GetByIdAsync(int id)
    {
        return await _context.People.FindAsync(id);
    }

    public async Task CreateAsync(Person person)
    {
        await _context.People.AddAsync(person);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Person person)
    {
        _context.People.Update(person);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var existing = await GetByIdAsync(id);
        if (existing != null)
        {
            _context.People.Remove(existing);
            await _context.SaveChangesAsync();
        }
    }
}
