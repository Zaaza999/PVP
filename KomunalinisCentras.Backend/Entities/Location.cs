using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    [Table("Locations")]
    public class Location
    {
        [Key]
        [Column("location_id")]
        public int LocationId { get; set; }

        [Column("location_name")]
        [MaxLength(100)]
        public string LocationName { get; set; } = null!;

        [Column("description")]
        public string? Description { get; set; }
    }
}
