using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Repositories;
using KomunalinisCentras.Backend.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Load MySQL connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register DbContext (MySQL via Pomelo)
builder.Services.AddDbContext<KomunalinisDbContext>(options =>
{
    var serverVersion = new MySqlServerVersion(new Version(8, 0, 32));
    options.UseMySql(connectionString, serverVersion);
});

// 3. Add controllers
builder.Services.AddControllers();

// 4. (Optional) Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 5. Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>(); 
builder.Services.AddScoped<IEmployeeTimeSlotRepository, EmployeeTimeSlotRepository>(); 
builder.Services.AddScoped<IVisitTopicRepository, VisitTopicRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>(); 
builder.Services.AddScoped<ILocationRepository, LocationRepository>(); 
builder.Services.AddScoped<IWasteTypeRepository, WasteTypeRepository>(); 
builder.Services.AddScoped<IGarbageScheduleRepository, GarbageScheduleRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<KomunalinisDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JWT:ValidAudience"],
            ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
        };
    });
builder.Services.AddAuthorization();

// Build the app
var app = builder.Build();

app.UseCors("AllowAll");
// 6. (Optional) Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 7. Additional middlewares
app.UseHttpsRedirection();

// 8. Map controllers
app.MapControllers();

// 9. Run application
app.Run();
