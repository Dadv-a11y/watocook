import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, LoaderIcon } from 'lucide-react-native';
import {Input} from '../components/input';
import { Button } from '../components/button';
import { Colors, FontSizes, Spacing } from '../constants/style';
import Toast from '../components/toast';
import { useAuth } from '../contest/authContext';

const Login = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '', password: '' } });
  const [showPassword, setShowPassword] = useState(false);
  const { isloading , signIn , googelSignIn , error } = useAuth();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  useEffect(() => {
    if (error && error.visible) {
      setToast(error);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>hello,</Text>
        <Text style={styles.sub}>ready to cook ?</Text>

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

        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'the password is required' }}
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

        <Button variant="primary" style={styles.cta} onPress={handleSubmit(async(data)=>{signIn(data.email , data.password)})} disabled={isloading}>
          {
          isloading && <LoaderIcon size={16} className="mr-2" />
          }
          <Text style={styles.ctaText}>
          {
            isloading ? 'Signing in...' : 'Sign in'
          }
          </Text>
        </Button>

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <Button variant="secondary" style={styles.googleBtn} onPress={() => googelSignIn()} disabled={isloading}>
          <Text style={styles.googleText}>Sign in with GOOGLE</Text>
        </Button>

        <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />

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
    marginBottom: 4,
    color: Colors.text,
  },
  sub: {
    color: Colors.text,
    fontFamily: 'Inter',
    fontSize: FontSizes.medium,
    fontWeight: '400',
    marginBottom: Spacing.medium,
  },
  label: {
    marginTop: 6,
    marginBottom: 8,
    color: Colors.text,
  },
  cta: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Login;