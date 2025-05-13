using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class PropertyUnsuitabilityRepository : ApplicationRepository<PropertyUnsuitability>
    {
        public PropertyUnsuitabilityRepository(KomunalinisDbContext context) : base(context) { }

    }


}
