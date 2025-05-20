using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KomunalinisCentras.Backend.Entities
{
    public class ApplicationGroup
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string GroupName { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Application> Applications { get; set; } = new List<Application>();

        [JsonIgnore]
        public ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}
