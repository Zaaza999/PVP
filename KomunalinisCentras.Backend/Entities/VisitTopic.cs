namespace KomunalinisCentras.Backend.Entities
{
    public class VisitTopic
    {
        public int TopicId { get; set; }
        public string TopicName { get; set; } = null!;
        public string? Description { get; set; }
    }
}
