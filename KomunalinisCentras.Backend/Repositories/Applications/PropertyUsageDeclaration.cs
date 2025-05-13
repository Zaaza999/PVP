using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class PropertyUsageDeclarationRepository : ApplicationRepository<PropertyUsageDeclaration>
    {
        private readonly KomunalinisDbContext _context;

        public PropertyUsageDeclarationRepository(KomunalinisDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<PropertyUsageDeclaration?> GetByIdAsync(int id)
        {
            return await _context.Set<PropertyUsageDeclaration>()
                .Include(r => r.Entries)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }


}
