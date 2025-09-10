using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace d4cETL.Migrations
{
    /// <inheritdoc />
    public partial class AddExecutionHistoryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ExecutionHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    StartTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Duration = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    ErrorMessage = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExecutionHistories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExecutionHistories_CreatedAt",
                table: "ExecutionHistories",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ExecutionHistories_StartTime",
                table: "ExecutionHistories",
                column: "StartTime");

            migrationBuilder.CreateIndex(
                name: "IX_ExecutionHistories_Status",
                table: "ExecutionHistories",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ExecutionHistories_Type",
                table: "ExecutionHistories",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExecutionHistories");
        }
    }
}
