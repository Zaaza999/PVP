using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Jobs
{
    public class ReminderJob
    {
        private readonly KomunalinisDbContext _db;
        private readonly IEmailService _mail;

        public ReminderJob(KomunalinisDbContext db, IEmailService mail)
        {
            _db = db;
            _mail = mail;
        }

        public async Task RunAsync()
        {
            var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));

            var schedules = await _db.Set<GarbageCollectionSchedule>()
                                     .Where(g => DateOnly.FromDateTime(g.CollectionDate) == tomorrow)
                                     .Include(g => g.Comment)
                                     .ToListAsync();

            foreach (var schedule in schedules)
            {
                foreach (var sub in schedule.Comment)
                {
                    var body = $"Sveiki!\nRytoj ({tomorrow:yyyy-MM-dd}) bus išvežamos: {schedule.WasteType}.";
                    //await _mail.SendAsync(sub.Email, "Atliekų išvežimo priminimas", body);
                }
            }
        }
    }
}
