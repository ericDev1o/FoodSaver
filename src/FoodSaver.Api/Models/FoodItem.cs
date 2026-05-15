namespace FoodSaver.Api.Models;

public sealed class FoodItem
{
    public Guid Id { get; init; }

    public required string Name { get; set; }

    public required DateOnly ExpiryDate { get; set; }

    public bool IsConsumed { get; set; }
}