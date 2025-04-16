namespace MyBackend.Models
{
    using System.Text.Json.Serialization;

    public class DetailsDTO
    {
        [JsonPropertyName("place_id")]
        public string PlaceId { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("formatted_address")]
        public string? FormattedAddress { get; set; }

        [JsonPropertyName("formatted_phone_number")]
        public string? FormattedPhoneNumber { get; set; }

        [JsonPropertyName("price_level")]
        public int? PriceLevel { get; set; }

        [JsonPropertyName("user_ratings_total")]
        public int? UserRatingsTotal { get; set; }

        [JsonPropertyName("wheelchair_accessible_entrance")]
        public bool? WheelchairAccessibleEntrance { get; set; }
    }
}
