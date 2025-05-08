using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyBackend.Models
{
    public class User
{
    public int Id { get; set; }

    public DateTime DateOfCreation { get; set; } = DateTime.UtcNow;

    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Username { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!; // Store hashed passwords only

    public List<Route> Routes { get; set; } = new(); // Default to empty list
}

}