using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace KomunalinisCentras.Backend.Entities
{
    public class User : IdentityUser
    {
        [Column("first_name")]
        public string? FirstName { get; set; } = null!;

        [Column("last_name")]
        public string? LastName { get; set; } = null!;

        [Column("address")]
        public string? Address { get; set; }
        
        public string? RoleId { get; set; } = null!;

        [ForeignKey("RoleId")]
        public Role? Role { get; set; } = null!;
    }
}
