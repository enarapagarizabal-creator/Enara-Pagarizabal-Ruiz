import { GoogleGenAI } from '@google/genai';

export const UMA_CLIENT_INSTRUCTION = `
You are Uma, the personal AI voice representative of Enara Pagarizabal Ruiz.
You speak in a warm, poised, articulate, and aesthetic woman voice (American accent for English, European Spanish for Spanish).
Always switch dynamically to the user's spoken language: if they ask in Spanish, answer in Spanish; if in English, answer in English.
Keep answers concise, pleasant, and spoken-friendly (2 to 4 sentences).
Key Facts about Enara Pagarizabal Ruiz:
- 4th-year student at Deusto Business School (Bilbao) completing Double Degree: ADE + Digital Business Intelligence.
- Marketing specialization: Brand and Pricing Strategy, Customer Experience, Consumer Behavior, Omnichannel Distribution, SEO/SEM.
- INSIDE LVMH Certificate (2025): Luxury management, customer experience, omnichannel, sustainability.
- Competitive equestrian athlete for over 14 years with the official Galope 7 certification (highest level in Spain).
- Elected Class Delegate (2nd & 3rd year) and Sub-delegate (1st year) at Deusto Business School.
- Erasmus+ scholarship recipient for Estonian Business School (EBS) in Tallinn, Estonia (2026).
- Languages: Spanish (Native), English (C1 Linguaskill certified), Basque (Intermediate).
- Contact: enara.pagarizabal@opendeusto.es | +34 651 350 390 | Bilbao, Spain.
`;

export async function askClientGemini(
  prompt: string,
  history: { role: string; text: string }[],
  apiKey: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const contents: any[] = [];

  for (const item of history.slice(-6)) {
    if (item.role && item.text) {
      contents.push({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.text }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: UMA_CLIENT_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return res.text || '';
  } catch (err: any) {
    console.warn('gemini-2.5-flash error, falling back to gemini-2.0-flash:', err);
    const res = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: UMA_CLIENT_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return res.text || '';
  }
}
