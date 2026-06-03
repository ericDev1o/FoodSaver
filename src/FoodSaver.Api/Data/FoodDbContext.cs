using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Models;

namespace FoodSaver.Api.Data;

public sealed class FoodDbContext(DbContextOptions<FoodDbContext> options)
    : DbContext(options)
{
    public DbSet<FoodItem> FoodItems => Set<FoodItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FoodItem>()
            .HasIndex(x => x.ExpiryDate);
    }
}