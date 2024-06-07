using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiLA_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSubmissionModel5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTicketClosed",
                table: "ReviewerSubmissions",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTicketClosed",
                table: "ReviewerSubmissions");
        }
    }
}
