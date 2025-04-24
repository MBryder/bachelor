using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MyBackend.Models
{
    public class Details
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string PlaceId { get; set; }
        [ForeignKey("PlaceId")]

        [JsonIgnore]
        public Place Place { get; set; }

        public string? FormattedAddress { get; set; }
        public string? FormattedPhoneNumber { get; set; }
        public string? Url { get; set; }
        public string? Website { get; set; }
        public bool? OpenNow { get; set; }
        public int? PriceLevel { get; set; }
        public double? Rating { get; set; }
        public int? UserRatingsTotal { get; set; }
        public bool? WheelchairAccessibleEntrance { get; set; }
        public bool? Reservable { get; set; }

        public string? EditorialLanguage { get; set; }
        public string? EditorialOverview { get; set; }

        // <-- Change these back to List<string>
        public List<string>? WeekdayText { get; set; }
        public List<string>? Types { get; set; }
    }

}
