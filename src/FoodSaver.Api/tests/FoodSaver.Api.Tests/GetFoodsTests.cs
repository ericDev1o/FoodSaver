using System.Net;
using FluentAssertions;
using System.Net.Http.Json;

using FoodSaver.Api.Features.Create;
using FoodSaver.Api.Features.GetAll;
using FoodSaver.Api.Models;

namespace FoodSaver.Api.Tests.Foods;

public sealed class GetFoodsTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Given_created_food_it_must_appear_in_get_all()
    {
        CancellationToken ct = TestContext.Current.CancellationToken;

        CreateFoodRequest create = new(
            "Milk", 
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
            1
        );

        await _client.PostAsJsonAsync("/foods", create, ct);

        HttpResponseMessage response = await _client.GetAsync("/foods", ct);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        List<FoodItem>? foods =
            await response.Content.ReadFromJsonAsync<List<FoodItem>>(cancellationToken: ct);

        foods.Should().NotBeNull();
        foods!.Should().ContainSingle(f => f.Name == "Milk");
    }
}