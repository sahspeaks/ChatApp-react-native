import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {RtcSurfaceView, VideoRenderMode} from 'react-native-agora';
import {useAgora} from '../firebase/AgoraContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VideoCall = ({navigation, route}) => {
  const {
    agoraEngineRef,
    leaveCall,
    startCall,
    switchCamera,
    muteLocalAudioStream,
    muteLocalVideoStream,
  } = useAgora();
  const [remoteUid, setRemoteUid] = useState(0);
  const [hasJoinedChannel, setHasJoinedChannel] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isLocalVideoMinimized, setIsLocalVideoMinimized] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  useEffect(() => {
    const joinChannel = async () => {
      const channelName = route.params?.channelName || 'default-channel';
      console.log('Joining video channel:', channelName);
      await startCall('video', channelName);
      console.log('startCall completed');
      setHasJoinedChannel(true);
    };
    joinChannel();
  }, [startCall, route.params]);

  useEffect(() => {
    const agoraEngine = agoraEngineRef.current;

    if (agoraEngine) {
      console.log('Enabling local video');
      agoraEngine.enableLocalVideo(true);
    } else {
      console.error('Agora engine is not initialized');
    }

    const eventHandler = {
      onJoinChannelSuccess: (connection, elapsed) => {
        console.log('Successfully joined the channel', connection, elapsed);
      },
      onLeaveChannel: (connection, stats) => {
        console.log('Left the channel', connection, stats);
      },
      onUserJoined: (_connection, uid) => {
        console.log('Remote user joined', uid);
        setRemoteUid(uid);
        // Subscribe to the remote user's video stream
        agoraEngine.setupRemoteVideo({
          uid: uid,
          renderMode: VideoRenderMode.Hidden,
        });
      },
      onUserOffline: (_connection, uid) => {
        console.log('Remote user left', uid);
        setRemoteUid(0);
      },
      onRemoteVideoStateChanged: (
        connection,
        remoteUid,
        state,
        reason,
        elapsed,
      ) => {
        console.log('Remote video state changed', {
          remoteUid,
          state,
          reason,
          elapsed,
        });
      },
      onError: (err, msg) => {
        console.error('Agora error', err, msg);
      },
    };

    console.log('Registering event handler');
    agoraEngine.registerEventHandler(eventHandler);

    return () => {
      console.log('Unregistering event handler');
      agoraEngine.unregisterEventHandler(eventHandler);
    };
  }, [agoraEngineRef]);

  const onLeaveCall = async () => {
    console.log('Leaving call');
    await leaveCall();
    navigation.goBack();
  };

  const onToggleMute = async () => {
    const newMuteStatus = !isMicMuted;
    console.log(newMuteStatus ? 'Muting mic' : 'Unmuting mic');
    setIsMicMuted(newMuteStatus);
    await muteLocalAudioStream(newMuteStatus);
  };
  const onToggleVideoPause = async () => {
    const newVideoStatus = !isVideoPaused;
    console.log(newVideoStatus ? 'Pausing video' : 'Resuming video');
    setIsVideoPaused(newVideoStatus);
    await muteLocalVideoStream(newVideoStatus); // Mute if paused, unmute if resumed
  };

  const onFlipCamera = () => {
    console.log('Flipping camera');
    switchCamera();
  };

  const onMinimizeLocalVideo = () => {
    console.log('Minimizing local video');
    setIsLocalVideoMinimized(true);
  };

  const onMaximizeLocalVideo = () => {
    console.log('Maximizing local video');
    setIsLocalVideoMinimized(false);
  };

  console.log('Rendering VideoCall component', {
    hasJoinedChannel,
    remoteUid,
    isMicMuted,
    isLocalVideoMinimized,
  });

  const renderLocalVideo = () => (
    <View style={styles.localVideoWrapper}>
      <RtcSurfaceView
        canvas={{uid: 0}}
        style={styles.localVideo}
        zOrderMediaOverlay={true}
      />
      {isVideoPaused && (
        <View style={styles.blurOverlay}>
          <Icon name="videocam-off" size={40} color="#fff" />
          <Text style={styles.pausedText}>Video Paused</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Full-Screen Remote Video */}
      <View style={styles.remoteVideoContainer}>
        {remoteUid !== 0 ? (
          <RtcSurfaceView
            canvas={{uid: remoteUid}}
            style={styles.remoteVideo}
            zOrderMediaOverlay={false}
          />
        ) : (
          <Text style={styles.text}>Remote user not joined yet</Text>
        )}
      </View>

      {/* Small Local Video on Top Right Corner */}
      <View
        style={[
          styles.localVideoContainer,
          isLocalVideoMinimized && styles.minimizedContainer,
        ]}>
        {isLocalVideoMinimized ? (
          <View style={styles.minimizedView}>
            <Text style={styles.userNameText}>Local User</Text>
            <TouchableOpacity
              onPress={onMaximizeLocalVideo}
              style={styles.button}>
              <Icon name="fullscreen" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {hasJoinedChannel ? (
              renderLocalVideo()
            ) : (
              <Text style={styles.text}>Joining Channel...</Text>
            )}
            <View style={styles.localVideoButtons}>
              <TouchableOpacity onPress={onFlipCamera} style={styles.button}>
                <Icon name="flip-camera-ios" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onToggleVideoPause}
                style={styles.button}>
                <Icon
                  name={isVideoPaused ? 'videocam-off' : 'videocam'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onMinimizeLocalVideo}
                style={styles.button}>
                <Icon name="fullscreen-exit" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Bottom Control Bar */}
      <View style={styles.controlBar}>
        <TouchableOpacity
          style={styles.controlButtonMic}
          onPress={onToggleMute}>
          <Icon name={isMicMuted ? 'mic-off' : 'mic'} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onLeaveCall}>
          <Icon name="call-end" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: 140,
    height: 240,
    zIndex: 2,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  minimizedContainer: {
    width: 140,
    height: 50,
  },
  minimizedView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingLeft: 10,
  },
  userNameText: {
    color: '#fff',
    fontSize: 14,
  },
  localVideoWrapper: {
    width: '100%',
    height: '100%',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
  localVideoButtons: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  controlBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  controlButtonMic: {
    backgroundColor: 'green',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 30,
  },
  controlButton: {
    backgroundColor: 'red',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 30,
  },
});

export default VideoCall;
