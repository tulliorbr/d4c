using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace d4cETL.Migrations
{
    /// <inheritdoc />
    public partial class AddEndpointAndIsSuccessToExecutionHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Endpoint",
                table: "ExecutionHistories",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsSuccess",
                table: "ExecutionHistories",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Endpoint",
                table: "ExecutionHistories");

            migrationBuilder.DropColumn(
                name: "IsSuccess",
                table: "ExecutionHistories");
        }
    }
}
