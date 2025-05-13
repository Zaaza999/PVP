using System;
using System.ComponentModel.DataAnnotations;

namespace KomunalinisCentras.Backend.Entities
{
    public class ContainerSizeChangeRequest : Application
    {
        [Required]
        public string PropertyAddress { get; set; } = null!;
        [Required]
        public string PropertyOwnerFullName { get; set; } = null!;
        public string? CorrespondenceAddress { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        public string? EmailAddress { get; set; }

        [Required]
        public int CurrentCapacityLiters { get; set; }  // isTalpa

        [Required]
        public int NewCapacityLiters { get; set; }  // iTalpa

        [Required]
        public string ApplicantFullName { get; set; } = null!;  // pareiskejas
    }
}
