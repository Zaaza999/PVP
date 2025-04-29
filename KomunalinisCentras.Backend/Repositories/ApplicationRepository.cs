using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly KomunalinisDbContext _context;

        public ApplicationRepository(KomunalinisDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Application>> GetAllAsync()
        {
            return await _context.Set<Application>().ToListAsync();
        }

        public async Task<Application?> GetByIdAsync(int id)
        {
            return await _context.Set<Application>().FindAsync(id);
        }

        public async Task CreateAsync(Application application)
        {
            await _context.Set<Application>().AddAsync(application);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Application application)
        {
            _context.Set<Application>().Update(application);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var application = await GetByIdAsync(id);
            if (application != null)
            {
                _context.Set<Application>().Remove(application);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<Application?> GetByIdWithUserAsync(int id)
        {
            return await _context.Applications
                .Include(a => a.SubmittedBy)
                .FirstOrDefaultAsync(a => a.ApplicationId == id);
        }
        
    }
}
