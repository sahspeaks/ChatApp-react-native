import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Router} from './routes/Router';
import FirebaseContextProvider from './firebase/FirebaseContext';
import {MenuProvider} from 'react-native-popup-menu';
import {AgoraProvider} from './firebase/AgoraContext';

const App = () => {
  return (
    <AgoraProvider>
      <MenuProvider>
        <FirebaseContextProvider>
          <Router />
        </FirebaseContextProvider>
      </MenuProvider>
    </AgoraProvider>
  );
};

export default App;
