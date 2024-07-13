import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const LoginForm = ({ onLogin, onToggle, onForgotPassword }) => {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    await onForgotPassword(email);
    setIsForgotPassword(false);
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner while fonts are loading
  }

  return (

  
    <View style={styles.container}>
        <View>
    {!isForgotPassword ? (
      <Text  style={[styles.toggleText , {fontSize:27}]}>Login</Text>
    ) : (
      <Text  style={[styles.toggleText , {fontSize:27}]}>Forgot password</Text>
    )}
    </View>

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
          autoCapitalize='none' 
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
      )}

      {!isForgotPassword ? (
        <>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
            <Text style={styles.toggleText}>Forgot Password?</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleForgotPassword} 
          >
            <Text style={styles.loginButtonText}>
            Reset Password
            </Text>
          </TouchableOpacity>


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

export default LoginForm;
