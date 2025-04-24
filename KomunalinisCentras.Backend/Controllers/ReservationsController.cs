using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IEmployeeTimeSlotRepository _timeSlotRepository;

        public ReservationsController(
            IReservationRepository reservationRepository,
            IEmployeeTimeSlotRepository timeSlotRepository)
        {
            _reservationRepository = reservationRepository;
            _timeSlotRepository = timeSlotRepository;
        }

        // GET /reservations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationRepository.GetAllAsync();
            return Ok(reservations);
        }

        // GET /reservations/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var reservation = await _reservationRepository.GetByIdAsync(id);
            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        // POST /reservations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Reservation newReservation)
        {
            // 1. Patikriname, ar egzistuoja laiko tarpas
            var slot = await _timeSlotRepository.GetByIdAsync(newReservation.TimeSlotId);
            if (slot == null)
                return BadRequest("Nerastas laiko tarpas.");

            // 2. Neleidžiame rezervuoti jau užimto tarpo
            if (slot.IsTaken)
                return Conflict("Šis laiko tarpas jau užimtas.");

            // 3. Pažymime, kad laiko tarpas dabar užimtas
            slot.IsTaken = true;
            await _timeSlotRepository.UpdateAsync(slot);

            // 4. Sukuriame rezervaciją
            await _reservationRepository.CreateAsync(newReservation);

            return CreatedAtAction(
                nameof(GetById),
                new { id = newReservation.ReservationId },
                newReservation
            );
        }

        // PUT /reservations/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Reservation updatedReservation)
        {
            if (id != updatedReservation.ReservationId)
                return BadRequest("ID neatitinka.");

            var existingReservation = await _reservationRepository.GetByIdAsync(id);
            if (existingReservation == null)
                return NotFound();

            // Atnaujiname laukus
            existingReservation.UserId = updatedReservation.UserId;
            existingReservation.TimeSlotId = updatedReservation.TimeSlotId;
            existingReservation.ReservationDate = updatedReservation.ReservationDate;
            existingReservation.Status = updatedReservation.Status;
            existingReservation.TopicId = updatedReservation.TopicId;

            await _reservationRepository.UpdateAsync(existingReservation);
            return NoContent();
        }

        // DELETE /reservations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // 1. Randame rezervaciją
            var existingReservation = await _reservationRepository.GetByIdAsync(id);
            if (existingReservation == null)
                return NotFound();

            // 2. Paimame susijusį laiko tarpo įrašą
            var slot = await _timeSlotRepository.GetByIdAsync(existingReservation.TimeSlotId);
            if (slot != null)
            {
                // 3. Pažymime laiko tarpą kaip laisvą
                slot.IsTaken = false;
                await _timeSlotRepository.UpdateAsync(slot);
            }

            // 4. Triname rezervaciją
            await _reservationRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
