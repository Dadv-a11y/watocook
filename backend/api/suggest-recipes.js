import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients array is required' });
  }

  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const ingredientsString = ingredients.join(',');
    const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredientsString}&number=10&ranking=1`);

    const recipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      cuisines: recipe.cuisines || [],
      dishTypes: recipe.dishTypes || []
    }));

    res.status(200).json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
}
