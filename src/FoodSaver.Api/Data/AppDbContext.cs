using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Models;


namespace FoodSaver.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<FoodItem> FoodItems => Set<FoodItem>();
}