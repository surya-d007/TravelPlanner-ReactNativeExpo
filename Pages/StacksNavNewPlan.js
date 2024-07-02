import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button , TouchableOpacity, TouchableHighlight, View} from 'react-native';
import Newtrip from './Newtrip';
import Icon from 'react-native-vector-icons/Ionicons';
import Uploadticket from './Uploadticket';
import Sample from './Sample'
import ReviewTrip from './ReviewTrip';
const Stack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="New trip" component={Newtrip} 
         options={{
            headerLeft: () => (
              <TouchableHighlight
                onPress={() => navigation.navigate('Home')}
                underlayColor="#aea6a6"
                style={{
                  borderRadius: 50, // Ensure the touchable area is circular
                  marginLeft: 15,
                  padding: 10,
                  paddingLeft:7
                }}
                >
                <View>
                  <Icon name="arrow-back" size={22} color="black" />
                </View>
              </TouchableHighlight>
            ),
          }}
         />
         
        <Stack.Screen name="Upload Your tickets" component={Uploadticket} />     
        <Stack.Screen name="ReviewTrip" component={ReviewTrip} />     
    </Stack.Navigator>
  );
};

export default StackNavigator;
