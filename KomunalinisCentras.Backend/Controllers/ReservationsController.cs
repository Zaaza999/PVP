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

        public ReservationsController(IReservationRepository reservationRepository)
        {
            _reservationRepository = reservationRepository;
        }

        // GET /reservations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationRepository.GetAllAsync();
            return Ok(reservations);
        }

        // GET /reservations/1
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
            await _reservationRepository.CreateAsync(newReservation);
            return CreatedAtAction(nameof(GetById), new { id = newReservation.ReservationId }, newReservation);
        }

        // PUT /reservations/1
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

        // DELETE /reservations/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingReservation = await _reservationRepository.GetByIdAsync(id);
            if (existingReservation == null)
                return NotFound();

            await _reservationRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
