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
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
            1
        );

        // Act

        HttpResponseMessage response =
            await _client.PostAsJsonAsync("/foods", request, ct);

        // Assert

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Given_an_empty_food_name_must_return_bad_request()
    {
        // Arrange

        CancellationToken ct = TestContext.Current.CancellationToken;

        CreateFoodRequest request = new(
            "",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
            1
        );

        // Act

        HttpResponseMessage response =
            await _client.PostAsJsonAsync("/foods", request, ct);

        // Assert

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Given_a_past_expiry_date_must_return_unprocessable_entity()
    {
        // Arrange

        CancellationToken ct = TestContext.Current.CancellationToken;

        CreateFoodRequest request = new(
            "Milk",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)),
            1
        );

        // Act

        HttpResponseMessage response =
            await _client.PostAsJsonAsync("/foods", request, ct);

        // Assert

        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }
}