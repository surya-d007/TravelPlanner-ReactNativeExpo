import { View, Text ,StyleSheet, Pressable } from 'react-native'
import React from 'react'

const ButtonCom = ({ navigation }) => {
  return (
    
    <Pressable onPress={() => navigation.navigate('Plan New trip')}>
        <View className=''>
          <View style={styles.card} className='h-12 w-36  rounded-2xl flex flex-row items-center justify-center border-[0.2px]'>
               <Text className=' font-bold text-3xl'>+</Text>
              <Text className=' text-base'>  Plan new trip</Text>
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
  });

  
export default ButtonCom