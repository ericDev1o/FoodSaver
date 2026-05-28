namespace FoodSaver.Api.Models;

public sealed class FoodItem
{
    public Guid Id { get; init; }

    public required string Name { get; init; }

    public required DateOnly ExpiryDate { get; init; }

    public required int Quantity { get; set; } = 1;
}