using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace KomunalinisCentras.Backend.Entities
{
    public class Role : IdentityRole
    {
        [Key] 
        [Column("role_id")]
        public int RoleId { get; set; } 

        [Column("role_name")]
        public string RoleName { get; set; } = null!;

        // Navigation (one Role -> many Users) 
        [JsonIgnore]
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
