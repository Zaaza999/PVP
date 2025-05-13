using System;
using System.ComponentModel.DataAnnotations;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Entities
{
    public class EmailInvoiceRequest : Application
    {
        [Required]
        public string PropertyAddress { get; set; } = null!;
        [Required]
        public string PropertyOwnerFullName { get; set; } = null!;

        public string? CorrespondenceAddress { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        public string? EmailAddress { get; set; }

        [Required]
        public string ApplicantFullName { get; set; } = null!;
    }
}
