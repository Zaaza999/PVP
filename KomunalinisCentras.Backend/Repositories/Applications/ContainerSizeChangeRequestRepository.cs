using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class ContainerSizeChangeRequestRepository : ApplicationRepository<ContainerSizeChangeRequest>
    {
        public ContainerSizeChangeRequestRepository(KomunalinisDbContext context) : base(context) { }

    }


}
