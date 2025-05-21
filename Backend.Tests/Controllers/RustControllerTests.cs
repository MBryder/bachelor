using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System;
using MyBackend.Controllers;
using System.Runtime.InteropServices;

public class RustControllerTests
{
[Fact]
public void SolveTSP_ValidRequest_ReturnsMinCostAndRoute()
{
    // Arrange
    int n = 3;
    double[] distances = new double[]
    {
        0, 10, 15,
        10, 0, 20,
        15, 20, 0
    };

    var mockSolver = new Mock<ITspSolver>();

    mockSolver.Setup(m => m.Solve(It.IsAny<int>(), It.IsAny<IntPtr>(), It.IsAny<IntPtr>()))
        .Callback<int, IntPtr, IntPtr>((size, distPtr, routePtr) =>
        {
            int[] fakeRoute = { 0, 1, 2, 0 };
            Marshal.Copy(fakeRoute, 0, routePtr, fakeRoute.Length);
        })
        .Returns(42);

    var controller = new RustController(mockSolver.Object);

    var request = new RustController.TSPRequest
    {
        N = n,
        Distances = distances
    };

    // Act
    var result = controller.SolveTSP(request) as OkObjectResult;

    // Assert
    Assert.NotNull(result);

    var json = System.Text.Json.JsonSerializer.Serialize(result.Value);
    var body = System.Text.Json.JsonSerializer.Deserialize<TspResponse>(json);

    Assert.NotNull(body);
    Assert.Equal(42, body.MinCost);
    Assert.Equal(new[] { 0, 1, 2, 0 }, body.Route);
}


public class TspResponse
{
    public int MinCost { get; set; }
    public int[] Route { get; set; } = Array.Empty<int>();
}

}
