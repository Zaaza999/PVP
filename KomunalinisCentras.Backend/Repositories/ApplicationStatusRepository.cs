using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class ApplicationStatusRepository : IApplicationStatusRepository
    {
        private readonly KomunalinisDbContext _db;

        public ApplicationStatusRepository(KomunalinisDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ApplicationStatus>> GetAllAsync()
        {
            return await _db.ApplicationStatuses.ToListAsync();
        }

        public async Task<ApplicationStatus?> GetByIdAsync(int id)
        {
            return await _db.ApplicationStatuses.FindAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _db.ApplicationStatuses.AnyAsync(s => s.Id == id);
        }
    }
}
