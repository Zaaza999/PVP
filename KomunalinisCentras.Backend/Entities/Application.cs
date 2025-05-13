using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace KomunalinisCentras.Backend.Entities
{
    public abstract class Application
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FormType  { get; set; } = null!;

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
        
        [Column("user_id")]
        public string SubmittedByUserId { get; set; }

        public User? SubmittedBy { get; set; }

        [Column("approved")]
        public bool Approved { get; set; } = false;
    }
}
