import  { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Switch from '../components/switch';
import { Plus, Link, X , Camera, User, Bookmark, ChevronRight, Search, ChefHat } from 'lucide-react-native';
import { Button } from '../components/button';
import { Colors, FontSizes, Spacing } from '../constants/style';
import { useAuth } from '../contest/authContext';

const Home = () => {
  const router = useRouter();
  const [mode, setMode] = useState(0); // 0 = ingredient, 1 = video
  const {session} = useAuth();

  // Ingredients mode
  const [ingredientText, setIngredientText] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const inputRef = useRef(null);

  // Video mode
  const [videoLink, setVideoLink] = useState('');

  function handleCameraScan(){
    // TODO : add picture analyse to permit the user to scan their ingredient
  }

  function addIngredient() {
    const v = ingredientText.split(/[,;]/).map((s) => s.trim()).filter((s) => s.length > 0);
    if (!v || v.length === 0) return;
    setIngredients((prev) => [...prev, ...v]);
    setIngredientText('');
    inputRef.current && inputRef.current.focus();
  }

  function removeIngredient(i) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleFind() {
    if (mode === 0) {
      if (ingredients.length === 0) return;
      // pass ingredients as a param
      router.push({ pathname: '/recipe-list', params: { ingredients: JSON.stringify(ingredients) } });
    } else {
      if (!videoLink.trim()) return;
      router.push({ pathname: '/recipe-list', params: { video: videoLink.trim() } });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}>

      <View style={styles.headerRowTop}>
          <Text style={styles.brand}>watocook</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => !session ? router.push('/login') : router.push('/profile') } style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Open profile">
            <User color={Colors.text} size={20} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => !session ? router.push('/login') : router.push('/bookmark')} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Open bookmarks">
            <Bookmark color={Colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>what do you have{"\n"}in your kitchen ?</Text>
        <Text style={styles.description}>List your ingredients to see what you can cook right now, or paste the link to a video that inspires you</Text>

        <ImageBackground source={require('../assets/images/placeholder.png')} style={styles.exploreCard} resizeMode='cover'>
          <View style={styles.exploreOverlay} pointerEvents="none">
            <View style={styles.exploreOverlayTop} />
            <View style={styles.exploreOverlayBottom} />
          </View>

          <View style={styles.exploreContent}>
            <View style={styles.exploreTextWrap}>
              <Text style={styles.exploreTitle}>Explore all recipe</Text>
              <Text style={styles.exploreSubtitle}>No ingredients? No problem. Discover new dishes and save your favorites for later.</Text>
            </View>
            <TouchableOpacity style={styles.exploreArrow} onPress={() => router.push('/recipe-list')} accessibilityRole="button" accessibilityLabel="Explore all recipes">
              <ChevronRight color={Colors.background} size={20} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.switchRow}>
          <Switch options={["ingredient", "video"]} onChange={(i)=>setMode(i)} />
        </View>

        {mode === 0 ? (
          <View style={styles.formGroup}>
            <View style={styles.ingredientInputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.ingredientInput}
                placeholder="enter your ingredients( e.g. tomatoes, eggs, flour ... )"
                placeholderTextColor={Colors.icon}
                multiline
                numberOfLines={3}
                maxLength={200}
                onChangeText={setIngredientText}
                value={ingredientText}
                textAlignVertical="top"
                maxHeight={24 * 8}
              />

              <TouchableOpacity style={styles.plusButton} onPress={addIngredient} accessibilityLabel="Add ingredient">
                <Plus color={Colors.text} strokeWidth={1} size={24} />
              </TouchableOpacity>

               <TouchableOpacity style={styles.plusButton} onPress={handleCameraScan} accessibilityLabel="scan ingredient">
                 <Camera color={Colors.text} strokeWidth={1} size={24}/>
              </TouchableOpacity>
             
            </View>

            <View style={styles.chipsRow}>
              {ingredients.map((ing, i) => (
                <View key={`${ing}-${i}`} style={styles.chip}>
                  <Text style={styles.chipText}>{ing}</Text>
                  <TouchableOpacity 
                  onPress={()=>removeIngredient(i)} 
                  style={styles.chipClose} 
                  accessibilityRole="button"
                  AccessibilityLabel={`Remove ingredient ${ing}`}>
                    <Text style={styles.chipCloseText}>
                      <X color={Colors.icon} size={14} strokeWidth={2} />
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.formGroup}>
            <View style={styles.videoInputWrapper}>
               <View style={styles.linkIcon}>
                <Link color={Colors.text} size={20} />
              </View>
              <TextInput
                style={styles.videoInput}
                placeholder="paste your link here"
                placeholderTextColor={Colors.icon}
                onChangeText={setVideoLink}
                value={videoLink}
              />
            </View>
          </View>
        )}

        <Button variant="primary" style={[styles.cta, (!(mode === 0 ? ingredients.length > 0 : videoLink.trim())) && styles.ctaDisabled]} onPress={handleFind}>
          <Search color={Colors.background} size={18} strokeWidth={4}/>
          <Text style={styles.ctaText}>look for a recipe</Text>
        </Button>

        <View style={styles.warningWrap}>
           <ChefHat color={Colors.icon} size={20} style={{ alignSelf: 'center' , marginRight: 8}} />
          <Text style={styles.warningText}>
           Enjoy your cooking, and <Text style={styles.bonAppetitText}> bon appétit!</Text>
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRowTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.medium / 2,
    paddingBottom: Spacing.small,
  },
  brand: {
    fontFamily: 'Lora',
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: 24,
    color: Colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.large,
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    color: Colors.text,
  },
  description: {
    textAlign: 'center',
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: Colors.icon,
    marginBottom: 18,
    lineHeight: 20,
  },
  exploreCard: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  exploreOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  exploreOverlayTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  exploreOverlayBottom: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  exploreContent: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  exploreTextWrap: {
    flex: 1,
  },
  exploreTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  exploreSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  exploreArrow: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    marginBottom: 18,
  },
  formGroup: {
    marginTop: 6,
    marginBottom: 32,
  },
  ingredientInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: 'transparent',
  },
  ingredientInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 24 * 8,
    paddingRight: 10,
    paddingTop: 6,
    color: Colors.text,
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    fontWeight: '400',
    outlineStyle: 'none',
  },
  plusButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.icon,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginTop: 8,
    backgroundColor: Colors.background,
  },
  chipText: {
    color: Colors.icon,
    marginRight: 8,
  },
  chipClose: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chipCloseText: {
    color: Colors.icon,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  videoInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
  },
  videoInput: {
    flex: 1,
    color: Colors.text,
    outlineStyle: 'none',
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  linkIcon: {
    marginLeft: 4,
    marginRight: 12,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 12,
    boxShadow: `0 4px 4px 0px rgba(0, 0, 0, 0.25)`,
  },
  ctaText: {
    color: Colors.background,
    fontSize: FontSizes.large,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  warningWrap:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  warningText:{
    fontFamily: 'Inter',
    fontSize: FontSizes.small, 
    color: Colors.icon, 
    textAlign: 'center', 
    lineHeight: 16 ,
    alignContent: 'center'
  },
  bonAppetitText:{
    fontFamily: 'Lora', 
    fontStyle: 'italic',
    fontWeight: '700', 
    color: Colors.text
  }
});

export default Home;