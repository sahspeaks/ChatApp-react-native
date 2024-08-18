import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {doc, onSnapshot} from 'firebase/firestore';
import {db} from '../firebase/service';
import {Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {useAgora} from '../firebase/AgoraContext';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {MenuItem} from '../components/CustomMenuItems';
import {useFirebaseContext} from '../firebase/FirebaseContext';

const ios = Platform.OS == 'ios';

const ChatRoomHeader = ({navigation, route}) => {
  const {top} = useSafeAreaInsets();
  const {user} = useFirebaseContext();
  const {item} = route.params;
  const [userStatus, setUserStatus] = useState({
    isOnline: false,
    lastSeen: null,
  });
  const {setupSDKEngine} = useAgora();

  useEffect(() => {
    setupSDKEngine();
  }, [setupSDKEngine]);

  const handleStartCall = async type => {
    navigation.navigate(type === 'video' ? 'VideoCall' : 'AudioCall', {
      type: type,
      channelName: 'myapp',
    });
  };

  useEffect(() => {
    if (!item?.userId) {
      console.error('Item ID is undefined');
      return;
    }
    const userStatusRef = doc(db, 'status', item.userId);
    const unsubscribe = onSnapshot(userStatusRef, doc => {
      if (doc.exists()) {
        const data = doc.data();
        setUserStatus({
          isOnline: data.isOnline,
          lastSeen: data.lastSeen ? data.lastSeen.toDate() : null,
        });
      }
    });
    return () => unsubscribe();
  }, [item?.userId]);

  // Function to format the last seen date
  const formatLastSeen = date => {
    if (!date) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  // Function to render the status text
  const renderStatus = () => {
    if (userStatus.isOnline) {
      return (
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
          <Text className="text-green-500 text-xs">Online</Text>
        </View>
      );
    } else if (userStatus.lastSeen) {
      return (
        <Text className="text-gray-500 text-xs">
          Last seen {formatLastSeen(userStatus.lastSeen)}
        </Text>
      );
    }
    return null;
  };

  const handleProfile = () => {
    console.log('Profile pressed');
    navigation.push('ChatPersonProfile', {
      user: item,
    });
  };

  return (
    <View
      style={{paddingTop: ios ? top : top + 10}}
      className="flex-row items-center justify-between bg-white px-2">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="">
          <Entypo name="chevron-left" size={35} color="#000" />
        </TouchableOpacity>

        <Pressable
          onPress={handleProfile}
          className="flex-row items-center gap-3 ml-1">
          <FastImage
            style={{height: hp(6), aspectRatio: 1, borderRadius: 100}}
            source={{uri: item?.profileUrl}}
          />
          <View>
            <Text
              style={{fontSize: hp(2.5)}}
              className="text-neutral-700 font-medium">
              {item?.name}
            </Text>
            {renderStatus()}
          </View>
        </Pressable>
      </View>
      <View className="flex-row items-center gap-4 mr-2">
        <TouchableOpacity onPress={() => handleStartCall('video')}>
          <Ionicons name="videocam-outline" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStartCall('audio')}>
          <Ionicons name="call-outline" size={25} color="#000" />
        </TouchableOpacity>

        <Menu>
          <MenuTrigger accessibilityLabel="Profile Menu">
            <MaterialIcons name="more-vert" size={25} color="#000" />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: 'continuous',
                marginTop: 48,
                backgroundColor: 'white',
                shadowOpacity: 0.2,
                shadowOffset: {width: 0, height: 0},
                width: 180,
              },
            }}>
            <MenuItem
              text="View Profile"
              action={handleProfile}
              value={null}
              icon={<Icon name="user-o" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <MenuItem
              text="Search"
              action={handleProfile}
              value={null}
              icon={<Icon name="search" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <MenuItem
              text="More"
              action={handleProfile}
              value={null}
              icon={<Icon name="info" size={hp(2.5)} color="#737373" />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default ChatRoomHeader;

const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200"></View>;
};
