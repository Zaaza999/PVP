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
        public DateTime EffectiveFrom { get; set; } // nuoData

        [Required]
        public int FrequencyPerMonth { get; set; } // daznis (1, 2, 4)

        [Required]
        public string ApplicantFullName { get; set; } = null!; // pareiskejas
    }
}
