import React, { useState  , useEffect} from 'react';
import { View, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Pages/Home';
import StacksNavNewPlan from './Pages/StacksNavNewPlan';
import Sample from './Pages/Sample';
import LoginForm from './Logins/LoginForm';
import RegisterForm from './Logins/RegisterForm';
import axios from 'axios';


const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('http://192.168.29.253:3000/login', { email, password });

      if(response.status === 200)
        {

          await AsyncStorage.setItem('userEmail', email);
          setLoggedIn(true);

        }

      
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login error (e.g., show error message)
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await axios.post('http://192.168.29.253:3000/register', { email, password });
      // After successful registration, automatically log in
      await handleLogin(email, password);
    } catch (error) {
      console.error('Error registering:', error);
      // Handle registration error (e.g., show error message)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 10, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 1 }}>
        {!loggedIn ? (
          isRegistering ? (
            <RegisterForm onRegister={handleRegister} onToggle={() => setIsRegistering(false)} />
          ) : (
            <LoginForm onLogin={handleLogin} onToggle={() => setIsRegistering(true)} />
          )
        ) : (
          <NavigationContainer>
            <Drawer.Navigator>
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen
                name="Plan New trip"
                component={StacksNavNewPlan}
                options={{ headerShown: false, swipeEnabled: false }}
              />
              <Drawer.Screen name="Sample" component={Sample} />
            </Drawer.Navigator>
          </NavigationContainer>
        )}
      </View>
    </SafeAreaView>
  );
}

