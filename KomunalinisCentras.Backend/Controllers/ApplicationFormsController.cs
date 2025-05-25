using System;
using System.Linq;
using System.Threading.Tasks;
using KomunalinisCentras.Backend.DTOs;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Factory;
using KomunalinisCentras.Backend.Repositories;
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IApplicationStatusRepository _statusRepository;
        private readonly RoleManager<Role> _roleManager;
        private readonly KomunalinisDbContext _db;
        private readonly IEmailService _mail;
        private readonly ILogger<ApplicationsController> _logger;

        public ApplicationsController(
            IServiceProvider serviceProvider,
            IApplicationStatusRepository statusRepository,
            RoleManager<Role> roleManager,
            KomunalinisDbContext db,
            IEmailService mail,
            ILogger<ApplicationsController> logger)
        {
            _serviceProvider = serviceProvider;
            _statusRepository = statusRepository;
            _roleManager = roleManager;
            _db = db;
            _mail = mail;
            _logger = logger;
        }

        /* ========================================================
           CRUD – bendri metodai
        ======================================================== */

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
            dynamic repo = _serviceProvider.GetRequiredService(repoType);
            await repo.CreateAsync((dynamic)application);

            return Created(string.Empty, application);
        }

        // GET /applications
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var repo = _serviceProvider.GetRequiredService<IApplicationRepository<Application>>();
            return Ok(await repo.GetAllAsync());
        }

        // GET /applications/by-role/{roleName}
        [HttpGet("by-role/{roleName}")]
        public async Task<IActionResult> GetApplicationsByWorkerRole(string roleName)
        {
            var role = await _roleManager.Roles
                                         .Include(r => r.ApplicationGroups)
                                         .FirstOrDefaultAsync(r => r.Name == roleName);
            if (role == null) return NotFound("Role not found.");

            var allowedGroupIds = role.ApplicationGroups.Select(g => g.Id).ToList();
            if (!allowedGroupIds.Any()) return Ok(Array.Empty<Application>());

            var repo = _serviceProvider.GetRequiredService<IApplicationRepository<Application>>();
            return Ok(await repo.GetByApplicationGroupIdsAsync(allowedGroupIds));
        }

        // GET /applications/{formType}
        [HttpGet("{formType}")]
        public async Task<IActionResult> GetAll(string formType)
        {
            var appType = ApplicationFactory.ResolveType(formType);
            if (appType == null) return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(appType);
            dynamic repo = _serviceProvider.GetRequiredService(repoType);
            return Ok(await repo.GetAllAsync());
        }

        // GET /applications/{formType}/{id}
        [HttpGet("{formType}/{id}")]
        public async Task<IActionResult> GetById(string formType, int id)
        {
            var appType = ApplicationFactory.ResolveType(formType);
            if (appType == null) return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(appType);
            dynamic repo = _serviceProvider.GetRequiredService(repoType);
            var app = await repo.GetByIdAsync(id);
            return app is null ? NotFound() : Ok(app);
        }

        // PUT /applications/{formType}/{id}
        [HttpPut("{formType}/{id}")]
        public async Task<IActionResult> Update(string formType, int id, [FromBody] ApplicationDto dto)
        {
            var application = ApplicationFactory.CreateFromDto(dto);
            if (application == null || application.Id != id)
                return BadRequest("Invalid form type or ID mismatch.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(application.GetType());
            dynamic repo = _serviceProvider.GetRequiredService(repoType);

            if (await repo.GetByIdAsync(id) is null) return NotFound();

            await repo.UpdateAsync((dynamic)application);
            return NoContent();
        }

        // DELETE /applications/{formType}/{id}
        [HttpDelete("{formType}/{id}")]
        public async Task<IActionResult> Delete(string formType, int id)
        {
            var appType = ApplicationFactory.ResolveType(formType);
            if (appType == null) return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(appType);
            dynamic repo = _serviceProvider.GetRequiredService(repoType);

            if (await repo.GetByIdAsync(id) is null) return NotFound();

            await repo.DeleteAsync(id);
            return NoContent();
        }

        // PUT /applications/{formType}/{id}/status
        [HttpPut("{formType}/{id}/status")]
        public async Task<IActionResult> UpdateStatus(string formType, int id, [FromBody] StatusUpdateDto dto)
        {
            if (dto == null || dto.StatusId <= 0) return BadRequest("Invalid or missing status data.");

            var statusEntity = await _db.ApplicationStatuses
                                        .Where(s => s.Id == dto.StatusId)
                                        .Select(s => new { s.Id, s.Name })
                                        .SingleOrDefaultAsync();
            if (statusEntity == null) return BadRequest("Provided status ID does not exist.");

            var appType = ApplicationFactory.ResolveType(formType);
            if (appType == null) return BadRequest("Unknown form type.");

            var repoType = typeof(IApplicationRepository<>).MakeGenericType(appType);
            dynamic repo = _serviceProvider.GetRequiredService(repoType);
            dynamic existing = await repo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            if (existing.StatusId == dto.StatusId) return NoContent();

            existing.StatusId = dto.StatusId;
            await repo.UpdateAsync(existing);

            try
            {
                string? targetEmail = null;

                Type type = ((object)existing).GetType();
                var uidProp = type.GetProperty("UserId") ?? type.GetProperty("user_id");
                if (uidProp?.GetValue(existing) is int uidVal)
                {
                    var user = await _db.Users.FindAsync(uidVal);
                    targetEmail = user?.Email;
                }

                if (string.IsNullOrWhiteSpace(targetEmail))
                {
                    var emailProp = type.GetProperties()
                                        .FirstOrDefault(p => p.Name.EndsWith("EmailAddress", StringComparison.OrdinalIgnoreCase) ||
                                                             p.Name.Equals("Email", StringComparison.OrdinalIgnoreCase));
                    targetEmail = emailProp?.GetValue(existing)?.ToString();
                }

                if (!string.IsNullOrWhiteSpace(targetEmail))
                {
                    var bodyHtml = $"<p>Sveiki!</p><p>Informuojame, kad Jūsų prašymo būsena pakeista į:</p><p style='font-size:1.2em;font-weight:600'>{statusEntity.Name}</p><p>Dėkojame, kad naudojatės mūsų paslaugomis!</p>";
                    await _mail.SendAsync(targetEmail, "Atnaujinta prašymo būsena", bodyHtml);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Nepavyko išsiųsti būsenos pakeitimo laiško. ApplicationId={ApplicationId}", id);
            }

            return NoContent();
        }

        /* ========================================================
           Statusų sąrašas – frontend dropdown'ui
        ======================================================== */

        [HttpGet("/applicationstatuses")]
        public async Task<IActionResult> GetStatuses()
        {
            return Ok(await _statusRepository.GetAllAsync());
        }
    }

    public record StatusUpdateDto(int StatusId);
}
