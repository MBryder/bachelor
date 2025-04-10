using System;
using System.ComponentModel.DataAnnotations;

namespace MyBackend.Models
{
    public class PlaceType
    {
        public int Id { get; set; }
        public int PlaceId { get; set; }
        public Place Place { get; set; }

        public string TypeName { get; set; } // e.g. "restaurant"
    }
}