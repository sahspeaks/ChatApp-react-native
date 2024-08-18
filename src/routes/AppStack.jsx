import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ChatRoom from '../screens/ChatRoom';
import HomeHeader from '../components/HomeHeader';
import ChatRoomHeader from '../components/ChatRoomHeader';
import ProfilePage from '../screens/ProfilePage';
import ChatPersonProfile from '../screens/ChatPersonProfile';
import VideoCall from '../screens/VideoCall';
import AudioCall from '../screens/AudioCall';

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          header: ({navigation, route}) => (
            <HomeHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          header: ({navigation, route}) => (
            <ChatRoomHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatPersonProfile"
        component={ChatPersonProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCall}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AudioCall"
        component={AudioCall}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
