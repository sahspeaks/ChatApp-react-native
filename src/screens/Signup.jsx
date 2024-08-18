import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
//react native elements
import {FirebaseContext} from '../firebase/FirebaseContext';
import Snackbar from 'react-native-snackbar';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Signup = ({navigation}) => {
  const defaultImage =
    'https://www.pngitem.com/pimgs/m/22-220721_circled-user-male-type-user-colorful-icon-png.png';
  const {register, setIsLoggedIn} = useContext(FirebaseContext);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(defaultImage);
  //   const [isLoading, setIsLoading] = useState(false);
  const [secureEntery, setSecureEntery] = useState(true);

  const handleSignup = async () => {
    console.log('handleSignup');

    if (
      name.length < 1 ||
      email.length < 1 ||
      password.length < 1 ||
      repeatPassword.length < 1
    ) {
      setError('All fields are required');
    } else if (password !== repeatPassword) {
      setError('Passwords do not match');
    } else {
      await register(email, password, name, profileUrl)
        .then(response => {
          if (response.success) {
            setIsLoggedIn(true);
            Snackbar.show({
              text: 'Signup success',
              duration: Snackbar.LENGTH_SHORT,
              textColor: 'white',
              backgroundColor: 'green',
            });
          } else {
            Snackbar.show({
              text: `${response.msg}`,
              duration: Snackbar.LENGTH_SHORT,
              textColor: 'white',
              backgroundColor: 'red',
            });
          }
        })
        .catch(e => {
          Snackbar.show({
            text: 'Invalid Creedentials',
            duration: Snackbar.LENGTH_SHORT,
            textColor: 'white',
            backgroundColor: 'red',
          });
          console.log(e);
          setError(e.message);
        });
    }
  };

  useEffect(() => {
    if (profileUrl) {
      setImagePreviewUrl(profileUrl);
    } else {
      setImagePreviewUrl(defaultImage);
    }
  }, [profileUrl]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.headingText}>Let's get</Text>
            <Text style={styles.headingText}>started</Text>
          </View>
          {/* form  */}
          <View style={styles.formContainer}>
            {/* Profile Image Preview */}
            <View style={styles.profileImageContainer}>
              <Image
                source={{uri: imagePreviewUrl}}
                style={styles.profileImage}
                onError={() => setImagePreviewUrl(defaultImage)}
              />
            </View>
            {/* Profile Image */}
            <View style={styles.inputContainer}>
              <Ionicons
                name={'image-outline'}
                size={30}
                color={colors.secondary}
              />
              <TextInput
                value={profileUrl}
                onChangeText={text => {
                  setError('');
                  setProfileUrl(text);
                }}
                style={styles.textInput}
                placeholder="Enter Profile Picture URL"
                placeholderTextColor={colors.secondary}
                keyboardType="default"
              />
            </View>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Ionicons
                name={'people-outline'}
                size={30}
                color={colors.secondary}
              />
              <TextInput
                value={name}
                onChangeText={text => {
                  setError('');
                  setName(text);
                }}
                style={styles.textInput}
                placeholder="Enter your Name"
                placeholderTextColor={colors.secondary}
              />
            </View>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons
                name={'mail-outline'}
                size={30}
                color={colors.secondary}
              />
              <TextInput
                value={email}
                onChangeText={text => {
                  setError('');
                  setEmail(text);
                }}
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={colors.secondary}
                keyboardType="email-address"
              />
            </View>
            {/* Password */}
            <View style={styles.inputContainer}>
              <SimpleLineIcons
                name={'lock'}
                size={30}
                color={colors.secondary}
              />
              <TextInput
                value={password}
                onChangeText={text => {
                  setError('');
                  setPassword(text);
                }}
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.secondary}
                secureTextEntry={secureEntery}
              />
              <TouchableOpacity
                onPress={() => {
                  setSecureEntery(prev => !prev);
                }}>
                <SimpleLineIcons
                  name={'eye'}
                  size={20}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
            {/* Repeat Password */}
            <View style={styles.inputContainer}>
              <Ionicons
                name={'key-outline'}
                size={30}
                color={colors.secondary}
              />
              <TextInput
                value={repeatPassword}
                onChangeText={text => {
                  setError('');
                  setRepeatPassword(text);
                }}
                style={styles.textInput}
                placeholder="Repeat Password"
                placeholderTextColor={colors.secondary}
                secureTextEntry={secureEntery}
              />
              <TouchableOpacity
                onPress={() => {
                  setSecureEntery(prev => !prev);
                }}>
                <SimpleLineIcons
                  name={'eye'}
                  size={20}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
            {/* Validation error */}
            {error ? (
              <Text className="text-red-400 text-center">{error}</Text>
            ) : null}
            {/* Signup button */}
            <TouchableOpacity
              onPress={handleSignup}
              style={styles.loginButtonWrapper}>
              <Text style={styles.loginText}>Sign up</Text>
            </TouchableOpacity>
            <Text style={styles.continueText}>or continue with</Text>
            <TouchableOpacity style={styles.googleButtonContainer}>
              <Image
                source={{
                  uri: 'http://pluspng.com/img-png/google-logo-png-open-2000.png',
                }}
                style={styles.googleImage}
              />
              <Text style={styles.googleText}>Google</Text>
            </TouchableOpacity>
            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.accountText}>Already have an account!</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signupText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    color: colors.primary,
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
    padding: 10,
  },
  continueText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    color: colors.secondary,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: '#1d9bf0',
    fontFamily: fonts.Bold,
    fontWeight: 'bold',
  },
});

export default Signup;
