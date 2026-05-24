using System.Net;
using System.Net.Http.Json;

using FluentAssertions;

using FoodSaver.Api.Features.Create;
using FoodSaver.Api.Models;

namespace FoodSaver.Api.Tests;

public sealed class ConsumeFoodTests(ApiFactory factory)
    : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Given_an_existing_food_when_consumed_it_must_be_marked_as_consumed()
    {
        // Arrange

        CancellationToken ct = TestContext.Current.CancellationToken;

        CreateFoodRequest request = new(
            "Milk",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
            1
        );

        HttpResponseMessage createResponse =
            await _client.PostAsJsonAsync("/foods", request, ct);

        Uri? location = createResponse.Headers.Location;

        // Act

        HttpResponseMessage consumeResponse =
            await _client.PatchAsync(location + "/consume", null, ct);

        HttpResponseMessage getResponse =
            await _client.GetAsync("/foods", ct);

        List<FoodItem>? foods =
            await getResponse.Content
                .ReadFromJsonAsync<List<FoodItem>>(cancellationToken: ct);

        // Assert

        consumeResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        foods.Should().ContainSingle(food =>
            food.Name == "Milk"
            && food.IsConsumed);
    }

    [Fact]
    public async Task Given_a_missing_food_must_return_not_found()
    {
        // Arrange

        CancellationToken ct = TestContext.Current.CancellationToken;

        Guid missingId = Guid.NewGuid();

        // Act

        HttpResponseMessage response =
            await _client.PatchAsync(
                $"/foods/{missingId}/consume",
                null,
                ct);

        // Assert

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}