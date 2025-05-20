using System;
using System.Text.Json;
using KomunalinisCentras.Backend.DTOs;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Factory;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IApplicationStatusRepository _statusRepository;
        private readonly RoleManager<Role> _roleManager;

        public ApplicationsController(IServiceProvider serviceProvider, IApplicationStatusRepository statusRepository, RoleManager<Role> roleManager)
        {
            _serviceProvider = serviceProvider;
            _statusRepository = statusRepository;
            _roleManager = roleManager;
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

        [HttpGet("by-role/{roleName}")]
        public async Task<IActionResult> GetApplicationsByWorkerRole(string roleName)
        {
            // var normalizedRoleName = roleName.ToUpperInvariant(); 
            var role = await _roleManager.Roles
                .Include(r => r.ApplicationGroups)
                .FirstOrDefaultAsync(r => r.Name == roleName);

            if (role == null)
                return NotFound("Role not found.");

            var allowedGroupIds = role.ApplicationGroups.Select(g => g.Id).ToList();

            if (!allowedGroupIds.Any())
                return Ok(new List<Application>());

            var repo = _serviceProvider.GetRequiredService<IApplicationRepository<Application>>();
            var apps = await repo.GetByApplicationGroupIdsAsync(allowedGroupIds);

            return Ok(apps);
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
            if (dto == null || dto.StatusId <= 0)
                return BadRequest("Invalid or missing status data.");

            var statusExists = await _statusRepository.ExistsAsync(dto.StatusId);
            if (!statusExists)
                return BadRequest("Provided status ID does not exist.");

            var applicationType = ApplicationFactory.ResolveType(formType);
            if (applicationType == null)
                return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(applicationType);
            dynamic repository = _serviceProvider.GetRequiredService(repoType);

            var existing = await repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            existing.StatusId = dto.StatusId;

            await repository.UpdateAsync(existing);
            return NoContent();
        }

        [HttpGet("/applicationstatuses")]
        public async Task<IActionResult> GetStatuses()
        {
            var statuses = await _statusRepository.GetAllAsync();
            return Ok(statuses);
        }

    }
}