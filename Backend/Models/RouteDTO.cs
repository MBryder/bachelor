namespace MyBackend.Models
{
    public class RouteDto
    {
        public string? CustomName { get; set; }
        public List<string>? Waypoints { get; set; }
        public string TransportationMode { get; set; } = "walking";
    }
}
