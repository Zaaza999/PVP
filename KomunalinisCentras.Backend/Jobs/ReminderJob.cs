using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Jobs
{

    public sealed class ReminderJob
    {
        private readonly KomunalinisDbContext _db;
        private readonly IEmailService        _mail;

        public ReminderJob(KomunalinisDbContext db, IEmailService mail)
        {
            _db   = db;
            _mail = mail;
        }

        private static readonly Dictionary<string, string> WasteNameLt = new()
        {
            ["Household"]            = "Buitinės atliekos",
            ["Plastic/Metal/Paper"]  = "Plastikas / Metalai / Popierius",
            ["Glass"]                = "Stiklas"
        };

        private static string Normalize(string txt)
        {
            return Regex.Replace(
                txt.ToLower().Normalize(NormalizationForm.FormD),
                @"[\u0300-\u036f]",  
                "");
        }

        public async Task RunAsync()
        {
            var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));

            var users = await _db.Users.Where(u => u.Subscription).ToListAsync();
            if (users.Count == 0) return;


            var settlements = await _db.Locations.ToListAsync();

            foreach (var user in users)
            {
                if (string.IsNullOrWhiteSpace(user.Address)) continue;

                string addrNorm   = Normalize(user.Address);
                string lastPart   = user.Address.Split(',').Last().Trim();
                string lastNorm   = Normalize(lastPart);

                var location = settlements.FirstOrDefault(l =>
                       Normalize(l.LocationName) == lastNorm          
                    || addrNorm.Contains(Normalize(l.LocationName))); 

                if (location is null) continue;

                var schedules = await _db.GarbageCollectionSchedules
                                          .Include(g => g.WasteType)
                                          .Where(g => g.LocationId == location.LocationId &&
                                                      DateOnly.FromDateTime(g.CollectionDate) == tomorrow)
                                          .ToListAsync();

                if (schedules.Count == 0) continue;

                var wastesLt = schedules
                    .Select(s => s.WasteType!.WasteName)
                    .Distinct()
                    .Select(n => WasteNameLt.TryGetValue(n, out var lt) ? lt : n)
                    .ToList();

                var rows = new StringBuilder();
                foreach (var w in wastesLt)
                {
                    rows.AppendLine(
                        $"<tr><td style='padding:8px 16px;border:1px solid #ddd'>{w}</td></tr>");
                }

                var bodyHtml = $@"
<p>Sveiki, {user.FirstName}!</p>

<p>
  Rytoj, <strong>{tomorrow:yyyy‑MM‑dd}</strong>,
  adresu <strong>{user.Address}</strong> bus išvežamos šios atliekos:
</p>

<table style='border-collapse:collapse;font-family:sans-serif'>
  <thead>
    <tr>
      <th style='padding:8px 16px;border:1px solid #ddd;background:#f5f5f5'>
        Atliekų tipas
      </th>
    </tr>
  </thead>
  <tbody>
    {rows}
  </tbody>
</table>

<p style='margin-top:24px'>Ačiū, kad rūšiuojate!</p>";

                await _mail.SendAsync(
                    user.Email!,
                    "Atliekų išvežimo priminimas",
                    bodyHtml);         
            }
        }
    }
}
