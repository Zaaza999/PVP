using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    [Table("WasteTypes")]
    public class WasteType
    {
        [Key]
        [Column("waste_id")]
        public int WasteId { get; set; }

        [Column("waste_name")]
        [MaxLength(100)]
        public string WasteName { get; set; } = null!;
    }
}
