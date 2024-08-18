// AgoraContext.js
import React, {createContext, useContext, useRef, useState} from 'react';
import {
  createAgoraRtcEngine,
  ClientRoleType,
  ChannelProfileType,
} from 'react-native-agora';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import Config from 'react-native-config';

const AgoraContext = createContext(null);

export const AgoraProvider = ({children}) => {
  const agoraEngineRef = useRef(null);
  const [isInCall, setIsInCall] = useState(false);

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const setupSDKEngine = async () => {
    try {
      await getPermission();
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.initialize({
        appId: Config.YOUR_AGORA_APP_ID,
      });
    } catch (e) {
      console.error('Failed to initialize Agora engine', e);
    }
  };

  const startCall = async (type, channelName) => {
    if (isInCall) return;
    try {
      const agoraEngine = agoraEngineRef.current;
      if (!agoraEngine) {
        console.error('Agora engine is not initialized');
        return;
      }
      console.log('Setting channel profile');
      agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );

      if (type === 'video') {
        console.log('Enabling video');
        agoraEngine.enableVideo();
        agoraEngine.startPreview();
      } else {
        console.log('Disabling video');
        agoraEngine.disableVideo();
      }

      console.log('Joining channel:', channelName);
      await agoraEngine.joinChannel(Config.YOUR_TEMP_TOKEN, channelName, null, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
      console.log('Joined channel');
      setIsInCall(true);
    } catch (e) {
      console.error('Failed to start call', e);
    }
  };

  const leaveCall = async () => {
    try {
      const agoraEngine = agoraEngineRef.current;
      await agoraEngine.leaveChannel();
      setIsInCall(false);
    } catch (e) {
      console.error('Failed to leave call', e);
    }
  };
  const muteLocalAudioStream = async mute => {
    const agoraEngine = agoraEngineRef.current;
    if (agoraEngine) {
      await agoraEngine.muteLocalAudioStream(mute);
    }
  };
  const muteLocalVideoStream = async mute => {
    const agoraEngine = agoraEngineRef.current;
    if (agoraEngine) {
      await agoraEngine.muteLocalVideoStream(mute);
    }
  };
  const switchCamera = () => {
    const agoraEngine = agoraEngineRef.current;
    if (agoraEngine) {
      agoraEngine.switchCamera();
    }
  };

  return (
    <AgoraContext.Provider
      value={{
        agoraEngineRef,
        isInCall,
        setupSDKEngine,
        startCall,
        leaveCall,
        switchCamera,
        muteLocalAudioStream,
        muteLocalVideoStream,
      }}>
      {children}
    </AgoraContext.Provider>
  );
};

export const useAgora = () => useContext(AgoraContext);
