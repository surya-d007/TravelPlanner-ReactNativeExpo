import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Pages/Home';
import StacksNavNewPlan from './Pages/StacksNavNewPlan';
import Sample from './Pages/Sample';
import LoginForm from './Logins/LoginForm';
import RegisterForm from './Logins/RegisterForm';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
import axios from 'axios';
import LogOut from './Components/LogOut';
import ChangePassword from './Components/ChangePassword';

const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    console.log('App mounted');
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    setIsLoading(true);
    try {
      const email = await AsyncStorage.getItem('Email');
      if (email) {
        const response = await axios.post('http://192.168.29.253/checkV', { email });
        console.log('Email found: ' + email);
        if (response.status === 200) {
          setLoggedIn(true);
          console.log('Login status checked:', email);
        } else {
          await AsyncStorage.removeItem('Email');
          setLoggedIn(false);
          console.log('Email verification failed');
        }
      } else {
        setLoggedIn(false);
        console.log('No email found');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setLoggedIn(false);
    } finally {
      setLoading(false);
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.29.253/login', { email, password });
      if (response.status === 200) {
        await AsyncStorage.setItem('Email', email);
        setLoggedIn(true);
      }
      console.log('Login response:', response.error);
    } catch (error) {
      console.error('Error logging in:', error.response.data);
      Alert.alert('Login Error', error.response.data.error);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const handleRegister = async (email, password) => {
    if (password.length < 8) {
      Alert.alert('Registration Error', 'Password must be at least 8 characters long.');
      return; // Exit the function early if validation fails
    }
    setIsLoading(true);
    try {
      await axios.post('http://192.168.29.253/register', { email, password });
      await handleLogin(email, password); // Automatically log in after registration
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const handleForgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.29.253/forgot-password', { email });
      if (response.status === 200) {
        Alert.alert('Success', 'Your Password has been sent to your email address');
      }
    } catch (error) {
      console.error('Error sending password reset email:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Unable to send password reset email ${error.response.data.error}`);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 10, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 1 }}>
        {isLoading ? ( // Display ActivityIndicator if isLoading is true
          <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        ) : !loggedIn ? (
          isRegistering ? (
            <RegisterForm onRegister={handleRegister} onToggle={() => setIsRegistering(false)} />
          ) : (
            <LoginForm onLogin={handleLogin} onToggle={() => setIsRegistering(true)} onForgotPassword={handleForgotPassword} />
          )
        ) : (
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home">
                {(props) => <Home {...props} />}
              </Drawer.Screen>
              <Drawer.Screen
                name="Plan New trip"
                component={StacksNavNewPlan}
                options={{ headerShown: false, swipeEnabled: false }}
              />
              <Drawer.Screen name="Sample" component={Sample} />
              <Drawer.Screen name="LogOut">
                {(props) => <LogOut {...props} setLoggedIn={setLoggedIn} />}
              </Drawer.Screen>
              <Drawer.Screen name="ChangePassword" component={ChangePassword} />
            </Drawer.Navigator>
          </NavigationContainer>
        )}
      </View>
    </SafeAreaView>
  );
}
