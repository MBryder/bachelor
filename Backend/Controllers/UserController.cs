using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBackend.Data;
using MyBackend.Models;
using MyBackend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using BCrypt.Net;

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
        public async Task<IActionResult> Register([FromBody] SignupRequest newUser)
        {
            var existing = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == newUser.Username);

            if (existing != null)
            {
                return Conflict(new { message = "Username already taken" });
            }

            // Map SignupRequest to User
            var user = new User
            {
                Username = newUser.Username,
                Email = newUser.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password),
                DateOfCreation = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered!" });
        }


        // POST /user/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

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

        // POST /user/{username}/routes
        [HttpPost("{username}/routes")]
        [Authorize]
        public async Task<IActionResult> AddRouteForUser(string username, [FromBody] RouteDto routeDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return NotFound("User not found.");

            var route = new MyBackend.Models.Route
            {
                Username = username,
                CustomName = routeDto.CustomName,
                DateOfCreation = DateTime.UtcNow,
                Waypoints = routeDto.Waypoints,
                TransportationMode = routeDto.TransportationMode
            };

            _context.Routes.Add(route);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Route added successfully", routeId = route.Id });
        }

        [HttpGet("{username}/routes")]
        [Authorize]
        public async Task<IActionResult> GetRoutesForUser(string username)
        {
            var user = await _context.Users
                .Include(u => u.Routes)
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound("User not found.");

            var routes = user.Routes?
                .OrderByDescending(r => r.DateOfCreation)
                .Select(r => new
                {
                    r.Id,
                    r.CustomName,
                    r.DateOfCreation,
                    r.Waypoints,
                    r.TransportationMode
                })
                .ToList();

            return Ok(routes);
        }

        [HttpGet("check-username")]
        public async Task<IActionResult> CheckUsername([FromQuery] string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest(new { available = false, message = "Invalid username" });

            var exists = await _context.Users.AnyAsync(u => u.Username == username);
            return Ok(new { available = !exists });
        }

        // DELETE /user/{username}/routes/{routeId}
        [HttpDelete("{username}/routes/{routeId}")]
        [Authorize]
        public async Task<IActionResult> DeleteRoute(string username, int routeId)
        {
            var route = await _context.Routes.FirstOrDefaultAsync(r => r.Id == routeId && r.Username == username);

            if (route == null)
                return NotFound(new { message = "Route not found." });

            _context.Routes.Remove(route);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Route deleted successfully." });
        }

        // PUT /user/change-password
        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) ||
                string.IsNullOrWhiteSpace(dto.CurrentPassword) ||
                string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest("All fields are required.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == dto.Username && u.Password == dto.CurrentPassword);

            if (user == null)
            {
                return Unauthorized("Current password is incorrect.");
            }

            user.Password = dto.NewPassword;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully." });
        }

        [HttpDelete("{username}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var user = await _context.Users
                .Include(u => u.Routes) // load related routes
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound("User not found.");

            // Delete related routes (if not handled by cascade delete)
            if (user.Routes != null && user.Routes.Count > 0)
            {
                _context.Routes.RemoveRange(user.Routes);
            }

            // Delete the user
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User and all related data deleted successfully." });
        }

        // GET /user/validate-token
        [HttpGet("validate-token")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            return Ok(new { message = "Token is valid" });
        }


    }
}
