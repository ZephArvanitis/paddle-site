using System;
using System.ComponentModel.DataAnnotations;


namespace PaddleProject.Database.Entities
{
    public class Paddle
    {
        public int ID { get; set; }

        public int PaddleDimensionID { get; set; }

        public int MakerID { get; set; }
    }
}
