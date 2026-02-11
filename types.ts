export enum UserPlan {
  FREE = 'free',
  PREMIUM = 'premium'
}

export enum EducationLevel {
  PRIMARY = 'Primaria',
  SECONDARY = 'Secundaria',
  BACHILLERATO = 'Bachillerato',
  UNIVERSITY = 'Universidad'
}

export enum Subject {
  MATH = 'Matemáticas',
  SCIENCE = 'Ciencias',
  HISTORY = 'Historia',
  LANGUAGE = 'Lengua',
  ENGLISH = 'Inglés',
  PROGRAMMING = 'Programación'
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  generatedCount: number;
  role?: string;
}

// --- AÑADIDO: Interfaz para los Recursos (Fichas) ---
export interface Resource {
  id: string;
  user_id: string;      // Vital para saber quién es el dueño
  title: string;
  content: string;
  created_at: string;
  type: string;
  is_public?: boolean;  // Nuevo: Para la Galería Pública
  description?: string; // Nuevo: Opcional
}

export interface WorksheetResponse {
  content: string;
  metadata?: {
    difficulty: string;
    estimatedTime: string;
    topics: string[];
  };
}