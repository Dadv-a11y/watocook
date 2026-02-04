import { ImageBackground, View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, Spacing } from '../constants/style';
import { Button } from '../components/button';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding = () => {
  const router = useRouter();

  function handleStart() {
    router.push('/home');
  }

  return (
    <ImageBackground source={require('../assets/images/onboarding.png')} style={styles.bg} resizeMode="cover">
        
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Image source={require('../assets/logo.svg')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brand}>watocook</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title}>Cook without{"\n"}stress, using what{"\n"}you have on hand</Text>

          <Button variant="primary" style={styles.cta} onPress={handleStart}>
            <Text style={styles.ctaText}>let&apos;s cook</Text>
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
    backgroundColor : 'rgba(0,0,0,0.4)',
  },
  center: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 90,
    height: 90,
  },
  brand: {
    color: Colors.background,
    fontFamily: 'Lora',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    color: Colors.background,
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontSize: 36,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: FontSizes.xlarge,
    lineHeight: 36,
    paddingHorizontal: 12,
    textShadow : '0px 2px 8px rgba(0,0,0,0.6)',
  },
  cta: {
    width: '85%',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    boxShadow: '0px 0px 12px rgba(249, 57, 67, 0.7)',
  },
  ctaText: {
    color: Colors.background,
    fontFamily: 'Inter',
    fontSize: FontSizes.large,
    fontWeight: '700',
  },
});

export default Onboarding;