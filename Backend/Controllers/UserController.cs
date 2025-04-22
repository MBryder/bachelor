using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBackend.Data;
using MyBackend.Models;
using MyBackend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace MyBackend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _config;

        public UserController(MyDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // GET /user
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // POST /user/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            var existing = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == newUser.Username);

            if (existing != null)
                return BadRequest("Username already exists.");

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered!" });
        }

        // POST /user/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == loginRequest.Username &&
                u.Password == loginRequest.Password);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            // Generate the JWT using JwtHelper
            var token = JwtHelper.GenerateToken(user, _config);
            return Ok(new { token });
        }

        // GET /user/test-places
        [HttpGet("test-places")]
        [Authorize] // Require valid JWT token to access this endpoint
        public async Task<IActionResult> TestPlacesQuery()
        {
            var places = await _context.Places
                .OrderByDescending(p => p.Rating)
                .Take(5)
                .ToListAsync();

            foreach (var place in places)
            {
                Console.WriteLine($"Place: {place.Name}, Rating: {place.Rating}");
            }

            return Ok(new { message = "Check console for results", count = places.Count });
        }

        // GET /user/test-place-images
        [HttpGet("test-place-images")]
        [Authorize] // Example of protecting endpoints with JWT
        public async Task<IActionResult> TestPlaceImagesQuery()
        {
            var places = await _context.Places
                .Include(p => p.Images)
                .Take(3)
                .ToListAsync();

            foreach (var place in places)
            {
                Console.WriteLine($"Place: {place.Name}");

                if (place.Images != null && place.Images.Any())
                {
                    foreach (var image in place.Images)
                    {
                        Console.WriteLine($"  → Image URL: {image.ImageUrl}");
                    }
                }
                else
                {
                    Console.WriteLine("  → No images");
                }
            }

            var result = places.Select(p => new
            {
                placeName = p.Name,
                imageUrls = p.Images.Select(i => i.ImageUrl).ToList()
            });

            return Ok(new
            {
                message = "Fetched places with their image URLs",
                count = places.Count,
                places = result
            });
        }
    }
}
