using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Repositories
{
    public interface IVisitTopicRepository
    {
        Task<IEnumerable<VisitTopic>> GetAllAsync();
        Task<VisitTopic?> GetByIdAsync(int id);
        Task CreateAsync(VisitTopic visitTopic);
        Task UpdateAsync(VisitTopic visitTopic);
        Task DeleteAsync(int id);
    }
}
