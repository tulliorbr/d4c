using System.Text.Json.Serialization;
using System.Text.Json;

namespace d4cETL.Application.DTOs;

public class FlexibleStringConverter : JsonConverter<string?>
{
  public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
  {
    return reader.TokenType switch
    {
      JsonTokenType.String => reader.GetString(),
      JsonTokenType.Number => reader.TryGetInt64(out var longValue) ? longValue.ToString() : reader.GetDouble().ToString(),
      JsonTokenType.Null => null,
      _ => reader.GetString()
    };
  }

  public override void Write(Utf8JsonWriter writer, string? value, JsonSerializerOptions options)
  {
    writer.WriteStringValue(value);
  }
}

public class MovimentosFinanceirosResponse
{
  [JsonPropertyName("movimentos")]
  public MovimentoFinanceiroDto[] MovimentosFinanceiros { get; set; } = Array.Empty<MovimentoFinanceiroDto>();

  [JsonPropertyName("nTotPaginas")]
  public int TotalDePaginas { get; set; }

  [JsonPropertyName("nPagina")]
  public int Pagina { get; set; }

  [JsonPropertyName("nTotRegistros")]
  public int TotalDeRegistros { get; set; }

  [JsonPropertyName("nRegistros")]
  public int RegistrosPagina { get; set; }
}

public class CategoriasResponse
{
  [JsonPropertyName("categoria_cadastro")]
  public CategoriaDto[] CategoriaCadastro { get; set; } = Array.Empty<CategoriaDto>();

  [JsonPropertyName("total_de_paginas")]
  public int TotalDePaginas { get; set; }

  [JsonPropertyName("pagina")]
  public int Pagina { get; set; }

  [JsonPropertyName("total_de_registros")]
  public int TotalDeRegistros { get; set; }
}

public class MovimentoFinanceiroDto
{
  [JsonPropertyName("detalhes")]
  public DetalhesMovimentoDto? Detalhes { get; set; }
}

public class DetalhesMovimentoDto
{
  [JsonPropertyName("nCodTitulo")]
  [JsonConverter(typeof(FlexibleStringConverter))]
  public string? NCodTitulo { get; set; }

  [JsonPropertyName("cCodIntTitulo")]
  public string? CCodIntTitulo { get; set; }

  [JsonPropertyName("cNumTitulo")]
  public string? CNumTitulo { get; set; }

  [JsonPropertyName("dDtEmissao")]
  public string? DDtEmissao { get; set; }

  [JsonPropertyName("dDtVenc")]
  public string? DDtVenc { get; set; }

  [JsonPropertyName("dDtPrevisao")]
  public string? DDtPrevisao { get; set; }

  [JsonPropertyName("dDtPagamento")]
  public string? DDtPagamento { get; set; }

  [JsonPropertyName("nCodCliente")]
  public long NCodCliente { get; set; }

  [JsonPropertyName("cCPFCNPJCliente")]
  public string? CCPFCNPJCliente { get; set; }

  [JsonPropertyName("cStatus")]
  public string? CStatus { get; set; }

  [JsonPropertyName("cNatureza")]
  public string? CNatureza { get; set; }

  [JsonPropertyName("cTipo")]
  public string? CTipo { get; set; }

  [JsonPropertyName("cOperacao")]
  public string? COperacao { get; set; }

  [JsonPropertyName("cCodCateg")]
  public string? CCodCateg { get; set; }

  [JsonPropertyName("nValorTitulo")]
  public decimal NValorTitulo { get; set; }

  [JsonPropertyName("nValorPIS")]
  public decimal? NValorPIS { get; set; }

  [JsonPropertyName("nValorCOFINS")]
  public decimal? NValorCOFINS { get; set; }

  [JsonPropertyName("nValorCSLL")]
  public decimal? NValorCSLL { get; set; }

  [JsonPropertyName("nValorIR")]
  public decimal? NValorIR { get; set; }

  [JsonPropertyName("nValorISS")]
  public decimal? NValorISS { get; set; }

  [JsonPropertyName("nValorINSS")]
  public decimal? NValorINSS { get; set; }

  [JsonPropertyName("nCodTitRepet")]
  public long NCodTitRepet { get; set; }

  [JsonPropertyName("nCodCC")]
  public long NCodCC { get; set; }

  [JsonPropertyName("dDtRegistro")]
  public string? DDtRegistro { get; set; }

  [JsonPropertyName("cGrupo")]
  public string? CGrupo { get; set; }

  [JsonPropertyName("cNumParcela")]
  public string? CNumParcela { get; set; }

  [JsonPropertyName("cOrigem")]
  public string? COrigem { get; set; }
}

public class CategoriaDto
{
  [JsonPropertyName("codigo")]
  public string Codigo { get; set; } = string.Empty;

  [JsonPropertyName("descricao")]
  public string Descricao { get; set; } = string.Empty;

  [JsonPropertyName("descricao_padrao")]
  public string? DescricaoPadrao { get; set; }

  [JsonPropertyName("tipo_categoria")]
  public string? TipoCategoria { get; set; }

  [JsonPropertyName("conta_inativa")]
  public string? ContaInativa { get; set; }

  [JsonPropertyName("natureza")]
  public string? Natureza { get; set; }

  [JsonPropertyName("totalizadora")]
  public string? Totalizadora { get; set; }
}