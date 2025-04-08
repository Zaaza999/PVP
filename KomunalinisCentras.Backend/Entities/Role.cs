namespace KomunalinisCentras.Backend.Entities
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = null!;

        // Navigation (one Role -> many Users)
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
