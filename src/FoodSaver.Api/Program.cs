using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Data;
using FoodSaver.Api.Features.Create;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=foodsaver.db");
});

var app = builder.Build();

using IServiceScope scope = app.Services.CreateAsyncScope();

AppDbContext db = scope.ServiceProvider
    .GetRequiredService<AppDbContext>();

await db.Database.EnsureCreatedAsync();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapCreateFoodEndpoint();

app.UseHttpsRedirection();

app.Run();

public partial class Program;