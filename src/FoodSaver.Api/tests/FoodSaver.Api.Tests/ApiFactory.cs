using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;

using FoodSaver.Api.Data;

namespace FoodSaver.Api.Tests;

public sealed class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly SqliteConnection _connection =
        new("DataSource=:memory:");

    public async ValueTask InitializeAsync()
    {
        await _connection.OpenAsync();

        using IServiceScope scope = Services.CreateScope();
        using FoodDbContext db = scope.ServiceProvider.GetRequiredService<FoodDbContext>();

        await db.Database.EnsureCreatedAsync();
    }

    public new async ValueTask DisposeAsync()
    {
        await _connection.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            services.AddSingleton(_connection);

            services.AddDbContext<FoodDbContext>(options =>
            {
                options.UseSqlite(_connection);
            });
        });
    }
}