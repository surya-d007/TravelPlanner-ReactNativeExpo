import { View, Text , StyleSheet } from 'react-native';
import React from 'react';

const ReviewTripCard = ({ day }) => {
  return (
    <View className='mt-5  rounded-xl my-6 ' style={styles.card}>
      <View className='bg-black h-12 rounded-xl'>

      <View className='px-5 rounded-t-xl h-16 bg-[#000000] flex flex-row justify-between items-center border relative' >
      <Text className='text-3xl text-[#ffffff] text-left ' style={{ fontFamily : 'Poppins-Medium' }}>Day {day.day}</Text>
      <Text className="absolute top-9 left-6 text-[#ffffff] text-xl">- - - - - -</Text>
      
      </View>
      </View>

      <View className='px-3 py-3 pt-2 mt-4 bg-[#eff4ff] rounded-b-xl'>
      {day.places.map((place, index) => (
        <View key={index} className='ml-4 mt-3'>
          <Text style={[styles.popsemi , {color : '#424242'}]}>●  <Text style={[styles.popsemi , {color : '#888A83'}]}>{place.description} </Text></Text>
        </View>
      ))}
      </View>


    </View>
  );
}

export default ReviewTripCard;


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
  