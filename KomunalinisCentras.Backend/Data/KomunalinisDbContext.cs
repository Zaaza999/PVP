using Microsoft.EntityFrameworkCore;
using KomunalinisCentras.Backend.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace KomunalinisCentras.Backend.Data
{
    public class KomunalinisDbContext : IdentityDbContext<User, Role, string>
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
        public DbSet<Application> Applications { get; set; }
        // START Application forms and their items
        public DbSet<PropertyUsageDeclaration> PropertyUsageDeclarations { get; set; }
        public DbSet<PropertyUsageDeclarationEntry> PropertyUsageDeclarationEntries { get; set; }
        public DbSet<ResidentCountDeclaration> ResidentCountDeclarations { get; set; }
        public DbSet<Resident> Residents { get; set; }
        public DbSet<ContainerFrequencyChange> ContainerFrequencyChanges { get; set; }
        public DbSet<EmailInvoiceRequest> EmailInvoiceRequests { get; set; }
        public DbSet<RefundRequest> RefundRequests { get; set; }
        public DbSet<WasteFeeExemption> WasteFeeExemptions { get; set; }
        public DbSet<WasteFeeExemptionBusiness> WasteFeeExemptionBusinesses { get; set; }
        public DbSet<PropertyUnsuitability> PropertyUnsuitabilities { get; set; }
        public DbSet<PayerDataChangeRequest> PayerDataChangeRequests { get; set; }
        public DbSet<ContainerRequest> ContainerRequests { get; set; }
        public DbSet<ContainerSizeChangeRequest> ContainerSizeChangeRequests { get; set; }

        // END Application forms and their items
        public DbSet<ApplicationStatus> ApplicationStatuses { get; set; }
        public DbSet<ApplicationGroup> ApplicationGroups { get; set; }



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
            modelBuilder.Entity<Application>().ToTable("Applications");
            modelBuilder.Entity<WasteFeeExemption>().HasBaseType<Application>();
            modelBuilder.Entity<WasteFeeExemptionBusiness>().HasBaseType<Application>();
            modelBuilder.Entity<EmailInvoiceRequest>().HasBaseType<Application>();
            modelBuilder.Entity<PropertyUnsuitability>().HasBaseType<Application>();
            modelBuilder.Entity<PropertyUsageDeclaration>().HasBaseType<Application>();
            modelBuilder.Entity<ResidentCountDeclaration>().HasBaseType<Application>();
            modelBuilder.Entity<ContainerRequest>().HasBaseType<Application>();
            modelBuilder.Entity<ContainerRequest>().HasBaseType<Application>();
            modelBuilder.Entity<ContainerFrequencyChange>().HasBaseType<Application>();
            modelBuilder.Entity<ContainerSizeChangeRequest>().HasBaseType<Application>();
            modelBuilder.Entity<PayerDataChangeRequest>().HasBaseType<Application>();
            modelBuilder.Entity<RefundRequest>().HasBaseType<Application>();
            modelBuilder.Entity<ApplicationGroup>().ToTable("ApplicationGroups");


            // Example relationships (if you want explicit configuration)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            modelBuilder.Entity<EmployeeTimeSlot>()
                .HasOne(e => e.Employee)
                .WithMany()
                .HasForeignKey(e => e.EmployeeId)
                .HasPrincipalKey(u => u.Id);

            //modelBuilder.Entity<EmployeeTimeSlot>()
            //    .HasOne(e => e.Topic)
            //    .WithMany()
            //    .HasForeignKey(e => e.TopicId);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .HasPrincipalKey(u => u.Id);

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


            modelBuilder.Entity<Application>()
                .HasOne(a => a.SubmittedBy)
                .WithMany()
                .HasForeignKey(a => a.SubmittedByUserId);

            modelBuilder.Entity<PropertyUsageDeclaration>()
                .HasMany(p => p.Entries)
                .WithOne(e => e.Declaration)
                .HasForeignKey(e => e.PropertyUsageDeclarationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ResidentCountDeclaration>()
                .HasMany(d => d.Residents)
                .WithOne(r => r.Declaration)
                .HasForeignKey(r => r.ResidentCountDeclarationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Status)
                .WithMany(s => s.Applications)
                .HasForeignKey(a => a.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.ApplicationGroup)
                .WithMany(g => g.Applications)
                .HasForeignKey(a => a.ApplicationGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Role>()
                .HasMany(r => r.ApplicationGroups)
                .WithMany(g => g.Roles)
                .UsingEntity<Dictionary<string, object>>(
                    "RoleApplicationGroup",
                    r => r.HasOne<ApplicationGroup>().WithMany().HasForeignKey("ApplicationGroupId"),
                    g => g.HasOne<Role>().WithMany().HasForeignKey("RoleId"),
                    je =>
                    {
                        je.ToTable("RoleApplicationGroups");
                        je.HasKey("RoleId", "ApplicationGroupId");
                    }
                );

        }
    }
}
