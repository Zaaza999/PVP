using System;
using System.ComponentModel.DataAnnotations;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Entities
{
    public class PayerDataChangeRequest : Application
    {

        [Required]
        public string PropertyOwnerFullName { get; set; } = null!;

        public string? CorrespondenceAddress { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        public string? EmailAddress { get; set; }

        public string? CompanyCode { get; set; }
        
        [Required]
        public string TenantFullName { get; set; }  = null!;
        
        [Required]
        public string TenantCompanyCode { get; set; }  = null!;

        [Required]
        public string PropertyAddress { get; set; } = null!;
        [Required]
        public string BuildingUniqueNumber { get; set; } = null!;

        [Required]
        public double RegisteredArea { get; set; }

        [Required]
        public string RegisteredPurpose { get; set; } = null!;

        [Required]
        [DataType(DataType.Date)]
        public DateTime LeaseStartDateOrUsageStartDate { get; set; }
        
        [Required]
        public string PaymentNoticeMailingAddress { get; set; } = null!;
        
        [Required]
        [EmailAddress]
        public string PaymentNoticeEmail { get; set; } = null!;

        [Required]
        public string RepresentativePosition { get; set; } = null!;
    }
}
