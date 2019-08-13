import React from 'react';
import { View, Text, Dimensions } from 'react-native';

import { ButtonAsText, ListItemAsButton } from '../../components/common';
import { deleteNotification, resetNotificationsCount } from '../../api/notifications';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Notification = ({ item, navigation, navigationTab, currentUser }) => {
  if (item.count || item.count === 0) { return null; }

  const {
    notificationStyle, messageStyle, nameStyle, contentStyle, xViewStyle, xStyle
  } = styles;
  const { id, content, postId, sender } = item;
  const { name, picture } = sender;

  const message = () => {
    return (
      <Text style={messageStyle}>
        <Text style={nameStyle}>{name} </Text>
        sent you a pijn note! You received prayer for "
        <Text style={contentStyle}>{content}"</Text>
      </Text>
    );
  };

  const goToPostNotes = () => {
    resetNotificationsCount(currentUser.uid);
    navigation.navigate(`${navigationTab}_Notes`, {
      user: currentUser,
      postAuthorId: currentUser.uid,
      postId,
      navigationTab
    });
  };

  return (
    <View style={notificationStyle}>
      <ListItemAsButton
        text={message()}
        imageSource={picture}
        onPress={goToPostNotes}
        textRestyle={messageStyle}
        numberOfLines={2}
      />
      <View style={xViewStyle}>
        <ButtonAsText
          editTextStyle={xStyle}
          onPress={() => deleteNotification(currentUser.uid, id)}
        >x</ButtonAsText>
      </View>
    </View>
  );
};

const styles = {
  notificationStyle: {
    flexDirection: 'row',
    flex: 1,
  },
  messageStyle: {
    width: SCREEN_WIDTH - 100,
    fontSize: 15
  },
  nameStyle: {
    fontWeight: '600'
  },
  contentStyle: {
    fontStyle: 'italic'
  },
  xViewStyle: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  xStyle: {
    paddingBottom: 2,
    fontWeight: '700',
    fontSize: 14
  },
};

export default Notification;
