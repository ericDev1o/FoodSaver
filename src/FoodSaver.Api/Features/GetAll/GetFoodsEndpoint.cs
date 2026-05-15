using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Data;
using FoodSaver.Api.Models;

namespace FoodSaver.Api.Features.GetAll;

public static class GetFoodsEndpoint
{
    public static IEndpointRouteBuilder MapGetFoodsEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/foods", async (AppDbContext db, CancellationToken ct) =>
        {
            List<FoodItem> foods = await db.FoodItems
                .AsNoTracking()
                .ToListAsync(ct);

            return Results.Ok(foods);
        });

        return app;
    }
}