using System;

using Microsoft.Extensions.DependencyInjection;

using Microsoft.EntityFrameworkCore.Design;

using PaddleProject.Database;

namespace PaddleProject.Migrations
{
    class Program
    {
        static void Main(string[] args)
        {
            // Dummy console app for EF Core tools!

            var serviceProvider = new ServiceCollection()
                .AddSingleton<IDesignTimeDbContextFactory<MainDbContext>, DesignTimeDbContextFactory>()

                .BuildServiceProvider()
                ;

            var designTimeDbContextFactory = serviceProvider.GetRequiredService<IDesignTimeDbContextFactory<MainDbContext>>();

            var dbContext = designTimeDbContextFactory.CreateDbContext(null);
        }
    }
}
