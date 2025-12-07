export interface Maxim {
  id: number;
  month: string;
  title: string;
  translation: string;
  description: string;
  chineseDescription: string;
  imageUrl?: string;
  imageLoading?: boolean;
  imageFailed?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  maxims: Maxim[];
  groundingChunks: GroundingChunk[];
}