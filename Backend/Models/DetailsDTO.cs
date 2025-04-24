using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MyBackend.Models
{
    public class DetailsDTO
    {
        [JsonPropertyName("place_id")]
        public string PlaceId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("formatted_address")]
        public string? FormattedAddress { get; set; }

        [JsonPropertyName("formatted_phone_number")]
        public string? FormattedPhoneNumber { get; set; }

        [JsonPropertyName("url")]
        public string? Url { get; set; }

        [JsonPropertyName("website")]
        public string? Website { get; set; }

        [JsonPropertyName("open_now")]
        public bool? OpenNow { get; set; }

        [JsonPropertyName("price_level")]
        public int? PriceLevel { get; set; }

        [JsonPropertyName("rating")]
        public double? Rating { get; set; }

        [JsonPropertyName("user_ratings_total")]
        public int? UserRatingsTotal { get; set; }

        [JsonPropertyName("wheelchair_accessible_entrance")]
        public bool? WheelchairAccessibleEntrance { get; set; }

        [JsonPropertyName("reservable")]
        public bool? Reservable { get; set; }

        [JsonPropertyName("editorial_summary")]
        public EditorialSummaryDTO EditorialSummary { get; set; }

        [JsonPropertyName("weekday_text")]
        public List<string> WeekdayText { get; set; }

        [JsonPropertyName("types")]
        public List<string> Types { get; set; }
    }

    public class EditorialSummaryDTO
    {
        [JsonPropertyName("language")]
        public string Language { get; set; }

        [JsonPropertyName("overview")]
        public string Overview { get; set; }
    }
}
