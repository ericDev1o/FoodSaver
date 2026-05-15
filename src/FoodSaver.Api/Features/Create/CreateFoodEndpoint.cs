using FoodSaver.Api.Data;
using FoodSaver.Api.Models;

namespace FoodSaver.Api.Features.Create;

public static class CreateFoodEndpoint
{
    public static IEndpointRouteBuilder MapCreateFoodEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost("/foods", static async (
            CreateFoodRequest request,
            AppDbContext db) =>
        {
            FoodItem food = new()
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                ExpiryDate = request.ExpiryDate,
                IsConsumed = false
            };

            db.FoodItems.Add(food);

            await db.SaveChangesAsync();

            return Results.Created($"/foods/{food.Id}", food);
        });

        return app;
    }
}