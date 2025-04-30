using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyBackend.Models
{
    public class User
    {
        public int? Id { get; set; }

        [Required]
        public string Username { get; set; } = null!;

        public string? Password { get; set; }

        public List<Route>? Routes { get; set; }
    }
}