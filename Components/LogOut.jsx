import { View, Text , Button, TouchableOpacity , StyleSheet, Pressable} from 'react-native'
import React , {useEffect} from 'react'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LogOut = ({setLoggedIn}) => {

    
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



    const handleLogout = async () => {
        try {
          await AsyncStorage.removeItem('Email');
          setLoggedIn(false);
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };
    
  return (
    <View className='p-9 pt-20'>
      
        <Text className='text-2xl text-center' style={styles.popsemi}> Are you sure you want to log out ?</Text>

        <View className='flex flex-row justify-center'>

            <TouchableOpacity className='mt-8 bg-black px-7 py-2 rounded-3xl' onPress={handleLogout}>
                <Text className='text-xl  text-white' style={styles.popreg}>Yes , Log out . </Text>
            </TouchableOpacity>





        </View>
      
    </View>
  )
}

export default LogOut


const styles = StyleSheet.create({
    popreg: {
      fontFamily: 'Poppins-Regular',
    },
    popsemi: {
      fontFamily: 'Poppins-SemiBold',
    },
  
  });
  