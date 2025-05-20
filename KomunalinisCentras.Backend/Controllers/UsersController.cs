using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET /users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users);
        }

        // GET /users/workers
        [HttpGet("workers")]
        public async Task<IActionResult> GetAllWorkers()
        {
            var workers = await _userRepository.GetAllWorkers();
            return Ok(workers);
        }

        // GET /users/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        // POST /users
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User newUser)
        {
            await _userRepository.CreateAsync(newUser);
            return CreatedAtAction(nameof(GetById),
                new { id = newUser.Id },
                newUser);
        }

        // PUT /users/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.Id)
                return BadRequest("ID mismatch.");

            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            // Example of updating fields:
            existing.FirstName = updatedUser.FirstName;
            existing.LastName = updatedUser.LastName;
            existing.UserName = updatedUser.UserName;
            existing.Address = updatedUser.Address;
            existing.PhoneNumber = updatedUser.PhoneNumber;
            existing.Email = updatedUser.Email;
            existing.RoleId = updatedUser.RoleId;

            await _userRepository.UpdateAsync(existing);

            // Grąžiname 200 OK ir atnaujinto vartotojo duomenis
            return Ok(existing);
        }

        // DELETE /users/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _userRepository.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{id}/subscribe")]
        public async Task<IActionResult> Subscribe(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            if (user.Subscription) return NoContent();

            user.Subscription = true;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }
        // PUT /users/{id}/unsubscribe
        [HttpPut("{id}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            if (!user.Subscription) return NoContent();

            user.Subscription = false;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }
        
        // GET /users/roles
        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _userRepository.GetAllRoles();
            return Ok(roles);
        }


    }
}
