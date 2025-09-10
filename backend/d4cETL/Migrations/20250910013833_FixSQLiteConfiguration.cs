using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace d4cETL.Migrations
{
    /// <inheritdoc />
    public partial class FixSQLiteConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ExecutionHistories_Endpoint",
                table: "ExecutionHistories",
                column: "Endpoint");

            migrationBuilder.CreateIndex(
                name: "IX_ExecutionHistories_IsSuccess",
                table: "ExecutionHistories",
                column: "IsSuccess");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ExecutionHistories_Endpoint",
                table: "ExecutionHistories");

            migrationBuilder.DropIndex(
                name: "IX_ExecutionHistories_IsSuccess",
                table: "ExecutionHistories");
        }
    }
}
