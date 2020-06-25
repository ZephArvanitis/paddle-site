using System;
using System.ComponentModel.DataAnnotations;


namespace PaddleProject.Database.Entities
{
    public class PaddleDimension
    {
        public int ID { get; set; }

        [Required]
        public double WidthCm { get; set; }

        [Required]
        public double LengthCm { get; set; }

        [Required]
        public double LoomHeightCm { get; set; }

        [Required]
        public double LoomLengthCm { get; set; }

        [Required]
        public double LoomDepthCm { get; set; }

        [Required]
        public double TipDepthCm { get; set; }

        [Required]
        public double ShoulderLengthCm { get; set; }
    }
}
