/** 
 * Converte uma string em um slug amigável para URL 
 * @param text - Texto a ser convertido 
 * @returns Slug amigável para URL 
 */ 
export const createSlug = (text: string): string => { 
  return text 
    .toLowerCase() 
    .normalize('NFD') // Normaliza caracteres acentuados 
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos 
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais 
    .trim() 
    .replace(/\s+/g, '-') // Substitui espaços por hífens 
    .replace(/-+/g, '-') // Remove hífens duplicados 
    .replace(/^-|-$/g, ''); // Remove hífens do início e fim 
}; 

/** 
 * Gera uma URL amigável para um carro 
 * @param carTitle - Título do carro 
 * @param carId - ID do carro 
 * @param includeId - Se deve incluir o ID na URL (padrão: false) 
 * @returns URL amigável no formato /galeria/nome-do-carro ou /galeria/nome-do-carro/id 
 */ 
export const generateCarUrl = (carTitle: string, carId: string, includeId: boolean = false): string => { 
  const slug = createSlug(carTitle); 
  return includeId ? `/galeria/${slug}/${carId}` : `/galeria/${slug}`; 
}; 

/** 
 * Gera uma URL única para um carro incluindo timestamp para garantir unicidade 
 * @param carTitle - Título do carro 
 * @param carId - ID do carro 
 * @returns URL amigável única no formato /galeria/nome-do-carro-timestamp 
 */ 
export const generateUniqueCarUrl = (carTitle: string, carId: string): string => { 
  const slug = createSlug(carTitle); 
  // Usar os últimos 8 caracteres do ID como identificador único 
  const uniqueId = carId.slice(-8); 
  return `/galeria/${slug}-${uniqueId}`; 
}; 

/** 
 * Extrai o ID do carro de uma URL amigável 
 * @param url - URL no formato /galeria/nome-do-carro/id 
 * @returns ID do carro ou null se não encontrado 
 */ 
export const extractCarIdFromUrl = (url: string): string | null => { 
  const match = url.match(/\/galeria\/[^/]+\/([^/]+)$/); 
  return match ? match[1] : null; 
};

export const generateCarLink = (carTitle: string, carId: string): string => {
  const baseUrl = "https://carronamidia.vercel.app";
  const externalLink = `${baseUrl}${generateUniqueCarUrl(carTitle, carId)}`;
  return externalLink;
};