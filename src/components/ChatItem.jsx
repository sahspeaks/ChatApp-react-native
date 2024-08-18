import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {formatDate, getRoomId} from '../constatnts/helper';
import {collection, doc, onSnapshot, orderBy, query} from 'firebase/firestore';
import {roomsCollection} from '../firebase/service';

const ChatItem = ({item, noBorder, index, navigation, route, currentUser}) => {
  const [lastMessage, setLastMessage] = useState(undefined);

  useEffect(() => {
    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(roomsCollection, roomId);
    const messageRef = collection(docRef, 'messages');
    const q = query(messageRef, orderBy('createdAt', 'desc'));

    let unsubscribe = onSnapshot(q, snapshot => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });

    return unsubscribe;
  }, []);

  const renderTime = () => {
    if (typeof lastMessage == 'undefined') return 'Loading...';
    if (lastMessage) {
      let time = formatDate(new Date(lastMessage?.createdAt?.seconds * 1000));
      return time;
    } else {
      return '';
    }
  };

  const renderLastMessage = () => {
    if (lastMessage === null || typeof lastMessage === 'undefined') {
      return 'No messages yet. Say Hi 👋';
    }

    let messageContent = '';
    const isCurrentUserSender = currentUser?.userId === lastMessage?.userId;
    const senderPrefix = isCurrentUserSender
      ? 'You: '
      : `${lastMessage?.senderName || 'Sender'}: `;

    try {
      switch (lastMessage.fileType) {
        case 'image/jpeg':
        case 'image/png':
          messageContent = 'Sent an image';
          break;
        case 'video/mp4':
          messageContent = 'Sent a video';
          break;
        case 'audio/mpeg':
          messageContent = 'Sent an audio message';
          break;
        case 'application/pdf':
          messageContent = 'Sent a PDF file';
          break;
        default:
          messageContent = lastMessage?.text || '';
      }

      if (messageContent) {
        return `${senderPrefix}${messageContent}`;
      } else {
        return `${senderPrefix}Sent a message`;
      }
    } catch (error) {
      console.error('Error rendering last message:', error);
      return 'Unable to display last message';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.push('ChatRoom', {item})}
      className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 pl-2 ${
        noBorder ? '' : 'border-b border-neutral-200'
      }`}>
      {/* display picture */}
      <FastImage
        style={{height: hp(6), aspectRatio: 1, borderRadius: 100}}
        source={{uri: item?.profileUrl}}
      />

      {/* name and last message */}
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{fontSize: hp(1.8)}}
            className="font-semibold text-neutral-800">
            {item?.name}
          </Text>
          <Text
            style={{fontSize: hp(1.5)}}
            className="font-medium text-neutral-400">
            {renderTime()}
          </Text>
        </View>
        {/* Last Message */}
        <Text
          className="font-medium text-neutral-500"
          style={{fontSize: hp(1.5)}}>
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
