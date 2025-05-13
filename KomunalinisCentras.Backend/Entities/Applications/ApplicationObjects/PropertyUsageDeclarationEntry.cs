using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    public class PropertyUsageDeclarationEntry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Address { get; set; } = null!; // adresas

        [Required]
        public string BuildingUniqueNumber { get; set; } = null!; // unikalusNr

        [Required]
        public string RegisteredPurpose { get; set; } = null!; // paskirtisRegistras

        [Required]
        public string ActualPurpose { get; set; } = null!; // paskirtisFaktine

        [Required]
        public double RegisteredArea { get; set; } // plotasRegistras

        [Required]
        public double ActualArea { get; set; } // plotasFaktine

        // Foreign key back to declaration
        [ForeignKey("Declaration")]
        public int PropertyUsageDeclarationId { get; set; }

        [JsonIgnore]
        public PropertyUsageDeclaration? Declaration { get; set; }
    }
}
