using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using MyBackend.Helpers;
using MyBackend.Models;
using Xunit;
using FluentAssertions;

namespace MyBackend.Tests.Helpers
{
    public class JwtHelperTests
    {
        private IConfiguration GetFakeConfig()
        {
            var inMemorySettings = new Dictionary<string, string> {
                { "Jwt:Key", "SuperSecretTestKey1234567890123456" },
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" },
                { "Jwt:ExpiresInMinutes", "60" }
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();
        }

        [Fact]
        public void GenerateToken_ValidUser_ReturnsValidJwt()
        {
            // Arrange
            var user = new User { Id = 1, Username = "TestUser" };
            var config = GetFakeConfig();

            // Act
            var tokenString = JwtHelper.GenerateToken(user, config);

            // Assert
            tokenString.Should().NotBeNullOrEmpty("token should be generated");

            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(tokenString);

            token.Claims.Should().Contain(c => c.Type == ClaimTypes.Name && c.Value == "TestUser");
            token.Claims.Should().Contain(c => c.Type == ClaimTypes.NameIdentifier && c.Value == "1");

            token.Issuer.Should().Be("TestIssuer");
            token.Audiences.Should().Contain("TestAudience");
            token.ValidTo.Should().BeAfter(DateTime.UtcNow);
        }

        [Fact]
        public void GenerateToken_MissingConfigKey_ThrowsException()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string?> {
                // Missing "Jwt:Key"
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" },
                { "Jwt:ExpiresInMinutes", "60" }
            };

            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var user = new User { Id = 1, Username = "TestUser" };

            // Act
            Action act = () => JwtHelper.GenerateToken(user, config);

            // Assert
            act.Should().Throw<ArgumentNullException>()
            .WithMessage("*Parameter 's'*");
        }
    }
}
