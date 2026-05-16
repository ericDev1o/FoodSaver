using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Data;
using FoodSaver.Api.Features.Create;
using FoodSaver.Api.Features.GetAll;
using FoodSaver.Api.Features.Consume;

const string CorsPolicy = "frontend";

WebApplicationBuilder builder = WebApplication.CreateBuilder(args) 
?? throw new NullReferenceException("Builder must'nt be null");

string[] origins = builder.Configuration
    .GetSection("Cors:Origins")
    .Get<string[]>();

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=foodsaver.db");
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

using IServiceScope scope = app.Services.CreateAsyncScope();
AppDbContext db = scope.ServiceProvider
    .GetRequiredService<AppDbContext>();
await db.Database.EnsureCreatedAsync();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(CorsPolicy);

app.MapCreateFoodEndpoint();
app.MapGetFoodsEndpoint();
app.MapConsumeFoodEndpoint();

app.UseHttpsRedirection();

app.Run();

public partial class Program;