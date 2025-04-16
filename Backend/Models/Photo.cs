using System;
using System.ComponentModel.DataAnnotations;

namespace MyBackend.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public int PlaceId { get; set; }
        public Place Place { get; set; }

        public int Height { get; set; }
        public int Width { get; set; }
        public string PhotoReference { get; set; }
        public string AttributionHtml { get; set; }
    }
}