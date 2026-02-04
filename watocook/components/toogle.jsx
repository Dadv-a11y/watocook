import { useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import {Colors} from '../constants/style';

const Toggle = ({ initialValue = false, onValueChange }) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const handlePress = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onValueChange?.(newValue);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.container, isEnabled && styles.enabled]}>
        <View style={[styles.circle, isEnabled && styles.circleEnabled]} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  enabled: {
    backgroundColor: Colors.primary,
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
  },
  circleEnabled: {
    alignSelf: 'flex-end',
    transitionProperty: 'transform',
    transitionDuration: '200ms',
  },
});

export default Toggle;
