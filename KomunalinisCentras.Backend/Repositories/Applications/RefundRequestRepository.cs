using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class RefundRequestRepository : ApplicationRepository<RefundRequest>
    {

        public RefundRequestRepository(KomunalinisDbContext context) : base(context) { }


    }


}
