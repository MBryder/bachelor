namespace MyBackend.Models
{
    public class PlaceCreateDto
    {
        public string PlaceId { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}