using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using Microsoft.EntityFrameworkCore;

using Entities = PaddleProject.Database.Entities;
using MainDbContext = PaddleProject.Database.MainDbContext;

namespace PaddleProject.Pages
{
    public class Step1Model : PageModel
    {
        public IEnumerable<string> Strings { get; set; }
        public IStringsProvider StringsProvider { get; }
        public string Unit { get; set; } = "inches";


        public Step1Model(IStringsProvider stringsProvider)
        {
            this.StringsProvider = stringsProvider;
        }


        public void OnGet()
        {
            this.Strings = this.StringsProvider.GetStrings();
        }

        public async Task<IActionResult> OnPostPaddleDimensions([FromBody] PaddleDimensionsMessage paddleDimensionsMessage)
        {
            Console.WriteLine($"paddle is {paddleDimensionsMessage.LengthCm} cm long");

            var entityID = await AddPaddleDimensionsIfNew(paddleDimensionsMessage);

            return new ObjectResult(entityID);
        }

        public async Task<int> AddPaddleDimensionsIfNew(PaddleDimensionsMessage paddleDimensionsMessage)
        {
            var dbContextOptions = Step1Model.GetDbContextOptions();
            var mainDbContext = Step1Model.GetDbContextFromOptions(dbContextOptions);

            var matchingPaddleDimensions = mainDbContext.PaddleDimensions
                .Where(x => (x.LengthCm == paddleDimensionsMessage.LengthCm &&
                             x.LoomDepthCm == paddleDimensionsMessage.LoomDepthCm &&
                             x.LoomHeightCm == paddleDimensionsMessage.LoomHeightCm &&
                             x.LoomLengthCm == paddleDimensionsMessage.LoomLengthCm &&
                             x.ShoulderLengthCm == paddleDimensionsMessage.ShoulderLengthCm &&
                             x.WidthCm == paddleDimensionsMessage.WidthCm &&
                             x.TipDepthCm == paddleDimensionsMessage.TipDepthCm));

            var paddleDimensionsExist = (matchingPaddleDimensions.Count() > 0);

            if (paddleDimensionsExist)
            {
                Console.WriteLine("Matching dimensions already in database, not adding.");
                return matchingPaddleDimensions.First().ID;
            }

            var paddleDimensionEntity = new Entities.PaddleDimension
            {
                WidthCm = paddleDimensionsMessage.WidthCm,
                LengthCm = paddleDimensionsMessage.LengthCm,
                LoomHeightCm = paddleDimensionsMessage.LoomHeightCm,
                LoomLengthCm = paddleDimensionsMessage.LoomLengthCm,
                LoomDepthCm = paddleDimensionsMessage.LoomDepthCm,
                TipDepthCm = paddleDimensionsMessage.TipDepthCm,
                ShoulderLengthCm = paddleDimensionsMessage.ShoulderLengthCm,
            };

            mainDbContext.Add(entity: paddleDimensionEntity);

            await mainDbContext.SaveChangesAsync();

            return paddleDimensionEntity.ID;
        }

        public async Task<IActionResult> OnPostMaker([FromBody] MakerMessage makerMessage)
        {
            Console.WriteLine($"made by {makerMessage.Name}");

            var entityID = await AddMakerIfNew(makerMessage);

            return new ObjectResult(entityID);
        }

        public async Task<int> AddMakerIfNew(MakerMessage makerMessage)
        {
            var dbContextOptions = Step1Model.GetDbContextOptions();
            var mainDbContext = Step1Model.GetDbContextFromOptions(dbContextOptions);

            var matchingMakers = mainDbContext.Makers
                .Where(x => x.Email == makerMessage.Email);

            var emailExists = (matchingMakers.Count() > 0);

            if (emailExists)
            {
                Console.WriteLine("Maker email already in database, not adding.");
                return matchingMakers.First().ID;

            }

            var makerEntity = new Entities.Maker
            {
                Name = makerMessage.Name,
                Email = makerMessage.Email
            };

            mainDbContext.Add(entity: makerEntity);

            await mainDbContext.SaveChangesAsync();

            return makerEntity.ID;
        }

        public async Task<IActionResult> OnPostPaddle([FromBody] PaddleMessage paddleMessage)
        {
            var makerID = this.AddMakerIfNew(paddleMessage.makerMessage).Result;
            var paddleDimensionsID = this.AddPaddleDimensionsIfNew(paddleMessage.paddleDimensionsMessage).Result;

            var dbContextOptions = Step1Model.GetDbContextOptions();
            var mainDbContext = Step1Model.GetDbContextFromOptions(dbContextOptions);

            var paddleEntity = new Entities.Paddle
            {
                ScaleFactor = 1.0,
                MakerID = makerID,
                PaddleDimensionID = paddleDimensionsID,
                DateCreated = DateTime.UtcNow
            };

            mainDbContext.Add(entity: paddleEntity);

            await mainDbContext.SaveChangesAsync();

            return new ObjectResult(paddleEntity.ID);
        }

        public async Task<int> PaddleCount()
        {

            var dbContextOptions = Step1Model.GetDbContextOptions();
            var mainDbContext = Step1Model.GetDbContextFromOptions(dbContextOptions);

            var nPaddles = await mainDbContext.Paddles
                .CountAsync();

            // await mainDbContext.SaveChangesAsync();

            return nPaddles;

        }

        public async Task<int> MakerCount()
        {

            var dbContextOptions = Step1Model.GetDbContextOptions();
            var mainDbContext = Step1Model.GetDbContextFromOptions(dbContextOptions);

            var nMakers = await mainDbContext.Makers
                .CountAsync();

            // await mainDbContext.SaveChangesAsync();

            return nMakers;

        }

        private static DbContextOptions<MainDbContext> GetDbContextOptions()
        {
            var serviceProvider = Step1Model.GetServiceProvider();

            var dbContextOptions = serviceProvider.GetRequiredService<DbContextOptions<MainDbContext>>();
            return dbContextOptions;
        }

        private static ServiceProvider GetServiceProvider()
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

            // var dbContext = serviceProvider.GetRequiredService<MainDbContext>();
            // return dbContext;

            return serviceProvider;
        }

        private static MainDbContext GetDbContextFromOptions(DbContextOptions<MainDbContext> dbContextOptions)
        {
            var mainDbContext = new MainDbContext(dbContextOptions);
            return mainDbContext;
        }
    }
}
