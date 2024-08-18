import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFirebaseContext} from '../firebase/FirebaseContext';
import Snackbar from 'react-native-snackbar';

const ProfilePage = ({navigation}) => {
  const {top} = useSafeAreaInsets();
  const {user, updateUserProfile} = useFirebaseContext();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [favoriteMessages, setFavoriteMessages] = React.useState([
    {id: '1', message: 'This is a favorite message 1'},
    {id: '2', message: 'This is a favorite message 2'},
    // Add more messages as needed
  ]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [newImageUrl, setNewImageUrl] = React.useState('');

  const handleEditName = async () => {
    if (isEditingName) {
      //   console.log('Updating name:', name);
      try {
        await updateUserProfile({name});
        // If the update is successful, toggle the edit mode
        Snackbar.show({
          text: `User Name Updated Successfully..`,
          duration: Snackbar.LENGTH_LONG,
          textColor: 'white',
          backgroundColor: 'green',
        });
        setIsEditingName(false);
      } catch (error) {
        console.error('Failed to update name:', error);
        // Handle the error (e.g., show an error message to the user)
        Snackbar.show({
          text: `User Name Update Failed: ${e.message}`,
          duration: Snackbar.LENGTH_LONG,
          textColor: 'white',
          backgroundColor: 'red',
        });
      }
    } else {
      // If we're not editing, simply toggle to edit mode
      setIsEditingName(true);
    }
  };
  const handleEditProfilePicture = () => {
    setIsModalVisible(true);
  };
  const handleUpdateProfilePicture = async () => {
    if (newImageUrl) {
      try {
        await updateUserProfile({profileUrl: newImageUrl});
        Snackbar.show({
          text: `Profile Picture Updated Successfully..`,
          duration: Snackbar.LENGTH_LONG,
          textColor: 'white',
          backgroundColor: 'green',
        });
        setIsModalVisible(false);
        setNewImageUrl('');
      } catch (error) {
        console.error('Failed to update profile picture:', error);
        // Handle the error (e.g., show an error message to the user)
        Snackbar.show({
          text: `Profile Picture Update Failed..`,
          duration: Snackbar.LENGTH_LONG,
          textColor: 'white',
          backgroundColor: 'red',
        });
      }
    }
  };

  const renderFavoriteMessage = ({item}) => (
    <View className="flex-row justify-between p-2 bg-gray-100 rounded-lg mb-2">
      <Text className="text-gray-700">{item.message}</Text>
      <TouchableOpacity onPress={() => console.log('Delete message')}>
        <Icon name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="  flex-row items-center px-4 py-3 bg-indigo-400"
        style={{paddingTop: top}}>
        <TouchableOpacity
          className="mt-2 pl-1"
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-medium ml-5">Profile</Text>
      </View>

      {/* User Information */}
      <View className="bg-white px-4 py-6 mt-4">
        {/* Profile Image */}
        <View className="items-center mt-8">
          <FastImage
            className="h-32 w-32 rounded-full border-4 border-indigo-400"
            source={{uri: user?.profileUrl}}
            style={{borderRadius: 100}}
          />
          <TouchableOpacity
            onPress={handleEditProfilePicture}
            className="absolute bg-green-500 p-2 rounded-full"
            style={{right: 140, bottom: -10}}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Editable Name */}
        <View className="mt-4">
          <Text className="text-gray-700 text-lg">Name</Text>
          {isEditingName ? (
            <View className="flex-row items-center bg-gray-100 mt-2 p-2 rounded-lg">
              <TextInput
                className="flex-1 text-gray-700"
                value={name}
                onChangeText={setName}
                onBlur={handleEditName}
              />
              <TouchableOpacity onPress={handleEditName}>
                <Icon name="edit" size={20} color="#737373" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-gray-700 text-base">{name}</Text>
              <TouchableOpacity onPress={handleEditName}>
                <Icon name="edit" size={20} color="#737373" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Email */}
        <View className="mt-4">
          <Text className="text-gray-700 text-lg">Email</Text>
          <Text className="text-gray-500 text-base mt-2">{email}</Text>
        </View>

        {/* Favorite Messages */}
        <View className="mt-8">
          <Text className="text-gray-700 text-lg">Favorite Messages</Text>
          <FlatList
            data={favoriteMessages}
            renderItem={renderFavoriteMessage}
            keyExtractor={item => item.id}
            className="mt-4"
          />
        </View>
      </View>
      {/* Modal for Profile Picture Update */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <FastImage
            source={{uri: user?.profileUrl}}
            style={styles.backgroundImage}
            blurRadius={25}
          />

          <View style={styles.overlay} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile Picture</Text>
            <TextInput
              placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
              style={styles.input}
              placeholder="Enter new image URL"
              value={newImageUrl}
              onChangeText={setNewImageUrl}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdateProfilePicture}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfilePage;
const styles = StyleSheet.create({
  // ... (existing styles)

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
  },
  updateButton: {
    backgroundColor: 'rgba(75, 0, 130, 0.6)',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
