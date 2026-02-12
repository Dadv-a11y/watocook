import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/style';

const Toast = ({ message, type, visible, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => onHide());
        }, 3000);
      });
    }
  }, [visible, slideAnim, onHide]);

  if (!visible) return null;

  const backgroundColor = type === 'error' ? '#ff4444' : type === 'warn' ? '#ffaa00' : '#4444ff';
  const textColor = '#ffffff';

  return (
    <Animated.View style={[styles.toast, { backgroundColor, transform: [{ translateY: slideAnim }] }]}>
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    padding: 15,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});

export default Toast;
