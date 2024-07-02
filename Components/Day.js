import { View, Text  , StyleSheet} from 'react-native'
import React , {useEffect} from 'react'

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const Day = () => {
    
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



  return (
    <View>
      <Text className='' style={styles.popsemi} >●  Day : 1</Text>
      <Text className=' ml-4 text-[#4A4A4A]' style={styles.popreg}>   Alleppey , Munnar , Kochi</Text>
    </View>
  )
}

export default Day



const styles = StyleSheet.create({
  
    popreg :{
      fontFamily : 'Poppins-Regular',
    },
    popsemi :{
      fontFamily : 'Poppins-SemiBold'
    }
  });
  