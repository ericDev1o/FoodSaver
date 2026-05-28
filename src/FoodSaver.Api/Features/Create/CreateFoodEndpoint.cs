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
            if (string.IsNullOrWhiteSpace(request.Name))
                return Results.BadRequest("Name is required.");

            if (request.ExpiryDate < DateOnly.FromDateTime(DateTime.UtcNow))
                return Results.UnprocessableEntity(
                    "Expiry date cannot be in the past.");

            FoodItem food = new()
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                ExpiryDate = request.ExpiryDate,
                Quantity = request.Quantity
            };

            db.FoodItems.Add(food);

            await db.SaveChangesAsync(ct);

            return Results.Created($"/foods/{food.Id}", food);
        })
        .Produces<FoodItem>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status422UnprocessableEntity);

        return app;
    }
}