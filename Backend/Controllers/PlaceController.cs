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

        public PlaceController(MyDbContext context)
        {
            _context = context;
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

        // GET /places/test
        [HttpGet("test")]
        public async Task<IActionResult> GetTestPlacesWithDetails()
        {
            var places = await _context.Places
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

                    WeekdayText = p.Details.WeekdayText,  // List<string>
                    Types = p.Details.Types         // List<string>
                }
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