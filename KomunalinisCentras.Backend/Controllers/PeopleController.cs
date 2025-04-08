using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class PeopleController : ControllerBase
{
    private readonly IPersonRepository _repo;

    public PeopleController(IPersonRepository repo)
    {
        _repo = repo;
    }

    // 1) GET all
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var people = await _repo.GetAllAsync();
        return Ok(people);
    }

    // 2) GET by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var person = await _repo.GetByIdAsync(id);
        if (person == null)
            return NotFound();

        return Ok(person);
    }

    // 3) CREATE
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Person newPerson)
    {
        newPerson.CreatedOn = DateTime.Now;
        await _repo.CreateAsync(newPerson);
        return CreatedAtAction(nameof(GetById), new { id = newPerson.Id }, newPerson);
    }

    // 4) UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Person updatedPerson)
    {
        if (id != updatedPerson.Id)
            return BadRequest("ID in route doesn't match ID in payload.");

        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
            return NotFound();

        existing.Name = updatedPerson.Name;
        existing.CreatedOn = updatedPerson.CreatedOn;

        await _repo.UpdateAsync(existing);
        return NoContent();
    }

    // 5) DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
            return NotFound();

        await _repo.DeleteAsync(id);
        return NoContent();
    }
}
