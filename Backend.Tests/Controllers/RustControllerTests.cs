using Xunit;
using Microsoft.AspNetCore.Mvc;
using MyBackend.Controllers;
using System;

public class RustControllerTests
{
    [Fact]
    public void SolveTSP_ValidRequest_ReturnsMinCostAndRoute()
    {
        // Arrange
        var controller = new RustController();
        var request = new RustController.TSPRequest
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
        var result = controller.SolveTSP(request) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var data = result.Value;
        var minCostProp = data?.GetType().GetProperty("minCost");
        var routeProp = data?.GetType().GetProperty("route");

        Assert.NotNull(minCostProp);
        Assert.NotNull(routeProp);

        int minCost = (int)minCostProp.GetValue(data);
        int[] route = (int[])routeProp.GetValue(data);

        Assert.True(minCost == 80);
        Assert.Equal(request.N + 1, route.Length);
        Assert.Equal(0, route[0]);
        Assert.Equal(0, route[^1]); 
    }

    [Fact]
    public void SolveTSP_InvalidRequest_ReturnsBadRequest()
    {
        // Arrange
        var controller = new RustController();
        var badRequest = new RustController.TSPRequest { N = 0, Distances = null };

        // Act
        var result = controller.SolveTSP(badRequest);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }
    
}
