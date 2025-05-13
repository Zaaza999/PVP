using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class PayerDataChangeRequestRepository : ApplicationRepository<PayerDataChangeRequest>
    {
        public PayerDataChangeRequestRepository(KomunalinisDbContext context) : base(context) { }

    }


}
