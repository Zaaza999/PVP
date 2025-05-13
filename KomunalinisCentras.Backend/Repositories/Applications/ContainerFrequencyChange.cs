using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class ContainerFrequencyChangeRepository : ApplicationRepository<ContainerFrequencyChange>
    {
        public ContainerFrequencyChangeRepository(KomunalinisDbContext context) : base(context) { }

    }


}
