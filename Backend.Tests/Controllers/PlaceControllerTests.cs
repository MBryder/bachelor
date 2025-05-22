using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBackend.Controllers;
using MyBackend.Data;
using MyBackend.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class PlaceControllerTests
{
    private static MyDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new MyDbContext(options);
    }

    private static ILogger<PlaceController> CreateFakeLogger()
    {
        return new LoggerFactory().CreateLogger<PlaceController>();
    }

    [Fact]
    public async Task GetPlaceById_ShouldReturnPlace_IfExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var place = new Place { PlaceId = "p1", Name = "Park", Latitude = 1.1, Longitude = 2.2, Icon = "https://icon.com/p1.png" };
        db.Places.Add(place);
        await db.SaveChangesAsync();
        var controller = new PlaceController(db, CreateFakeLogger());

        // Act
        var result = await controller.GetPlaceById("p1");

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Single((List<Place>)ok.Value);
    }

    [Fact]
public async Task GetPlacesWithName_ShouldReturnMatchingPlaces()
{
    // Arrange
    var db = CreateInMemoryDbContext();
    db.Places.Add(new Place { PlaceId = "1", Name = "TestPlace", Icon = "https://icon.com/1.png" });
    db.Places.Add(new Place { PlaceId = "2", Name = "Another", Icon = "https://icon.com/2.png" });
    await db.SaveChangesAsync();
    var controller = new PlaceController(db, CreateFakeLogger());

    // Act
    var result = await controller.GetPlacesWithName("Test");

    // Assert
    var ok = Assert.IsType<OkObjectResult>(result);
    var list = Assert.IsAssignableFrom<IEnumerable<object>>(ok.Value);
    Assert.Single(list);
}

    [Fact]
    public async Task CreatePlace_ShouldAddNewPlace_IfNotExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        var controller = new PlaceController(db, CreateFakeLogger());
        var dto = new PlaceCreateDto { PlaceId = "new1", Latitude = 1.0, Longitude = 2.0 };

        // Act
        var result = await controller.CreatePlace(dto);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
        Assert.Equal("new1", ((Place)ok.Value).PlaceId);
    }

    [Fact]
    public async Task CreatePlace_ShouldReturnConflict_IfPlaceExists()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Places.Add(new Place { PlaceId = "dup", Name = "Old", Icon = "https://icon.com/dup.png" });
        await db.SaveChangesAsync();
        var controller = new PlaceController(db, CreateFakeLogger());
        var dto = new PlaceCreateDto { PlaceId = "dup", Latitude = 0.0, Longitude = 0.0 };

        // Act
        var result = await controller.CreatePlace(dto);

        // Assert
        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task GetPlacesInBounds_ShouldReturnOnlyWithinBounds()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Places.Add(new Place { PlaceId = "1", Name = "A", Latitude = 10, Longitude = 10, Icon = "https://icon.com/a.png" });
        db.Places.Add(new Place { PlaceId = "2", Name = "B", Latitude = 20, Longitude = 20, Icon = "https://icon.com/b.png" });
        await db.SaveChangesAsync();
        var controller = new PlaceController(db, CreateFakeLogger());

        // Act
        var result = await controller.GetPlacesInBounds(5, 5, 15, 15);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsType<List<Place>>(ok.Value);
        Assert.Single(list);
    }

    [Fact]
    public async Task GetTestPlacesWithDetails_ShouldReturnFormattedResults()
    {
        // Arrange
        var db = CreateInMemoryDbContext();
        db.Places.Add(new Place
        {
            PlaceId = "test1",
            Name = "Test",
            Rating = 4.5,
            Latitude = 1.1,
            Longitude = 2.2,
            Icon = "https://icon.com/test.png",
            Images = new List<Image> { new Image { ImageUrl = "http://example.com/img.jpg" } },
            Details = new Details { PlaceId = "test1", FormattedAddress = "Test St", WeekdayText = new List<string>(), Types = new List<string>() }
        });
        await db.SaveChangesAsync();
        var controller = new PlaceController(db, CreateFakeLogger());

        // Act
        var result = await controller.GetTestPlacesWithDetails();

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("places", ok.Value?.ToString());
    }
}
