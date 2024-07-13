import React , {useEffect , useState} from 'react';
import { View, Text, StyleSheet, Pressable  , Linking , TouchableOpacity , Modal, ScrollView} from 'react-native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Day from './Day';
import ReviewTripCard from './ReviewTripCard';
import Icon from 'react-native-vector-icons/Ionicons';

SplashScreen.preventAutoHideAsync();


export default function App({trip}) {

  const [modalVisible, setModalVisible] = useState(false);



  console.log(JSON.stringify(trip, null, 2));
  //console.log("ffsj :  " + trip.location);
  

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


  function formatDateString(dateString) {
    const date = new Date(dateString);

    // Extract individual date components
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Month is zero-indexed, so we add 1
    const year = date.getUTCFullYear();

    // Format day and month to have leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Construct the desired date format
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

    return formattedDate;
}

function countPlacesVisited(tripData) {
  let totalPlaces = 0;

  // Loop through each day of the trip
  tripData.tripData.days.forEach(day => {
    // Increment the total places by the number of places in each day
    totalPlaces += day.places.length;
  });

  return totalPlaces;
}


function formatDateString2(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${month}, ${year}`;
}

const getTotalDistance = (trip) => {
  let totalDistance = 0;
  trip.tripData.days.forEach(day => {
    day.places.forEach(place => {
      if (place.distance && place.distance.value) {
        totalDistance += place.distance.value;
      }
    });
  });
  return totalDistance;
};

const navigateToLink = (url) => {
  Linking.openURL(url).catch((error) => console.error('Failed to open URL:', error));
};


  return (
    <View className='py-4 px-6 '>

<View className='items-center pb-6'> 
          <Text style={styles.popsemi}>- - - - -  {formatDateString2(trip.tripData.date)}  - - - - - </Text>
      </View>

      <View style={styles.card} className=' rounded-xl flex flex-col   '>
         
      <Text className="absolute top-[-28px] right-2 text-[#000000] text-base font-semibold" style={styles.popsemi}>{formatDateString(trip.tripData.date)}</Text>

        <View className='px-5 rounded-t-xl h-16 bg-[#000000] flex flex-row justify-between items-center border ' >
        <Text className='text-3xl text-[#ffffff] text-left' style={{ fontFamily: 'Poppins-Medium' }}>
  {trip.tripData.tripName.length > 8 ? trip.tripData.tripName.slice(0, 7) + '..' : trip.tripData.tripName}
</Text>
          <Text className="absolute top-9 left-7 text-[#ffffff] text-xl">- - - - - - -</Text>
          <View className='py-5'>
            <Text className='text-[#ffffff] text-right' style={styles.popreg}>No days : {trip.tripData.days.length} / {trip.tripData.numNights}N</Text>
            <Text className='text-[#ffffff] text-right' style={styles.popreg}>Aproxx budget  : x K</Text>
          </View>
        </View>


        <View className='flex flex-col pt-4 px-6   bg-[#eff3fb] rounded-b-xl border border-[#cfcfcf] '>

         
            
            <Text style={[styles.popsemi, {fontSize : 20} ]} className=''>Country  : {trip.tripData.countryName}</Text>
            <View className='flex flex-row'>
                  <Text style={styles.popsemi}  className='py-1 basis-1/2'>No of people : {trip.tripData.numPeople}</Text>

                  <Text style={styles.popsemi} className='py-1 basis-1/2'>No of places : {countPlacesVisited(trip)}</Text>

          </View>

            <Text style={styles.popsemi} className='py-1'>Total Dist between places : { (getTotalDistance(trip) / 1000).toFixed(0)} km</Text>
            
            <View className='pt-3 pr-2  pb-4 flex flex-row' >

                
            <TouchableOpacity onPress={() => navigateToLink(trip.location)} className='basis-1/2 relative'>
                  <Text style={styles.popsemi} className='text-[17px]'>View Report </Text>
                  <Text className='absolute bottom-[-10] left-[0] font-extrabold text-[20px]'>------</Text>
            
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => setModalVisible(true)} className='basis-1/2'>

                  <View className=' flex flex-row-reverse basis-1/2  relative'>
                  <Text className="text-[17px] " style={styles.popsemi}>more info >></Text>
                  <Text className='absolute bottom-[-10] left-[40] font-extrabold text-[20px]'>------</Text>
                  </View>
                  </TouchableOpacity>

      
                  

            </View>
            <Modal
        animationType="slide"
        
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
             
        <View  className='flex-1 h-full bg-[#fafcff] '>
          <View  className=''>
          <ScrollView showsVerticalScrollIndicator={false} >

          
            
            
              <View style={styles.closeButtonText} className='bg-white  h-14 flex   justify-center ps-40 ms-20'>
              <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
             className="ms-10"> 
              
              <Icon name="arrow-back" size={27} color="black" className=" justify-center "/>
              </TouchableOpacity>
                </View>
              
              
              
           
              <View className='px-5'>
          <View>
            <Text className='my-3 mt-10' style={[styles.popsemi, { fontSize: 20 }]}>
              Trip / Tour Name : <Text style={[styles.popsemi, { color: '#888A83' }]}> {trip.tripData.tripName}</Text>
            </Text>
            <Text className='mt-7' style={[styles.popsemi, { fontSize: 18 }]}>
              Country Name : <Text style={[styles.popsemi, { color: '#888A83' }]}> {trip.tripData.countryName}</Text>
            </Text>
            <Text className='mt-4' style={[styles.popsemi, { fontSize: 18 }]}>
              Trip starting Date : <Text style={[styles.popsemi, { color: '#888A83' }]}> {trip.tripData.date} </Text>
            </Text>
          </View>

          <View className='flex flex-row flex-wrap mt-2'>
            <View className='basis-1/2 pr-2 mt-5'>
              <Text style={[styles.popsemi, { fontSize: 18 }]}>No of days : <Text style={[styles.popsemi, { color: '#888A83' }]}> {trip.tripData.days.length} </Text></Text>
            </View>
            <View className='basis-1/2 pl-2 mt-5'>
              <Text style={[styles.popsemi, { fontSize: 18 }]}>No of Nights : <Text style={[styles.popsemi, { color: '#888A83' }]}> {trip.tripData.numNights}</Text></Text>
            </View>
            <View className='basis-1/2 pr-2 mt-5'>
              <Text style={[styles.popsemi, { fontSize: 18 }]}>No of people : <Text style={[styles.popsemi, { color: '#888A83' }]}>{trip.tripData.numPeople}</Text></Text>
            </View>
          </View>

          </View>

              {trip.tripData.days.map((day, index) => (
            <ReviewTripCard key={index} day={day} />
              ))}

              <View className='pb-6'>

              </View>
            
          </ScrollView>
          </View>
        </View>
      </Modal>

            
            
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
