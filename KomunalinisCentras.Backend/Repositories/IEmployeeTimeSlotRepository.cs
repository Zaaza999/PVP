using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IEmployeeTimeSlotRepository
    {
        Task<IEnumerable<EmployeeTimeSlot>> GetAllAsync();
        Task<EmployeeTimeSlot?> GetByIdAsync(int id);
        Task CreateAsync(EmployeeTimeSlot employeeTimeSlot);
        Task UpdateAsync(EmployeeTimeSlot employeeTimeSlot);
        Task DeleteAsync(int id);
    }
}
