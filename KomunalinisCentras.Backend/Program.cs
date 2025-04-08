using KomunalinisCentras.Backend.Data;
using Microsoft.EntityFrameworkCore; 
using KomunalinisCentras.Backend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Įkeliame ConnectionString iš appsettings.json (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Registruojame DbContext (pvz., MySQL su Pomelo)
builder.Services.AddDbContext<KomunalinisDbContext>(options =>
{
    var serverVersion = new MySqlServerVersion(new Version(8, 0, 32));
    options.UseMySql(connectionString, serverVersion);
});

// 3. Įdedame kontrolerius
builder.Services.AddControllers();

// 4. Pridedame „Swashbuckle“ / „EndpointsApiExplorer“ tam, kad generuotume OpenAPI/Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
 
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
// Sukuriame programą
var app = builder.Build();

// 5. Jei Development aplinka – generuojame Swagger/OpenAPI endpointą
if (app.Environment.IsDevelopment())
{
    // Klasikinis būdas su Swashbuckle
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 6. Papildomas middleware
app.UseHttpsRedirection();

// 7. Priskiriame maršrutus (controllerius)
app.MapControllers();

// 8. Pavyzdinis minimal API endpoint'as (WeatherForecast)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();

    return forecast;
})
.WithName("GetWeatherForecast");

// 9. Paleidžiame programą
app.Run();

// Papildomas pavyzdinis „record“ modelis
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
