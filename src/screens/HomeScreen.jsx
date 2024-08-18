import React, {useEffect, useState, useCallback} from 'react';
import {View, StatusBar, ActivityIndicator} from 'react-native';
import {useFirebaseContext} from '../firebase/FirebaseContext';
import Snackbar from 'react-native-snackbar';
import ChatList from '../components/ChatList';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {usersCollection} from '../firebase/service';
import {getDocs, query, where} from 'firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import UserStatusManager from '../firebase/userStatusManager';

const HomeScreen = ({navigation, route}) => {
  const {user} = useFirebaseContext();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = useCallback(async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const q = query(usersCollection, where('userId', '!=', user.uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach(doc => {
        data.push({...doc.data()});
      });
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Snackbar.show({
        text: 'Failed to load users. Please try again.',
        duration: Snackbar.LENGTH_LONG,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [getUsers]),
  );

  useEffect(() => {
    if (user?.uid) {
      const statusManager = new UserStatusManager(user.uid);
      statusManager.startListening();

      return () => {
        statusManager.stopListening();
      };
    }
  }, [user]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      {isLoading ? (
        <View
          className="flex items-center justify-center"
          style={{height: hp(80)}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ChatList
          users={users}
          navigation={navigation}
          route={route}
          currentUser={user}
          onRefresh={getUsers}
        />
      )}
    </View>
  );
};

export default HomeScreen;
