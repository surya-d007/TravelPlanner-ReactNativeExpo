import { View, Text, ScrollView , StyleSheet , Image } from 'react-native'
import React , {useEffect} from 'react'
import HomeTripCard from '../Components/HomeTripCard'
import ButtonCom from '../Components/ButtonCom'



import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const Home = ({ navigation }) => {

  
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

    <View >
            
     
    <ScrollView showsVerticalScrollIndicator={false} className='bg-[#fafcff] px-2'>
    <View className='h-52 relative'>

      
        <View className='absolute bottom-3 right-1 px-5'>
          <ButtonCom navigation={navigation}></ButtonCom>
        </View>

    </View>
    <View className="flex-1 ">  
      
    <View className='items-center py-6'> 
          <Text style={styles.popsemi}>- - - - -  jan , 2024  - - - - - </Text>
      </View>

    


      <HomeTripCard></HomeTripCard>
      <HomeTripCard></HomeTripCard>
      <HomeTripCard></HomeTripCard>
      <HomeTripCard></HomeTripCard>
      <HomeTripCard></HomeTripCard>
      
    </View>
    </ScrollView>
    </View>
  )
}

export default Home


const styles = StyleSheet.create({

  popreg :{
    fontFamily : 'Poppins-Regular',
  },
  popsemi :{
    fontFamily : 'Poppins-SemiBold'
  }
});
