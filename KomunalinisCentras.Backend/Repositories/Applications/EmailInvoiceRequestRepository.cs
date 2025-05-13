using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class EmailInvoiceRequestRepository : ApplicationRepository<EmailInvoiceRequest>
    {
        public EmailInvoiceRequestRepository(KomunalinisDbContext context) : base(context) { }

    }


}
