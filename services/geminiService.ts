import { GoogleGenerativeAI } from "@google/generative-ai";
import { EducationLevel, Subject, WorksheetResponse } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Inicializamos la IA.
const genAI = new GoogleGenerativeAI(API_KEY || "");

interface GenerateParams {
  subject: Subject;
  level: EducationLevel;
  topic: string;
  exerciseCount: number;
  instructions?: string;
}

export const generateWorksheet = async (params: GenerateParams): Promise<WorksheetResponse> => {
  
  if (!API_KEY) {
    console.error("❌ FALTA API KEY: Revisa tu archivo .env.local");
    throw new Error("Falta la API Key de Gemini. Configúrala para continuar.");
  }

  try {
    // ✅ RESTAURADO: Usamos la versión que tú indicaste
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // --- PROMPT OPTIMIZADO PARA TU VISUALIZADOR A4 ---
    const prompt = `
      Actúa como un profesor experto y crea una ficha educativa visual y limpia en MARKDOWN.
      
      DATOS DE LA FICHA:
      - Asignatura: ${params.subject}
      - Nivel: ${params.level}
      - Tema: ${params.topic}
      - Cantidad de ejercicios: ${params.exerciseCount}
      - Instrucciones extra: ${params.instructions || "Ninguna"}

      REGLAS DE FORMATO (ESTRICTO):
      1. 🚫 NO uses LaTeX ni signos de dólar ($). Escribe las fórmulas en texto simple (ej: "x al cuadrado", "3/4").
      2. 🚫 NO uses bloques de código (\`\`\`). Devuelve el Markdown puro directamente.
      3. Usa Emojis para hacer la ficha amigable y visual.
      4. Usa líneas horizontales (---) para separar secciones claramente.

      ESTRUCTURA OBLIGATORIA DE LA RESPUESTA:
      
      # ${params.topic}
      
      > 💡 **Resumen Rápido**:
      > (Explica el concepto en 2-3 líneas sencillas adaptadas a nivel ${params.level}).
      
      ---

      ## 🧠 Ejemplo Resuelto
      (Pon un ejemplo paso a paso muy claro usando texto simple).

      ---

      ## ✍️ Ejercicios Prácticos
      (Genera exactamente ${params.exerciseCount} ejercicios. Usa una lista numerada).
      1. [Ejercicio 1] __________
      2. [Ejercicio 2] __________
      ...

      ---
      
      ### ✅ Soluciones (Para el profesor)
      (Pon las respuestas aquí abajo en cursiva y letra pequeña).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      // Mantenemos esto si lo necesitas para tu interfaz, si no, puedes borrarlo
      metadata: {
        difficulty: "Adaptable",
        estimatedTime: "20 min",
        topics: [params.topic]
      }
    };

  } catch (error) {
    console.error("Error conectando con Gemini:", error);
    throw new Error("No se pudo generar la ficha. Verifica tu conexión o API Key.");
  }
};