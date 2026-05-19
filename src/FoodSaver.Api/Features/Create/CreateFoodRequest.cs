using System.Globalization;

namespace FoodSaver.Api.Features.Create;

public sealed record CreateFoodRequest(
    string Name,
    DateOnly ExpiryDate,
    int Quantity
);