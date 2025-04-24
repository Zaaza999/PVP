using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationRepository _repository;

        public LocationsController(ILocationRepository repository)
        {
            _repository = repository;
        }

        // GET /Locations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return Ok(list);
        }

        // GET /Locations/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var loc = await _repository.GetByIdAsync(id);
            return loc is null ? NotFound() : Ok(loc);
        }

        // POST /Locations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Location newLocation)
        {
            await _repository.CreateAsync(newLocation);
            return CreatedAtAction(nameof(GetById),
                                   new { id = newLocation.LocationId },
                                   newLocation);
        }

        // PUT /Locations/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Location updated)
        {
            if (id != updated.LocationId) return BadRequest("ID mismatch");
            var existing = await _repository.GetByIdAsync(id);
            if (existing is null) return NotFound();

            existing.LocationName = updated.LocationName;
            existing.Description  = updated.Description;

            await _repository.UpdateAsync(existing);
            return NoContent();
        }

        // DELETE /Locations/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing is null) return NotFound();

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
