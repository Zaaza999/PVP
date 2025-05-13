using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class ContainerRequestRepository : ApplicationRepository<ContainerRequest>
    {
        public ContainerRequestRepository(KomunalinisDbContext context) : base(context) { }

    }


}
