using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBackend.Data;
using MyBackend.Models;

namespace MyBackend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _context;

        public UserController(MyDbContext context)
        {
            _context = context;
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

            return Ok(new { message = "Login successful!" });
        }
    }
}