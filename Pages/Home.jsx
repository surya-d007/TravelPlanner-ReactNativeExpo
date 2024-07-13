import React, { useEffect, useState } from 'react';
import { View, ScrollView, Button, StyleSheet, Text, Image, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeTripCard from '../Components/HomeTripCard';
import ButtonCom from '../Components/ButtonCom';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

import Img from '../assets/trip.png';
import WorldImg from '../assets/world.png';

const Home = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);



  const fetchUserData = async () => {
    try {
      console.log('hi1');
      const userEmail = await AsyncStorage.getItem('Email');
      const response = await fetch('http://192.168.29.253:3000/getUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        console.error('Failed to fetch user data:', response.status);
        return;
      }

      const data = await response.json();
      setTrips(data.trips || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
      setIsRefreshing(false); // Set refreshing to false after fetch completes
    }
  };

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

  useEffect(() => {
    console.log("hi");
    fetchUserData();
  }, []);

  // Use useFocusEffect to fetch data on screen focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true); // Set refreshing to true when refreshing starts
    fetchUserData(); // Fetch user data again
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#fafcff' , paddingBottom : 30 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']} // Color of the refresh indicator
          />
        }
      >
        <View className='h-48'>
          {trips.length === 0 ? (
            <View className='justify-center items-center'>
              <Image
                source={Img}
                className='h-[50vw] w-[60vw] mt-10'
              />
            </View>
          ) : (
            <Image
              source={WorldImg}
              style={[styles.flipHorizontal]}
              className='h-[50vw] w-[90vw] mt-6'
              resizeMode="contain"
            />
          )}
        </View>

        <View style={{ height: 52 }} className='flex flex-row-reverse h-40'>
          <View style={{ paddingHorizontal: 5 }} className='pr-0 pt-10'>
            <ButtonCom navigation={navigation} />
          </View>
        </View>

        {trips.length === 0 ? (
          <View className='justify-center items-center'>
            <Text className='px-4 mt-40 text-center' style={[styles.popsemi, { fontSize: 20 }]}>- - - - -  No Trips  - - - - - </Text>
          </View>
        ) : (
          <View style={{ }}>
            <Text className='mt-20 ml-5' style={[styles.popsemi, { fontSize: 20 }]}>Your latest created Trips :</Text>
            {trips.reverse().map((trip, index) => (
              <HomeTripCard key={index} trip={trip} />
            ))}
          </View>
        )}

        
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  popreg: {
    fontFamily: 'Poppins-Regular',
  },
  popsemi: {
    fontFamily: 'Poppins-SemiBold',
  },
  flipHorizontal: {
    transform: [{ scaleX: -1 }],
  },
});
