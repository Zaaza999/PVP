using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WasteTypesController : ControllerBase
    {
        private readonly IWasteTypeRepository _repository;

        public WasteTypesController(IWasteTypeRepository repository)
        {
            _repository = repository;
        }

        // GET /WasteTypes
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }

        // GET /WasteTypes/3
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        // POST /WasteTypes
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] WasteType newItem)
        {
            await _repository.CreateAsync(newItem);
            return CreatedAtAction(nameof(GetById),
                                   new { id = newItem.WasteId },
                                   newItem);
        }

        // PUT /WasteTypes/3
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] WasteType updated)
        {
            if (id != updated.WasteId) return BadRequest("ID mismatch");
            var existing = await _repository.GetByIdAsync(id);
            if (existing is null) return NotFound();

            existing.WasteName = updated.WasteName;
            await _repository.UpdateAsync(existing);
            return NoContent();
        }

        // DELETE /WasteTypes/3
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
