using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBackend.Data;
using MyBackend.Models;

namespace MyBackend.Controllers
{

    [ApiController]
    [Route("places")]
    public class PlaceController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ILogger<PlaceController> _logger;

        public PlaceController(MyDbContext context, ILogger<PlaceController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET /places/by-bounds?swLat=...&swLng=...&neLat=...&neLng=...
        // RETURNS PLACES IN VIEW ON THE MAP!
        [HttpGet("by-bounds")]
        public async Task<IActionResult> GetPlacesInBounds([FromQuery] double swLat, [FromQuery] double swLng, [FromQuery] double neLat, [FromQuery] double neLng)
        {
            var places = await _context.Places
                .Where(p => p.Latitude >= swLat && p.Latitude <= neLat &&
                            p.Longitude >= swLng && p.Longitude <= neLng)
                .Include(p => p.Images) // Include images if needed
                .ToListAsync();

            return Ok(places);
        }

        // GET /places/search?name=...
        [HttpGet("name")]
        public async Task<IActionResult> GetPlacesInBounds([FromQuery] string Name)
        {
            _logger.LogInformation($"Endpoint hit: Searching for places with name containing '{Name}'");

            var places = await _context.Places
                .Where(p => p.Name.ToLower().Contains(Name.ToLower()))
                .Select(p => new
                {
                    p.Name
                })
                .ToListAsync(); // Execute the query

            return Ok(places);
        }

        // GET /places/test
        [HttpGet("test")]
        public async Task<IActionResult> GetTestPlacesWithDetails()
        {
            var places = await _context.Places
                .Include(p => p.Images)
                .Include(p => p.Details)
                .Take(5)
                .ToListAsync();

            var result = places.Select(p => new
            {
                p.PlaceId,
                p.Name,
                p.Rating,
                p.Latitude,
                p.Longitude,
                imageUrls = p.Images.Select(i => i.ImageUrl).ToList(),
                details = p.Details != null ? new
                {
                    p.Details.FormattedAddress,
                    p.Details.FormattedPhoneNumber,
                    p.Details.PriceLevel,
                    p.Details.UserRatingsTotal,
                    p.Details.WheelchairAccessibleEntrance
                } : null
            });

            return Ok(new
            {
                message = "Fetched first 5 places with images and details",
                count = result.Count(),
                places = result
            });
        }

    }
}