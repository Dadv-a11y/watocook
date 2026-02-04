import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes } from '../constants/style';
import ButtonGroup from './buttonGroup';
import { Button } from './button';
import { X } from 'lucide-react-native';

export default function FilterModal({ visible, onClose, initialFilters = {}, onApply }) {
  const [timeIndex, setTimeIndex] = useState(initialFilters.timeIndex ?? 0);
  const [originIndex, setOriginIndex] = useState(initialFilters.originIndex ?? 0);
  const [categoryIndex, setCategoryIndex] = useState(initialFilters.categoryIndex ?? 0);
  const [customTime, setCustomTime] = useState(initialFilters.customTime ?? '');

  const timeOptions = ['< 15 min', '< 30 min', '< 1 hour', 'custom'];
  const originOptions = ['italian', 'asian', 'mediterranean', 'mexican'];
  const categoryOptions = ['Starter', 'Main course', 'Side dish', 'Dessert', 'Drink/Smoothie'];

  function handleApply() {
    onApply && onApply({ timeIndex, originIndex, categoryIndex, customTime });
    onClose && onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.close} onPress={onClose} accessibilityRole="button" aria-label='close filters'>
            <X color={Colors.text} size={20} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>filters</Text>

            <Text style={styles.sectionTitle}>Time</Text>
            <ButtonGroup options={timeOptions} onChange={setTimeIndex} initialIndex={timeIndex} />
            {timeOptions[timeIndex] === 'custom' && (
              <TextInput style={styles.customInput} placeholder="minutes" keyboardType="numeric" value={customTime} onChangeText={setCustomTime} />
            )}

            <Text style={styles.sectionTitle}>Origin</Text>
            <ButtonGroup options={originOptions} onChange={setOriginIndex} initialIndex={originIndex} />

            <Text style={styles.sectionTitle}>Category</Text>
            <ButtonGroup options={categoryOptions} onChange={setCategoryIndex} initialIndex={categoryIndex} />
          </ScrollView>
           <Button variant="primary" style={styles.apply} onPress={handleApply}>
              <Text style={styles.applyText}>apply filter</Text>
            </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: Spacing.large,
    paddingLeft: Spacing.large,
    paddingRight: Spacing.small,
    maxHeight: '85%',
  },
  close: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 10,
  },
  content: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lora',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.medium,
  },
  sectionTitle: {
    marginTop: Spacing.medium,
    marginBottom: 8,
    fontSize: 16,
    color: Colors.text,
  },
  customInput: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  apply: {
    alignSelf: 'center',
    width: '80%',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
  },
  applyText: {
    color: Colors.background,
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: FontSizes.large,
  },
});