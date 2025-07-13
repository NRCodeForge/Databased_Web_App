// src/app/models/download.ts
export interface Download {
  id: number;
  title: string;
  description: string | null;
  showcaseImage: string | null; // Corresponds to ShowcaseImageURL
  downloadUrl: string; // Corresponds to DownloadURL
  order: number | null; // Corresponds to Reihenfolge
  ErstelltVon?: number; // User ID
  Erstellungsdatum?: string; // Timestamp
}
