using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

using FoodSaver.Api.Features.Create;

namespace FoodSaver.Api.Tests;

public sealed class CreateFoodTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Given_a_food_name_and_expiry_date_must_create_a_food_item()
    {
        // Arrange 

        CancellationToken ct = TestContext.Current.CancellationToken;

        CreateFoodRequest request = new(
            "Milk",
            new DateOnly(2026, 05, 20)
        );

        // Act

        HttpResponseMessage response =
            await _client.PostAsJsonAsync("/foods", request, ct);

        // Assert

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}