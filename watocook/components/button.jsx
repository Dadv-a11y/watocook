import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Colors, FontSizes } from "../constants/style";

export const Button = ({ children, onPress, variant,style, props }) => {

  const v = variant || 'primary';

  const content = (typeof children === 'string' || typeof children === 'number')
    ? <Text style={[styles.text, v === 'primary' ? styles.primaryText : styles.secondaryText]}>{children}</Text>
    : children;

  return (
    <TouchableOpacity
      style={[styles.button, v === 'primary' ? styles.primary : styles.secondary, style]}
      onPress={onPress}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
  },
  primary: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    elevation: 2,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.12)',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.text,
  },
  text: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    fontFamily: 'Inter'
  },
  primaryText: {
    color: Colors.background,
  },
  secondaryText: {
    color: Colors.text,
  }
})