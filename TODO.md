# TODO: Connect Recipe List to Backend and Apply Filters

- [x] Modify backend/api/suggest-recipes.js to use Spoonacular /findByIngredients API and return recipes
- [x] Update watocook/app/recipe-list.jsx:
  - [x] Add state for recipes, loading, appliedFilters
  - [x] Add useEffect to fetch recipes on mount or when ingredients change
  - [x] Implement applyFilters to set appliedFilters
  - [x] Create filteredRecipes useMemo to filter based on appliedFilters and selectedCategory
  - [x] Update FlatList to display filteredRecipes, mapping Spoonacular data to {id, title, time, image}
- [ ] Test the backend API
- [ ] Run the app and verify fetching and filtering
