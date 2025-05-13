using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class WasteFeeExemptionBusinessRepository : ApplicationRepository<WasteFeeExemptionBusiness>
    {

        public WasteFeeExemptionBusinessRepository(KomunalinisDbContext context) : base(context) { }


    }


}
