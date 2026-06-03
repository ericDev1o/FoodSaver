using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

using FoodSaver.Api.Data;

namespace FoodSaver.Api.Tests;

public sealed class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private SqliteConnection _connection = default!;

    public async ValueTask InitializeAsync()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        await _connection.OpenAsync();

        using IServiceScope scope = Services.CreateScope();
        using FoodDbContext db = scope.ServiceProvider.GetRequiredService<FoodDbContext>();

        await db.Database.EnsureCreatedAsync();
    }

    public new ValueTask DisposeAsync()
    {
        _connection.Dispose();
        return ValueTask.CompletedTask;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<FoodDbContext>>();

            services.AddDbContext<FoodDbContext>(options =>
            {
                options.UseSqlite(_connection);
            });
        });
    }
}