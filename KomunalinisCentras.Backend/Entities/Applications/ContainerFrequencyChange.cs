using System;
using System.ComponentModel.DataAnnotations;

namespace KomunalinisCentras.Backend.Entities
{
    public class ContainerFrequencyChange : Application
    {
        [Required]
        public string PropertyAddress { get; set; } = null!;
        [Required]
        public string PropertyOwnerFullName { get; set; } = null!;
        public string? CorrespondenceAddress { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        public string? EmailAddress { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime EffectiveFrom { get; set; } 

        [Required]
        public int FrequencyPerMonth { get; set; } 

        [Required]
        public string ApplicantFullName { get; set; } = null!; 
    }
}
