import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ChatPersonProfile = ({navigation, route}) => {
  const {top} = useSafeAreaInsets();
  const {user} = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: top}]}>
        <TouchableOpacity
          className="pl-2 mt-1"
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <FastImage
            style={styles.profileImage}
            source={{uri: user.profileUrl}}
          />
        </View>

        {/* User Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* Additional Information */}
          <View style={styles.additionalInfo}>
            <InfoItem
              icon="phone"
              label="Phone"
              value={user.phone || 'Not provided'}
            />
            <InfoItem
              icon="map-marker"
              label="Location"
              value={user.location || 'Not provided'}
            />
            <InfoItem
              icon="briefcase"
              label="Occupation"
              value={user.occupation || 'Not provided'}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.button}>
            <Icon name="comment" size={20} color="#fff" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="phone" size={20} color="#fff" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({icon, label, value}) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={20} color="#7071E8" />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#7071E8',
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp(5),
    fontWeight: 'bold',
    marginLeft: wp(4),
  },
  content: {
    padding: wp(4),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  profileImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    borderWidth: 3,
    borderColor: '#7071E8',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  email: {
    fontSize: wp(4),
    color: '#666',
    marginBottom: hp(3),
  },
  additionalInfo: {
    width: '100%',
    marginBottom: hp(3),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  infoLabel: {
    fontSize: wp(3.5),
    color: '#666',
    marginLeft: wp(3),
  },
  infoValue: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: '500',
    marginLeft: wp(3),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7071E8',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
  },
  buttonText: {
    color: '#fff',
    marginLeft: wp(2),
    fontSize: wp(4),
  },
});

export default ChatPersonProfile;
