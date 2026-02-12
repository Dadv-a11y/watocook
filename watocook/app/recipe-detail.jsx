import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Bookmark, Share2, ChevronLeft,Check, AlarmClock, CookingPot } from 'lucide-react-native';
import Switch from '../components/switch';
import { Colors, Spacing, FontSizes } from '../constants/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from '../components/toast';

const mockRecipe = {
  title: 'jollof rice',
  time: '10 min',
  serves: '1 serve',
  ingredients: [
    { name: 'ingredient 1', qty: '200 g', have: true },
    { name: 'ingredient 2', qty: '200 g', have: false },
    { name: 'ingredient 3', qty: '200 g', have: false },
    { name: 'ingredient 4', qty: '200 g', have: false },
    { name: 'ingredient 5', qty: '200 g', have: true },
    { name: 'ingredient 6', qty: '200 g', have: false },
  ],
  steps: [
    { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod' },
    { id: 2, text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip' },
    { id: 3, text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip' },
  ],
  image: require('../assets/images/placeholder.png'),
};

const RecipeDetail = () => {
  const router = useRouter();
  const { recipeId, video } = useLocalSearchParams();
  const [tab, setTab] = useState(0); // 0 = ingredient, 1 = procedure
  const [bookmarked, setBookmarked] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredientsState, setIngredientsState] = useState([]);
  const [toast , setToast] = useState({ visible: false, message: '', type: 'info' })

  useEffect(() => {
    const fetchRecipe = async () => {
      if (video) {
        try {
          const response = await fetch('/api/extract-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl: video })
          });
          if (!response.ok) {
            setToast({ visible: true, message: 'Failed to extract recipe from video', type: 'error' });
            setRecipe(mockRecipe);
            setIngredientsState(mockRecipe.ingredients);
            setLoading(false);
            return;
          }
          const data = await response.json();
          const rawRecipe = data.recipe;
          const transformedRecipe = {
            title: rawRecipe.title,
            time: `${rawRecipe.prepTime || '0 min'} prep + ${rawRecipe.cookTime || '0 min'} cook`,
            serves: `${rawRecipe.servings || 1} serve${(rawRecipe.servings || 1) > 1 ? 's' : ''}`,
            ingredients: rawRecipe.ingredients.map(ing => {
              const parts = ing.split(' ');
              const qty = parts[0];
              const name = parts.slice(1).join(' ');
              return { name, qty, have: false };
            }),
            steps: rawRecipe.instructions.map((text, index) => ({ id: index + 1, text })),
            image: require('../assets/images/placeholder.png')
          };
          setRecipe(transformedRecipe);
          setIngredientsState(transformedRecipe.ingredients);
        } catch (err) {
          setToast({ visible: true, message: err.message, type: 'error' });
          setRecipe(mockRecipe);
          setIngredientsState(mockRecipe.ingredients);
        } finally {
          setLoading(false);
        }
      } else if (recipeId) {
        try {
          const response = await fetch(`/api/get-recipe?recipeId=${recipeId}`);
          if (!response.ok) {
            setToast({ visible: true, message: 'Failed to fetch recipe', type: 'error' });
          }
          const data = await response.json();
          setRecipe(data.recipe);
          setIngredientsState(data.recipe.ingredients);
        } catch (err) {
          setToast({ visible: true, message: err.message, type: 'error' });
          setRecipe(mockRecipe); // Fallback to mock data
          setIngredientsState(mockRecipe.ingredients);
        } finally {
          setLoading(false);
        }
      } else {
        setRecipe(mockRecipe);
        setIngredientsState(mockRecipe.ingredients);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, video]);

  function toggleBookmark() {
    setBookmarked((b) => !b);
  }

  function toggleHave(i) {
   setIngredientsState((prev) => prev.map((it, idx) => (idx === i ? { ...it, have: !it.have } : it)));
  }

  function handleShare() {
    // simple fallback: use navigator.share on web or RN Share on native later
    try {
      // attempt to use the Web Share API if available
      if (global.navigator && global.navigator.share) {
        const title = recipe ? recipe.title : mockRecipe.title;
        global.navigator.share({ title, text: `Check this recipe: ${title}` });
      }
    } catch (e) {
      console.log('share failed', e);
    }
  }

   if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground source={mockRecipe.image} style={styles.header} imageStyle={styles.headerImage}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.icon} accessibilityRole="button">
              <ChevronLeft color={Colors.background} size={22} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleBookmark} style={styles.icon} accessibilityRole="button" accessibilityLabel={bookmarked ? `Remove bookmark on ${mockRecipe.title} ` : `add bookmark on ${mockRecipe.title}`}>
                <Bookmark color={Colors.background} size={20} fill={bookmarked ? Colors.background : 'transparent'}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShare} style={styles.icon} accessibilityRole="button" accessibilityLabel={`Share ${mockRecipe.title} recipe`}>
                <Share2 color={Colors.background} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.switchWrap}>
            <Switch options={["ingredient", "procedure"]} onChange={(i) => setTab(i)} />
          </View>

          <Text style={styles.title}>{recipe ? recipe.title : mockRecipe.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <AlarmClock color={Colors.icon} size={16} />
              <Text style={styles.metaText}>{recipe ? recipe.time : mockRecipe.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <CookingPot color={Colors.icon} size={16} />
              <Text style={styles.metaText}>{recipe ? recipe.serves : mockRecipe.serves}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{ingredientsState.length} ingredients</Text>
            </View>
          </View>

          {tab === 0 ? (
            <View style={styles.ingredientsList}>
              {ingredientsState.map((it, i) => (
                <TouchableOpacity key={i} style={styles.ingredientRow} onPress={() => toggleHave(i)} accessibilityRole="button" accessibilityLabel={it.have ? `you have ${it.name}. click if you don't` : `you don't have ${it.name}. click if you have it`}>
                  <Text style={styles.ingredientName}>{it.name}</Text>
                  <View style={styles.ingredientRight}>
                    <Text style={styles.ingredientQty}>{it.qty}</Text>
                    {it.have ? <Check color={Colors.text} size={20} /> : <View style={styles.emptySpace} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.steps}>
              {(recipe ? recipe.steps : mockRecipe.steps).map((s , i) => (
                <View key={s.id} style={styles.stepCard}>
                  <Text style={styles.stepTitle}>step {i+1}</Text>
                  <Text style={styles.stepText}>{s.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
         <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
      </ScrollView>
    </SafeAreaView>
  );
};

const HEADER_HEIGHT = 220;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
  },
  headerImage: {
    resizeMode: 'cover',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.medium,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.medium,
  },
  switchWrap: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Lora',
    fontWeight : 700 ,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    marginLeft: 6,
    color: Colors.icon,
  },
  ingredientsList: {},
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  ingredientName: {
    fontSize: FontSizes.medium,
    fontFamily: "Inter",
    fontWeight: 400 ,
    color: Colors.text,
  },
  ingredientRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientQty: {
    color: Colors.icon,
    marginRight: 8,
  },
  emptySpace: {
    width: 18,
    height: 18,
  },
  steps: {
    marginTop: 6,
  },
  stepCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: "0 4 8 rgba(0, 0, 0, 0.06)",
    elevation: 2,
  },
  stepTitle: {
    fontFamily: "Inter",
    fontWeight: '700',
    marginBottom: 6,
  },
  stepText: {
    fontFamily: 'Inter',
    fontSize: FontSizes.medium,
    fontWeight: 400 ,
    color: '#444',
    lineHeight: 18,
  },
});

export default RecipeDetail;