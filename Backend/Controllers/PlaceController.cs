using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
        public async Task<IActionResult> GetPlacesInBounds([FromQuery] double swLat, [FromQuery] double swLng, [FromQuery] double neLat, [FromQuery] double neLng)
        {
            var places = await _context.Places
                .Where(p => p.Latitude >= swLat && p.Latitude <= neLat &&
                            p.Longitude >= swLng && p.Longitude <= neLng &&
                            !p.PlaceId.StartsWith("user-location-"))
                .Include(p => p.Images)
                .Include(p => p.Details)
                .ToListAsync();

            return Ok(places);
        }

        [HttpGet("name")]
        [Authorize]
        public async Task<IActionResult> GetPlacesWithName([FromQuery] string Name)
        {
            _logger.LogInformation($"Endpoint hit: Searching for places with name containing '{Name}'");

            var places = await _context.Places
                .Where(p => p.Name.ToLower().Contains(Name.ToLower()) &&
                            !p.PlaceId.StartsWith("user-location-"))
                .Select(p => new
                {
                    p.Name,
                    p.PlaceId,
                })
                .ToListAsync();

            return Ok(places);
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetPlaceById([FromQuery] string id)
        {
            // No filter needed here since you're fetching a specific place ID
            var places = await _context.Places
                .Where(p => p.PlaceId == id)
                .Include(p => p.Images)
                .Include(p => p.Details)
                .ToListAsync();

            return Ok(places);
        }

        [HttpGet("test")]
        public async Task<IActionResult> GetTestPlacesWithDetails()
        {
            var places = await _context.Places
                .Where(p => !p.PlaceId.StartsWith("user-location-"))
                .AsNoTracking()
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
                ImageUrls = p.Images.Select(i => i.ImageUrl).ToList(),

                Details = p.Details == null ? null : new
                {
                    Address = p.Details.FormattedAddress,
                    PhoneNumber = p.Details.FormattedPhoneNumber,
                    Url = p.Details.Url,
                    Website = p.Details.Website,
                    OpenNow = p.Details.OpenNow,
                    PriceLevel = p.Details.PriceLevel,
                    Rating = p.Details.Rating,
                    UserRatingsTotal = p.Details.UserRatingsTotal,
                    WheelchairAccessible = p.Details.WheelchairAccessibleEntrance,
                    Reservable = p.Details.Reservable,

                    EditorialSummary = new
                    {
                        Language = p.Details.EditorialLanguage,
                        Overview = p.Details.EditorialOverview
                    },

                    WeekdayText = p.Details.WeekdayText,
                    Types = p.Details.Types
                }
            });

            return Ok(new
            {
                message = "Fetched first 5 places with images and details",
                count = result.Count(),
                places = result
            });
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreatePlace([FromBody] PlaceCreateDto dto)
        {
            // Check if the place already exists
            var existing = await _context.Places.FirstOrDefaultAsync(p => p.PlaceId == dto.PlaceId);
            if (existing != null)
            {
                return Conflict(new { message = "A place with this PlaceId already exists." });
            }

            var place = new Place
            {
                PlaceId = dto.PlaceId,
                Name = "User Location",
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Icon = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
                Photos = new List<Photo>(),
                Types = new List<PlaceType>(),
                Images = new List<Image>(),
                Details = new Details
                {
                    PlaceId = dto.PlaceId,
                    FormattedAddress = "Current location",
                    WeekdayText = new List<string>(),
                    Types = new List<string>()
                }
            };

            _context.Places.Add(place);
            await _context.SaveChangesAsync();

            // Reload with includes
            var saved = await _context.Places
                .Include(p => p.Details)
                .FirstOrDefaultAsync(p => p.PlaceId == dto.PlaceId);

            return Ok(saved);
        }

    }
}