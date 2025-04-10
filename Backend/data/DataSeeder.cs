using System.Text.Json;
using MyBackend.Models;
using MyBackend.Data;

public class DataSeeder
{
    private readonly MyDbContext _context;

    public DataSeeder(MyDbContext context)
    {
        _context = context;
    }

    public async Task SeedPlacesAsync(string jsonFilePath)
    {
        if (_context.Places.Any()) return; // Avoid reseeding

        var json = await File.ReadAllTextAsync(jsonFilePath);
        var rawPlaces = JsonSerializer.Deserialize<List<PlaceDTO>>(json);

        foreach (var raw in rawPlaces)
        {
            var place = new Place
            {
                PlaceId = raw.place_id,
                Name = raw.name,
                BusinessStatus = raw.business_status,
                Icon = raw.icon,
                IconBackgroundColor = raw.icon_background_color,
                IconMaskBaseUri = raw.icon_mask_base_uri,
                OpenNow = raw.opening_hours?.open_now ?? false,
                Latitude = raw.geometry.location.lat,
                Longitude = raw.geometry.location.lng,
                ViewportNorthEastLat = raw.geometry.viewport.northeast.lat,
                ViewportNorthEastLng = raw.geometry.viewport.northeast.lng,
                ViewportSouthWestLat = raw.geometry.viewport.southwest.lat,
                ViewportSouthWestLng = raw.geometry.viewport.southwest.lng,
                Rating = raw.rating,
                UserRatingsTotal = raw.user_ratings_total,
                Vicinity = raw.vicinity,
                Reference = raw.reference,
                Scope = raw.scope,
                PlusCodeCompound = raw.plus_code?.compound_code,
                PlusCodeGlobal = raw.plus_code?.global_code,
                Photos = raw.photos?.Select(p => new Photo
                {
                    Height = p.height,
                    Width = p.width,
                    PhotoReference = p.photo_reference,
                    AttributionHtml = p.html_attributions?.FirstOrDefault()
                }).ToList(),
                Types = raw.types?.Select(t => new PlaceType
                {
                    TypeName = t
                }).ToList()
            };

            _context.Places.Add(place);
        }

        await _context.SaveChangesAsync();
    }
}
