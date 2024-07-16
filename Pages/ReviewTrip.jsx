import React, { useEffect, useState , useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ScrollView, Linking, Vibration, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ReviewTripCard from '../Components/ReviewTripCard';

SplashScreen.preventAutoHideAsync();

const ReviewTrip = ({ route , navigation}) => {
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [timer, setTimer] = useState(0); // State for countdown timer
  const [userEmail, setUserEmail] = useState('');

  const scrollViewRef = useRef(null); 

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('Email');
        if (storedEmail !== null) {
          setUserEmail(storedEmail);
          console.log('User Email:', userEmail);
        } else {
          console.log('No email found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to fetch the email from AsyncStorage:', error);
      }
    };

    fetchEmail();
  }, []);

  const { tripData, img1, img2, imgInServer1, imgInServer2 } = route.params;

  useEffect(() => {
    console.log('Trip Data from Review:', JSON.stringify(tripData, null, 2));
    console.log(imgInServer1 + " " + imgInServer2);
  }, [tripData]);

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

  if (!fontsLoaded) {
    return null;
  }

  const formattedDate = new Date(tripData.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    Vibration.vibrate(15); // Vibrate for 15ms
    setIsPressed(true);
  };

  const GenerateReport = async () => {

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0 });
    }

    setIsPressed(false);
    setIsLoading(true); // Start loading

    // Start a timer that updates every second
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    try {
      const apiUrl = 'http://192.168.29.253/api/GenerateReport'; // Replace with your server URL
      const response = await axios.post(apiUrl, {
        userId: 'sury007',
        tripData,
        img1,
        img2,
        imgInServer1,
        imgInServer2,
        userEmail,
      });

      console.log('Server Response:', response.data);
      console.log('Server Response:', response);

      if (response.status === 200) {
        await Linking.openURL(response.data.location);
      }

      setIsLoading(false); // Stop loading
      setTimer(0);
      clearInterval(interval); // Stop the timer interval
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error sending data:', error.message);
      setIsLoading(false); // Stop loading on error
      clearInterval(interval); // Stop the timer interval
      setTimer(0);
    }
  };

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <View className='flex-1 px-2 bg-[#fafcff]'>
        <View className='px-5'>
          <View>
            <Text className='my-3 mt-10' style={[styles.popsemi, { fontSize: 20 }]}>
              Trip / Tour Name : <Text style={[styles.popsemi, { color: '#888A83' }]}> {tripData.tripName}</Text>
            </Text>
            <Text className='mt-7' style={[styles.popsemi, { fontSize: 18 }]}>
              Country Name : <Text style={[styles.popsemi, { color: '#888A83' }]}> {tripData.countryName}</Text>
            </Text>
            <Text className='mt-4' style={[styles.popsemi, { fontSize: 18 }]}>
              Trip starting Date : <Text style={[styles.popsemi, { color: '#888A83' }]}> {formattedDate} </Text>
            </Text>
          </View>

          <View className='flex flex-row flex-wrap mt-2'>
            <View className='basis-1/2 pr-2 mt-5'>
              <Text style={[styles.popsemi, { fontSize: 18 }]}>No of days : <Text style={[styles.popsemi, { color: '#888A83' }]}> {tripData.days.length} </Text></Text>
            </View>
            <View className='basis-1/2 pl-2 mt-5'>
              <Text style={[styles.popsemi, { fontSize: 18 }]}>No of Nights : <Text style={[styles.popsemi, { color: '#888A83' }]}> {tripData.numNights}</Text></Text>
            </View>
            <View className='basis-1/2 pr-2 mt-5'>
              <Text style={[styles.popsemi, { fontSize: 18 }]}>No of people : <Text style={[styles.popsemi, { color: '#888A83' }]}>{tripData.numPeople}</Text></Text>
            </View>
          </View>

          </View>
       </View>
       

       <View className='flex-1  bg-[#fafcff] pb-4'>
          {tripData.days.map((day, index) => (
            <ReviewTripCard key={index} day={day} />
          ))}
        </View>

        <View className='flex-1 px-2 bg-[#fafcff]'>
          <View className='bg-[#fafcff] my-6'>
            <Text style={[styles.popsemi, { fontSize: 18 }]} className='mb-6'>Travel-to tickets : </Text>
            <View className='flex-1 items-center justify-center'>
              <View className='border rounded-lg mb-6 bg-white'>
                <Image source={{ uri: img1 }} style={{ height: 300, width: 300 }} className='rounded-lg' />
              </View>
            </View>
            <Text style={[styles.popsemi, { fontSize: 18 }]} className='mb-6'>Travel-back tickets : </Text>
            <View className='flex-1 items-center justify-center'>
              <View className='border rounded-lg mb-6 bg-white'>
                <Image source={{ uri: img2 }} style={{ height: 300, width: 300 }} className='rounded-lg' />
              </View>
            </View>
          </View>

          <Pressable onPressIn={handlePressIn} onPressOut={GenerateReport} className='mb-10'>
            <View className='items-end my-5 mt-6 mr-3'>
              <View className='flex flex-row gap-x-2 items-center justify-center h-12 w-48 rounded-2xl border-[0.2px] bg-white' style={[styles.card, isPressed && styles.cardPressed]}>
                <View>
                  <Text className='text-base' style={[styles.popsemi, isPressed && styles.text]}>Generate Report >></Text>
                </View>
              </View>
            </View>
          </Pressable>
          </View>

       

      {/* Conditional overlay view */}
      {isLoading && (
        <View style={styles.overlay} >
          <View style={styles.modal}>
          <Text style={styles.timer}>It might take up to 60 sec</Text>
            <ActivityIndicator size='large' color='#0000ff' />
            <Text style={styles.timer}>Timer : {timer}</Text>
            
          </View>
        </View>
      )}

    </ScrollView>
  );
};

export default ReviewTrip;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
  },
  popreg: {
    fontFamily: 'Poppins-Regular',
  },
  popsemi: {
    fontFamily: 'Poppins-SemiBold',
  },
  cardPressed: {
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-start",
    
  },
  
  modal: {
    backgroundColor: 'white',
    marginTop : 150,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 24,
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
  },
});
