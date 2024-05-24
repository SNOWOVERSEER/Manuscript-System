using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiLA_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSubmissionModel3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsRevisedDeadlineConfirmed",
                table: "Submissions",
                newName: "IsExtensionChanceUsed");

            migrationBuilder.AddColumn<string>(
                name: "CommentsFromEditor",
                table: "Submissions",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RevisedFilePaths",
                table: "Manuscripts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentsFromEditor",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "RevisedFilePaths",
                table: "Manuscripts");

            migrationBuilder.RenameColumn(
                name: "IsExtensionChanceUsed",
                table: "Submissions",
                newName: "IsRevisedDeadlineConfirmed");
        }
    }
}
