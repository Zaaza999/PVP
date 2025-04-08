using System.ComponentModel.DataAnnotations;

namespace KomunalinisCentras.Backend.Entities
{
    public class WasteType
    { 
        [Key]
        public int WasteId { get; set; }
        public string WasteName { get; set; } = null!; 
    }
}
