using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    public class WasteFeeExemptionBusiness : Application
    {
        [Required]
        public string PropertyAddress { get; set; } = null!;
        [Required]
        public string PropertyOwnerFullName { get; set; } = null!;

        public string? CorrespondenceAddress { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        public string? EmailAddress { get; set; }

        [Required]
        public double Area { get; set; }

        [Required]
        public string BuildingUniqueNumber { get; set; } = null!;

        [Required]
        [DataType(DataType.Date)]
        public DateTime PeriodFrom { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime PeriodTo { get; set; }

        [Required]
        public string ApplicantFullName { get; set; } = null!;
    }
}
