using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KomunalinisCentras.Backend.Entities
{
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("role_id")]
        public int RoleId { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; } = null!;

        [Column("last_name")]
        public string LastName { get; set; } = null!;

        [Column("username")]
        public string Username { get; set; } = null!;

        [Column("user_password")]
        public string UserPassword { get; set; } = null!;

        [Column("address")]
        public string? Address { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [JsonIgnore]
        public Role? Role { get; set; }
    }
}
