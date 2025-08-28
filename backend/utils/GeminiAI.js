const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model configuration
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// System instruction: Medical chatbot
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig,
  systemInstruction: `
    You are an AI medical assistant providing advice on general health conditions, symptoms, treatments, and preventive care.
    Your responses should be concise, informative, and medically sound, but always remind users to consult a healthcare professional for critical concerns.

    Key areas of expertise:
    - General health & wellness
    - Common illnesses and symptoms
    - Preventive care and lifestyle tips
    - First-aid and emergency guidance
    - Mental health support

    Avoid providing medication prescriptions or diagnosing serious conditions. Always suggest consulting a doctor for proper evaluation.
  `,
});

// Function to get response from Gemini AI
async function getMedicalResponse(input) {
  const chat = model.startChat();

  const response = await chat.sendMessage(`${input}`);

  const markdownText = response.response.text();

  console.log(markdownText);
  const jsonMatch = markdownText.match(/json\s*(.*?)\s*/s);
  
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  } else {
    return markdownText; // Return plain text if no JSON format detected
  }
}

module.exports = { getMedicalResponse };