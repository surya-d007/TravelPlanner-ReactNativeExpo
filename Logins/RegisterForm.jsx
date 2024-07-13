// RegisterForm.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';

const RegisterForm = ({ onRegister, onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onRegister(email, password);
  };

  return (
    <View style={styles.container}>
      <Text  style={[styles.toggleText , {fontSize:27}]}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
      

      <TouchableOpacity
            style={styles.loginButton}
            onPress={handleRegister}
          >
            <Text style={styles.loginButtonText}>
            Register
            </Text>
          </TouchableOpacity>


      <TouchableOpacity onPress={onToggle}>
        <Text style={styles.toggleText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fafcff',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    width: '100%',
    backgroundColor: "#fff",
    height: 50,
    fontSize: 18,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  loginButton: {
    height: 45,
    paddingHorizontal: 30,
    backgroundColor: 'black',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
      
  },
  toggleText: {
    fontSize:14,
    marginTop: 20,
    fontFamily: 'Poppins-SemiBold',
  },
});


export default RegisterForm;
