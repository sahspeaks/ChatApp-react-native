import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useAgora} from '../firebase/AgoraContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AudioCall = ({navigation, route}) => {
  const {agoraEngineRef, leaveCall, startCall} = useAgora();
  const [remoteUid, setRemoteUid] = useState(0);
  const [hasJoinedChannel, setHasJoinedChannel] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const joinChannel = async () => {
      const channelName = route.params?.channelName || 'default-channel';
      console.log('Joining audio channel:', channelName);
      await startCall('audio', channelName);
      console.log('startCall completed for audio');
      setHasJoinedChannel(true);
    };
    joinChannel();
  }, [startCall, route.params]);

  useEffect(() => {
    const agoraEngine = agoraEngineRef.current;

    if (agoraEngine) {
      console.log('Disabling video for audio call');
      agoraEngine.disableVideo();
    } else {
      console.error('Agora engine is not initialized');
    }

    const eventHandler = {
      onJoinChannelSuccess: (connection, elapsed) => {
        console.log(
          'Successfully joined the audio channel',
          connection,
          elapsed,
        );
      },
      onLeaveChannel: (connection, stats) => {
        console.log('Left the audio channel', connection, stats);
      },
      onUserJoined: (_connection, uid) => {
        console.log('Remote user joined audio call', uid);
        setRemoteUid(uid);
      },
      onUserOffline: (_connection, uid) => {
        console.log('Remote user left audio call', uid);
        setRemoteUid(0);
      },
      onError: (err, msg) => {
        console.error('Agora error in audio call', err, msg);
      },
    };

    console.log('Registering event handler for audio call');
    agoraEngine.registerEventHandler(eventHandler);

    return () => {
      console.log('Unregistering event handler for audio call');
      agoraEngine.unregisterEventHandler(eventHandler);
    };
  }, [agoraEngineRef]);

  const onLeaveCall = async () => {
    console.log('Leaving audio call');
    await leaveCall();
    navigation.goBack();
  };

  const onToggleMute = () => {
    const agoraEngine = agoraEngineRef.current;
    if (agoraEngine) {
      if (isMuted) {
        agoraEngine.enableAudio();
      } else {
        agoraEngine.disableAudio();
      }
      setIsMuted(!isMuted);
    }
  };

  console.log('Rendering AudioCall component', {hasJoinedChannel, remoteUid});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.callInfo}>
        <Text style={styles.callStatus}>
          {hasJoinedChannel ? 'In Call' : 'Joining Call...'}
        </Text>
        <Text style={styles.remoteUser}>
          {remoteUid !== 0
            ? `Connected with user ${remoteUid}`
            : 'Waiting for other user to join...'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.circleButton} onPress={onToggleMute}>
          <MaterialIcons
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endCallButton} onPress={onLeaveCall}>
          <MaterialIcons name="call-end" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  callInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  callStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  remoteUser: {
    fontSize: 18,
    color: '#cccccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioCall;
