using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Jobs
{
    /// <summary>
    ///   Sends e‑mail reminders to every <see cref="User"/> that has <c>subscription = true</c>.
    ///   Address ‑> Location match is done via <see cref="User.Address"/> : <see cref="Location.LocationName"/>.
    ///   The message lists all waste types that will be collected tomorrow for that location.
    /// </summary>
    public sealed class ReminderJob
    {
        private readonly KomunalinisDbContext _db;
        private readonly IEmailService        _mail;

        public ReminderJob( KomunalinisDbContext db, IEmailService mail )
        {
            _db   = db;
            _mail = mail;
        }

        public async Task RunAsync()
        {
            var tomorrow = DateOnly.FromDateTime( DateTime.UtcNow.Date.AddDays( 1 ) );

            // 1) Visi vartotojai su subscription == true
            var users = await _db.Users.Where( u => u.Subscription ).ToListAsync();
            if ( users.Count == 0 ) return;

            foreach ( var user in users )
            {
                // 2) Surandame jo Location pagal adresą (čia spėjame, kad Address == LocationName)
                var location = await _db.Locations
                                        .FirstOrDefaultAsync( l => l.LocationName == user.Address );
                if ( location is null ) continue;          // nėra tokios vietovės – praleidžiam

                // 3) Ištraukiame rytdienos grafikus toje vietoje
                var schedules = await _db.GarbageCollectionSchedules
                                          .Include( g => g.WasteType )
                                          .Where( g => g.LocationId == location.LocationId &&
                                                       DateOnly.FromDateTime( g.CollectionDate ) == tomorrow )
                                          .ToListAsync();

                if ( schedules.Count == 0 ) continue;      // nieko nesiunčiam jei nėra grafiko

                var wastes = string.Join( ", ", schedules.Select( s => s.WasteType!.WasteName ).Distinct() );

                var body =
                    $"Sveiki, {user.FirstName}!\n" +
                    $"Rytoj ({tomorrow:yyyy-MM-dd}) adresu {location.LocationName} bus išvežamos atliekos: {wastes}.";

                await _mail.SendAsync( user.Email!, "Atliekų išvežimo priminimas", body );
            }
        }
    }
}
