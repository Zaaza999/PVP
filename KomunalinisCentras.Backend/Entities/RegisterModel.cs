namespace KomunalinisCentras.Backend.Entities;

public class RegisterModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public string Password { get; set; }
    public string RoleId { get; set; } = null!;

}