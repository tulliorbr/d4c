SELECT COUNT(*) as TotalRegistros FROM MovimentosFinanceiros;

SELECT 
    MIN(DDtEmissao) as DataMaisAntiga,
    MAX(DDtEmissao) as DataMaisRecente,
    COUNT(*) as TotalRegistros
FROM MovimentosFinanceiros 
WHERE DDtEmissao IS NOT NULL;

SELECT 
    COUNT(DISTINCT CCodCateg) as CategoriasDistintas,
    COUNT(*) as TotalMovimentos
FROM MovimentosFinanceiros 
WHERE CCodCateg IS NOT NULL AND CCodCateg != '';

SELECT 
    COUNT(*) as RegistrosUltimos24Meses
FROM MovimentosFinanceiros 
WHERE DDtEmissao >= date('now', '-24 months');

SELECT 
    COUNT(*) as RegistrosUltimos12Meses
FROM MovimentosFinanceiros 
WHERE DDtEmissao >= date('now', '-12 months');