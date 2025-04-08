namespace KomunalinisCentras.Backend.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string UserPassword { get; set; } = null!;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }

        public Role? Role { get; set; }
    }
}
