using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Repositories
{
    public class VisitTopicRepository : IVisitTopicRepository
    {
        private readonly KomunalinisDbContext _context;

        public VisitTopicRepository(KomunalinisDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VisitTopic>> GetAllAsync()
        {
            return await _context.VisitTopics.ToListAsync();
        }

        public async Task<VisitTopic?> GetByIdAsync(int id)
        {
            return await _context.VisitTopics.FirstOrDefaultAsync(v => v.TopicId == id);
        }

        public async Task CreateAsync(VisitTopic visitTopic)
        {
            await _context.VisitTopics.AddAsync(visitTopic);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(VisitTopic visitTopic)
        {
            _context.VisitTopics.Update(visitTopic);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var topic = await GetByIdAsync(id);
            if (topic != null)
            {
                _context.VisitTopics.Remove(topic);
                await _context.SaveChangesAsync();
            }
        }
    }
}
