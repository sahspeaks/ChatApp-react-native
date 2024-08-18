import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Sound from 'react-native-sound';

const MessageItem = ({message, currentUser}) => {
  const [imageSize, setImageSize] = useState({width: wp(60), height: wp(60)});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (message.fileType === 'image/jpeg' || message.fileType === 'image/png') {
      Image.getSize(
        message.fileUrl,
        (width, height) => {
          const screenWidth = Dimensions.get('window').width;
          const scaleFactor = width / screenWidth;
          const imageWidth = screenWidth * 0.7; // 70% of screen width
          const imageHeight = (height / scaleFactor) * 0.7;
          setImageSize({width: imageWidth, height: imageHeight});
        },
        error => {
          console.error("Couldn't get the image size: ", error);
        },
      );
    }

    if (message.fileType === 'audio/mpeg') {
      const sound = new Sound(message.fileUrl, '', error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
      });
      setAudio(sound);
    }

    return () => {
      if (audio) {
        audio.release();
      }
    };
  }, [message]);

  const toggleAudio = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play(success => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const renderMessageContent = () => {
    switch (message.fileType) {
      case 'image/jpeg':
      case 'image/png':
        return (
          <Image
            source={{uri: message.fileUrl}}
            style={{
              width: imageSize.width,
              height: imageSize.height,
              borderRadius: 10,
            }}
            resizeMode="contain"
          />
        );
      case 'audio/mpeg':
        return (
          <TouchableOpacity
            onPress={toggleAudio}
            className="flex-row items-center bg-indigo-100 p-3 rounded-lg">
            <Feather
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={hp(4)}
              color="#4F46E5"
            />
            <Text style={{fontSize: hp(2)}} className="ml-3 text-indigo-700">
              {isPlaying ? 'Pause Audio' : 'Play Audio'}
            </Text>
          </TouchableOpacity>
        );
      case 'video/mp4':
        return (
          <View
            style={{
              width: wp(80),
              height: wp(80),
              borderRadius: 15,
              overflow: 'hidden',
            }}>
            <Video
              source={{uri: message.fileUrl}}
              style={{width: '100%', height: '100%'}}
              controls={true}
              resizeMode="cover"
            />
          </View>
        );
      default:
        return (
          <Text style={{fontSize: hp(1.9)}} className="text-neutral-600">
            {message?.text || message?.fileName}
          </Text>
        );
    }
  };

  const messageContainerStyle =
    currentUser?.userId == message?.userId
      ? 'flex-row justify-end mb-3 mr-3'
      : 'ml-3 mb-3';

  const messageBubbleStyle =
    currentUser?.userId == message?.userId
      ? 'flex self-end p-3 rounded-2xl bg-white border border-neutral-200'
      : 'flex self-start p-3 px-4 rounded-2xl bg-indigo-100 border border-indigo-200';

  return (
    <View className={messageContainerStyle}>
      <View style={{maxWidth: wp(80)}}>
        <View className={messageBubbleStyle}>{renderMessageContent()}</View>
      </View>
    </View>
  );
};

export default MessageItem;
