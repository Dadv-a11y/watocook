import React from 'react';
import { StyleSheet, TextInput, View, Text } from "react-native";
import { Colors, FontSizes, Spacing } from "../constants/style";

export const Input = ({ style, label, error, leftIcon, rightIcon, iconStyle, ...props }) => {
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text> }

      <View style={[styles.inputWrapper, hasError && styles.inputWrapperError]}>
        {leftIcon ? <View style={[styles.iconLeft, iconStyle]}>{leftIcon}</View> : null}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.icon}
          {...props}
        />

        {rightIcon ? <View style={[styles.iconRight, iconStyle]}>{rightIcon}</View> : null}
      </View>

      {error && <Text style={styles.error}>{error}</Text> }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.medium / 2,
  },
  label: {
    fontSize: FontSizes.small,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: Colors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  inputWrapperError: {
    borderColor: Colors.primary,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  iconLeft: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: Colors.primary,
    marginTop: 4,
    fontSize: FontSizes.small,
  },
});