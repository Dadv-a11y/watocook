import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {AlarmClock, Bookmark} from 'lucide-react-native';
import { Colors, FontSizes, Spacing } from '../constants/style';

export default function Card({
  image,
  title = '',
  time = '',
  initialBookmarked = false,
  onBookmarkChange,
  onPress,
  style,
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const router = useRouter();

  function toggleBookmark(e) {
    e.stopPropagation && e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next);
    onBookmarkChange && onBookmarkChange(next);
  }

  function handlePress() {
    if (onPress) return onPress();
    // fallback to route to recipe-detail (push without params)
    router.push('/recipe-detail');
  }

  return (
    <TouchableOpacity 
    activeOpacity={0.95}
    onPress={handlePress}
    style={[styles.container, style]}
    accessibilityRole='link'
    accessibilityLabel={`view the recipe of ${title}`}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
          <View style={styles.exploreOverlay} pointerEvents="none">
                    <View style={styles.exploreOverlayTop} />
                    <View style={styles.exploreOverlayBottom} />
                  </View>
        <TouchableOpacity onPress={toggleBookmark} style={styles.bookmark}  accessibilityLabel={bookmarked ? `Remove bookmark on ${title} ` : `add bookmark on ${title}`}>
         <Bookmark size={24} color={Colors.background} fill={bookmarked ? Colors.background : 'transparent'}/>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {time ? (
            <View style={styles.metaRow}>
              <AlarmClock size={16} color={Colors.background}/>
              <Text style={styles.metaText}>{time}</Text>
            </View>
          ) : null}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const CARD_HEIGHT = 160;
const BORDER_RADIUS = 8;

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    marginBottom: Spacing.large / 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    boxShadow: '0px 4px 8px rgba(9, 9, 9, 0.48)',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: CARD_HEIGHT,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: BORDER_RADIUS,
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: Spacing.medium,
  },
  title: {
    color: Colors.background,
    fontSize: FontSizes.large,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  metaText: {
    color: Colors.background,
    fontSize: FontSizes.small,
    fontFamily: 'Inter',
    fontWeight: '400'
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
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
});
