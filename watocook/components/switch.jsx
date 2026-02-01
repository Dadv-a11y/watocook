import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors, FontSizes} from '../constants/style';

const SEGMENT_PADDING = 4;
const DEFAULT_HEIGHT = 40;

/**
 * Switch Component
 * 
 * A customizable segmented control component that allows users to toggle between multiple options.
 * Features smooth animated transitions between selected segments using React Native's Animated API.
 * 
 * @component
 * @example
 * const [selected, setSelected] = useState(0);
 * return (
 *   <Switch
 *     options={['ingredient', 'video']}
 *     initialIndex={0}
 *     onChange={(index) => setSelected(index)}
 *   />
 * )
 * 
 * @param {Object} props - Component props
 * @param {string[]} [props.options=['ingredient', 'video']] - Array of option labels to display
 * @param {number} [props.initialIndex=0] - The initially selected option index
 * @param {Function} [props.onChange] - Callback function triggered when selection changes, receives the selected index
 * @param {Object} [props.style] - Custom style object to override default container styles
 * 
 * @returns {React.ReactElement} A touchable segmented control with animated knob indicator
 */
export default function Switch({
  options = ['ingredient', 'video'],
  initialIndex = 0,
  onChange,
  style,
}) {
  const [index, setIndex] = useState(initialIndex);
  const [width, setWidth] = useState(0);
  const translate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (width === 0) return;
    const target = index * (width / 2);
    Animated.spring(translate, {
      toValue: target,
      useNativeDriver: true,
      stiffness: 200,
      damping: 20,
    }).start();
  }, [index, width, translate]);

  function handlePress(i) {
    setIndex(i);
    onChange && onChange(i);
  }

  // rendered knob width is slightly smaller than half so there's a small border visible
  const knobWidth = width ? width / 2 - SEGMENT_PADDING * 2 : 0;

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {/* Animated knob */}
      {width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.knob,
            {
              width: knobWidth,
              transform: [{ translateX: translate }],
            },
          ]}
        />
      )}

      {/* Options (touch areas) */}
      <View style={styles.row}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={opt + i}
            activeOpacity={0.8}
            style={styles.optionWrapper}
            onPress={() => handlePress(i)}
            accessibilityRole="tab"
            accessibilityState={{ selected: i === index }}
          >
            <Text style={[styles.label, i === index ? styles.labelActive : null]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: DEFAULT_HEIGHT / 2,
    padding: SEGMENT_PADDING,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: DEFAULT_HEIGHT - SEGMENT_PADDING * 2,
  },
  label: {
    color: Colors.text,
    fontSize: FontSizes.medium,
    fontFamily: 'Inter'
  },
  labelActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  knob: {
    position: 'absolute',
    left: SEGMENT_PADDING,
    top: SEGMENT_PADDING,
    bottom: SEGMENT_PADDING,
    backgroundColor: Colors.primary,
    borderRadius: (DEFAULT_HEIGHT - SEGMENT_PADDING * 2) / 2,
    boxShadow: '0px 0px 12px rgba(249, 57, 67, 0.18)',
    elevation: 6,
  },
});