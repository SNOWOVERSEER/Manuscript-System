using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiLA_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReviewerSubmission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Comment",
                table: "ReviewerSubmissions",
                newName: "CommentsToEditor");

            migrationBuilder.AddColumn<string>(
                name: "CommentsToAuthor",
                table: "ReviewerSubmissions",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentsToAuthor",
                table: "ReviewerSubmissions");

            migrationBuilder.RenameColumn(
                name: "CommentsToEditor",
                table: "ReviewerSubmissions",
                newName: "Comment");
        }
    }
}
