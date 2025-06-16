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
        private readonly IVisitTopicRepository _visitTopicRepository;
        private readonly IUserRepository _userRepository;

        public ReservationsController(
            IReservationRepository reservationRepository,
            IEmployeeTimeSlotRepository timeSlotRepository,
            IVisitTopicRepository visitTopicRepository,
            IUserRepository userRepository)
        {
            _reservationRepository = reservationRepository;
            _timeSlotRepository = timeSlotRepository;
            _visitTopicRepository = visitTopicRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationRepository.GetAllAsync();
            return Ok(reservations);
        }
        
        [HttpGet("ByUser")]
        public async Task<IActionResult> GetByUserId([FromQuery] string? userId)
        {
            if (userId == null)
            {
                var reservations = await _reservationRepository.GetAllAsync();
                return Ok(reservations);
            }
            var userReservations = await _reservationRepository.GetByUserIdAsync(userId);
            return Ok(userReservations);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var reservation = await _reservationRepository.GetByIdAsync(id);
            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Reservation newReservation)
        {
            var slot = await _timeSlotRepository.GetByIdAsync(newReservation.TimeSlotId);
            if (slot == null)
                return BadRequest("Nerastas laiko tarpas.");

            if (slot.IsTaken)
                return Conflict("Šis laiko tarpas jau užimtas.");

            var topic = await _visitTopicRepository.GetByIdAsync(newReservation.TopicId);
            if (topic == null)
                return BadRequest("Nerasta rezervacijos tema."); 
            
            var user = await _userRepository.GetByIdAsync(newReservation.UserId);
            if (user == null)
                return BadRequest("Nerasta rezervacijos tema.");

            slot.IsTaken    = true;
            slot.Description = "Rezervacijos tema: " + topic.TopicName + ", Vardas: " + user.FirstName + ", Pavardė: " + user.LastName;
            await _timeSlotRepository.UpdateAsync(slot);

            await _reservationRepository.CreateAsync(newReservation);

            return CreatedAtAction(
                nameof(GetById),
                new { id = newReservation.ReservationId },
                newReservation
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Reservation updatedReservation)
        {
            if (id != updatedReservation.ReservationId)
                return BadRequest("ID neatitinka.");

            var existingReservation = await _reservationRepository.GetByIdAsync(id);
            if (existingReservation == null)
                return NotFound();

            existingReservation.UserId = updatedReservation.UserId;
            existingReservation.TimeSlotId = updatedReservation.TimeSlotId;
            existingReservation.ReservationDate = updatedReservation.ReservationDate;
            existingReservation.Status = updatedReservation.Status;
            existingReservation.TopicId = updatedReservation.TopicId;

            await _reservationRepository.UpdateAsync(existingReservation);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingReservation = await _reservationRepository.GetByIdAsync(id);
            if (existingReservation == null)
                return NotFound();

            var slot = await _timeSlotRepository.GetByIdAsync(existingReservation.TimeSlotId);
            if (slot != null)
            {
                slot.IsTaken = false;
                await _timeSlotRepository.UpdateAsync(slot);
            }

            await _reservationRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
