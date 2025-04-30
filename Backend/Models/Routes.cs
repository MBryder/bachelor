using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBackend.Models
{
    public class Route
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = null!;  // This is the foreign key

        [ForeignKey("Username")]
        public User? User { get; set; }                // This references the FK

        public string? CustomName { get; set; }

        public DateTime DateOfCreation { get; set; }

        public List<string>? Waypoints { get; set; }
    }
}