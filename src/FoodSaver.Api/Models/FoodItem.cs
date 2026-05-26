namespace FoodSaver.Api.Models;

public sealed class FoodItem
{
    public Guid Id { get; init; }

    public required string Name { get; init; }

    public required DateOnly ExpiryDate { get; init; }

    public bool IsConsumed { get; set; }

    public required int Quantity { get; init; } = 1;
}