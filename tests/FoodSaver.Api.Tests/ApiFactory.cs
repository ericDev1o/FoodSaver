using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;

using FoodSaver.Api.Data;

namespace FoodSaver.Api.Tests;

public sealed class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private SqliteConnection _connection = default!;

    public ValueTask InitializeAsync()
    {
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();

        using IServiceScope scope = Services.CreateScope();
        using AppDbContext db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        db.Database.EnsureCreated();

        return ValueTask.CompletedTask;
    }

    public new ValueTask DisposeAsync()
    {
        _connection.Dispose();
        return ValueTask.CompletedTask;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices((IServiceCollection services) =>
        { 
            services.AddDbContext<AppDbContext>( DbContextOptions =>
            {
                DbContextOptions.UseSqlite(_connection);
            });
        });
    }
}