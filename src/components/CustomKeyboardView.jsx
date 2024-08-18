import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React from 'react';

const ios = Platform.OS == 'ios';

const CustomKeyboardView = ({children, inChat}) => {
  let keyConfig = {};
  let scrollConfig = {};
  if (inChat) {
    keyConfig = {keyboardVerticalOffset: 90};
    scrollConfig = {contentContainerStyle: {flex: 1}};
  }
  return (
    <KeyboardAvoidingView
      behavior={ios ? 'padding' : 'height'}
      style={{flex: 1}}
      {...keyConfig}>
      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}
        {...scrollConfig}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardView;
