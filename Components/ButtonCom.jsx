import { View, Text ,StyleSheet, Pressable, TouchableOpacity , Vibration } from 'react-native'
import React , {useEffect , useState} from 'react'

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';


const ButtonCom = ({ navigation }) => {

  
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

  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    Vibration.vibrate(15); // Vibrate for 50ms
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    navigation.navigate('Plan New trip');
  };


  return (
    
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} className=' '>
        <View className='p-5'>
          <View style={[styles.card , isPressed && styles.cardPressed ]} className='h-12 w-40  rounded-2xl flex flex-row items-center justify-center border-[0.2px]'>
               <Text className=' font-bold text-3xl' style={isPressed && styles.text}>+</Text>
              <Text className=' text-base' style={[styles.popsemi , isPressed && styles.text]}>  Plan new trip</Text>
          </View>
        </View>
    </Pressable>
  )

  
}


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
    cardPressed:{
      backgroundColor: '#000' ,
    },
    text:{
      color : '#fff'
    },
    popreg: {
      fontFamily: 'Poppins-Regular',
    },
    popsemi: {
      fontFamily: 'Poppins-SemiBold',
    }
  });

  
export default ButtonCom