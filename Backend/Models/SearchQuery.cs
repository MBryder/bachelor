using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class SearchQuery
{
    [Key]
    public int QueryID { get; set; }

    public int UserID { get; set; }
    [ForeignKey("UserID")]
    public User User { get; set; }

    public int StartAttractionID { get; set; }
    public int EndAttractionID { get; set; }

    public DateTime SearchDate { get; set; }
}
