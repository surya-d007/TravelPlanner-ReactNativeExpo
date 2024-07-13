
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator , Text , Alert} from 'react-native';
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

const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);


  
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
    try {
      const email = await AsyncStorage.getItem('Email'); // Ensure the key 'Email' is correct
      if (email) {
        const response = await axios.post('http://192.168.29.253:3000/checkV', { email });
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
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('http://192.168.29.253:3000/login', { email, password });
      if (response.status === 200) {
        await AsyncStorage.setItem('Email', email); // Ensure the key 'Email' is consistent
        setLoggedIn(true);
      }
      console.log('Login response:', response.error);
    } catch (error) {
      console.error('Error logging in:', error.response.data);
      Alert.alert('Login Error',error.response.data.error);
      
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await axios.post('http://192.168.29.253:3000/register', { email, password });
      await handleLogin(email, password); // Automatically log in after registration
    } catch (error) {
      console.error('Error registering:', error);
    }
  };


  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post('http://192.168.29.253:3000/forgot-password', { email });
      if(response.status===200)
        Alert.alert('Success', 'Your Password has been sent to your email address');
    } catch (error) {
      console.error('Error sending password reset email:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Unable to send password reset email');
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
        {!loggedIn ? (
          isRegistering ? (
            <RegisterForm onRegister={handleRegister} onToggle={() => setIsRegistering(false)} />
          ) : (
            <LoginForm onLogin={handleLogin} onToggle={() => setIsRegistering(true)}   onForgotPassword={handleForgotPassword}   />
          )
        ) : (
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home">
                {(props) => <Home {...props}  />}
              </Drawer.Screen>
              <Drawer.Screen
                name="Plan New trip"
                component={StacksNavNewPlan}
                options={{ headerShown: false, swipeEnabled: false }}
              />
              
              <Drawer.Screen name="Sample" component={Sample} />
              <Drawer.Screen name="LogOut" >
              {(props) => <LogOut {...props} setLoggedIn={setLoggedIn} />}
              </Drawer.Screen>
            </Drawer.Navigator>
          </NavigationContainer>
        )}
      </View>
    </SafeAreaView>
  );
}
