using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KomunalinisCentras.Backend.Entities
{
    public class ApplicationStatus
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

    [JsonIgnore]
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
