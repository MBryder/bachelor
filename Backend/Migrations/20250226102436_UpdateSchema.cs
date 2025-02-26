using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserID");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Attractions",
                columns: table => new
                {
                    AttractionID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<decimal>(type: "numeric", nullable: false),
                    Longitude = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attractions", x => x.AttractionID);
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    RouteID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RouteName = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.RouteID);
                    table.ForeignKey(
                        name: "FK_Routes_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SearchQueries",
                columns: table => new
                {
                    QueryID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserID = table.Column<int>(type: "integer", nullable: false),
                    StartAttractionID = table.Column<int>(type: "integer", nullable: false),
                    EndAttractionID = table.Column<int>(type: "integer", nullable: false),
                    SearchDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SearchQueries", x => x.QueryID);
                    table.ForeignKey(
                        name: "FK_SearchQueries_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Paths",
                columns: table => new
                {
                    PathID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FromAttractionID = table.Column<int>(type: "integer", nullable: false),
                    ToAttractionID = table.Column<int>(type: "integer", nullable: false),
                    Distance = table.Column<float>(type: "real", nullable: false),
                    TravelTime = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paths", x => x.PathID);
                    table.ForeignKey(
                        name: "FK_Paths_Attractions_FromAttractionID",
                        column: x => x.FromAttractionID,
                        principalTable: "Attractions",
                        principalColumn: "AttractionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Paths_Attractions_ToAttractionID",
                        column: x => x.ToAttractionID,
                        principalTable: "Attractions",
                        principalColumn: "AttractionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteAttractions",
                columns: table => new
                {
                    RouteAttractionID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RouteID = table.Column<int>(type: "integer", nullable: false),
                    AttractionID = table.Column<int>(type: "integer", nullable: false),
                    StopOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteAttractions", x => x.RouteAttractionID);
                    table.ForeignKey(
                        name: "FK_RouteAttractions_Attractions_AttractionID",
                        column: x => x.AttractionID,
                        principalTable: "Attractions",
                        principalColumn: "AttractionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteAttractions_Routes_RouteID",
                        column: x => x.RouteID,
                        principalTable: "Routes",
                        principalColumn: "RouteID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Paths_FromAttractionID",
                table: "Paths",
                column: "FromAttractionID");

            migrationBuilder.CreateIndex(
                name: "IX_Paths_ToAttractionID",
                table: "Paths",
                column: "ToAttractionID");

            migrationBuilder.CreateIndex(
                name: "IX_RouteAttractions_AttractionID",
                table: "RouteAttractions",
                column: "AttractionID");

            migrationBuilder.CreateIndex(
                name: "IX_RouteAttractions_RouteID",
                table: "RouteAttractions",
                column: "RouteID");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_UserID",
                table: "Routes",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_SearchQueries_UserID",
                table: "SearchQueries",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Paths");

            migrationBuilder.DropTable(
                name: "RouteAttractions");

            migrationBuilder.DropTable(
                name: "SearchQueries");

            migrationBuilder.DropTable(
                name: "Attractions");

            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Users",
                newName: "Id");
        }
    }
}
