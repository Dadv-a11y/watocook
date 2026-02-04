import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Filter, ChevronRight, Search } from 'lucide-react-native';
import { Colors, FontSizes, Spacing } from '../constants/style';
import Card from '../components/card';
import ButtonGroup from '../components/buttonGroup';
import FilterModal from '../components/FilterModal';

const Recipes = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - Spacing.medium * 2 - Spacing.small) / 2;

  // Sample data - replace with API data
  const sampleRecipes = [
    { id: '1', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '2', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '3', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
    { id: '4', title: 'Jollof rice', time: '1h', image: require('../assets/images/placeholder.png') },
  ];

  const recipeSections = [
    { title: 'recently view', data: sampleRecipes.slice(0, 2) },
    { title: 'breakfast', data: sampleRecipes.slice(0, 2) },
    { title: 'lunch', data: sampleRecipes.slice(2, 4) },
  ];

  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({});

  const categories = ['breakfast', 'lunch', 'brunch', 'dinner'];

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    console.log('Filters applied:', appliedFilters);
    // Replace with actual API call with filters
  };

  const renderSection = ({ item: section }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Pressable onPress={()=>{router.push({pathname:'/recipe-list' , params: {ingredients: JSON.stringify(filters?.ingredients), categories: JSON.stringify(categories)}})}} hitSlop={8}>
          <View style={styles.moreButton}>
            <Text style={styles.moreText}>More</Text>
            <ChevronRight size={16} color={Colors.text} />
          </View>
        </Pressable>
      </View>
      <View style={styles.row}>
        {section.data.map((recipe) => (
          <View key={recipe.id} style={{ width: cardWidth }}>
            <Card
              image={recipe.image}
              title={recipe.title}
              time={recipe.time}
              onBookmarkChange={(isBookmarked) => {
                console.log(`${recipe.title} bookmarked: ${isBookmarked}`);
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.title}>recipes</Text>
          <Pressable onPress={() => setFilterModalVisible(true)} hitSlop={8}>
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
          <Search size={20} color={Colors.icon} style={styles.searchIcon} />
        </View>

        {/* Category Filter */}
        <ButtonGroup
          options={categories}
          selectedIndex={selectedCategory}
          onChange={setSelectedCategory}
          style={styles.categoryContainer}
        />

        {/* Recipe Sections */}
        <FlatList
          data={recipeSections}
          renderItem={renderSection}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
    </KeyboardAvoidingView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        initialFilters={filters}
        onApply={handleApplyFilters}
      />
    </>
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
    paddingRight: 45,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontFamily: 'Inter',
    fontSize: FontSizes.medium,
    color: Colors.text,
    outlineStyle: 'none',
  },
  searchIcon: {
    position: 'absolute',
    right: Spacing.medium + 10,
    top: 14,
  },
  categoryContainer: {
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.large,
  },
  section: {
    marginBottom: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontFamily: 'Lora',
    fontWeight: '700',
    color: Colors.text,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreText: {
    fontFamily: 'Inter',
    fontSize: FontSizes.medium,
    fontWeight: '400',
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.small,
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: Spacing.large,
  },
});

export default Recipes;
