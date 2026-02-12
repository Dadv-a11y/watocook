import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipeId } = req.query;

  if (!recipeId) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);

    const data = response.data;

    // Format the data to match the frontend structure
    const recipe = {
      title: data.title,
      time: `${data.readyInMinutes} min`,
      serves: `${data.servings} serve${data.servings > 1 ? 's' : ''}`,
      ingredients: data.extendedIngredients.map(ing => ({
        name: ing.name,
        qty: `${ing.amount} ${ing.unit}`,
        have: false // Default to false, frontend will manage
      })),
      steps: data.analyzedInstructions.length > 0
        ? data.analyzedInstructions[0].steps.map((step, index) => ({
            id: index + 1,
            text: step.step
          }))
        : [],
      image: data.image
    };

    res.status(200).json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
}
