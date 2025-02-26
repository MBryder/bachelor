using System;
using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int UserID { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [Required]
    public string Email { get; set; }

    public DateTime CreatedAt { get; set; }

    // Relationships
    public ICollection<Route> Routes { get; set; }
    public ICollection<SearchQuery> SearchQueries { get; set; }
}

