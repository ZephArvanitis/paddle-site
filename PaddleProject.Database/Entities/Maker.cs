using System;
using System.ComponentModel.DataAnnotations;


namespace PaddleProject.Database.Entities
{
    public class Maker
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }
    }
}
