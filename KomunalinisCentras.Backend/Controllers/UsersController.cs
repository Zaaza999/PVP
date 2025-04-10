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

        // GET /users/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
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
                new { id = newUser.UserId },
                newUser);
        }

        // PUT /users/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.UserId)
                return BadRequest("ID mismatch.");

            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            // Example of updating fields:
            existing.FirstName = updatedUser.FirstName;
            existing.LastName = updatedUser.LastName;
            existing.Username = updatedUser.Username;
            existing.UserPassword = updatedUser.UserPassword;
            existing.Address = updatedUser.Address;
            existing.Phone = updatedUser.Phone;
            existing.Email = updatedUser.Email;
            existing.RoleId = updatedUser.RoleId;

            await _userRepository.UpdateAsync(existing);

            // Grąžiname 200 OK ir atnaujinto vartotojo duomenis
            return Ok(existing);
        }

        // DELETE /users/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _userRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
