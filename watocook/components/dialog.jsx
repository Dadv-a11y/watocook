import { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '../constants/style';

const Dialog = ({ visible = false, onClose, onConfirm, title, description, icon: IconComponent, cancelText = 'Cancel', confirmText = 'Confirm', confirmColor = '#ff3b30' }) => {
  const [slideAnim] = useState(new Animated.Value(200));

  const handleConfirm = () => {
    onConfirm?.(true);
    handleClose();
  };

  const handleCancel = () => {
    onConfirm?.(false);
    handleClose();
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };

  const animateUp = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  if (visible) {
    setTimeout(animateUp, 100);
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose} />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.dialog}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#333" />
          </Pressable>

          {IconComponent && (
            <View style={styles.iconContainer}>
              <IconComponent size={32} color="#ff3b30" />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton, { backgroundColor: confirmColor }]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dialog: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffe0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: Colors.icon,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: Colors.text,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: Colors.background,
  },
});

export default Dialog;
