using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class ResidentCountDeclarationRepository : ApplicationRepository<ResidentCountDeclaration>
    {
        private readonly KomunalinisDbContext _context;

        public ResidentCountDeclarationRepository(KomunalinisDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<ResidentCountDeclaration?> GetByIdAsync(int id)
        {
            return await _context.Set<ResidentCountDeclaration>()
                .Include(r => r.Residents)
                .Include(r => r.Status)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }


}
