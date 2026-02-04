import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react-native';
import Input from '../components/input';
import { Button } from '../components/button';
import { Colors, FontSizes, Spacing } from '../constants/style';

const Register = () => {
  const router = useRouter();
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', accepted: false },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    if (!data.accepted) {
      // set an error on accepted - react-hook-form full control could setError but keep simple
      alert('You must accept terms and conditions');
      return;
    }

    // proceed with registration (API call etc.)
    console.log('register', data);
    router.push('/login');
  };

  const passwordValue = watch('password');

  return (
    <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>create an account</Text>

        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'the name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              leftIcon={<User color={Colors.icon} size={18} />}
              placeholder="enter name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: 'the email is required', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'invalid email' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              leftIcon={<Mail color={Colors.icon} size={18} />}
              placeholder="enter email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />

        <Text style={styles.label}>password</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'the password is required', minLength: { value: 6, message: 'minimum 6 characters' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              leftIcon={<Lock color={Colors.icon} size={18} />}
              rightIcon={<TouchableOpacity onPress={() => setShowPassword((s) => !s)}>{showPassword ? <EyeOff color={Colors.icon} size={18} /> : <Eye color={Colors.icon} size={18} />}</TouchableOpacity>}
              placeholder="enter password"
              secureTextEntry={!showPassword}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: 'this fill field', validate: (v) => v === passwordValue || 'passwords do not match' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              leftIcon={<Lock color={Colors.icon} size={18} />}
              rightIcon={<TouchableOpacity onPress={() => setShowPassword((s) => !s)}>{showPassword ? <EyeOff color={Colors.icon} size={18} /> : <Eye color={Colors.icon} size={18} />}</TouchableOpacity>}
              placeholder="retype password"
              secureTextEntry={!showPassword}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="accepted"
          rules={{ validate: (v) => v === true || 'You must accept terms' }}
          render={({ field: { value, onChange } }) => (
            <TouchableOpacity style={styles.acceptRow} onPress={() => onChange(!value)} accessibilityRole="checkbox" accessibilityState={{ checked: !!value }}>
              <View style={[styles.checkbox, value && styles.checkboxChecked]}>{value ? <Check color={Colors.text} stroke={2} fontSize={8}/>: null}</View>
              <View style={styles.acceptTextWrap}>
                <Text style={styles.acceptTitle}>accept terms and conditions</Text>
                <Text style={styles.acceptDesc}>Description</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {errors.accepted && <Text style={styles.fieldError}>{errors.accepted?.message}</Text>}

        <Button variant="primary" style={styles.cta} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.ctaText}>Sign up</Text>
        </Button>

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <Button variant="secondary" style={styles.googleBtn} onPress={() => {}}>
          <Text style={styles.googleText}>Sign in with GOOGLE</Text>
        </Button>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.large,
    paddingTop: Spacing.large,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Lora',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.medium,
    color: Colors.text,
  },
  label: {
    marginTop: 6,
    marginBottom: 8,
    color: Colors.text,
  },
  acceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.text,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.text,
  },
  acceptTitle: {
    fontWeight: '700',
  },
  acceptDesc: {
    color: Colors.icon,
    fontSize: 12,
  },
  cta: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 10,
  },
  ctaText: {
    color: Colors.background,
    fontFamily: 'Inter',
    fontSize: FontSizes.large,
    fontWeight: '600',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 12,
    color: '#999',
  },
  googleBtn: {
    paddingVertical: 12,
    borderRadius: 10,
  },
  googleText: {
    fontFamily: 'Inter',
    fontSize: FontSizes.medium,
    color: Colors.text,
    fontWeight: '600',
  },
  fieldError: {
    color: Colors.primary,
    fontFamily: 'Inter',
    fontSize: FontSizes.small,
    fontWeight: '400',
    marginTop: 4,
  },
});

export default Register;