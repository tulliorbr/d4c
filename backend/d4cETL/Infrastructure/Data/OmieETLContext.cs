using d4cETL.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace d4cETL.Infrastructure.Data;

public class OmieETLContext : DbContext
{
  public OmieETLContext(DbContextOptions<OmieETLContext> options) : base(options)
  {
  }

  public DbSet<MovimentoFinanceiro> MovimentosFinanceiros { get; set; }
  public DbSet<Categoria> Categorias { get; set; }

  public DbSet<ETLBatch> ETLBatches { get; set; }
  public DbSet<ETLBatchItem> ETLBatchItems { get; set; }
  public DbSet<ETLMetrics> ETLMetrics { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<MovimentoFinanceiro>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.NCodTitulo).IsRequired();
      entity.Property(e => e.NValorTitulo).HasPrecision(18, 2);
      entity.Property(e => e.NValorPIS).HasPrecision(18, 2);
      entity.Property(e => e.NValorCOFINS).HasPrecision(18, 2);
      entity.Property(e => e.NValorCSLL).HasPrecision(18, 2);
      entity.Property(e => e.NValorIR).HasPrecision(18, 2);
      entity.Property(e => e.NValorISS).HasPrecision(18, 2);
      entity.Property(e => e.NValorINSS).HasPrecision(18, 2);
      entity.HasIndex(e => e.NCodTitulo).IsUnique();
      entity.HasIndex(e => e.CCodIntTitulo);
      entity.HasIndex(e => e.CNatureza);
      entity.HasIndex(e => e.CStatus);
      entity.HasIndex(e => e.CreatedAt);
    });

    modelBuilder.Entity<Categoria>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Codigo).IsRequired().HasMaxLength(20);
      entity.Property(e => e.Descricao).IsRequired().HasMaxLength(50);
      entity.HasIndex(e => e.Codigo).IsUnique();
      entity.HasIndex(e => e.CreatedAt);
    });

    modelBuilder.Entity<ETLBatch>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.BatchId).IsRequired().HasMaxLength(50);
      entity.Property(e => e.TipoExecucao).IsRequired().HasMaxLength(20);
      entity.Property(e => e.Entidade).IsRequired().HasMaxLength(50);
      entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
      entity.Property(e => e.CorrelationId).HasMaxLength(50);

      entity.HasIndex(e => e.BatchId).IsUnique();
      entity.HasIndex(e => e.DataInicio);
      entity.HasIndex(e => e.Status);
      entity.HasIndex(e => e.Entidade);
    });

    modelBuilder.Entity<ETLBatchItem>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.ItemId).IsRequired().HasMaxLength(50);
      entity.Property(e => e.TipoItem).IsRequired().HasMaxLength(50);
      entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
      entity.Property(e => e.Operacao).IsRequired().HasMaxLength(20);

      entity.HasIndex(e => e.ETLBatchId);
      entity.HasIndex(e => e.Status);
      entity.HasIndex(e => e.DataInicio);

      entity.HasOne(e => e.ETLBatch)
            .WithMany(b => b.Itens)
            .HasForeignKey(e => e.ETLBatchId)
            .OnDelete(DeleteBehavior.Cascade);
    });


    modelBuilder.Entity<ETLMetrics>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Entidade).IsRequired().HasMaxLength(50);
      entity.Property(e => e.TipoExecucao).IsRequired().HasMaxLength(20);
      entity.Property(e => e.Status).IsRequired().HasMaxLength(20);

      entity.HasIndex(e => e.Entidade);
      entity.HasIndex(e => e.DataExecucao);
      entity.HasIndex(e => e.UltimaExecucao);
    });
  }
}