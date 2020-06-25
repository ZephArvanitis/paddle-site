using System;

using Microsoft.EntityFrameworkCore;


namespace PaddleProject.Database
{
    public class MainDbContext : DbContext
    {
        public DbSet<Entities.Paddle> Paddles { get; set; }
        public DbSet<Entities.Maker> Makers { get; set; }
        public DbSet<Entities.PaddleDimension> PaddleDimensions { get; set; }


        public MainDbContext(DbContextOptions<MainDbContext> dbContextOptions)
            : base(dbContextOptions)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Don't think I need anything here, but this is where I could manually
            // add foreign keys.
            // modelBuilder.Entity<Entities.Person>().HasAlternateKey(x => x.Name);
        }
    }
}
