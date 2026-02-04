import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { HELPLINES } from "../data/helplines";
import { AIAnalysisResponse } from "../types";

// API ključ povlačimo iz sustava
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeCrisisInput(userInput: string): Promise<AIAnalysisResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // OVDJE SU IZMJENE S .OBJECT, .ARRAY i .STRING
    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        priorityNumbers: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "ID-ovi preporučenih službi iz dostavljene liste."
        },
        exercise: {
          type: SchemaType.STRING,
          description: "Kratka vježba prve pomoći (disanje, uzemljenje)."
        },
        empatheticMessage: {
          type: SchemaType.STRING,
          description: "Topla poruka podrške za korisnika."
        }
      },
      required: ["priorityNumbers", "exercise", "empatheticMessage"]
    };

    const prompt = `
      Ti si stručnjak za krizne situacije u Hrvatskoj. 
      Korisnik piše: "${userInput}"
      
      Zadatak:
      1. Analiziraj stanje i odaberi najrelevantnije službe iz ove liste: ${JSON.stringify(HELPLINES)}.
      2. Predloži kratku vježbu prve pomoći.
      3. Pošalji toplu poruku podrške.
      
      Uvjet: Ako detektiraš ozbiljan rizik od samoozljeđivanja ili nasilja, 
      prioritetni broj mora biti ID službe Hitna Pomoć (5) ili Policija (6).
      Odgovaraj isključivo na hrvatskom jeziku.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText) as AIAnalysisResponse;

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      priorityNumbers: ["5"],
      exercise: "Pokušajte polako udahnuti na nos 4 sekunde, zadržati dah i polako izdahnuti.",
      empatheticMessage: "Žao mi je što prolazite kroz ovo. Molim vas, obratite se stručnoj osobi."
    };
  }
}