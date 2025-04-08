using Microsoft.EntityFrameworkCore;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Data;

public class KomunalinisDbContext : DbContext
{
    public KomunalinisDbContext(DbContextOptions<KomunalinisDbContext> options)
        : base(options)
    {
    }

    // Štai čia "Person" bus lentelė "People"
    public DbSet<Person> People { get; set; }
}
