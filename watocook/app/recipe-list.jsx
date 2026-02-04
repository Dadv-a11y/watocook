import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams} from 'expo-router';
import { ChevronLeft, Sliders } from 'lucide-react-native';
import { Colors, Spacing, FontSizes } from '../constants/style';
import ButtonGroup from '../components/buttonGroup';
import Card from '../components/card';
import FilterModal from '../components/FilterModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const mock = new Array(6).fill(0).map((_, i) => ({ id: i, title: 'jollof rice', time: '1 h', image: require('../assets/images/placeholder.png') }));

const RecipeList = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['breakfast', 'lunch', 'brunch', 'dinner'];
  const [selectedCategory, setSelectedCategory] = useState(0);

  const filters = useMemo(() => ({
    ingredients: params.ingredients ? JSON.parse(params?.ingredients) : undefined,
    video: params.video,
  }), [params]);

  function handleBack() {
    router.back();
  }

  function openFilters() {
    setShowFilters(true);
  }

  function applyFilters(values) {
    // TODO: apply the filter values to your search / state.
    // For now we just close modal and log to console.
    console.log('applied filters', values);
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

      <FlatList
        data={mock}
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