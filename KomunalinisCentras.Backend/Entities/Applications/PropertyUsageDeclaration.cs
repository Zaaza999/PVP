using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Entities
{
    public class PropertyUsageDeclaration : Application
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

        // Navigation property to entries
        public List<PropertyUsageDeclarationEntry> Entries { get; set; } = new();
    }
}
