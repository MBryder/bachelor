using Microsoft.AspNetCore.Mvc;
using System;
using System.Runtime.InteropServices;

[Route("api/[controller]")]  // Matches `/api/rust/`
[ApiController]
public class RustController : ControllerBase
{
    [HttpGet("add")]
    public IActionResult AddNumbers([FromQuery] int a, [FromQuery] int b)
    {
        int result = RustInterop.add_numbers(a, b);
        return Ok(new { sum = result });
    }

    [HttpGet("multiply")]
    public IActionResult MultiplyNumbers([FromQuery] int a, [FromQuery] int b)
    {
        int result = RustInterop.multiply_numbers(a, b);
        return Ok(new { product = result });
    }
    

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "API is working" });
    }
    
    /*
    // **NEW API Endpoint for TSP using RustInterop**
    [HttpPost("tsp")]
    public IActionResult SolveTSP([FromBody] TSPRequest request)
    {
        if (request == null || request.Distances == null || request.N <= 0)
        {
            return BadRequest(new { error = "Invalid input" });
        }

        int n = request.N;
        int[] dist = request.Distances;

        if (dist.Length != n * n)
        {
            return BadRequest(new { error = "Invalid matrix size" });
        }

        // Allocate and pin the distance matrix
        GCHandle distHandle = GCHandle.Alloc(dist, GCHandleType.Pinned);
        IntPtr distPtr = distHandle.AddrOfPinnedObject();

        // Allocate memory for the route
        int[] route = new int[n + 1];
        GCHandle routeHandle = GCHandle.Alloc(route, GCHandleType.Pinned);
        IntPtr routePtr = routeHandle.AddrOfPinnedObject();

        // Call the Rust function
        int minCost = RustInterop.HeldKarpTSPFull(n, distPtr, routePtr);

        // Free pinned objects
        distHandle.Free();
        routeHandle.Free();

        return Ok(new
        {
            minCost = minCost,
            route = route
        });
    }
    */
}
