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

        public string? Name { get; set; }

        public string? FormattedAddress { get; set; }

        public string? FormattedPhoneNumber { get; set; }

        public int? PriceLevel { get; set; }

        public int? UserRatingsTotal { get; set; }

        public bool? WheelchairAccessibleEntrance { get; set; }

        // Navigation property
        [ForeignKey("PlaceId")]

        [JsonIgnore]
        public Place Place { get; set; }
    }
}
