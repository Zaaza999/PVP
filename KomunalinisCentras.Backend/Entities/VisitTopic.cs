using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    public class VisitTopic
    { 
        [Key] 
        [Column("topic_id")]

        public int TopicId { get; set; } 

        [Column("topic_name")]
        public string TopicName { get; set; } = null!; 

        [Column("description")]
        public string? Description { get; set; }
    }
}
