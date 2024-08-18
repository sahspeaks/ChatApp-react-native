import {Text, View, Platform} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {useFirebaseContext} from '../firebase/FirebaseContext';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {MenuItem} from '../components/CustomMenuItems';
import Icon from 'react-native-vector-icons/FontAwesome';
import Snackbar from 'react-native-snackbar';
const ios = Platform.OS == 'ios';
const HomeHeader = ({navigation, route}) => {
  const {top} = useSafeAreaInsets();
  const {user, logout} = useFirebaseContext();

  const handleProfile = () => {
    navigation.push('ProfilePage', {
      user: user,
    });
  };
  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login screen or handle UI update
      Snackbar.show({
        text: 'Logout success',
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'green',
      });
    } catch (error) {
      Snackbar.show({
        text: `Logout failed: ${error.message}`,
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
      console.error('Logout failed:', error);
    }
  };
  return (
    <View
      style={{paddingTop: ios ? top : top + 10}}
      className="flex-row justify-between px-5 bg-indigo-400 pb-4">
      <View>
        <Text style={{fontSize: hp(3)}} className=" font-medium text-white">
          Chats
        </Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger accessibilityLabel="Profile Menu">
            <FastImage
              style={{height: hp(5), aspectRatio: 1, borderRadius: 100}}
              source={{uri: user?.profileUrl}}
            />
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
              text="Profile"
              action={handleProfile}
              value={null}
              icon={<Icon name="user-o" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <MenuItem
              text="Log Out"
              action={handleLogout}
              value={null}
              icon={<Icon name="sign-out" size={hp(2.5)} color="#737373" />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default HomeHeader;

const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200"></View>;
};
