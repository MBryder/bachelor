using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBackend.Data;
using MyBackend.Models;
using System.Security.Claims;

namespace MyBackend.Controllers
{
    [ApiController]
    [Route("routes")]
    [Authorize] // All endpoints require JWT authentication
    public class RouteController : ControllerBase
    {
        private readonly MyDbContext _context;

        public RouteController(MyDbContext context)
        {
            _context = context;
        }

        // GET /routes/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSharedRouteById(string id)
        {
            var route = await _context.SharedRoutes
                .FirstOrDefaultAsync(r => r.Id == id);

            if (route == null)
            {
                return NotFound(new { message = "Route not found" });
            }

            return Ok(route);
        }

        
        [HttpPost("share")]
        public async Task<IActionResult> SharePublicRoute([FromBody] SharedRouteDto sharedRoute)
        {
            var shared = new SharedRoute
{
            Id = Guid.NewGuid().ToString(),
            CustomName = sharedRoute.CustomName,
            DateOfCreation = DateTime.UtcNow,
            Waypoints = sharedRoute.Waypoints,
            TransportationMode = sharedRoute.TransportationMode
        };

        _context.SharedRoutes.Add(shared);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Shared route added successfully", routeId = shared.Id });
        }
    }
}
