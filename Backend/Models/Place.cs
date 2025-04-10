using System;
using System.ComponentModel.DataAnnotations;

namespace MyBackend.Models
{
    public class Place
    {
        public int Id { get; set; } // Primary key
        public string PlaceId { get; set; } // Google place_id
        public string Name { get; set; }
        public string? BusinessStatus { get; set; }
        public string Icon { get; set; }
        public string? IconBackgroundColor { get; set; }
        public string? IconMaskBaseUri { get; set; }
        public bool? OpenNow { get; set; } // From opening_hours.open_now
        public double Latitude { get; set; } // geometry.location.lat
        public double Longitude { get; set; } // geometry.location.lng
        public double? ViewportNorthEastLat { get; set; }
        public double? ViewportNorthEastLng { get; set; }
        public double? ViewportSouthWestLat { get; set; }
        public double? ViewportSouthWestLng { get; set; }
        public double? Rating { get; set; }
        public int? UserRatingsTotal { get; set; }
        public string? Vicinity { get; set; }
        public string? Reference { get; set; }
        public string? Scope { get; set; }

        public string? PlusCodeGlobal { get; set; }
        public string? PlusCodeCompound { get; set; }

        public ICollection<Photo> Photos { get; set; }
        public ICollection<PlaceType> Types { get; set; }
    }
}