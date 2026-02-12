import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams} from 'expo-router';
import { ChevronLeft, Sliders } from 'lucide-react-native';
import { Colors, Spacing, FontSizes } from '../constants/style';
import ButtonGroup from '../components/buttonGroup';
import Card from '../components/card';
import FilterModal from '../components/FilterModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const RecipeList = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const categories = ['breakfast', 'lunch', 'brunch', 'dinner'];
  const [selectedCategory, setSelectedCategory] = useState(0);

  const filters = useMemo(() => ({
    ingredients: params.ingredients ? JSON.parse(params?.ingredients) : undefined,
  }), [params]);

  useEffect(() => {
    if (filters.ingredients) {
      fetchRecipes();
    }
  }, [filters.ingredients]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/suggest-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: filters.ingredients }),
      });
      const data = await response.json();
      const mappedRecipes = data.recipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        time: `${Math.floor(recipe.readyInMinutes / 60)} h ${recipe.readyInMinutes % 60} min`,
        image: { uri: recipe.image },
        readyInMinutes: recipe.readyInMinutes,
        cuisines: recipe.cuisines,
        dishTypes: recipe.dishTypes,
      }));
      setRecipes(mappedRecipes);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by time
    if (appliedFilters.timeIndex !== undefined) {
      const timeOptions = ['< 15 min', '< 30 min', '< 1 hour', 'custom'];
      const selectedTime = timeOptions[appliedFilters.timeIndex];
      if (selectedTime === '< 15 min') {
        filtered = filtered.filter(r => r.readyInMinutes < 15);
      } else if (selectedTime === '< 30 min') {
        filtered = filtered.filter(r => r.readyInMinutes < 30);
      } else if (selectedTime === '< 1 hour') {
        filtered = filtered.filter(r => r.readyInMinutes < 60);
      } else if (selectedTime === 'custom' && appliedFilters.customTime) {
        filtered = filtered.filter(r => r.readyInMinutes <= parseInt(appliedFilters.customTime));
      }
    }

    // Filter by origin (cuisines)
    if (appliedFilters.originIndex !== undefined) {
      const originOptions = ['italian', 'asian', 'mediterranean', 'mexican'];
      const selectedOrigin = originOptions[appliedFilters.originIndex];
      filtered = filtered.filter(r => r.cuisines.some(c => c.toLowerCase().includes(selectedOrigin)));
    }

    // Filter by category (dishTypes)
    if (appliedFilters.categoryIndex !== undefined) {
      const categoryOptions = ['Starter', 'Main course', 'Side dish', 'Dessert', 'Drink/Smoothie'];
      const selectedCategoryFilter = categoryOptions[appliedFilters.categoryIndex].toLowerCase();
      filtered = filtered.filter(r => r.dishTypes.some(d => d.toLowerCase().includes(selectedCategoryFilter)));
    }

    // Filter by selected category (breakfast, lunch, etc.) - map to dishTypes
    const categoryMappings = {
      breakfast: ['breakfast', 'brunch'],
      lunch: ['lunch', 'main course'],
      brunch: ['brunch', 'breakfast'],
      dinner: ['dinner', 'main course'],
    };
    const selectedCategoryName = categories[selectedCategory];
    const mappedTypes = categoryMappings[selectedCategoryName] || [];
    filtered = filtered.filter(r => r.dishTypes.some(d => mappedTypes.some(m => d.toLowerCase().includes(m))));

    return filtered;
  }, [recipes, appliedFilters, selectedCategory]);

  function handleBack() {
    router.back();
  }

  function openFilters() {
    setShowFilters(true);
  }

  function applyFilters(values) {
    setAppliedFilters(values);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconBtn} accessibilityRole="button">
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>recipes</Text>

        <TouchableOpacity onPress={openFilters} style={styles.iconBtn} accessibilityRole="button">
          <Sliders color={Colors.text} size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.chipsRow}>
        <ButtonGroup options={categories} onChange={setSelectedCategory} initialIndex={selectedCategory} />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.text} />
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.column}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <Card image={item.image} title={item.title} time={item.time} onPress={()=>{router.push({
                  pathname: '/recipe-detail',
                  params: { id: item.id}
              })}}/>
            </View>
          )}
        />
      )}

      <FilterModal visible={showFilters} onClose={() => setShowFilters(false)} onApply={applyFilters} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.medium,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontSize: FontSizes.xlarge,
    fontWeight: '700',
  },
  chipsRow: {
    marginBottom: Spacing.medium,
    marginLeft: Spacing.large,
    paddingRight: Spacing.small,
  },
  list: {
    paddingBottom: 120,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  cardWrap: {
    width: '48%',
  },
});

export default RecipeList;