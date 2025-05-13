using System;
using System.Text.Json;
using KomunalinisCentras.Backend.DTOs;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Factory;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IServiceProvider _serviceProvider;

        public ApplicationsController(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        // POST /applications
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ApplicationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var application = ApplicationFactory.CreateFromDto(dto);
            if (application == null)
                return BadRequest("Unknown or unsupported form type.");

            application.Date = DateTime.UtcNow;

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(application.GetType());
            dynamic repository = _serviceProvider.GetRequiredService(repoType);

            await repository.CreateAsync((dynamic)application);

            return Created(string.Empty, application);
        }

        // GET /applications
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var applicationRepository = _serviceProvider.GetRequiredService<IApplicationRepository<Application>>();
            var all = await applicationRepository.GetAllAsync();
            return Ok(all);
        }

        // GET /applications/formType
        [HttpGet("{formType}")]
        public async Task<IActionResult> GetAll(string formType)
        {
            var applicationType = ApplicationFactory.ResolveType(formType);
            if (applicationType == null)
                return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(applicationType);
            dynamic repository = _serviceProvider.GetRequiredService(repoType);

            var applications = await repository.GetAllAsync();
            return Ok(applications);
        }

        // GET /applications/formType/1
        [HttpGet("{formType}/{id}")]
        public async Task<IActionResult> GetById(string formType, int id)
        {
            var applicationType = ApplicationFactory.ResolveType(formType);
            if (applicationType == null)
                return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(applicationType);
            dynamic repository = _serviceProvider.GetRequiredService(repoType);

            var application = await repository.GetByIdAsync(id);
            if (application == null)
                return NotFound();

            return Ok(application);
        }

        // PUT /applications/formType/1
        [HttpPut("{formType}/{id}")]
        public async Task<IActionResult> Update(string formType, int id, [FromBody] ApplicationDto dto)
        {
            var application = ApplicationFactory.CreateFromDto(dto);
            if (application == null || application.Id != id)
                return BadRequest("Invalid form type or ID mismatch.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(application.GetType());
            dynamic repository = _serviceProvider.GetRequiredService(repoType);

            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await repository.UpdateAsync((dynamic)application);
            return NoContent();
        }

        // DELETE /applications/formType/1
        [HttpDelete("{formType}/{id}")]
        public async Task<IActionResult> Delete(string formType, int id)
        {
            var applicationType = ApplicationFactory.ResolveType(formType);
            if (applicationType == null)
                return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(applicationType);
            dynamic repository = _serviceProvider.GetRequiredService(repoType);

            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await repository.DeleteAsync(id);
            return NoContent();
        }

        // PUT /applications/{formType}/{id}/status
        [HttpPut("{formType}/{id}/status")]
        public async Task<IActionResult> UpdateStatus(string formType, int id, [FromBody] StatusUpdateDto dto)
        {
            if (dto == null)
                return BadRequest("Missing status data.");

            var applicationType = ApplicationFactory.ResolveType(formType);
            if (applicationType == null)
                return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(applicationType);
            dynamic repository = _serviceProvider.GetRequiredService(repoType);

            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            // Currently supports only boolean "Approved"
            existing.Approved = dto.Approved;

            await repository.UpdateAsync(existing);
            return NoContent();
        }
    }
}