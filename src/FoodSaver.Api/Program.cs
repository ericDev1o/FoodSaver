using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Data;
using FoodSaver.Api.Features.Create;
using FoodSaver.Api.Features.GetAll;
using FoodSaver.Api.Features.Consume;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=foodsaver.db");
});
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:4173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });
}

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

if (app.Environment.IsDevelopment())
{
    app.UseCors();
}

app.MapCreateFoodEndpoint();
app.MapGetFoodsEndpoint();
app.MapConsumeFoodEndpoint();

app.UseHttpsRedirection();

app.Run();

public partial class Program;