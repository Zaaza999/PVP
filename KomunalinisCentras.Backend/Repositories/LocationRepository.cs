using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly KomunalinisDbContext _context;

        public LocationRepository(KomunalinisDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Location>> GetAllAsync() =>
            await _context.Locations.AsNoTracking().ToListAsync();

        public async Task<Location?> GetByIdAsync(int id) =>
            await _context.Locations.FindAsync(id);

        public async Task CreateAsync(Location location)
        {
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Location location)
        {
            _context.Locations.Update(location);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var loc = await _context.Locations.FindAsync(id);
            if (loc is null) return;
            _context.Locations.Remove(loc);
            await _context.SaveChangesAsync();
        }
    }
}