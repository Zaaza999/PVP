using Microsoft.EntityFrameworkCore;
using KomunalinisCentras.Backend.Entities;

namespace KomunalinisCentras.Backend.Data
{
    public class KomunalinisDbContext : DbContext
    {
        public KomunalinisDbContext(DbContextOptions<KomunalinisDbContext> options)
            : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<VisitTopic> VisitTopics { get; set; }
        public DbSet<EmployeeTimeSlot> EmployeeTimeSlots { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<WasteType> WasteTypes { get; set; }
        public DbSet<GarbageCollectionSchedule> GarbageCollectionSchedules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map to the new table names from the SQL script
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<VisitTopic>().ToTable("VisitTopics");
            modelBuilder.Entity<EmployeeTimeSlot>().ToTable("EmployeeTimeSlots");
            modelBuilder.Entity<Reservation>().ToTable("Reservations");
            modelBuilder.Entity<Location>().ToTable("Locations");
            modelBuilder.Entity<WasteType>().ToTable("WasteTypes");
            modelBuilder.Entity<GarbageCollectionSchedule>().ToTable("GarbageCollectionSchedule");

            // Example relationships (if you want explicit configuration)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            modelBuilder.Entity<EmployeeTimeSlot>()
                .HasOne(e => e.Employee)
                .WithMany()
                .HasForeignKey(e => e.EmployeeId);

            //modelBuilder.Entity<EmployeeTimeSlot>()
            //    .HasOne(e => e.Topic)
            //    .WithMany()
            //    .HasForeignKey(e => e.TopicId);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.TimeSlot)
                .WithMany()
                .HasForeignKey(r => r.TimeSlotId);

            modelBuilder.Entity<GarbageCollectionSchedule>()
                .HasOne(g => g.Location)
                .WithMany()
                .HasForeignKey(g => g.LocationId);

            modelBuilder.Entity<GarbageCollectionSchedule>()
                .HasOne(g => g.WasteType)
                .WithMany()
                .HasForeignKey(g => g.WasteId);
        }
    }
}
