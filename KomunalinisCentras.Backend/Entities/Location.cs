using System.ComponentModel.DataAnnotations;


namespace KomunalinisCentras.Backend.Entities
{
    public class Location
    {
        [Key]
        public int LocationId { get; set; }
        public string LocationName { get; set; } = null!;
        public string? Description { get; set; }
    }
}
