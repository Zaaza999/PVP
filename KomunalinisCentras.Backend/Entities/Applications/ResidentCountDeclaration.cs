using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KomunalinisCentras.Backend.Entities
{
    public class ResidentCountDeclaration : Application
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

        [Required]
        public double Area { get; set; } // bendrasPlotas

        public List<Resident> Residents { get; set; } = new(); // gyventojai
    }
}
