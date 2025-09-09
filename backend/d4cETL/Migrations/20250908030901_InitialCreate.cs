using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace d4cETL.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Codigo = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DescricaoPadrao = table.Column<string>(type: "TEXT", nullable: true),
                    TipoCategoria = table.Column<string>(type: "TEXT", nullable: true),
                    ContaInativa = table.Column<string>(type: "TEXT", nullable: true),
                    DefinidaPeloUsuario = table.Column<string>(type: "TEXT", nullable: true),
                    IdContaContabil = table.Column<int>(type: "INTEGER", nullable: true),
                    TagContaContabil = table.Column<string>(type: "TEXT", nullable: true),
                    ContaDespesa = table.Column<string>(type: "TEXT", nullable: true),
                    ContaReceita = table.Column<string>(type: "TEXT", nullable: true),
                    NaoExibir = table.Column<string>(type: "TEXT", nullable: true),
                    Natureza = table.Column<string>(type: "TEXT", nullable: true),
                    Totalizadora = table.Column<string>(type: "TEXT", nullable: true),
                    Transferencia = table.Column<string>(type: "TEXT", nullable: true),
                    CodigoDre = table.Column<string>(type: "TEXT", nullable: true),
                    CategoriaSuperior = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CorrelationId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MovimentosFinanceiros",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NCodTitulo = table.Column<int>(type: "INTEGER", nullable: false),
                    CCodIntTitulo = table.Column<string>(type: "TEXT", nullable: true),
                    CNumTitulo = table.Column<string>(type: "TEXT", nullable: true),
                    DDtEmissao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DDtVenc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DDtPrevisao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DDtPagamento = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NCodCliente = table.Column<int>(type: "INTEGER", nullable: true),
                    CCPFCNPJCliente = table.Column<string>(type: "TEXT", nullable: true),
                    NCodCtr = table.Column<int>(type: "INTEGER", nullable: true),
                    CNumCtr = table.Column<string>(type: "TEXT", nullable: true),
                    NCodOS = table.Column<int>(type: "INTEGER", nullable: true),
                    CNumOS = table.Column<string>(type: "TEXT", nullable: true),
                    NCodCC = table.Column<int>(type: "INTEGER", nullable: true),
                    CStatus = table.Column<string>(type: "TEXT", nullable: true),
                    CNatureza = table.Column<string>(type: "TEXT", nullable: true),
                    CTipo = table.Column<string>(type: "TEXT", nullable: true),
                    COperacao = table.Column<string>(type: "TEXT", nullable: true),
                    CNumDocFiscal = table.Column<string>(type: "TEXT", nullable: true),
                    CCodCateg = table.Column<string>(type: "TEXT", nullable: true),
                    CNumParcela = table.Column<string>(type: "TEXT", nullable: true),
                    NValorTitulo = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    NValorPIS = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CRetPIS = table.Column<string>(type: "TEXT", nullable: true),
                    NValorCOFINS = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CRetCOFINS = table.Column<string>(type: "TEXT", nullable: true),
                    NValorCSLL = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CRetCSLL = table.Column<string>(type: "TEXT", nullable: true),
                    NValorIR = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CRetIR = table.Column<string>(type: "TEXT", nullable: true),
                    NValorISS = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CRetISS = table.Column<string>(type: "TEXT", nullable: true),
                    NValorINSS = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CRetINSS = table.Column<string>(type: "TEXT", nullable: true),
                    CCodProjeto = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CorrelationId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovimentosFinanceiros", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_Codigo",
                table: "Categorias",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_CreatedAt",
                table: "Categorias",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MovimentosFinanceiros_CCodIntTitulo",
                table: "MovimentosFinanceiros",
                column: "CCodIntTitulo");

            migrationBuilder.CreateIndex(
                name: "IX_MovimentosFinanceiros_CNatureza",
                table: "MovimentosFinanceiros",
                column: "CNatureza");

            migrationBuilder.CreateIndex(
                name: "IX_MovimentosFinanceiros_CreatedAt",
                table: "MovimentosFinanceiros",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MovimentosFinanceiros_CStatus",
                table: "MovimentosFinanceiros",
                column: "CStatus");

            migrationBuilder.CreateIndex(
                name: "IX_MovimentosFinanceiros_NCodTitulo",
                table: "MovimentosFinanceiros",
                column: "NCodTitulo",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropTable(
                name: "MovimentosFinanceiros");
        }
    }
}
