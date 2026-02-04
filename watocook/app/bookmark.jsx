import  { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Filter, Search } from 'lucide-react-native';
import { Colors, FontSizes, Spacing } from '../constants/style';
import Card from '../components/card';
import ButtonGroup from '../components/buttonGroup';

const Bookmark = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - Spacing.medium * 2 - Spacing.small) / 2;

  // Sample data - replace with API data
  const [allRecipes] = useState([
    { id: '1', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '2', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '3', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '4', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '5', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '6', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
  ]);

  const [recipes, setRecipes] = useState(allRecipes);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [removedIds, setRemovedIds] = useState(new Set());
  const fadeAnimsRef = useRef({});
  const debounceTimerRef = useRef(null);

  const categories = ['breakfast', 'lunch', 'brunch', 'dinner'];

  // Initialize fade animations for all cards
  useEffect(() => {
    recipes.forEach((recipe) => {
      if (!fadeAnimsRef.current[recipe.id]) {
        fadeAnimsRef.current[recipe.id] = new Animated.Value(1);
      }
    });
  }, [recipes]);

  // Debounce function to send removed items to backend
  const sendRemovedToBackend = useCallback(() => {
    if (removedIds.size > 0) {
      console.log('Sending removed items to backend:', Array.from(removedIds));
      // Replace with actual API call:
      // await api.removeBookmarks(Array.from(removedIds));
      setRemovedIds(new Set());
    }
  }, [removedIds]);

  // Handle bookmark removal with debounce
  const handleBookmarkChange = useCallback(
    (recipeId, isBookmarked) => {
      if (!isBookmarked) {
        // Animate out the card
        Animated.timing(fadeAnimsRef.current[recipeId], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Add to removed set
        setRemovedIds((prev) => {
          const updated = new Set(prev);
          updated.add(recipeId);
          return updated;
        });

        // Remove from visible list after animation
        setTimeout(() => {
          setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        }, 300);

        // Debounce the backend call
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          sendRemovedToBackend();
        }, 2000);
      }
    },
    [sendRemovedToBackend]
  );

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderCard = ({ item }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnimsRef.current[item.id],
          width: cardWidth,
        },
      ]}
    >
      <Card
        image={item.image}
        title={item.title}
        time={item.time}
        initialBookmarked={true}
        onBookmarkChange={(isBookmarked) =>
          handleBookmarkChange(item.id, isBookmarked)
        }
      />
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>bookmark</Text>
        <Pressable hitSlop={8}>
          <Filter size={24} color={Colors.text} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Value"
          placeholderTextColor={Colors.icon}
          value={searchValue}
          onChangeText={setSearchValue}
        />
        <TouchableOpacity style={styles.searchIcon}>
         <Search size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ButtonGroup
        options={categories}
        selectedIndex={selectedCategory}
        onChange={setSelectedCategory}
        style={styles.categoryContainer}
      />

      {/* Recipes Grid */}
        <FlatList
          data={filteredRecipes}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
             () => (
          <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No bookmarks yet</Text>
          </View>
             )
          }
        />

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    paddingTop: Spacing.large,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontFamily: 'Lora',
    fontWeight: '700',
    color: Colors.text,
    fontStyle: 'italic',
  },
  searchContainer: {
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.medium,
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: Spacing.medium,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.text,
    fontSize: FontSizes.medium,
    color: Colors.text,
    outlineStyle: 'none',
  },
  searchIcon: {
    position: 'absolute',
    right: Spacing.medium,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  categoryContainer: {
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.large,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.medium,
    gap: Spacing.small,
  },
  listContent: {
    paddingBottom: Spacing.large,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.large,
    color: Colors.icon,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
});

export default Bookmark;