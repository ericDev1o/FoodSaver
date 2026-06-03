using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodSaver.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIndex_FoodItems_ExpiryDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_FoodItems_ExpiryDate",
                table: "FoodItems",
                column: "ExpiryDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_FoodItems_ExpiryDate",
                table: "FoodItems");
        }
    }
}
