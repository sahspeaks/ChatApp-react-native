import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {FirebaseContext} from '../firebase/FirebaseContext';
// Routes
import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const Router = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {isLoggedIn, user, getCurrentUser, setIsLoggedIn} =
    useContext(FirebaseContext);

  useEffect(() => {
    // Check if the user state has been initialized
    getCurrentUser()
      .then(user => {
        setIsLoading(false);
        if (user) {
          setIsLoggedIn(true);
        }
      })
      .catch(error => {
        console.error('Error getting current user:', error);
        setIsLoggedIn(false);
        setIsLoading(false);
      });
  }, [user, setIsLoggedIn]);

  if (isLoading) {
    return (
      <View
        className="flex items-center justify-center"
        style={{height: hp(80)}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
