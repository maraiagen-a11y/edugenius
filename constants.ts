import { EducationLevel, Resource, Subject, UserPlan } from "./types";

export const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Ejercicios de Fracciones Básicas',
    description: 'Introducción a las sumas y restas de fracciones con el mismo denominador.',
    subject: Subject.MATH,
    level: EducationLevel.PRIMARY,
    type: 'PDF',
    downloads: 1240,
    isPremium: false
  },
  {
    id: '2',
    title: 'Análisis Sintáctico de Oraciones Simples',
    description: 'Guía completa y ejercicios prácticos para analizar oraciones simples.',
    subject: Subject.LANGUAGE,
    level: EducationLevel.ESO,
    type: 'PDF',
    downloads: 850,
    isPremium: false
  },
  {
    id: '3',
    title: 'Past Simple vs Present Perfect',
    description: 'Worksheet intensive focusing on irregular verbs and tense usage.',
    subject: Subject.ENGLISH,
    level: EducationLevel.ESO,
    type: 'PDF',
    downloads: 2100,
    isPremium: true
  },
  {
    id: '4',
    title: 'Derivadas e Integrales: Examen Tipo',
    description: 'Modelos de examen para preparación de selectividad.',
    subject: Subject.MATH,
    level: EducationLevel.BACHILLERATO,
    type: 'PDF',
    downloads: 540,
    isPremium: true
  },
  {
    id: '5',
    title: 'La Generación del 27',
    description: 'Resumen literario y análisis de poemas clave.',
    subject: Subject.LANGUAGE,
    level: EducationLevel.BACHILLERATO,
    type: 'DOC',
    downloads: 320,
    isPremium: true
  }
];

// --- LÍMITES DEL PLAN (ESTRATEGIA 4,99€) ---
export const PLAN_LIMITS = {
  [UserPlan.FREE]: {
    maxGenerations: 3,       // Bajamos a 3 para que prueben y quieran más
    maxResources: 5,         // Límite de guardado
    canExportPDF: false,     // <--- EL GANCHO: Ver sí, descargar no.
    maxHistory: 3
  },
  [UserPlan.PREMIUM]: {
    maxGenerations: 1000,    // "Ilimitado" real para humanos (seguro para ti)
    maxResources: 1000,      // Mucho espacio
    canExportPDF: true,      // Descarga permitida
    maxHistory: 1000
  }
};

// --- CONFIGURACIÓN DE LA APP Y PRECIOS ---
export const APP_CONFIG = {
    NAME: "EduGenius AI",
    CURRENCY: "€",
    PRICING: {
        MONTHLY: 4.99,       // Precio accesible (Ticket bajo)
        YEARLY: 49.00,       // 2 meses gratis si pagan el año
        SAVE_PERCENTAGE: 18  // Ahorro visible
    },
    SUPPORT_EMAIL: "soporte@edugenius.com"
};