using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Route
{
    [Key]
    public int RouteID { get; set; }

    [Required]
    public string RouteName { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Foreign key
    public int UserID { get; set; }
    [ForeignKey("UserID")]
    public User User { get; set; }

    public ICollection<RouteAttraction> RouteAttractions { get; set; }
}
