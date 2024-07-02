import { View, Text , Pressable , StyleSheet , Image, ScrollView  , Linking} from 'react-native'
import React , {useEffect} from 'react'
import axios from 'axios';  

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ReviewTripCard from '../Components/ReviewTripCard';
SplashScreen.preventAutoHideAsync();


const ReviewTrip = ({route}) => {


  
  let userEmail=''

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail !== null) {
          userEmail = storedEmail;
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


  

    const userId = 'sury007'
    const { tripData  , img1 , img2  , imgInServer1 , imgInServer2} = route.params;
    

  useEffect(() => {
    // Log the trip data to the console

    console.log('Trip Data from Reviw:', JSON.stringify(tripData, null, 2)); 
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
    day: 'numeric'
  });



  
  const GenerateReport = async() => {
    const apiUrl = 'http://192.168.29.253:3000/api/GenerateReport'; // Replace with your server URL

    try {
      const response = await axios.post(apiUrl, {
        userId,
        tripData,
        img1,
        img2,
        imgInServer1,
        imgInServer2,
        userEmail
      });

      // Handle success response from server
      
      console.log('Server Response:', response.data);
      console.log('Server Response:', response);

      if(response.status == 200)
        {
          await Linking.openURL( response.data.location);
        }

      
      
    } catch (error) {
      // Handle error
      console.error('Error sending data:', error.message);
      
    }
  };





  
  
  return (

    <ScrollView showsVerticalScrollIndicator={false}>
      
      

    <View className=' flex-1 px-2 bg-[#fafcff]'>
      <View className='px-5'>     


          <View>
            <Text className='my-3 mt-10' style={[styles.popsemi, { fontSize: 20 }]}>
              Trip / Tour Name : <Text style={[styles.popsemi , {color : '#888A83'}]}>  {tripData.tripName}</Text>
            </Text>
         
            <Text className='mt-7' style={[styles.popsemi, { fontSize: 18 }]}>
              Country Name : <Text style={[styles.popsemi , {color : '#888A83'}]}>  {tripData.countryName}</Text>
            </Text>
          
            <Text className='mt-4' style={[styles.popsemi, { fontSize: 18 }]}>
              Trip starting Date : <Text style={[styles.popsemi , {color : '#888A83'}]}> {formattedDate} </Text>
            </Text>

            </View>

            <View className='flex flex-row flex-wrap mt-2'>
              <View className='basis-1/2 pr-2 mt-5'>
                <Text style={[styles.popsemi, { fontSize: 18 }]}>No of days :   <Text style={[styles.popsemi , {color : '#888A83'}]}> {tripData.days.length} </Text></Text>
              
              </View>
              <View className='basis-1/2 pl-2 mt-5'>
                <Text style={[styles.popsemi, { fontSize: 18 }]}>No of Nights :  <Text style={[styles.popsemi , {color : '#888A83'}]}> {tripData.numNights}</Text></Text>
                
              </View>
              <View className='basis-1/2 pr-2 mt-5'>
                <Text style={[styles.popsemi, { fontSize: 18 }]}>No of people :   <Text style={[styles.popsemi , {color : '#888A83'}]}>{tripData.numPeople}</Text></Text>
              </View>
            </View>


            {tripData.days.map((day, index) => (
          <ReviewTripCard key={index} day={day} />
        ))}


      <View className='bg-[#fafcff] my-6'>
          <Text style={[styles.popsemi , {fontSize:18} ]} className='mb-6'>Travel-to tickets : </Text>

          <View className='flex-1 items-center justify-center '>
          <Image source={{ uri: img1 }} style={{height : 300 , width : 300 }}    className=' rounded-lg mb-6'/>
          </View>

          <Text style={[styles.popsemi , {fontSize:18} ]} className='mb-6'>Travel-back tickets :  </Text>

          <View className='flex-1 items-center justify-center'>
            <Image source={{ uri: img2 }} style={{height : 300 , width : 300 }}  className='rounded-lg' />
          </View>
      </View>





             
      <Pressable onPress={GenerateReport}>
      <View className='items-end my-5 mt-6 mr-3'>

      <View className='flex flex-row gap-x-2 items-center justify-center h-12 w-48 rounded-2xl border-[0.2px] bg-white' style ={styles.card}>

        <View  >
          <Text className='text-base ' style={styles.popreg}>Generate Report</Text>
        </View>

        <Image
          source={require('../assets/next.png')} // Replace with your actual image path
          className ='h-3 mt-[-1px]'
          resizeMode="contain"
        />
        
      </View>
      </View>
      </Pressable>

        
                  

            
      </View>
    </View>



 


    </ScrollView>
  )
}

export default ReviewTrip


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
    popreg :{
      fontFamily : 'Poppins-Regular',
      
    },
    popsemi :{
      fontFamily : 'Poppins-SemiBold',

      
    }
  });
  