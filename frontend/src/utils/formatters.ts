// Utilitários de formatação para a aplicação

/**
 * Formata uma data para o formato brasileiro
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Formata uma data para o formato brasileiro simples (dd/mm/aaaa)
 */
export const formatDateSimple = (date: string | Date): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formata uma duração em milissegundos para formato legível
 */
export const formatDuration = (durationMs: number): string => {
  if (!durationMs || durationMs < 0) return '-';
  
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Formata um número para formato brasileiro
 */
export const formatNumber = (value: number): string => {
  if (value === null || value === undefined) return '-';
  
  return value.toLocaleString('pt-BR');
};

/**
 * Formata um valor monetário para formato brasileiro
 */
export const formatCurrency = (value: number): string => {
  if (value === null || value === undefined) return '-';
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

/**
 * Formata CPF/CNPJ
 */
export const formatCpfCnpj = (document: string): string => {
  if (!document) return '-';
  
  // Remove caracteres não numéricos
  const cleanDocument = document.replace(/\D/g, '');
  
  if (cleanDocument.length === 11) {
    // CPF: 000.000.000-00
    return cleanDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cleanDocument.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return cleanDocument.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return document; // Retorna original se não for CPF nem CNPJ
};

/**
 * Formata natureza do movimento
 */
export const formatNatureza = (natureza: string): string => {
  if (!natureza) return '-';
  
  const naturezaMap: Record<string, string> = {
    'R': 'Receita',
    'P': 'Pagamento'
  };
  
  return naturezaMap[natureza.toUpperCase()] || natureza;
};

/**
 * Formata uma porcentagem
 */
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return '-';
  
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Formata o status para exibição
 */
export const formatStatus = (status: string): string => {
  if (!status) return '-';
  
  const statusMap: Record<string, string> = {
    'pending': 'Pendente',
    'running': 'Executando',
    'completed': 'Concluído',
    'failed': 'Falhou',
    'cancelled': 'Cancelado',
    'success': 'Sucesso',
    'error': 'Erro',
    'processing': 'Processando'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Formata o tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Alias para formatFileSize (compatibilidade)
 */
export const formatBytes = formatFileSize;

/**
 * Trunca texto longo
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '-';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formata um ID para exibição
 */
export const formatId = (id: string | number): string => {
  if (!id) return '-';
  
  const idStr = id.toString();
  if (idStr.length <= 8) return idStr;
  
  return `${idStr.substring(0, 8)}...`;
};