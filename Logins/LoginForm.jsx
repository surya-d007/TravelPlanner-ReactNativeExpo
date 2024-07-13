// LoginForm.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';

const LoginForm = ({ onLogin, onToggle, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onLogin(email, password);
  };

  const handleForgotPassword = async() => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    await onForgotPassword(email);
    setIsForgotPassword(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!isForgotPassword && (
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
      )}
      {!isForgotPassword ? (
        <>
          <Button title="Login" onPress={handleLogin} />
          <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
            <Text style={styles.toggleText}>Forgot Password?</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Button title="Reset Password" onPress={handleForgotPassword} />
          <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
            <Text style={styles.toggleText}>Back to Login</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={onToggle}>
        <Text style={styles.toggleText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  toggleText: {
    color: 'blue',
    marginTop: 20,
  },
});

export default LoginForm;
