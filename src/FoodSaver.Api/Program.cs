using Microsoft.EntityFrameworkCore;

using Scalar.AspNetCore;

using FoodSaver.Api.Data;
using FoodSaver.Api.Features.Create;
using FoodSaver.Api.Features.GetAll;
using FoodSaver.Api.Features.Consume;

const string CorsPolicy = "frontend";

string port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

string[] origins = builder.Configuration
    .GetSection("Cors:Origins")
    .Get<string[]>()
    ?? throw new InvalidOperationException
    ("CORS origins configuration is missing.");

builder.Services.AddOpenApi();

string? connectionString = builder.Configuration.GetConnectionString("FoodSaver");
if(string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException(
        "Connection string 'FoodSaver' not found.");
builder.Services.AddDbContext<FoodDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .WithMethods(
                "GET",
                "POST",
                "PATCH"
            );
    });
});

WebApplication app = builder.Build();

app.Urls.Add($"http://0.0.0.0:{port}");

using IServiceScope scope = app.Services.CreateAsyncScope();
FoodDbContext db = scope.ServiceProvider
    .GetRequiredService<FoodDbContext>();
await db.Database.MigrateAsync();

if (builder.Configuration.GetValue<bool>("EnableDocs"))
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(CorsPolicy);

app.MapCreateFoodEndpoint();
app.MapGetFoodsEndpoint();
app.MapConsumeFoodEndpoint();

app.Run();

public partial class Program;