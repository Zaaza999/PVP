using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace KomunalinisCentras.Backend.Entities
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FormType { get; set; } = null!;

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Column("user_id")]
        public string SubmittedByUserId { get; set; }

        public User? SubmittedBy { get; set; }

        [Required]
        [ForeignKey("Status")]
        public int StatusId { get; set; }

        public ApplicationStatus Status { get; set; } = null!;

        [ForeignKey("ApplicationGroup")]
        public int ApplicationGroupId { get; set; }

        public ApplicationGroup ApplicationGroup { get; set; } = null!;

    }

}
