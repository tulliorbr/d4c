using d4cETL.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;

namespace d4cETL.Infrastructure.Data;

public class OmieETLContext : DbContext
{
  public OmieETLContext(DbContextOptions<OmieETLContext> options) : base(options)
  {
  }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    if (!optionsBuilder.IsConfigured)
    {
      optionsBuilder.UseSqlite("Data Source=d4cetl.db;Mode=ReadWriteCreate;Cache=Shared;Foreign Keys=True");
    }
    
    optionsBuilder.EnableServiceProviderCaching();
    optionsBuilder.EnableSensitiveDataLogging(false);
  }

  public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
  {
    var maxRetries = 3;
    var delay = TimeSpan.FromMilliseconds(100);
    
    for (int attempt = 0; attempt < maxRetries; attempt++)
    {
      try
      {
        return await base.SaveChangesAsync(cancellationToken);
      }
      catch (DbUpdateException ex) when (ex.InnerException is SqliteException sqliteEx && sqliteEx.SqliteErrorCode == 5)
      {
        if (attempt == maxRetries - 1) throw;
        
        await Task.Delay(delay * (attempt + 1), cancellationToken);
      }
    }
    
    return 0;
  }

  public DbSet<MovimentoFinanceiro> MovimentosFinanceiros { get; set; }
  public DbSet<Categoria> Categorias { get; set; }

  public DbSet<ETLBatch> ETLBatches { get; set; }
  public DbSet<ETLBatchItem> ETLBatchItems { get; set; }
  public DbSet<ETLMetrics> ETLMetrics { get; set; }
  public DbSet<ExecutionHistory> ExecutionHistories { get; set; }

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

    modelBuilder.Entity<ExecutionHistory>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
      entity.Property(e => e.Endpoint).IsRequired().HasMaxLength(100);
      entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
      entity.Property(e => e.ErrorMessage).HasMaxLength(1000);

      entity.HasIndex(e => e.Type);
      entity.HasIndex(e => e.Endpoint);
      entity.HasIndex(e => e.IsSuccess);
      entity.HasIndex(e => e.Status);
      entity.HasIndex(e => e.StartTime);
      entity.HasIndex(e => e.CreatedAt);
    });
  }
}