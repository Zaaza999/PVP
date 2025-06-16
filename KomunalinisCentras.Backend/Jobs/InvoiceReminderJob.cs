using System.Text;
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Jobs
{

    public sealed class InvoiceReminderJob
    {
        private readonly KomunalinisDbContext _db;
        private readonly IEmailService        _mail;

        public InvoiceReminderJob(KomunalinisDbContext db, IEmailService mail)
        {
            _db   = db;
            _mail = mail;
        }

        public async Task RunAsync()
        {
            var invoices = await _db.Invoices
                .Include(i => i.Payments)
                .Where(i => i.Status == InvoiceStatus.Issued 
                         || i.Status == InvoiceStatus.Pending)
                .ToListAsync();

            var unpaid = invoices
                .Select(i => new {
                    Invoice   = i,
                    PaidSoFar = i.Payments.Sum(p => p.Amount),
                })
                .Where(x => x.Invoice.Amount - x.PaidSoFar > 0)
                .ToList();

            if (!unpaid.Any())
                return; 

            var byUser = unpaid
                .GroupBy(x => x.Invoice.UserId)
                .ToList();

            foreach (var group in byUser)
            {
                var userId = group.Key;
                var user   = await _db.Users.FindAsync(userId);
                if (user == null || string.IsNullOrWhiteSpace(user.Email))
                    continue;

                int count = group.Count();
                decimal totalRemaining = group.Sum(x => x.Invoice.Amount - x.PaidSoFar);
                string currency = group.First().Invoice.Currency;

                var rows = new StringBuilder();
                rows.AppendLine("<tr>"
                    + "<th style='padding:8px;border:1px solid #ddd'>ID</th>"
                    + "<th style='padding:8px;border:1px solid #ddd'>Tema</th>"
                    + "<th style='padding:8px;border:1px solid #ddd'>Likutis</th>"
                    + "</tr>");

                foreach (var x in group)
                {
                    var inv = x.Invoice;
                    var rem = inv.Amount - x.PaidSoFar;
                    rows.AppendLine($@"
  <tr>
    <td style='padding:8px;border:1px solid #ddd'>{inv.Id}</td>
    <td style='padding:8px;border:1px solid #ddd'>{inv.Topic}</td>
    <td style='padding:8px;border:1px solid #ddd'>{rem:F2} {currency}</td>
  </tr>");
                }

                var body = $@"
<p>Sveiki, {user.FirstName}!</p>

<p>Šiuo metu turite <strong>{count}</strong> neapmokėtą(-as) sąskaitą(-as), 
bendra likusi suma: <strong>{totalRemaining:F2} {currency}</strong>.</p>

<table style='border-collapse:collapse;font-family:sans-serif'>
  <thead style='background:#f5f5f5'>{rows}</thead>
  <tbody></tbody>
</table>

<p>Primename apmokėti kuo greičiau.</p>";

                await _mail.SendAsync(
                    user.Email,
                    "Primename apie neapmokėtas sąskaitas",
                    body);
            }
        }
    }
}
