namespace MyBackend.Models
{
    public class SharedRouteDto
    {
        public string? CustomName { get; set; }
        public string TransportationMode { get; set; } = "walking";
        public List<string>? Waypoints { get; set; }
    }
}