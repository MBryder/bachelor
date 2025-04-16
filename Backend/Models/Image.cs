using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace MyBackend.Models
{
    public class Image
    {
        public int Id { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        public string PlaceId { get; set; }

        [ForeignKey("PlaceId")]
        
        [JsonIgnore]
        public Place Place { get; set; }
    }
}