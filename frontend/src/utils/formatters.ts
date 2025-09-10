
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
    second: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
};


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


export const formatNumber = (value: number): string => {
  if (value === null || value === undefined) return '-';

  return value.toLocaleString('pt-BR');
};


export const formatCurrency = (value: number): string => {
  if (value === null || value === undefined) return '-';

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};


export const formatNatureza = (natureza: string): string => {
  if (!natureza) return '-';

  const naturezaMap: Record<string, string> = {
    'R': 'Receita',
    'P': 'Pagamento'
  };

  return naturezaMap[natureza.toUpperCase()] || natureza;
};

export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return '-';

  return `${(value * 100).toFixed(2)}%`;
};

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

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatBytes = formatFileSize;

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '-';

  if (text.length <= maxLength) return text;

  return `${text.substring(0, maxLength)}...`;
};

export const formatId = (id: string | number): string => {
  if (!id) return '-';

  const idStr = id.toString();
  if (idStr.length <= 8) return idStr;

  return `${idStr.substring(0, 8)}...`;
};