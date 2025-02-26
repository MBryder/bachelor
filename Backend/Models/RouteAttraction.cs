using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class RouteAttraction
{
    [Key]
    public int RouteAttractionID { get; set; }

    // Foreign Keys
    public int RouteID { get; set; }
    [ForeignKey("RouteID")]
    public Route Route { get; set; }

    public int AttractionID { get; set; }
    [ForeignKey("AttractionID")]
    public Attraction Attraction { get; set; }

    public int StopOrder { get; set; }
}
