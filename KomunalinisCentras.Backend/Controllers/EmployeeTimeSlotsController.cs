using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeTimeSlotsController : ControllerBase
    {
        private readonly IEmployeeTimeSlotRepository _employeeTimeSlotRepository;

        public EmployeeTimeSlotsController(IEmployeeTimeSlotRepository employeeTimeSlotRepository)
        {
            _employeeTimeSlotRepository = employeeTimeSlotRepository;
        }

        // GET /employeetimeslots
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var slots = await _employeeTimeSlotRepository.GetAllAsync();
            return Ok(slots);
        }

        // GET /employeetimeslots/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var slot = await _employeeTimeSlotRepository.GetByIdAsync(id);
            if (slot == null) return NotFound();

            return Ok(slot);
        }

        // POST /employeetimeslots
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeTimeSlot newSlot)
        {
            await _employeeTimeSlotRepository.CreateAsync(newSlot);
            return CreatedAtAction(nameof(GetById), new { id = newSlot.TimeSlotId }, newSlot);
        }

        // PUT /employeetimeslots/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeTimeSlot updatedSlot)
        {
            if (id != updatedSlot.TimeSlotId)
                return BadRequest("ID neatitinka.");

            var existingSlot = await _employeeTimeSlotRepository.GetByIdAsync(id);
            if (existingSlot == null)
                return NotFound();

            // Atnaujiname tik egzistuojančius laukus
            existingSlot.EmployeeId = updatedSlot.EmployeeId;
            existingSlot.SlotDate = updatedSlot.SlotDate;
            existingSlot.TimeFrom = updatedSlot.TimeFrom;
            existingSlot.TimeTo = updatedSlot.TimeTo;

            await _employeeTimeSlotRepository.UpdateAsync(existingSlot);
            return NoContent();
        }

        // DELETE /employeetimeslots/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingSlot = await _employeeTimeSlotRepository.GetByIdAsync(id);
            if (existingSlot == null)
                return NotFound();

            await _employeeTimeSlotRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
