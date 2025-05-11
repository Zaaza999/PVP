using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Controllers;

[Authorize(Roles = "Worker")]
[ApiController]
[Route("[controller]")]
public class ResidentsController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public ResidentsController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("residents")]
    public async Task<IActionResult> GetResidents()
    {
        var residents = _userManager.Users
            .Where(u => u.Role != null && u.Role.RoleName == "client")
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email, 
                u.Address, 
                u.PhoneNumber
            });

        return Ok(await residents.ToListAsync());
    }
}