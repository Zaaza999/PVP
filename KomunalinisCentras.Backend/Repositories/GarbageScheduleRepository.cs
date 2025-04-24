using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class GarbageScheduleRepository : IGarbageScheduleRepository
    {
        private readonly KomunalinisDbContext _ctx;

        public GarbageScheduleRepository(KomunalinisDbContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<GarbageCollectionSchedule>> GetAllAsync() =>
            await _ctx.GarbageCollectionSchedules
                      .Include(s => s.Location)
                      .Include(s => s.WasteType)
                      .AsNoTracking()
                      .ToListAsync();

        public async Task<GarbageCollectionSchedule?> GetByIdAsync(int id) =>
            await _ctx.GarbageCollectionSchedules
                      .Include(s => s.Location)
                      .Include(s => s.WasteType)
                      .FirstOrDefaultAsync(s => s.ScheduleId == id);

        public async Task CreateAsync(GarbageCollectionSchedule schedule)
        {
            _ctx.GarbageCollectionSchedules.Add(schedule);
            await _ctx.SaveChangesAsync();
        }

        public async Task UpdateAsync(GarbageCollectionSchedule schedule)
        {
            _ctx.GarbageCollectionSchedules.Update(schedule);
            await _ctx.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _ctx.GarbageCollectionSchedules.FindAsync(id);
            if (item is null) return;
            _ctx.GarbageCollectionSchedules.Remove(item);
            await _ctx.SaveChangesAsync();
        }
    }
}
