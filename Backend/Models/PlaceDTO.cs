using System;
using System.ComponentModel.DataAnnotations;

namespace MyBackend.Models
{
    public class PlaceDTO
    {
        public string business_status { get; set; }
        public Geometry geometry { get; set; }
        public string icon { get; set; }
        public string icon_background_color { get; set; }
        public string icon_mask_base_uri { get; set; }
        public string name { get; set; }
        public OpeningHours opening_hours { get; set; }
        public List<PhotoDTO> photos { get; set; }
        public string place_id { get; set; }
        public PlusCode plus_code { get; set; }
        public double rating { get; set; }
        public string reference { get; set; }
        public string scope { get; set; }
        public List<string> types { get; set; }
        public int user_ratings_total { get; set; }
        public string vicinity { get; set; }

        public class Geometry
        {
            public Location location { get; set; }
            public Viewport viewport { get; set; }

            public class Location
            {
                public double lat { get; set; }
                public double lng { get; set; }
            }

            public class Viewport
            {
                public Location northeast { get; set; }
                public Location southwest { get; set; }
            }
        }

        public class OpeningHours
        {
            public bool open_now { get; set; }
        }

        public class PlusCode
        {
            public string compound_code { get; set; }
            public string global_code { get; set; }
        }

        public class PhotoDTO
        {
            public int height { get; set; }
            public int width { get; set; }
            public string photo_reference { get; set; }
            public List<string> html_attributions { get; set; }
        }
    }
}