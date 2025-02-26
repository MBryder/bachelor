using System.ComponentModel.DataAnnotations;

public class Attraction
{
    [Key]
    public int AttractionID { get; set; }

    [Required]
    public string Name { get; set; }

    public string Description { get; set; }
    public string Address { get; set; }

    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    public ICollection<RouteAttraction> RouteAttractions { get; set; }
}
