import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, Share2, ChevronLeft,Check, AlarmClock, CookingPot } from 'lucide-react-native';
import Switch from '../components/switch';
import { Colors, Spacing, FontSizes } from '../constants/style';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [tab, setTab] = useState(0); // 0 = ingredient, 1 = procedure
  const [bookmarked, setBookmarked] = useState(false);
  const [ingredients, setIngredients] = useState(mockRecipe.ingredients);

  function toggleBookmark() {
    setBookmarked((b) => !b);
  }

  function toggleHave(i) {
    setIngredients((prev) => prev.map((it, idx) => (idx === i ? { ...it, have: !it.have } : it)));
  }

  function handleShare() {
    // simple fallback: use navigator.share on web or RN Share on native later
    try {
      // attempt to use the Web Share API if available
      if (global.navigator && global.navigator.share) {
        global.navigator.share({ title: mockRecipe.title, text: `Check this recipe: ${mockRecipe.title}` });
      }
    } catch (e) {
      console.log('share failed', e);
    }
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

          <Text style={styles.title}>{mockRecipe.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <AlarmClock color={Colors.icon} size={16} />
              <Text style={styles.metaText}>{mockRecipe.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <CookingPot color={Colors.icon} size={16} />
              <Text style={styles.metaText}>{mockRecipe.serves}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{mockRecipe.ingredients.length} ingredients</Text>
            </View>
          </View>

          {tab === 0 ? (
            <View style={styles.ingredientsList}>
              {ingredients.map((it, i) => (
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
              {mockRecipe.steps.map((s , i) => (
                <View key={s.id} style={styles.stepCard}>
                  <Text style={styles.stepTitle}>step {i+1}</Text>
                  <Text style={styles.stepText}>{s.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
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