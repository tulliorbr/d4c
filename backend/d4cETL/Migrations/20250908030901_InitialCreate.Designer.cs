using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using d4cETL.Infrastructure.Data;

#nullable disable

namespace d4cETL.Migrations
{
  [DbContext(typeof(OmieETLContext))]
  [Migration("20250908030901_InitialCreate")]
  partial class InitialCreate
  {

    protected override void BuildTargetModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
      modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

      modelBuilder.Entity("d4cETL.Domain.Entities.Categoria", b =>
          {
            b.Property<int>("Id")
                      .ValueGeneratedOnAdd()
                      .HasColumnType("INTEGER");

            b.Property<string>("CategoriaSuperior")
                      .HasColumnType("TEXT");

            b.Property<string>("Codigo")
                      .IsRequired()
                      .HasMaxLength(20)
                      .HasColumnType("TEXT");

            b.Property<string>("CodigoDre")
                      .HasColumnType("TEXT");

            b.Property<string>("ContaDespesa")
                      .HasColumnType("TEXT");

            b.Property<string>("ContaInativa")
                      .HasColumnType("TEXT");

            b.Property<string>("ContaReceita")
                      .HasColumnType("TEXT");

            b.Property<string>("CorrelationId")
                      .HasColumnType("TEXT");

            b.Property<DateTime>("CreatedAt")
                      .HasColumnType("TEXT");

            b.Property<string>("DefinidaPeloUsuario")
                      .HasColumnType("TEXT");

            b.Property<string>("Descricao")
                      .IsRequired()
                      .HasMaxLength(50)
                      .HasColumnType("TEXT");

            b.Property<string>("DescricaoPadrao")
                      .HasColumnType("TEXT");

            b.Property<int?>("IdContaContabil")
                      .HasColumnType("INTEGER");

            b.Property<string>("NaoExibir")
                      .HasColumnType("TEXT");

            b.Property<string>("Natureza")
                      .HasColumnType("TEXT");

            b.Property<string>("TagContaContabil")
                      .HasColumnType("TEXT");

            b.Property<string>("TipoCategoria")
                      .HasColumnType("TEXT");

            b.Property<string>("Totalizadora")
                      .HasColumnType("TEXT");

            b.Property<string>("Transferencia")
                      .HasColumnType("TEXT");

            b.Property<DateTime?>("UpdatedAt")
                      .HasColumnType("TEXT");

            b.HasKey("Id");

            b.HasIndex("Codigo")
                      .IsUnique();

            b.HasIndex("CreatedAt");

            b.ToTable("Categorias");
          });

      modelBuilder.Entity("d4cETL.Domain.Entities.MovimentoFinanceiro", b =>
          {
            b.Property<int>("Id")
                      .ValueGeneratedOnAdd()
                      .HasColumnType("INTEGER");

            b.Property<string>("CCPFCNPJCliente")
                      .HasColumnType("TEXT");

            b.Property<string>("CCodCateg")
                      .HasColumnType("TEXT");

            b.Property<string>("CCodIntTitulo")
                      .HasColumnType("TEXT");

            b.Property<int?>("CCodProjeto")
                      .HasColumnType("INTEGER");

            b.Property<string>("CNatureza")
                      .HasColumnType("TEXT");

            b.Property<string>("CNumCtr")
                      .HasColumnType("TEXT");

            b.Property<string>("CNumDocFiscal")
                      .HasColumnType("TEXT");

            b.Property<string>("CNumOS")
                      .HasColumnType("TEXT");

            b.Property<string>("CNumParcela")
                      .HasColumnType("TEXT");

            b.Property<string>("CNumTitulo")
                      .HasColumnType("TEXT");

            b.Property<string>("COperacao")
                      .HasColumnType("TEXT");

            b.Property<string>("CRetCOFINS")
                      .HasColumnType("TEXT");

            b.Property<string>("CRetCSLL")
                      .HasColumnType("TEXT");

            b.Property<string>("CRetINSS")
                      .HasColumnType("TEXT");

            b.Property<string>("CRetIR")
                      .HasColumnType("TEXT");

            b.Property<string>("CRetISS")
                      .HasColumnType("TEXT");

            b.Property<string>("CRetPIS")
                      .HasColumnType("TEXT");

            b.Property<string>("CStatus")
                      .HasColumnType("TEXT");

            b.Property<string>("CTipo")
                      .HasColumnType("TEXT");

            b.Property<string>("CorrelationId")
                      .HasColumnType("TEXT");

            b.Property<DateTime>("CreatedAt")
                      .HasColumnType("TEXT");

            b.Property<DateTime?>("DDtEmissao")
                      .HasColumnType("TEXT");

            b.Property<DateTime?>("DDtPagamento")
                      .HasColumnType("TEXT");

            b.Property<DateTime?>("DDtPrevisao")
                      .HasColumnType("TEXT");

            b.Property<DateTime?>("DDtVenc")
                      .HasColumnType("TEXT");

            b.Property<int?>("NCodCC")
                      .HasColumnType("INTEGER");

            b.Property<int?>("NCodCliente")
                      .HasColumnType("INTEGER");

            b.Property<int?>("NCodCtr")
                      .HasColumnType("INTEGER");

            b.Property<int?>("NCodOS")
                      .HasColumnType("INTEGER");

            b.Property<int>("NCodTitulo")
                      .HasColumnType("INTEGER");

            b.Property<decimal?>("NValorCOFINS")
                      .HasPrecision(18, 2)
                      .HasColumnType("TEXT");

            b.Property<decimal?>("NValorCSLL")
                      .HasPrecision(18, 2)
                      .HasColumnType("TEXT");

            b.Property<decimal?>("NValorINSS")
                      .HasPrecision(18, 2)
                      .HasColumnType("TEXT");

            b.Property<decimal?>("NValorIR")
                      .HasPrecision(18, 2)
                      .HasColumnType("TEXT");

            b.Property<decimal?>("NValorISS")
                      .HasPrecision(18, 2)
                      .HasColumnType("TEXT");

            b.Property<decimal?>("NValorPIS")
                      .HasPrecision(18, 2)
                      .HasColumnType("TEXT");

            b.Property<decimal>("NValorTitulo")
                      .HasPrecision(18, 2)
                      .HasColumnType("TEXT");

            b.Property<DateTime?>("UpdatedAt")
                      .HasColumnType("TEXT");

            b.HasKey("Id");

            b.HasIndex("CCodIntTitulo");

            b.HasIndex("CNatureza");

            b.HasIndex("CStatus");

            b.HasIndex("CreatedAt");

            b.HasIndex("NCodTitulo")
                      .IsUnique();

            b.ToTable("MovimentosFinanceiros");
          });
#pragma warning restore 612, 618
    }
  }
}
