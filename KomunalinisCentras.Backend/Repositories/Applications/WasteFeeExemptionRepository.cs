using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class WasteFeeExemptionRepository : ApplicationRepository<WasteFeeExemption>
    {
        public WasteFeeExemptionRepository(KomunalinisDbContext context) : base(context) { }

    }

}
