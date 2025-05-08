using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBackend.Models
{
    public class SharedRoute
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string? CustomName { get; set; }

        public DateTime DateOfCreation { get; set; } = DateTime.UtcNow;
        public string TransportationMode { get; set; } = "walking"; // Default value (optional)

        public List<string>? Waypoints { get; set; }
    }
}