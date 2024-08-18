import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MessageList from '../components/MessageList';
import Feather from 'react-native-vector-icons/Feather';
import CustomKeyboardView from '../components/CustomKeyboardView';
import {useFirebaseContext} from '../firebase/FirebaseContext';
import {getRoomId} from '../constatnts/helper';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import {db, roomsCollection, storage} from '../firebase/service';
import Snackbar from 'react-native-snackbar';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import DocumentPicker, {types} from 'react-native-document-picker';
import {MenuItem} from '../components/CustomMenuItems';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import RNFS from 'react-native-fs';
// import {Blob} from 'rn-fetch-blob'; // If Blob is not already imported
import {Platform} from 'react-native';

const ChatRoom = ({navigation, route}) => {
  const {item} = route.params;
  const {user} = useFirebaseContext();
  const [messages, setMessages] = useState([]);
  const textRef = useRef('');
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  // console.log('ChatRoom', item);

  useEffect(() => {
    createRoomIfNotExists();

    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, 'rooms', roomId);
    const messageRef = collection(docRef, 'messages');
    const q = query(messageRef, orderBy('createdAt', 'asc'));

    let unsubscribe = onSnapshot(q, snapshot => {
      let allMessages = snapshot.docs.map(doc => {
        return {id: doc.id, ...doc.data()};
      });
      setMessages([...allMessages]);
    });

    const KeyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      updateScrollview,
    );
    return () => {
      unsubscribe();
      KeyboardDidShowListener.remove();
    };
  }, []);
  // console.log('messages: ', messages);

  const handleFileSelection = async type => {
    try {
      let documentType;
      switch (type) {
        case 'IMAGES':
          documentType = [types.images];
          break;
        case 'AUDIO':
          documentType = [types.audio];
          break;
        case 'VIDEO':
          documentType = [types.video];
          break;
        default:
          documentType = [types.allFiles];
      }

      const res = await DocumentPicker.pick({
        type: documentType,
        allowMultiSelection: false,
      });

      // Handle the selected file
      const file = res[0];
      console.log('Selected file:', file); // Log the selected file
      await sendFileMessage(file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error picking file:', err);
        Snackbar.show({
          text: `Error picking file: ${err.message}`,
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'red',
        });
      }
    }
  };

  const sendFileMessage = async file => {
    try {
      console.log('File object:', file);

      if (!file || typeof file.uri !== 'string') {
        throw new Error('Invalid file object or URI');
      }

      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, 'rooms', roomId);
      const messageRef = collection(docRef, 'messages');

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `${roomId}/${file.name}`);

      let fileUri;
      if (Platform.OS === 'android') {
        // For Android
        const destPath = `${RNFS.CachesDirectoryPath}/${file.name}`;
        await RNFS.copyFile(file.uri, destPath);
        fileUri = `file://${destPath}`;
      } else {
        // For iOS
        fileUri = file.uri;
      }

      // Create a Blob from the file
      const response = await fetch(fileUri);
      const blob = await response.blob();

      console.log('Blob size:', blob.size);

      // Upload the file
      await uploadBytes(storageRef, blob, {contentType: file.type});

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      console.log('Download URL:', downloadURL);

      // Send the message with the file information and download URL
      const newDoc = await addDoc(messageRef, {
        userId: user?.userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: downloadURL,
        profileUrl: user?.profileUrl,
        senderName: user?.name,
        createdAt: Timestamp.fromDate(new Date()),
      });

      console.log('New File Message ID: ', newDoc.id);
    } catch (e) {
      console.error('Error in sendFileMessage:', e);
      console.error('Error stack:', e.stack);
      if (e.serverResponse) {
        console.error('Server response:', e.serverResponse);
      }
      Snackbar.show({
        text: `Error sending file message: ${e.message}`,
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
    }
  };

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(
      doc(db, 'rooms', roomId),
      {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
      },
      {merge: true},
    );
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(roomsCollection, roomId);
      const messageRef = collection(docRef, 'messages');
      textRef.current = '';
      if (inputRef) inputRef?.current?.clear();
      const newDoc = await addDoc(messageRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.name,
        createdAt: Timestamp.fromDate(new Date()),
      });
      // console.log('New MessageID: ', newDoc.id);
    } catch (e) {
      Snackbar.show({
        text: `Got error while sending message: ${e.message}`,
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
    }
  };

  useEffect(() => {
    updateScrollview();
  }, [messages]);

  const updateScrollview = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    });
  };

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar
          barStyle={'dark-content'}
          translucent={true}
          backgroundColor={'transparent'}
        />
        {/* <ChatRoomHeader navigation={navigation} route={route} /> */}
        <View className="h-3 border-b border-neutral-200" />

        <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
          <View className="flex-1">
            <MessageList
              messages={messages}
              currentUser={user}
              scrollViewRef={scrollViewRef}
            />
          </View>
          {/* input and send button */}
          <View style={{marginBottom: hp(3)}} className="pt-2">
            <View className="flex-row justify-between items-center mx-3">
              <View className="flex-row justify-between bg-white border p-2 border-neutral-300 rounded-full">
                <Menu>
                  <MenuTrigger>
                    <View className="bg-neutral-200 p-3 rounded-full">
                      <Feather name="plus" size={hp(2.7)} color="#737373" />
                    </View>
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{
                      optionsContainer: {
                        borderRadius: 10,
                        borderCurve: 'continuous',
                        marginTop: -60,
                        backgroundColor: 'white',
                        shadowOpacity: 0.2,
                        shadowOffset: {width: 0, height: 0},
                        width: 200,
                      },
                    }}>
                    <MenuItem
                      text="Select Image"
                      action={handleFileSelection}
                      value="IMAGES"
                      icon={
                        <Icon name="picture-o" size={hp(2.5)} color="#737373" />
                      }
                    />
                    <Divider />
                    <MenuItem
                      action={handleFileSelection}
                      text="Select Audio"
                      value="AUDIO"
                      icon={
                        <Icon name="music" size={hp(2.5)} color="#737373" />
                      }
                    />
                    <Divider />
                    <MenuItem
                      text="Select Video"
                      action={handleFileSelection}
                      value="VIDEO"
                      icon={
                        <Icon
                          name="video-camera"
                          size={hp(2.5)}
                          color="#737373"
                        />
                      }
                    />
                  </MenuOptions>
                </Menu>
                <TextInput
                  ref={inputRef}
                  onChangeText={value => (textRef.current = value)}
                  placeholder="Type message..."
                  style={{fontSize: hp(2)}}
                  className="flex-1 mr-2 text-slate-700"
                  placeholderTextColor={'#737373'}
                  onSubmitEditing={value => (textRef.current = value)}
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  className="bg-neutral-200 p-3  rounded-full">
                  <Feather name="send" size={hp(2.7)} color="#737373" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
};

export default ChatRoom;
const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200"></View>;
};
