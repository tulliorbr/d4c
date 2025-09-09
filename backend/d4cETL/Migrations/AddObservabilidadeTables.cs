using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace d4cETL.Migrations
{
    public partial class AddObservabilidadeTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ETLBatches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Entidade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    TipoExecucao = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DataInicio = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataFim = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TotalRegistros = table.Column<int>(type: "INTEGER", nullable: false),
                    RegistrosProcessados = table.Column<int>(type: "INTEGER", nullable: false),
                    RegistrosComErro = table.Column<int>(type: "INTEGER", nullable: false),
                    MensagemErro = table.Column<string>(type: "TEXT", nullable: true),
                    ParametrosExecucao = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ETLBatches", x => x.Id);
                });
    
            migrationBuilder.CreateTable(
                name: "ETLBatchItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    BatchId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RegistroId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Tentativas = table.Column<int>(type: "INTEGER", nullable: false),
                    DataProcessamento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DuracaoMs = table.Column<long>(type: "INTEGER", nullable: false),
                    MensagemErro = table.Column<string>(type: "TEXT", nullable: true),
                    DadosOriginais = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ETLBatchItems", x => x.Id);
                    table.ForeignKey(
                              name: "FK_ETLBatchItems_ETLBatches_BatchId",
                              column: x => x.BatchId,
                              principalTable: "ETLBatches",
                              principalColumn: "Id",
                              onDelete: ReferentialAction.Cascade);
                });
    
            migrationBuilder.CreateTable(
                name: "ETLMetrics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    BatchId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Entidade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    DataExecucao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ThroughputRegistrosPorSegundo = table.Column<double>(type: "REAL", nullable: false),
                    LatenciaMediaMs = table.Column<double>(type: "REAL", nullable: false),
                    MemoriaUtilizadaMB = table.Column<double>(type: "REAL", nullable: false),
                    CpuUtilizacaoPercent = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ETLMetrics", x => x.Id);
                    table.ForeignKey(
                              name: "FK_ETLMetrics_ETLBatches_BatchId",
                              column: x => x.BatchId,
                              principalTable: "ETLBatches",
                              principalColumn: "Id",
                              onDelete: ReferentialAction.Cascade);
                });
    
            migrationBuilder.CreateIndex(
                name: "IX_ETLBatchItems_BatchId",
                table: "ETLBatchItems",
                column: "BatchId");
    
            migrationBuilder.CreateIndex(
                name: "IX_ETLBatchItems_RegistroId",
                table: "ETLBatchItems",
                column: "RegistroId");
    
            migrationBuilder.CreateIndex(
                name: "IX_ETLBatchItems_Status",
                table: "ETLBatchItems",
                column: "Status");
    
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
                name: "IX_ETLMetrics_BatchId",
                table: "ETLMetrics",
                column: "BatchId");
    
            migrationBuilder.CreateIndex(
                name: "IX_ETLMetrics_DataExecucao",
                table: "ETLMetrics",
                column: "DataExecucao");
    
            migrationBuilder.CreateIndex(
                name: "IX_ETLMetrics_Entidade",
                table: "ETLMetrics",
                column: "Entidade");
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