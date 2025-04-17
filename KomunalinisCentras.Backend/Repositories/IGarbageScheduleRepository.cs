using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IGarbageScheduleRepository
    {
        Task<IEnumerable<GarbageCollectionSchedule>> GetAllAsync();
        Task<GarbageCollectionSchedule?> GetByIdAsync(int id);
        Task CreateAsync(GarbageCollectionSchedule schedule);
        Task UpdateAsync(GarbageCollectionSchedule schedule);
        Task DeleteAsync(int id);
    }
}
