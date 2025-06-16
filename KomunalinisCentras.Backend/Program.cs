
using KomunalinisCentras.Backend.Data;
using KomunalinisCentras.Backend.Repositories;
using KomunalinisCentras.Backend.Entities;
using KomunalinisCentras.Backend.Services;   
using KomunalinisCentras.Backend.Jobs;       
using KomunalinisCentras.Backend.Middleware; 
using Serilog;
using KomunalinisCentras.Backend.Gateways;


using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; 
using System.Text.Json;


using Hangfire;
using Hangfire.MySql;
using Hangfire.Storage;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();


var conn          = builder.Configuration.GetConnectionString("DefaultConnection")!;
var serverVersion = new MySqlServerVersion(new Version(8, 0, 32));

builder.Services.AddDbContext<KomunalinisDbContext>(opt =>
    opt.UseMySql(conn, serverVersion));


builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<KomunalinisDbContext>()
    .AddDefaultTokenProviders();


var jwt    = builder.Configuration.GetSection("JWT");
var secret = Encoding.UTF8.GetBytes(jwt["Secret"]!);

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    o.SaveToken            = true;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer   = true,
        ValidateAudience = true,
        ValidIssuer      = jwt["ValidIssuer"],
        ValidAudience    = jwt["ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(secret)
    };
});

builder.Services.AddAuthorization();


builder.Services.AddScoped<IUserRepository, UserRepository>(); 
builder.Services.AddScoped<IEmployeeTimeSlotRepository, EmployeeTimeSlotRepository>(); 
builder.Services.AddScoped<IVisitTopicRepository, VisitTopicRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>(); 
builder.Services.AddScoped<ILocationRepository, LocationRepository>(); 
builder.Services.AddScoped<IWasteTypeRepository, WasteTypeRepository>(); 
builder.Services.AddScoped<IGarbageScheduleRepository, GarbageScheduleRepository>();
builder.Services.AddScoped(typeof(IApplicationRepository<>), typeof(ApplicationRepository<>));
builder.Services.AddScoped<IApplicationRepository<ResidentCountDeclaration>, ResidentCountDeclarationRepository>();
builder.Services.AddScoped<IApplicationRepository<PropertyUsageDeclaration>, PropertyUsageDeclarationRepository>();
builder.Services.AddScoped<IApplicationRepository<RefundRequest>, RefundRequestRepository>();
builder.Services.AddScoped<IApplicationRepository<EmailInvoiceRequest>, EmailInvoiceRequestRepository>();
builder.Services.AddScoped<IApplicationRepository<WasteFeeExemption>, WasteFeeExemptionRepository>();
builder.Services.AddScoped<IApplicationRepository<WasteFeeExemptionBusiness>, WasteFeeExemptionBusinessRepository>();
builder.Services.AddScoped<IApplicationRepository<ContainerFrequencyChange>, ContainerFrequencyChangeRepository>();
builder.Services.AddScoped<IApplicationRepository<ContainerRequest>, ContainerRequestRepository>();
builder.Services.AddScoped<IApplicationRepository<ContainerSizeChangeRequest>, ContainerSizeChangeRequestRepository>();
builder.Services.AddScoped<IApplicationRepository<PayerDataChangeRequest>, PayerDataChangeRequestRepository>();
builder.Services.AddScoped<IApplicationRepository<PropertyUnsuitability>, PropertyUnsuitabilityRepository>();
builder.Services.AddScoped<IApplicationStatusRepository, ApplicationStatusRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();  
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
builder.Services.AddScoped<IStripeGateway, KomunalinisCentras.Backend.Gateways.StripeGateway>();


builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IPaymentGateway, PayseraGateway>();



builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();


builder.Services.AddHangfire(cfg =>
    cfg.UseStorage(new MySqlStorage(
        conn,
        new MySqlStorageOptions
        {
            PrepareSchemaIfNecessary = true      
        })));


builder.Services.AddHangfireServer(); 


Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddDbContext<KomunalinisDbContext>(opt =>
    opt.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(p => p.AddPolicy("AllowAll", policy =>
    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader())); 


builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy  = JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.DictionaryKeyPolicy   = JsonNamingPolicy.CamelCase;
    });


var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<KomunalinisDbContext>();
    db.Database.Migrate();
}

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<UserStatusMiddleware>();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


using (var scope = app.Services.CreateScope())
{
    var manager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
    manager.AddOrUpdate<ReminderJob>(
        "waste-reminder",
        job => job.RunAsync(),
        builder.Configuration["Hangfire:Cron"] ?? "0 17 * * *"); 

    manager.AddOrUpdate<InvoiceReminderJob>(
        "invoice-reminder",
        job => job.RunAsync(),
        builder.Configuration["Hangfire:InvoiceCron"] ?? "0 9 * * *"); 
} 

app.UseHangfireDashboard("/hangfire");  


app.MapControllers();

app.Run();