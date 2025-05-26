using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using MyBackend.Controllers;
using MyBackend.Data;
using MyBackend.Models;
using MyBackend.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

public class UserControllerTests
{
    private static MyDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new MyDbContext(options);
    }

    private static IConfiguration CreateFakeConfig()
    {
        var dict = new Dictionary<string, string?>
        {
            { "Jwt:Key", "TestKeyThatIsLongEnoughToBeSecure123456" },
            { "Jwt:Issuer", "test" },
            { "Jwt:Audience", "test" },
            { "Jwt:ExpiresInMinutes", "60" }
        };

        return new ConfigurationBuilder().AddInMemoryCollection(dict).Build();
    }

    private static ControllerContext CreateFakeControllerContext(string username)
    {
        var claims = new List<Claim> { new Claim(ClaimTypes.Name, username) };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var principal = new ClaimsPrincipal(identity);

        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
    }

    [Fact]
    public async Task Register_ShouldReturnConflict_IfUserExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var config = CreateFakeConfig();
        db.Users.Add(new User { Username = "existing", Email = "existing@test.com", Password = "123" });
        await db.SaveChangesAsync();
        var controller = new UserController(db, config);
        var input = new SignupRequest { Username = "existing", Email = "new@test.com", Password = "abc" };

        // Act
        var result = await controller.Register(input);

        // Assert
        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task Register_ShouldCreateUser_IfNew()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var config = CreateFakeConfig();
        var controller = new UserController(db, config);
        var input = new SignupRequest { Username = "newuser", Email = "test@test.com", Password = "abc" };

        // Act
        var result = await controller.Register(input);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(await db.Users.FirstOrDefaultAsync(u => u.Username == "newuser"));
    }

    [Fact]
    public async Task Login_ShouldReturnToken_IfCredentialsAreValid()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var config = CreateFakeConfig();
        var password = "securepass";
        var user = new User { Username = "valid", Password = BCrypt.Net.BCrypt.HashPassword(password), Email = "v@test.com" };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        var controller = new UserController(db, config);

        // Act
        var result = await controller.Login(new LoginRequest { Username = "valid", Password = password });

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var tokenProp = okResult.Value?.GetType().GetProperty("token");
        var token = tokenProp?.GetValue(okResult.Value)?.ToString();
        Assert.False(string.IsNullOrEmpty(token));
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_IfInvalidPassword()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var config = CreateFakeConfig();
        db.Users.Add(new User { Username = "bob", Password = BCrypt.Net.BCrypt.HashPassword("correct"), Email = "bob@example.com" });
        await db.SaveChangesAsync();
        var controller = new UserController(db, config);

        // Act
        var result = await controller.Login(new LoginRequest { Username = "bob", Password = "wrong" });

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task AddRouteForUser_ShouldReturnOk_IfUserExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var config = CreateFakeConfig();
        db.Users.Add(new User { Username = "kasper", Email = "k@test.com", Password = "xxx" });
        await db.SaveChangesAsync();
        var controller = new UserController(db, config);
        var dto = new RouteDto { CustomName = "TestRoute", Waypoints = new List<string> { "A", "B" }, TransportationMode = "bike" };

        // Act
        var result = await controller.AddRouteForUser("kasper", dto);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("routeId", ok.Value?.ToString());
    }

    [Fact]
    public async Task AddRouteForUser_ShouldReturnNotFound_IfUserMissing()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var config = CreateFakeConfig();
        var controller = new UserController(db, config);
        var dto = new RouteDto { CustomName = "Test", Waypoints = new List<string> { "A", "B" }, TransportationMode = "walk" };

        // Act
        var result = await controller.AddRouteForUser("ghost", dto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task ValidateToken_ShouldReturnOk_IfAuthorized()
    {
        // Arrange
        var controller = new UserController(null!, CreateFakeConfig())
        {
            ControllerContext = CreateFakeControllerContext("testuser")
        };

        // Act
        var result = controller.ValidateToken();

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("Token is valid", ok.Value?.ToString());
    }

    [Fact]
    public async Task ChangePassword_ShouldReturnBadRequest_IfMissingFields()
    {
        // Arrange
        var controller = new UserController(CreateInMemoryDbContext(), CreateFakeConfig());

        // Act
        var result = await controller.ChangePassword(new ChangePasswordDto());

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task ChangePassword_ShouldReturnUnauthorized_IfWrongPassword()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Users.Add(new User { Username = "test", Password = "wrong", Email = "e@test.com" });
        await db.SaveChangesAsync();
        var controller = new UserController(db, CreateFakeConfig());
        var dto = new ChangePasswordDto { Username = "test", CurrentPassword = "right", NewPassword = "newpass" };

        // Act
        var result = await controller.ChangePassword(dto);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task GetRoutesForUser_ShouldReturnRoutes_IfUserExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Users.Add(new User
        {
            Username = "user1",
            Email = "u@test.com",
            Password = "pass",
            Routes = new List<Route>
            {
                new Route { CustomName = "R1", DateOfCreation = DateTime.UtcNow, Waypoints = new List<string>{"A"}, TransportationMode = "bike" }
            }
        });
        await db.SaveChangesAsync();
        var controller = new UserController(db, CreateFakeConfig());

        // Act
        var result = await controller.GetRoutesForUser("user1");

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotEmpty(ok.Value?.ToString());
    }

    [Fact]
    public async Task GetRoutesForUser_ShouldReturnNotFound_IfUserMissing()
    {
        // Arrange
        var controller = new UserController(CreateInMemoryDbContext(), CreateFakeConfig());

        // Act
        var result = await controller.GetRoutesForUser("nouser");

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteRoute_ShouldReturnOk_IfRouteExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Users.Add(new User { Username = "u1", Email = "e@test.com", Password = "x" });
        db.Routes.Add(new Route { Username = "u1", CustomName = "R", Waypoints = new List<string>(), TransportationMode = "walk" });
        await db.SaveChangesAsync();
        var controller = new UserController(db, CreateFakeConfig());
        var route = db.Routes.First();

        // Act
        var result = await controller.DeleteRoute("u1", route.Id);

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task DeleteRoute_ShouldReturnNotFound_IfRouteMissing()
    {
        // Arrange
        var controller = new UserController(CreateInMemoryDbContext(), CreateFakeConfig());

        // Act
        var result = await controller.DeleteRoute("user", 99);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteUser_ShouldRemoveUserAndRoutes()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Users.Add(new User
        {
            Username = "delme",
            Email = "d@x.com",
            Password = "123",
            Routes = new List<Route> { new Route { CustomName = "X", Waypoints = new List<string>(), TransportationMode = "walk" } }
        });
        await db.SaveChangesAsync();
        var controller = new UserController(db, CreateFakeConfig());

        // Act
        var result = await controller.DeleteUser("delme");

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Empty(db.Users.ToList());
        Assert.Empty(db.Routes.ToList());
    }

    [Fact]
    public async Task DeleteUser_ShouldReturnNotFound_IfUserMissing()
    {
        // Arrange
        var controller = new UserController(CreateInMemoryDbContext(), CreateFakeConfig());

        // Act
        var result = await controller.DeleteUser("ghost");

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task CheckUsername_ShouldReturnAvailable_IfFree()
    {
        // Arrange
        var controller = new UserController(CreateInMemoryDbContext(), CreateFakeConfig());

        // Act
        var result = await controller.CheckUsername("newname") as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var available = (bool)result.Value?.GetType().GetProperty("available")?.GetValue(result.Value);
        Assert.True(available);
    }

    [Fact]
    public async Task CheckUsername_ShouldReturnUnavailable_IfTaken()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Users.Add(new User { Username = "taken", Email = "t@x.com", Password = "123" });
        await db.SaveChangesAsync();
        var controller = new UserController(db, CreateFakeConfig());

        // Act
        var result = await controller.CheckUsername("taken") as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var available = (bool)result.Value?.GetType().GetProperty("available")?.GetValue(result.Value);
        Assert.False(available);
    }

    [Fact]
    public async Task CheckUsername_ShouldReturnBadRequest_IfInvalid()
    {
        // Arrange
        var controller = new UserController(CreateInMemoryDbContext(), CreateFakeConfig());

        // Act
        var result = await controller.CheckUsername("") as BadRequestObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Contains("Invalid username", result.Value?.ToString());
    }
}
