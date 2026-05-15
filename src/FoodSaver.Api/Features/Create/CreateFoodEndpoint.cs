using FoodSaver.Api.Data;
using FoodSaver.Api.Models;

namespace FoodSaver.Api.Features.Create;

public static class CreateFoodEndpoint
{
    public static IEndpointRouteBuilder MapCreateFoodEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost("/foods", static async (
            CreateFoodRequest request,
            AppDbContext db,
            CancellationToken ct) =>
        {
            FoodItem food = new()
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                ExpiryDate = request.ExpiryDate,
                IsConsumed = false
            };

            db.FoodItems.Add(food);

            await db.SaveChangesAsync(ct);

            return Results.Created($"/foods/{food.Id}", food);
        })
        .Produces<FoodItem>(StatusCodes.Status201Created);

        return app;
    }
}