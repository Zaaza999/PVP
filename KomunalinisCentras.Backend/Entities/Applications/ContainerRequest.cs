using System;
using System.ComponentModel.DataAnnotations;

namespace KomunalinisCentras.Backend.Entities
{
    public class ContainerRequest : Application
    {
        [Required]
        public string PropertyAddress { get; set; } = null!;
        [Required]
        public string PropertyOwnerFullName { get; set; } = null!;
        public string? CorrespondenceAddress { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        public string? EmailAddress { get; set; }

        [Required]
        [EmailAddress]
        public string EmailForInvoices { get; set; } = null!; 

        [Required]
        public int ContainerVolumeLiters { get; set; } // talpa (120, 140, 240)

        [Required]
        public int EmptyingFrequencyPerYear { get; set; } // daznumas (12, 26, 52)

        [Required]
        public string ApplicantFullName { get; set; } = null!; // pareiskejas
    }
}
