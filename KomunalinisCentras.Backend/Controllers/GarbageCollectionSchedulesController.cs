using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GarbageCollectionSchedulesController : ControllerBase
    {
        private readonly IGarbageScheduleRepository _repo;

        public GarbageCollectionSchedulesController(IGarbageScheduleRepository repo)
        {
            _repo = repo;
        }

        // GET /GarbageCollectionSchedules
        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _repo.GetAllAsync());

        // GET /GarbageCollectionSchedules/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        // POST /GarbageCollectionSchedules
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GarbageCollectionSchedule model)
        {
            await _repo.CreateAsync(model);
            return CreatedAtAction(nameof(GetById),
                                   new { id = model.ScheduleId },
                                   model);
        }

        // PUT /GarbageCollectionSchedules/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] GarbageCollectionSchedule model)
        {
            if (id != model.ScheduleId) return BadRequest("ID mismatch");
            var existing = await _repo.GetByIdAsync(id);
            if (existing is null) return NotFound();

            existing.LocationId     = model.LocationId;
            existing.WasteId        = model.WasteId;
            existing.CollectionDate = model.CollectionDate;
            existing.Comment        = model.Comment;

            await _repo.UpdateAsync(existing);
            return NoContent();
        }

        // DELETE /GarbageCollectionSchedules/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing is null) return NotFound();

            await _repo.DeleteAsync(id);
            return NoContent();
        }
    }
}
