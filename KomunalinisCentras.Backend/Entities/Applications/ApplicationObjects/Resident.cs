using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KomunalinisCentras.Backend.Entities
{
    public class Resident
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        public string PersonalData { get; set; } = null!;

        public string? AdditionalInfo { get; set; }

        [ForeignKey("Declaration")]
        public int ResidentCountDeclarationId { get; set; }

        [JsonIgnore]
        public ResidentCountDeclaration? Declaration { get; set; }
    }
}
