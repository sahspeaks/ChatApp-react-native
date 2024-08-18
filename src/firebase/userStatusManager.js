import {AppState} from 'react-native';
import {doc, updateDoc, serverTimestamp, setDoc} from 'firebase/firestore';
import {db} from '../firebase/service'; // Adjust this import based on your Firebase configuration file

class UserStatusManager {
  constructor(userId) {
    this.userId = userId;
    this.db = db;
    this.userStatusRef = doc(this.db, 'status', userId);
    this.appStateSubscription = null;
  }

  async initializeUserStatus() {
    try {
      await setDoc(
        this.userStatusRef,
        {
          isOnline: true,
          lastSeen: serverTimestamp(),
        },
        {merge: true},
      );
    } catch (error) {
      console.error('Error initializing user status:', error);
    }
  }

  startListening() {
    this.initializeUserStatus();
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  stopListening() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    this.setUserOffline();
  }

  handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.setUserOnline();
    } else if (nextAppState === 'background') {
      this.setUserOffline();
    }
  };

  async setUserOnline() {
    try {
      await updateDoc(this.userStatusRef, {
        isOnline: true,
      });
    } catch (error) {
      console.error('Error setting user online:', error);
    }
  }

  async setUserOffline() {
    try {
      await updateDoc(this.userStatusRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error setting user offline:', error);
    }
  }
}

export default UserStatusManager;
