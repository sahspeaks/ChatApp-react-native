import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {useFirebaseContext} from '../firebase/FirebaseContext';
import Snackbar from 'react-native-snackbar';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Login = ({navigation}) => {
  const {login, isLoggedIn, setIsLoggedIn} = useFirebaseContext();

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);

  const handleLogin = async () => {
    if (email.length < 1 || password.length < 1) {
      setError('All fields are required');
    } else {
      try {
        //setloading true
        await login(email, password)
          //setloading false
          .then(response => {
            if (response.success) {
              setIsLoggedIn(true);
              Snackbar.show({
                text: `Login success`,
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
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        className="flex-1 items-center justify-center"
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.headingText}>Hey,</Text>
            <Text style={styles.headingText}>Welcome</Text>
            <Text style={styles.headingText}>Back</Text>
          </View>
          {/* form  */}
          <View style={styles.formContainer}>
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
                secureTextEntry={secureEntry}
              />
              <TouchableOpacity
                onPress={() => {
                  setSecureEntry(prev => !prev);
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
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButtonWrapper}
              onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
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
            <View style={styles.footerContainer}>
              <Text style={styles.accountText}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>Sign up</Text>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
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
    fontFamily: fonts.Bold,
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

export default Login;
