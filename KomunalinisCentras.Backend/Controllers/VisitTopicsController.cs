using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KomunalinisCentras.Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VisitTopicsController : ControllerBase
    {
        private readonly IVisitTopicRepository _visitTopicRepository;

        public VisitTopicsController(IVisitTopicRepository visitTopicRepository)
        {
            _visitTopicRepository = visitTopicRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var topics = await _visitTopicRepository.GetAllAsync();
            return Ok(topics);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var topic = await _visitTopicRepository.GetByIdAsync(id);
            if (topic == null)
                return NotFound();

            return Ok(topic);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VisitTopic newTopic)
        {
            await _visitTopicRepository.CreateAsync(newTopic);
            return CreatedAtAction(nameof(GetById), new { id = newTopic.TopicId }, newTopic);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] VisitTopic updatedTopic)
        {
            if (id != updatedTopic.TopicId)
                return BadRequest("ID neatitinka.");

            var existingTopic = await _visitTopicRepository.GetByIdAsync(id);
            if (existingTopic == null)
                return NotFound();

            existingTopic.TopicName = updatedTopic.TopicName;
            existingTopic.Description = updatedTopic.Description;

            await _visitTopicRepository.UpdateAsync(existingTopic);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingTopic = await _visitTopicRepository.GetByIdAsync(id);
            if (existingTopic == null)
                return NotFound();

            await _visitTopicRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
