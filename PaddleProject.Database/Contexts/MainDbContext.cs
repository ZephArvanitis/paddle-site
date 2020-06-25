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
            // Add default values here.
            modelBuilder.Entity<Entities.Paddle>()
                .Property(b => b.ScaleFactor)
                .HasDefaultValue(1.0);

            modelBuilder.Entity<Entities.Paddle>()
                .Property(b => b.DateCreated)
                .HasDefaultValueSql("getdate()");

            // modelBuilder.Entity<Entities.Person>().HasAlternateKey(x => x.Name);
        }
    }
}
