using Microsoft.AspNetCore.Mvc;

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

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "API is working" });
    }
}
