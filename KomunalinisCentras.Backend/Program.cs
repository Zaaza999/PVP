using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Repositories;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Services;   // IEmailService / EmailService
using KomunalinisCentras.Backend.Jobs;       // ReminderJob

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using Hangfire;
using Hangfire.MySqlStorage;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// 1. Configuration sources (appsettings.json + environment)
// ------------------------------------------------------------
builder.Configuration.AddEnvironmentVariables();

// ------------------------------------------------------------
// 2. Database (MySQL via Pomelo)
// ------------------------------------------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
var serverVersion    = new MySqlServerVersion(new Version(8, 0, 32));

builder.Services.AddDbContext<KomunalinisDbContext>(opt =>
    opt.UseMySql(connectionString, serverVersion));

// ------------------------------------------------------------
// 3. ASP.NET Identity (EF‑Core store)
// ------------------------------------------------------------
builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<KomunalinisDbContext>()
    .AddDefaultTokenProviders();

// ------------------------------------------------------------
// 4. JWT Authentication
// ------------------------------------------------------------
var jwtSection = builder.Configuration.GetSection("JWT");
var jwtSecret  = Encoding.UTF8.GetBytes(jwtSection["Secret"]!);

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.RequireHttpsMetadata = !builder.Environment.IsDevelopment(); // HTTP allowed only in dev
    opt.SaveToken            = true;
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidIssuer              = jwtSection["ValidIssuer"],
        ValidAudience            = jwtSection["ValidAudience"],
        IssuerSigningKey         = new SymmetricSecurityKey(jwtSecret)
    };
});
builder.Services.AddAuthorization();

// ------------------------------------------------------------
// 5. Custom repositories & services
// ------------------------------------------------------------
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmployeeTimeSlotRepository, EmployeeTimeSlotRepository>();
builder.Services.AddScoped<IVisitTopicRepository, VisitTopicRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<ILocationRepository, LocationRepository>();
builder.Services.AddScoped<IWasteTypeRepository, WasteTypeRepository>();
builder.Services.AddScoped<IGarbageScheduleRepository, GarbageScheduleRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();

builder.Services.AddScoped<IEmailService, EmailService>();

// ------------------------------------------------------------
// 6. Hangfire (job scheduler)
// ------------------------------------------------------------
builder.Services.AddHangfire(cfg =>
    cfg.UseStorage(new MySqlStorage(connectionString)));

builder.Services.AddHangfireServer();

// ------------------------------------------------------------
// 7. Controllers, Swagger, CORS
// ------------------------------------------------------------
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", p => p
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// ------------------------------------------------------------
// 8. Build the app
// ------------------------------------------------------------
var app = builder.Build();

// --- Automatic EF Core migrations (dev / staging) -------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<KomunalinisDbContext>();
    db.Database.Migrate();
}

// --- Middlewares -----------------------------------------------------------
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// --- Hangfire recurring job ------------------------------------------------
RecurringJob.AddOrUpdate<ReminderJob>(
    "waste-reminder",
    job => job.RunAsync(),
    builder.Configuration["Hangfire:Cron"] ?? "0 17 * * *"); // fallback 17:00 UTC

// --- Endpoints -------------------------------------------------------------
app.MapControllers();

// --- Run -------------------------------------------------------------------
app.Run();
