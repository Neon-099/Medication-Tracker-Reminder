const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY  ;

// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

//const GEMINI_URL =
  //`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const GROK_URL = 'https://api.x.ai/v1/chat/completions';

const SYSTEM_PROMPT = "Transcribe the text from this prescription label exactly as it appears, line by line. Do not add markdown formatting, explanations, or conversational filler. Just return the raw text found on the label.";

// const SYSTEM_PROMPT = `
// You are an OCR extraction engine.

// Extract the prescription label and return ONLY valid JSON in this exact shape:
// {
//   "patient_name": string | null,
//   "medication_name": string | null,
//   "dosage": string | null,
//   "frequency": string | null,
//   "prescribing_doctor": string | null,
//   "pharmacy_name": string | null,
//   "raw_text": string
// }

// Rules:
// - Preserve original wording
// - Do not guess missing fields
// - Do not add explanations
// - No markdown
// `;


async function analyzeWithGemini(base64Data: string, mimeType: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: SYSTEM_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Gemini API Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function analyzeWithGrok(fullDataUrl: string): Promise<string> {
  if (!GROK_API_KEY) throw new Error('Grok API key not configured');

  const response = await fetch(GROK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-2-vision-1212",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            { 
              type: "image_url", 
              image_url: { url: fullDataUrl } 
            }
          ]
        }
      ],
      stream: false
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Grok API Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    return content.map(c => c.text ?? '').join('');
  }

  return content ?? '';
}

export const analyzeImage = async (base64Image: string): Promise<string> => {
  // Extract pure base64 and mime type
  const matches = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  const mimeType = matches ? matches[1] : 'image/jpeg';
  const content = matches ? matches[2] : base64Image.replace(/^data:image\/\w+;base64,/, '');

  try {
    // 1. Try Gemini
    console.log('Attempting analysis with Gemini...');
    return await analyzeWithGemini(content, mimeType);
  } catch (geminiError) {
    console.warn('Gemini failed, falling back to Grok:', geminiError);
    
    // 2. Try Grok Fallback
    if (GROK_API_KEY) {
      console.log('Attempting analysis with Grok...');
      return await analyzeWithGrok(base64Image); // Grok needs full data URL
    }
    
    throw geminiError;
  }
};