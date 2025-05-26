using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using MyBackend;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;


namespace Backend.Tests.Integration
{
    public class RustIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public RustIntegrationTests(CustomWebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task TspEndpoint_ShouldReturnMinCostAndRoute()
        {
            // Arrange
            var request = new
            {
                N = 4,
                Distances = new double[]
                {
                    0, 10, 15, 20,
                    10, 0, 35, 25,
                    15, 35, 0, 30,
                    20, 25, 30, 0
                }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/rust/tsp", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadFromJsonAsync<TspResponse>();

            json.Should().NotBeNull();
            json.MinCost.Should().Be(80);
            json.Route.Should().NotBeNull();
            json.Route.Length.Should().Be(request.N + 1);
        }

        private class TspResponse
        {
            public int MinCost { get; set; }
            public int[] Route { get; set; }
        }
    }
}
