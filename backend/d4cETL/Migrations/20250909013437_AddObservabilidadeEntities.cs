using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace d4cETL.Migrations
{
    public partial class AddObservabilidadeEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ETLBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BatchId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    TipoExecucao = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Entidade = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DataInicio = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataFim = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    TotalRegistrosLidos = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalRegistrosProcessados = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalRegistrosInseridos = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalRegistrosAtualizados = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalRegistrosComErro = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalPaginas = table.Column<int>(type: "INTEGER", nullable: false),
                    PaginaAtual = table.Column<int>(type: "INTEGER", nullable: false),
                    ThroughputRegistrosPorSegundo = table.Column<double>(type: "REAL", nullable: true),
                    LatenciaMediaMs = table.Column<double>(type: "REAL", nullable: true),
                    MensagemErro = table.Column<string>(type: "TEXT", nullable: true),
                    StackTrace = table.Column<string>(type: "TEXT", nullable: true),
                    CorrelationId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ETLBatches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ETLMetrics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Entidade = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DataExecucao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TipoExecucao = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    RegistrosLidos = table.Column<int>(type: "INTEGER", nullable: false),
                    RegistrosProcessados = table.Column<int>(type: "INTEGER", nullable: false),
                    RegistrosComErro = table.Column<int>(type: "INTEGER", nullable: false),
                    ThroughputRegistrosPorSegundo = table.Column<double>(type: "REAL", nullable: false),
                    LatenciaMediaMs = table.Column<double>(type: "REAL", nullable: false),
                    DuracaoTotalMinutos = table.Column<double>(type: "REAL", nullable: false),
                    UltimaExecucao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ETLMetrics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ETLBatchItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ETLBatchId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    TipoItem = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Pagina = table.Column<int>(type: "INTEGER", nullable: false),
                    PosicaoNaPagina = table.Column<int>(type: "INTEGER", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataFim = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Operacao = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    NumeroTentativas = table.Column<int>(type: "INTEGER", nullable: false),
                    DuracaoMs = table.Column<double>(type: "REAL", nullable: true),
                    MensagemErro = table.Column<string>(type: "TEXT", nullable: true),
                    DadosOriginais = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ETLBatchItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ETLBatchItems_ETLBatches_ETLBatchId",
                        column: x => x.ETLBatchId,
                        principalTable: "ETLBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ETLBatches_BatchId",
                table: "ETLBatches",
                column: "BatchId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ETLBatches_DataInicio",
                table: "ETLBatches",
                column: "DataInicio");

            migrationBuilder.CreateIndex(
                name: "IX_ETLBatches_Entidade",
                table: "ETLBatches",
                column: "Entidade");

            migrationBuilder.CreateIndex(
                name: "IX_ETLBatches_Status",
                table: "ETLBatches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ETLBatchItems_DataInicio",
                table: "ETLBatchItems",
                column: "DataInicio");

            migrationBuilder.CreateIndex(
                name: "IX_ETLBatchItems_ETLBatchId",
                table: "ETLBatchItems",
                column: "ETLBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_ETLBatchItems_Status",
                table: "ETLBatchItems",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ETLMetrics_DataExecucao",
                table: "ETLMetrics",
                column: "DataExecucao");

            migrationBuilder.CreateIndex(
                name: "IX_ETLMetrics_Entidade",
                table: "ETLMetrics",
                column: "Entidade");

            migrationBuilder.CreateIndex(
                name: "IX_ETLMetrics_UltimaExecucao",
                table: "ETLMetrics",
                column: "UltimaExecucao");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ETLBatchItems");

            migrationBuilder.DropTable(
                name: "ETLMetrics");

            migrationBuilder.DropTable(
                name: "ETLBatches");
        }
    }
}
