using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Backend.Tests.Integration
{
    public class IntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public IntegrationTests(CustomWebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        // Auth Flow
        [Fact]
        public async Task Register_ShouldSucceed_WhenValid()
        {
            // Arrange
            var newUser = new
            {
                Username = "testuser",
                Email = "test@example.com",
                Password = "Password123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/user/register", newUser);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task Login_ShouldReturnToken_WhenCredentialsAreValid()
        {
            // Arrange
            await _client.PostAsJsonAsync("/user/register", new
            {
                Username = "loginuser",
                Email = "login@example.com",
                Password = "Password123"
            });

            var loginRequest = new
            {
                Username = "loginuser",
                Password = "Password123"
            };

            // Act
            var login = await _client.PostAsJsonAsync("/user/login", loginRequest);

            // Assert
            login.EnsureSuccessStatusCode();
            var json = await login.Content.ReadFromJsonAsync<JsonElement>();
            json.TryGetProperty("token", out _).Should().BeTrue();
        }

        [Fact]
        public async Task Login_ShouldFail_WhenCredentialsAreInvalid()
        {
            // Arrange
            var invalidLogin = new
            {
                Username = "wrong",
                Password = "wrong"
            };

            // Act
            var login = await _client.PostAsJsonAsync("/user/login", invalidLogin);

            // Assert
            login.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }

        // Routes
        [Fact]
        public async Task AddRoute_ShouldSucceed_WhenUserIsAuthorized()
        {
            // Arrange
            var token = await GetAuthToken("routeuser", "route@example.com");

            var request = new HttpRequestMessage(HttpMethod.Post, "/user/routeuser/routes");
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Content = JsonContent.Create(new
            {
                CustomName = "Test Route",
                Waypoints = new[] { "A", "B" },
                TransportationMode = "WALKING"
            });

            // Act
            var response = await _client.SendAsync(request);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task GetRoutes_ShouldReturnUserRoutes_WhenUserIsAuthorized()
        {
            // Arrange
            var token = await GetAuthToken("viewroute", "view@example.com");

            var request = new HttpRequestMessage(HttpMethod.Get, "/user/viewroute/routes");
            request.Headers.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.SendAsync(request);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        // Shared Route
        [Fact]
        public async Task SharePublicRoute_ShouldSucceed_WithValidData()
        {
            // Arrange
            var token = await GetAuthToken("sharer", "sharer@example.com");

            var request = new HttpRequestMessage(HttpMethod.Post, "/routes/share");
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Content = JsonContent.Create(new
            {
                CustomName = "Shared Route",
                Waypoints = new[] { "X", "Y" },
                TransportationMode = "BIKE"
            });

            // Act
            var response = await _client.SendAsync(request);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task GetSharedRoute_ShouldReturnSharedRoute_IfExists()
        {
            // Arrange
            var token = await GetAuthToken("sharedtest", "sharedtest@example.com");

            var create = new HttpRequestMessage(HttpMethod.Post, "/routes/share");
            create.Headers.Add("Authorization", $"Bearer {token}");
            create.Content = JsonContent.Create(new
            {
                CustomName = "Public Route",
                Waypoints = new[] { "W1", "W2" },
                TransportationMode = "CAR"
            });

            // Act
            var created = await _client.SendAsync(create);
            created.EnsureSuccessStatusCode();
            var result = await created.Content.ReadFromJsonAsync<JsonElement>();
            var routeId = result.GetProperty("routeId").GetString();

            var response = await _client.GetAsync($"/routes/{routeId}");

            // Assert
            response.EnsureSuccessStatusCode();
        }

        // Places
        [Fact]
        public async Task SearchPlacesByName_ShouldReturnMatches()
        {
            // Arrange
            var token = await GetAuthToken("searcher", "search@example.com");

            var request = new HttpRequestMessage(HttpMethod.Get, "/places/name?Name=cafe");
            request.Headers.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.SendAsync(request);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        // Helper for JWT
        private async Task<string> GetAuthToken(string username, string email)
        {
            // Arrange
            await _client.PostAsJsonAsync("/user/register", new
            {
                Username = username,
                Email = email,
                Password = "Password123"
            });

            var login = await _client.PostAsJsonAsync("/user/login", new
            {
                Username = username,
                Password = "Password123"
            });

            // Act
            var json = await login.Content.ReadFromJsonAsync<JsonElement>();

            // Assert
            return json.GetProperty("token").GetString();
        }
    }
}
