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

        public async Task<IEnumerable<EmployeeTimeSlot>> GetAllAsync()
        {
            return await _context.EmployeeTimeSlots
                .Include(e => e.Employee)
                .ToListAsync();
        }

        public async Task<EmployeeTimeSlot?> GetByIdAsync(int id)
        {
            return await _context.EmployeeTimeSlots
                .Include(e => e.Employee)
                .FirstOrDefaultAsync(e => e.TimeSlotId == id);
        }

        public async Task CreateAsync(EmployeeTimeSlot employeeTimeSlot)
        {
            await _context.EmployeeTimeSlots.AddAsync(employeeTimeSlot);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(EmployeeTimeSlot employeeTimeSlot)
        {
            _context.EmployeeTimeSlots.Update(employeeTimeSlot);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var slot = await GetByIdAsync(id);
            if (slot != null)
            {
                _context.EmployeeTimeSlots.Remove(slot);
                await _context.SaveChangesAsync();
            }
        }
    }
}
