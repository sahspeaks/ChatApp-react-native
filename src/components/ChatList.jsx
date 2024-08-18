import {View, Text, FlatList, RefreshControl} from 'react-native';
import React, {useState} from 'react';

import ChatItem from '../components/ChatItem';

const ChatList = ({users, navigation, route, currentUser, onRefresh}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{flex: 1, paddingVertical: 25}}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <ChatItem
            currentUser={currentUser}
            navigation={navigation}
            route={route}
            item={item}
            index={index}
            noBorder={index + 1 == users.length}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default ChatList;
