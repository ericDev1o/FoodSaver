using Microsoft.EntityFrameworkCore;

using FoodSaver.Api.Data;
using FoodSaver.Api.Models;

namespace FoodSaver.Api.Features.Consume;

public static class ConsumeFoodEndpoint
{
    public static IEndpointRouteBuilder MapConsumeFoodEndpoint(
        this IEndpointRouteBuilder app)
    {
        app.MapPatch("/foods/{id:guid}/consume", static async (
            Guid id,
            AppDbContext db,
            CancellationToken ct) =>
        {
            FoodItem? food = await db.FoodItems
                .FirstOrDefaultAsync(food => food.Id == id, ct);

            if (food is null)
            {
                return Results.NotFound();
            }

            food.IsConsumed = true;

            await db.SaveChangesAsync(ct);

            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);

        return app;
    }
}