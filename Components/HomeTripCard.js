import React , {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Day from './Day';

SplashScreen.preventAutoHideAsync();


export default function App() {
  

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
    <View className='py-7 px-3 '>

      <View style={styles.card} className=' rounded-xl flex flex-col relative  '>
         
      <Text className="absolute top-[-28px] right-2 text-[#000000] text-base font-semibold" style={styles.popreg}>30-01-2004</Text>

        <View className='px-5 rounded-t-xl h-16 bg-[#000000] flex flex-row justify-between items-center border ' >
          <Text className='text-3xl text-[#ffffff] text-left ' style={{ fontFamily : 'Poppins-Medium' }}>Kerela</Text>
          <Text className="absolute top-9 left-7 text-[#ffffff] text-xl">- - - - - - -</Text>
          <View className='py-5'>
            <Text className='text-[#ffffff] text-right' style={styles.popreg}>No days : 5 / 4N</Text>
            <Text className='text-[#ffffff] text-right' style={styles.popreg}>Aproxx budget  : 15 K</Text>
          </View>
        </View>


        <View className='flex flex-col py-4 px-6  bg-[#eff4ff] rounded-b-xl border border-[#cfcfcf]'>
            
            <Day></Day>
            <Day></Day>
            <View className='flex flex-row'>
                <Text className=' ml-6  text-3xl'>᠁</Text>
                
            </View>
            <Text className="  absolute bottom-4 right-6  text-[15px] " style={styles.popsemi}>more info --></Text>
        </View>

      </View>
      
    </View>
  );
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
    elevation: 20,
  },
  popreg :{
    fontFamily : 'Poppins-Regular',
  },
  popsemi :{
    fontFamily : 'Poppins-SemiBold'
  }
});
