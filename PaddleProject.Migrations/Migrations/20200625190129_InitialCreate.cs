using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PaddleProject.Migrations.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Makers",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Makers", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "PaddleDimensions",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    WidthCm = table.Column<double>(nullable: false),
                    LengthCm = table.Column<double>(nullable: false),
                    LoomHeightCm = table.Column<double>(nullable: false),
                    LoomLengthCm = table.Column<double>(nullable: false),
                    LoomDepthCm = table.Column<double>(nullable: false),
                    TipDepthCm = table.Column<double>(nullable: false),
                    ShoulderLengthCm = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaddleDimensions", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Paddles",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PaddleDimensionID = table.Column<int>(nullable: false),
                    MakerID = table.Column<int>(nullable: false),
                    ScaleFactor = table.Column<double>(nullable: false, defaultValue: 1.0),
                    DateCreated = table.Column<DateTime>(nullable: false, defaultValueSql: "getdate()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paddles", x => x.ID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Makers");

            migrationBuilder.DropTable(
                name: "PaddleDimensions");

            migrationBuilder.DropTable(
                name: "Paddles");
        }
    }
}
