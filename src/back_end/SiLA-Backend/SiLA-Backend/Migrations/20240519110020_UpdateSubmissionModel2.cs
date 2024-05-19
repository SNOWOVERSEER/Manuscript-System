using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiLA_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSubmissionModel2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CaseCompleted",
                table: "Submissions",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRevisedDeadlineConfirmed",
                table: "Submissions",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaseCompleted",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "IsRevisedDeadlineConfirmed",
                table: "Submissions");
        }
    }
}
