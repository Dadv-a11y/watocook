import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    // Extract video ID and platform
    let videoId, platform;
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      platform = 'youtube';
      const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      videoId = match ? match[1] : null;
    } else if (videoUrl.includes('tiktok.com')) {
      platform = 'tiktok';
      // TikTok URLs are more complex, extract video ID
      const match = videoUrl.match(/\/video\/(\d+)/);
      videoId = match ? match[1] : null;
    } else {
      return res.status(400).json({ error: 'Unsupported video platform' });
    }

    if (!videoId) {
      return res.status(400).json({ error: 'Invalid video URL' });
    }

    // Fetch video metadata (title, description)
    let metadata = {};
    if (platform === 'youtube') {
      const apiKey = process.env.YOUTUBE_API_KEY;
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
      const item = response.data.items[0];
      metadata = {
        title: item.snippet.title,
        description: item.snippet.description,
      };
    } else if (platform === 'tiktok') {
      // For TikTok, use a different approach or API
      // Placeholder: Assume we can fetch metadata via scraping or API
      metadata = { title: 'TikTok Video', description: 'Description not available' };
    }

    // Use Gemini to extract recipe information from metadata
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Extract recipe information from the following video title and description. Return as JSON with fields: title, ingredients (array), instructions (array), servings, prepTime, cookTime.

Title: ${metadata.title}
Description: ${metadata.description}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const recipe = JSON.parse(text);
    res.status(200).json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to extract recipe' });
  }
}
