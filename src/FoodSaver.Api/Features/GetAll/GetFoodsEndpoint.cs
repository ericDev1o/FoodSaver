using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Data;
using FoodSaver.Api.Models;

namespace FoodSaver.Api.Features.GetAll;

public static class GetFoodsEndpoint
{
    public static IEndpointRouteBuilder MapGetFoodsEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/foods", async (
            FoodDbContext db, 
            CancellationToken ct) =>
        {
            List<FoodItem> foods = await db.FoodItems
                .AsNoTracking()
                .Where(f => f.Quantity > 0)
                .ToListAsync(ct);

            return Results.Ok(foods);
        })
        .Produces<List<FoodItem>>(StatusCodes.Status200OK);

        return app;
    }
}