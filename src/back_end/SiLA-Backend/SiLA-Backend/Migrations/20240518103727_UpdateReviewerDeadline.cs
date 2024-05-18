using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiLA_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReviewerDeadline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewDeadline",
                table: "Submissions",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewDeadline",
                table: "Submissions");
        }
    }
}
