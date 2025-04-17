using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class WasteTypeRepository : IWasteTypeRepository
    {
        private readonly KomunalinisDbContext _context;

        public WasteTypeRepository(KomunalinisDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WasteType>> GetAllAsync() =>
            await _context.WasteTypes.AsNoTracking().ToListAsync();

        public async Task<WasteType?> GetByIdAsync(int id) =>
            await _context.WasteTypes.FindAsync(id);

        public async Task CreateAsync(WasteType wasteType)
        {
            _context.WasteTypes.Add(wasteType);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(WasteType wasteType)
        {
            _context.WasteTypes.Update(wasteType);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var wt = await _context.WasteTypes.FindAsync(id);
            if (wt is null) return;
            _context.WasteTypes.Remove(wt);
            await _context.SaveChangesAsync();
        }
    }
}
