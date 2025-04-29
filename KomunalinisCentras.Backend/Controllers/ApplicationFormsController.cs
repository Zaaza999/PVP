using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationRepository _applicationRepository;

        public ApplicationsController(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        // GET /applications
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var applications = await _applicationRepository.GetAllAsync();
            return Ok(applications);
        }

        // GET /applications/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var application = await _applicationRepository.GetByIdWithUserAsync(id);
            if (application == null)
                return NotFound();

            return Ok(application);
        }

        // POST /applications
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Application newApplication)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            newApplication.SubmittedAt = DateTime.UtcNow;
            await _applicationRepository.CreateAsync(newApplication);
            return CreatedAtAction(nameof(GetById), new { id = newApplication.ApplicationId }, newApplication);
        }

        // PUT /applications/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Application updatedApplication)
        {
            if (id != updatedApplication.ApplicationId)
                return BadRequest("ID neatitinka.");

            var existingApp = await _applicationRepository.GetByIdAsync(id);
            if (existingApp == null)
                return NotFound();

            existingApp.FormType = updatedApplication.FormType;
            existingApp.Data = updatedApplication.Data;
            existingApp.SubmittedByUserId = updatedApplication.SubmittedByUserId;

            await _applicationRepository.UpdateAsync(existingApp);
            return NoContent();
        }

        // DELETE /applications/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingApp = await _applicationRepository.GetByIdAsync(id);
            if (existingApp == null)
                return NotFound();

            await _applicationRepository.DeleteAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> SetApprovalStatus(int id, [FromBody] bool approved)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            if (application == null)
                return NotFound();

            application.Approved = approved;
            await _applicationRepository.UpdateAsync(application);

            return NoContent();
        }

    }
}
