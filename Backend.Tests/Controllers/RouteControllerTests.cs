using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using MyBackend.Controllers;
using MyBackend.Data;
using MyBackend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class RouteControllerTests
{
    private static MyDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new MyDbContext(options);
    }

    [Fact]
    public async Task GetSharedRouteById_ShouldReturnRoute_IfExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var shared = new SharedRoute
        {
            Id = "abc123",
            CustomName = "Shared",
            DateOfCreation = DateTime.UtcNow,
            Waypoints = new List<string> { "A", "B" },
            TransportationMode = "walk"
        };
        db.SharedRoutes.Add(shared);
        await db.SaveChangesAsync();
        var controller = new RouteController(db);

        // Act
        var result = await controller.GetSharedRouteById("abc123");

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(shared, ok.Value);
    }

    [Fact]
    public async Task GetSharedRouteById_ShouldReturnNotFound_IfMissing()
    {
        // Arrange
        var controller = new RouteController(CreateInMemoryDbContext());

        // Act
        var result = await controller.GetSharedRouteById("missing");

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task SharePublicRoute_ShouldAddRouteAndReturnId()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var controller = new RouteController(db);
        var dto = new SharedRouteDto
        {
            CustomName = "Shared Test",
            Waypoints = new List<string> { "X", "Y" },
            TransportationMode = "bike"
        };

        // Act
        var result = await controller.SharePublicRoute(dto);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var routeId = ok.Value?.GetType().GetProperty("routeId")?.GetValue(ok.Value)?.ToString();
        Assert.False(string.IsNullOrEmpty(routeId));
        Assert.Single(db.SharedRoutes);
    }
}