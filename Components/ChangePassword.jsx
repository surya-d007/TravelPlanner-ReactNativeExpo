import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ChangePassword = () => {
  const navigation = useNavigation();
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('Email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    loadEmail();

    const resetState = navigation.addListener('focus', () => {
      // Reset state when component is focused
      setStage(1);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsLoading(false);
    });

    return resetState;
  }, [navigation]);

  const handleNextStage = async () => {
    if (stage === 1) {
      setStage(2);
    } else if (stage === 2) {
      setIsLoading(true);
      try {
        const response = await axios.post('http://192.168.29.253/login', {
          email,
          password: currentPassword,
        });

        setIsLoading(false);

        if (response.status === 200) {
          setStage(3);
        } else {
          Alert.alert('Error', response.data.message || 'Verification failed');
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', error.response?.data?.message || 'Verification failed');
      }
    }
  };

  const handlePasswordUpdate = async () => {
    // Validate password length
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.29.253/change-password', {
        email,
        newPassword,
      });

      setIsLoading(false);

      if (response.status === 200) {
        Alert.alert('Success', 'Password updated successfully');
        // Reset state to start from the beginning
        setStage(1);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        Alert.alert('Error', response.data.message || 'Password update failed');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <View className='p-9 pt-20'>
      {stage === 1 && (
        <>
          <Text className='text-2xl text-center' style={styles.popsemi}>
            Are you sure you want to change your password?
          </Text>

          <View className='flex flex-row justify-center'>
            <TouchableOpacity
              className='mt-8 bg-black px-7 py-2 rounded-3xl'
              onPress={handleNextStage}
            >
              <Text className='text-xl text-white' style={styles.popreg}>
                Yes, Change password.
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {stage === 2 && (
        <View className='mt-10'>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.popreg, styles.disabledInput]}
            keyboardType='email-address'
          />
          <TextInput
            placeholder='Enter current password'
            value={currentPassword}
            autoCapitalize='none' 
            onChangeText={setCurrentPassword}
            style={[styles.input, styles.popreg]}
            secureTextEntry
          />
          {isLoading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <TouchableOpacity
              className='mt-8 bg-black px-7 py-2 rounded-3xl'
              onPress={handleNextStage}
            >
              <Text className='text-xl text-white' style={styles.popreg}>
                Verify
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {stage === 3 && (
        <View className='mt-10'>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.popreg, styles.disabledInput]}
            keyboardType='email-address'
          />
          <TextInput
            placeholder='Enter new password'
            value={newPassword}
            onChangeText={setNewPassword}
            style={[styles.input, styles.popreg]}
            autoCapitalize='none' 
            secureTextEntry
          />
          <TextInput
            placeholder='Confirm new password'
            autoCapitalize='none' 
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            style={[styles.input, styles.popreg]}
            secureTextEntry
          />
          {isLoading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <TouchableOpacity
              className='mt-8 bg-black px-7 py-2 rounded-3xl'
              onPress={handlePasswordUpdate}
            >
              <Text className='text-xl text-white' style={styles.popreg}>
                Update Password
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  popreg: {
    fontFamily: 'Poppins-Regular',
  },
  popsemi: {
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
  },
});
