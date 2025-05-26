using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class EmployeeTimeSlotRepository : IEmployeeTimeSlotRepository
    {
        private readonly KomunalinisDbContext _context;

        public EmployeeTimeSlotRepository(KomunalinisDbContext context)
        {
            _context = context;
        }

        /* ---------- CRUD ---------- */

        public async Task<IEnumerable<EmployeeTimeSlot>> GetAllAsync()
        {
            return await _context.EmployeeTimeSlots
                                 .Include(s => s.Employee)
                                 .ToListAsync();
        }

        public async Task<EmployeeTimeSlot?> GetByIdAsync(int id)
        {
            return await _context.EmployeeTimeSlots
                                 .Include(s => s.Employee)
                                 .FirstOrDefaultAsync(s => s.TimeSlotId == id);
        }

        public async Task CreateAsync(EmployeeTimeSlot slot)
        {
            await _context.EmployeeTimeSlots.AddAsync(slot);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(EmployeeTimeSlot slot)
        {
            _context.EmployeeTimeSlots.Update(slot);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var slot = await GetByIdAsync(id);
            if (slot is null) return;

            _context.EmployeeTimeSlots.Remove(slot);
            await _context.SaveChangesAsync();
        }

        /* ---------- Custom queries ---------- */

        /// <summary>
        ///  Grąžina visus LAISVUS intervalus (IsTaken = false) tam tikrai temai,
        ///  atsižvelgiant į darbuotojo rolę.
        /// </summary>
        public async Task<IEnumerable<EmployeeTimeSlot>> GetAvailableByTopicAsync(int topicId)
        {
            var topic = await _context.VisitTopics
                                      .AsNoTracking()
                                      .FirstOrDefaultAsync(t => t.TopicId == topicId);

            if (topic is null) return Enumerable.Empty<EmployeeTimeSlot>();

            var roleId = topic.roleID;         

            return await _context.EmployeeTimeSlots
                                 .Where(s => !s.IsTaken &&
                                             s.ForRezervation &&
                                             s.Employee.RoleId == roleId)
                                 .OrderBy(s => s.SlotDate)
                                 .ThenBy(s => s.TimeFrom)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<EmployeeTimeSlot>> GetByEmployeeAndDateAsync(
            string employeeId,
            DateOnly date)
        {
            var startOfDay = date.ToDateTime(TimeOnly.MinValue);
            var endOfDay   = date.ToDateTime(TimeOnly.MaxValue);

            return await _context.EmployeeTimeSlots
                .Where(s => s.EmployeeId == employeeId &&
                            s.SlotDate >= startOfDay &&
                            s.SlotDate <= endOfDay)
                .OrderBy(s => s.TimeFrom)
                .ToListAsync();
        }
    }
}
