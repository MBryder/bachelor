using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Path
{
    [Key]
    public int PathID { get; set; }

    public int FromAttractionID { get; set; }
    public int ToAttractionID { get; set; }

    public float Distance { get; set; }
    public int TravelTime { get; set; }

    [ForeignKey("FromAttractionID")]
    public Attraction FromAttraction { get; set; }

    [ForeignKey("ToAttractionID")]
    public Attraction ToAttraction { get; set; }
}
