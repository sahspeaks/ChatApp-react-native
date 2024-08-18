import {ScrollView} from 'react-native';
import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({messages, currentUser, scrollViewRef}) => {
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingTop: 10}}>
      {messages.map((message, index) => {
        return (
          <MessageItem
            message={message}
            currentUser={currentUser}
            key={index}
          />
        );
      })}
    </ScrollView>
  );
};

export default MessageList;
