import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput,Image, FlatList, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Button, ScrollView , Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

SplashScreen.preventAutoHideAsync();

import axios from 'axios';

const Newtrip = ({ navigation }) => {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0 });
    }
  }, []);




  
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





  const [tripName, setTripName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [numNights, setNumNights] = useState(0);
  const [numPeople, setNumPeople] = useState(0);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setInputDate(currentDate.toLocaleDateString());
  };

  const showMode = () => {
    setShow(true);
  };

  const [numDays, setNumDays] = useState(0);
  const [days, setDays] = useState([]);
  const [distanceData, setDistanceData] = useState([]);
  const [activeInput, setActiveInput] = useState({ day: null, placeIndex: null });

  //const API_KEY = 'AIzaSyDsTXMntd-2w7pTrQePS7cJdM1kXvQ7beE';
  const API_KEY = 'AIzaSyDsTXMntd-2w7pTrQePS7cJdM1kXvQ7beE';


  useEffect(() => {
    // Initialize your state variables here, or fetch initial data if needed
    setTripName('');
    setCountryName('');
    setDate(new Date());
    setInputDate('');
    setNumNights(0);
    setNumPeople(0);
    setNumDays(0);
    setDays([]);
  },[]);



  const fetchPlaces = async (searchQuery, dayIndex, placeIndex) => {
    if (searchQuery.length > 2) {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchQuery}&key=${API_KEY}`
      );
      const newDays = [...days];
      newDays[dayIndex].places[placeIndex].suggestions = response.data.predictions;
      setDays(newDays);
    } else {
      const newDays = [...days];
      newDays[dayIndex].places[placeIndex].suggestions = [];
      setDays(newDays);
    }
  };

  const handleInputChange = (text, dayIndex, placeIndex) => {
    const newDays = [...days];
    newDays[dayIndex].places[placeIndex].query = text;
    setDays(newDays);
    setActiveInput({ day: dayIndex, placeIndex: placeIndex });
    fetchPlaces(text, dayIndex, placeIndex);
  };

  const handlePlaceSelect = async (place, dayIndex, placeIndex) => {
    const placeDetails = await fetchPlaceDetails(place.place_id);
    const newDays = [...days];
    newDays[dayIndex].places[placeIndex].selected = { ...placeDetails, description: place.description, place_id: place.place_id };
    newDays[dayIndex].places[placeIndex].query = place.description;
    newDays[dayIndex].places[placeIndex].suggestions = [];
    setDays(newDays);
    setActiveInput({ day: null, placeIndex: null });
  };

  const fetchPlaceDetails = async (placeId) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
    );
    return response.data.result;
  };

  const handleNumDaysChange = (text) => {
    if (text === '') {
      setNumDays(0); // Set numDays to 0 if the input is empty
    } else {
      const number = parseInt(text, 10);
      setNumDays(number);
      const newDays = Array.from({ length: number }, () => ({
        numPlaces: 0,
        places: [],
      }));
      setDays(newDays);
    }
  };
  

  const handleNumPlacesChange = (text, dayIndex) => {
    if (text === '') {
      text = '0'; // Set text to '0' if it's empty
    }
    const number = parseInt(text, 10);
    const newDays = [...days];
    newDays[dayIndex].numPlaces = number;
    newDays[dayIndex].places = Array.from({ length: number }, () => ({
      query: '',
      suggestions: [],
      selected: null,
    }));
    setDays(newDays);
  };






  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    Vibration.vibrate(15); // Vibrate for 50ms
    setIsPressed(true);
  };


  const handlePressOut = async() => {
    setIsPressed(false);
    
  
    //Gather all the required data
    const tripData = {
      tripName: tripName,
      countryName: countryName,
      date: date,
      numNights: numNights,
      numPeople: numPeople,
      days: days.map((day, dayIndex) => ({
        day: dayIndex + 1,
        places: day.places.map(place => ({
          description: place.selected ? place.selected.description : '',
          place_id: place.selected ? place.selected.place_id : '',
        })),
      })),
    };

  
    // Clear active input state as well if needed


    //  const tripData =  {
    //   "tripName": "Chennai trip",
    //   "countryName": "India",
    //   "date": "2024-07-12T04:20:00.000Z",
    //   "numNights": 3,
    //   "numPeople": 5,
    //   "days": [
    //     {
    //       "day": 1,
    //       "places": [
    //         {
    //           "description": "Perambur, Chennai, Tamil Nadu, India",
    //           "place_id": "ChIJm6CRQgVlUjoR00h7rxzlbyc"
    //         },
    //         {
    //           "description": "ICF Chennai Charter Chapter, 2nd Street, Sri Sakthi Vijayalakshmi Nagar, Gangai Nagar, Velachery, Chennai, Tamil Nadu, India",
    //           "place_id": "ChIJq6o2aYldUjoRZpp9UWU7w-I"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 2,
    //       "places": [
    //         {
    //           "description": "VIT Chennai, Kelambakkam - Vandalur Road, Rajan Nagar, Chennai, Tamil Nadu, India",
    //           "place_id": "ChIJZx9Jjq9ZUjoRLX11GxNCS5Q"
    //         },
    //         {
    //           "description": "Vandalur, Tamil Nadu, India",
    //           "place_id": "ChIJy7t0xgn2UjoRM_bhnwg2rB8"
    //         },
    //         {
    //           "description": "Tambaram, Chennai, Tamil Nadu, India",
    //           "place_id": "ChIJD61KhBRfUjoR1DjOxGY6beE"
    //         }
    //       ]
    //     },
    //     {
    //       "day": 3,
    //       "places": [
    //         {
    //           "description": "VIT Chennai, Kelambakkam - Vandalur Road, Rajan Nagar, Chennai, Tamil Nadu, India",
    //           "place_id": "ChIJZx9Jjq9ZUjoRLX11GxNCS5Q"
    //         },
    //         {
    //           "description": "Vandalur, Tamil Nadu, India",
    //           "place_id": "ChIJy7t0xgn2UjoRM_bhnwg2rB8"
    //         },
    //         {
    //           "description": "Tambaram, Chennai, Tamil Nadu, India",
    //           "place_id": "ChIJD61KhBRfUjoR1DjOxGY6beE"
    //         }
    //       ]
    //     }

    //   ]
    // };


  
    console.log('Trip Data:', JSON.stringify(tripData, null, 2));
    
    navigation.navigate('Upload Your tickets', { tripData });

    const userId = await AsyncStorage.getItem('Email');
    navigation.navigate('Upload Your tickets' , { tripData , userId });
    
    setTripName('');
    setCountryName('');
    setDate(new Date());
    setInputDate('');
    setNumNights(0);
    setNumPeople(0);
    setNumDays(0);
    setDays([]);
  };



  




  return (
    <KeyboardAvoidingView   behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    style={{ flex: 1 }}
    >
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          <View className='flex-1 px-2 py-12 pt-8 bg-[#fafcff]'>
          <View className='px-5'>

                
          <View>
            <Text className='my-3 mt-3' style={[styles.popsemi, { fontSize: 20 }]}>
              Trip / Tour Name :
            </Text>
            <TextInput
              style={[styles.popreg, { fontSize: 19 }]}
              className='border border-[1.4px] border-[#D0D5DD] bg-white rounded-xl h-14 w-full px-4 pt-2 pb-1'
              placeholder='Enter Trip Name'
              value={tripName}
              onChangeText={setTripName}
            />
            <Text className='mt-7' style={[styles.popsemi, { fontSize: 16 }]}>
              Country Name :
            </Text>
            <TextInput
              style={[styles.popreg, { fontSize: 18 }]}
              className='border border-[1.4px] border-[#D0D5DD] bg-white rounded-xl h-14 w-full px-4 pt-2 pb-1'
              placeholder='Enter Country Name'
              value={countryName}
              onChangeText={setCountryName}
            />
            <Text className='mt-4' style={[styles.popsemi, { fontSize: 16 }]}>
              Trip starting Date :
            </Text>

            <Pressable onPress={showMode}>
            <TextInput
              style={[styles.popreg, { fontSize: 18 }]}
              className='border border-[1.4px] border-[#D0D5DD] bg-white rounded-xl h-13 w-1/2 p-3 my-2'
              
              value={inputDate}
              editable={false} 
              onChangeText={setDate}
            />
            </Pressable>
                        {show && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}

            </View>


        




            <View className='flex flex-row flex-wrap mt-3'>
              <View className='basis-1/2 pr-2'>
                <Text style={[styles.popsemi, { fontSize: 16 }]}>No of days :</Text>
                <TextInput
                  style={[styles.popreg, { fontSize: 18 }]}
                  className='border border-[#D0D5DD] bg-white rounded-xl h-12 px-3 py-2 pb-1 my-2'  
                  value={numDays === 0 ? '' : numDays.toString()} // Show empty if numDays is 0, otherwise show numDays
                  onChangeText={handleNumDaysChange}
                  keyboardType='numeric'
                />
              </View>
              <View className='basis-1/2 pl-2'>
                <Text style={[styles.popsemi, { fontSize: 16 }]}>No of Nights :</Text>
                <TextInput
                  style={[styles.popreg, { fontSize: 18 }]}
                  className='border border-[#D0D5DD] bg-white rounded-xl h-12 px-3 py-2 pb-1 my-2'
                  
                  value={numNights === 0 ? '' : numNights.toString()} // Show empty if numNights is 0, otherwise show numNights
                  onChangeText={(value) => setNumNights(parseInt(value) || 0)}
                  keyboardType='numeric'
                />
              </View>
              <View className='basis-1/2 pr-2'>
                <Text style={[styles.popsemi, { fontSize: 16 }]}>No of people :</Text>
                <TextInput
                  style={[styles.popreg, { fontSize: 18 }]}
                  className='border border-[#D0D5DD] bg-white rounded-xl h-12 px-3 py-2 pb-1 my-2'
                  
                  value={numPeople === 0 ? '' : numPeople.toString()} // Show empty if numPeople is 0, otherwise show numPeople
                  onChangeText={(value) => setNumPeople(parseInt(value) || 0)}
                  keyboardType='numeric'
                />
              </View>
            </View>


          


        {days.map((day, dayIndex) => (


          <View key={dayIndex} className='my-6'>

            <View className='items-center py-6'>
                <Text style={[styles.popsemi , {fontSize:16}]}>- - - - - Day {dayIndex + 1} - - - - -</Text>
              </View>
              
            
            
            <TextInput
              className='border border-[1.4px] border-[#D0D5DD] bg-white rounded-xl h-13 w-full p-3 my-2'
              value={day.numPlaces === 0 ? '' : day.numPlaces.toString()} // Show empty if numPlaces is 0, otherwise show numPlaces

              keyboardType="numeric"
              placeholder={`Enter number of places for Day ${dayIndex + 1}`}
              onChangeText={(text) => handleNumPlacesChange(text, dayIndex)}
            />


            {day.places.map((place, placeIndex) => (
              <View key={placeIndex} >
                <Text>Place {placeIndex + 1} :</Text>

                
                <TextInput
                  className='border border-[1.4px] border-[#D0D5DD] bg-white rounded-xl h-13 w-full p-3 my-2'
                  value={place.query}
                  onChangeText={(text) => handleInputChange(text, dayIndex, placeIndex)}
                  placeholder={`Search for place ${placeIndex + 1}`}
                />
                {activeInput.day === dayIndex && activeInput.placeIndex === placeIndex && (
                  <FlatList
                    className ='absolute z-10 top-20 w-full '
                    data={place.suggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                      <Pressable onPress={() => handlePlaceSelect(item, dayIndex, placeIndex)}>
                        <View className='border border-[1.4px] border-t-[0.7px] border-b-[0.7px] border-[#D0D5DD] rounded-xl  h-14 pl-3 items-start justify-center bg-white roun'>
                          <Text>{item.description}</Text>
                        </View>
                      </Pressable>
                    )}
                  />
                )}
              </View>
            ))}

          </View>
        ))}


          
            <View className='items-end my-5'>
              <View className='items-end my-5 mr-3'>

              <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} className='p-5 pr-3 '>
                <View
                  className='flex flex-row gap-x-2 items-center justify-center h-12 w-32 rounded-2xl border-[0.2px] bg-white'
                  style={[styles.card , isPressed && styles.cardPressed ]}
                >
                  <View>
                    <Text className=' text-base ' style={[styles.popsemi , isPressed && styles.text]}>Next  >>  </Text>
                  </View>
                  
                </View>
                </Pressable>
              </View>
            </View>
          



        </View>
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};




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
    elevation: 10,
  },
  popreg: {
    fontFamily: 'Poppins-Regular',
  },
  popsemi: {
    fontFamily: 'Poppins-SemiBold',
  },
  cardPressed:{
    backgroundColor: '#000' ,
  },
  text:{
    color : '#fff'
  },
});



export default Newtrip;
