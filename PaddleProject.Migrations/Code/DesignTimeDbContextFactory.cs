using System;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

using PaddleProject.Database;


namespace PaddleProject.Migrations
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MainDbContext>
    {
        public MainDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")

                .Build()
                ;

            var connectionString = configuration["ConnectionStrings:DefaultConnection"];

            var serviceProvider = new ServiceCollection()
                .AddDbContext<MainDbContext>(dbContextOptionsBuilder =>
                {
                    dbContextOptionsBuilder.UseSqlite(connectionString, sqlliteDbContextOptionsBuilder =>
                    {
                        sqlliteDbContextOptionsBuilder.MigrationsAssembly("PaddleProject.Migrations");
                    });
                    //dbContextOptionsBuilder.UseSqlServer(connectionString, sqlServerDbContextOptionsBuilder =>
                    //{
                    //    sqlServerDbContextOptionsBuilder.MigrationsAssembly("PaddleProject.Migrations");
                    //});
                })

                .BuildServiceProvider()
                ;

            var dbContext = serviceProvider.GetRequiredService<MainDbContext>();
            return dbContext;
        }
    }
}
