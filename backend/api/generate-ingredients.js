import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Image is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = "Extract the list of ingredients from this image of foods or recipe. Return as a JSON array of strings.";
    const imageData = {
      inlineData: {
        data: image.split(',')[1], // Remove data:image/jpeg;base64, prefix
        mimeType: 'image/jpeg'
      }
    };
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    // Parse the response as JSON
    const ingredients = JSON.parse(text);
    res.status(200).json({ ingredients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate ingredients' });
  }
}
