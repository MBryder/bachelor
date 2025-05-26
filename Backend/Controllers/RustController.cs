
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

    [HttpPost("tsp")]
    public IActionResult SolveTSP([FromBody] TSPRequest request)
    {
        if (request == null || request.Distances == null || request.N <= 0)
        {
            return BadRequest(new { error = "Invalid input" });
        }

        int n = request.N;

        // Convert double[] to int[] (rounding)
        int[] dist = request.Distances
        .Select(x => (int)Math.Round((double)x, MidpointRounding.AwayFromZero))
        .ToArray();

        if (dist.Length != n * n)
        {
            return BadRequest(new { error = "Invalid matrix size" });
        }

        GCHandle distHandle = GCHandle.Alloc(dist, GCHandleType.Pinned);
        IntPtr distPtr = distHandle.AddrOfPinnedObject();

        int[] route = new int[n + 1];
        GCHandle routeHandle = GCHandle.Alloc(route, GCHandleType.Pinned);
        IntPtr routePtr = routeHandle.AddrOfPinnedObject();

        int minCost = RustInterop.HeldKarpTSPFull(n, distPtr, routePtr);

        distHandle.Free();
        routeHandle.Free();

        return Ok(new
        {
            minCost = minCost,
            route = route
        });
    }

    public class TSPRequest
    {
        public int N { get; set; }
        public double[] Distances { get; set; }
    }
}
