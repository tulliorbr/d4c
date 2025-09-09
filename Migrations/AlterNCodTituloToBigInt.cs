using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace d4cETL.Migrations
{
  public partial class AlterNCodTituloToBigInt : Migration
  {

    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql(@"
                -- Criar tabela temporária com a estrutura atual
                CREATE TABLE MovimentosFinanceiros_temp AS 
                SELECT * FROM MovimentosFinanceiros;
                
                -- Remover a tabela original
                DROP TABLE MovimentosFinanceiros;
                
                -- Recriar a tabela com NCodTitulo como BIGINT
                CREATE TABLE MovimentosFinanceiros (
                    Id INTEGER NOT NULL CONSTRAINT PK_MovimentosFinanceiros PRIMARY KEY AUTOINCREMENT,
                    NCodTitulo BIGINT NOT NULL,
                    CCodIntTitulo TEXT NULL,
                    CNumTitulo TEXT NULL,
                    DDtEmissao TEXT NULL,
                    DDtVenc TEXT NULL,
                    DDtPrevisao TEXT NULL,
                    DDtPagamento TEXT NULL,
                    NCodCliente INTEGER NULL,
                    CCPFCNPJCliente TEXT NULL,
                    NCodCtr INTEGER NULL,
                    CNumCtr TEXT NULL,
                    NCodOS INTEGER NULL,
                    CNumOS TEXT NULL,
                    NCodCC INTEGER NULL,
                    CStatus TEXT NULL,
                    CNatureza TEXT NULL,
                    CTipo TEXT NULL,
                    COperacao TEXT NULL,
                    CNumDocFiscal TEXT NULL,
                    CCodCateg TEXT NULL,
                    CNumParcela TEXT NULL,
                    NValorTitulo TEXT NOT NULL,
                    NValorPIS TEXT NULL,
                    CRetPIS TEXT NULL,
                    NValorCOFINS TEXT NULL,
                    CRetCOFINS TEXT NULL,
                    NValorCSLL TEXT NULL,
                    CRetCSLL TEXT NULL,
                    NValorIR TEXT NULL,
                    CRetIR TEXT NULL,
                    NValorISS TEXT NULL,
                    CRetISS TEXT NULL,
                    NValorINSS TEXT NULL,
                    CRetINSS TEXT NULL,
                    CCodProjeto INTEGER NULL,
                    CreatedAt TEXT NOT NULL,
                    UpdatedAt TEXT NULL,
                    CorrelationId TEXT NULL
                );
                
                -- Copiar dados da tabela temporária para a nova tabela
                INSERT INTO MovimentosFinanceiros 
                SELECT * FROM MovimentosFinanceiros_temp;
                
                -- Remover tabela temporária
                DROP TABLE MovimentosFinanceiros_temp;
                
                -- Recriar índices
                CREATE INDEX IX_MovimentosFinanceiros_CCodIntTitulo ON MovimentosFinanceiros (CCodIntTitulo);
                CREATE INDEX IX_MovimentosFinanceiros_CNatureza ON MovimentosFinanceiros (CNatureza);
                CREATE INDEX IX_MovimentosFinanceiros_CreatedAt ON MovimentosFinanceiros (CreatedAt);
                CREATE INDEX IX_MovimentosFinanceiros_CStatus ON MovimentosFinanceiros (CStatus);
                CREATE UNIQUE INDEX IX_MovimentosFinanceiros_NCodTitulo ON MovimentosFinanceiros (NCodTitulo);
            ");
    }


    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql(@"
                CREATE TABLE MovimentosFinanceiros_temp AS 
                SELECT * FROM MovimentosFinanceiros;
                
                DROP TABLE MovimentosFinanceiros;
                
                CREATE TABLE MovimentosFinanceiros (
                    Id INTEGER NOT NULL CONSTRAINT PK_MovimentosFinanceiros PRIMARY KEY AUTOINCREMENT,
                    NCodTitulo INTEGER NOT NULL,
                    CCodIntTitulo TEXT NULL,
                    CNumTitulo TEXT NULL,
                    DDtEmissao TEXT NULL,
                    DDtVenc TEXT NULL,
                    DDtPrevisao TEXT NULL,
                    DDtPagamento TEXT NULL,
                    NCodCliente INTEGER NULL,
                    CCPFCNPJCliente TEXT NULL,
                    NCodCtr INTEGER NULL,
                    CNumCtr TEXT NULL,
                    NCodOS INTEGER NULL,
                    CNumOS TEXT NULL,
                    NCodCC INTEGER NULL,
                    CStatus TEXT NULL,
                    CNatureza TEXT NULL,
                    CTipo TEXT NULL,
                    COperacao TEXT NULL,
                    CNumDocFiscal TEXT NULL,
                    CCodCateg TEXT NULL,
                    CNumParcela TEXT NULL,
                    NValorTitulo TEXT NOT NULL,
                    NValorPIS TEXT NULL,
                    CRetPIS TEXT NULL,
                    NValorCOFINS TEXT NULL,
                    CRetCOFINS TEXT NULL,
                    NValorCSLL TEXT NULL,
                    CRetCSLL TEXT NULL,
                    NValorIR TEXT NULL,
                    CRetIR TEXT NULL,
                    NValorISS TEXT NULL,
                    CRetISS TEXT NULL,
                    NValorINSS TEXT NULL,
                    CRetINSS TEXT NULL,
                    CCodProjeto INTEGER NULL,
                    CreatedAt TEXT NOT NULL,
                    UpdatedAt TEXT NULL,
                    CorrelationId TEXT NULL
                );
                
                INSERT INTO MovimentosFinanceiros 
                SELECT * FROM MovimentosFinanceiros_temp;
                
                DROP TABLE MovimentosFinanceiros_temp;
                
                CREATE INDEX IX_MovimentosFinanceiros_CCodIntTitulo ON MovimentosFinanceiros (CCodIntTitulo);
                CREATE INDEX IX_MovimentosFinanceiros_CNatureza ON MovimentosFinanceiros (CNatureza);
                CREATE INDEX IX_MovimentosFinanceiros_CreatedAt ON MovimentosFinanceiros (CreatedAt);
                CREATE INDEX IX_MovimentosFinanceiros_CStatus ON MovimentosFinanceiros (CStatus);
                CREATE UNIQUE INDEX IX_MovimentosFinanceiros_NCodTitulo ON MovimentosFinanceiros (NCodTitulo);
            ");
    }
  }
}