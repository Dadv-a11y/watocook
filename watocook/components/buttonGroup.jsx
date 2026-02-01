import React, { useState } from 'react';
import {  TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes } from '../constants/style';

/**
 * ButtonGroup
 * props:
 * - options: array of strings (labels)
 * - value / selectedIndex: controlled selected index
 * - onChange(index)
 * - initialIndex
 * - style
 */
export default function ButtonGroup({ options = [], value, selectedIndex, onChange, initialIndex = 0, style }) {
  const [internal, setInternal] = useState(initialIndex);
  const selected = typeof value === 'number' ? value : (typeof selectedIndex === 'number' ? selectedIndex : internal);

  function handlePress(i) {
    if (typeof value !== 'number' && typeof selectedIndex !== 'number') setInternal(i);
    onChange && onChange(i);
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.container, style]}>
      {options.map((opt, i) => {
        const active = i === selected;
        return (
          <TouchableOpacity
            key={`${opt}-${i}`}
            activeOpacity={0.9}
            onPress={() => handlePress(i)}
            style={[styles.button, active ? styles.buttonActive : styles.buttonInactive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.small / 2,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    boxShadow: '0px 8px 16px rgba(249, 57, 67, 0.18)',
    elevation: 8,
  },
  buttonInactive: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  text: {
    fontSize: FontSizes.medium,
    fontFamily: "Inter"
  },
  textActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  textInactive: {
    color: Colors.text,
    fontWeight: '400',
  },
});
