import React from 'react';
import { Text, View } from 'react-native';

import { ActionButton, ActionButtonStill, ButtonAsText } from '../common';
import { displayTimeAgo } from '../../functions/common';
import { pinPost, unpinPost } from '../../actions';
import { disabledGray } from '../../assets/colors';

const Banner = ({
  userId,
  author,
  redirect,
  postId,
  pinned,
  timestamp,
  createdOn,
  onProfile,
  navigationTab
}) => {
  const { name, picture } = author;
  const {
    containerStyle,
    thumbnailStyle,
    headerContentStyle,
    headerAuthorStyle,
    headerDetailStyle,
    rightIconViewStyle,
    buttonStyle,
    pinStyle,
    pinnedStyle
  } = styles;

  const posted = displayTimeAgo(timestamp, createdOn);

  const pinPress = async () => {
    if (pinned) {
      unpinPost({ postId, userId });
    } else {
      pinPost({ postId, userId });
    }
  };

  const goToPublicProfile = () => {
    if (userId === author.id) {
      redirect('Profile'); return;
    }

    redirect(`${navigationTab}_PublicProfile`, {
      profileUser: { ...author, uid: author.id },
      status: 'Unfriend',
      navigationTab: 'UserFeed'
    });
  };

  const pinButtonStyle = pinned ? pinnedStyle : pinStyle;
  const disabled = !!onProfile;

  return (
    <View style={containerStyle}>
      <ActionButton
        iconStyle={thumbnailStyle}
        imageSource={{ uri: picture }}
        onPress={goToPublicProfile}
        disabled={disabled}
      />

      <View style={headerContentStyle}>
        <ButtonAsText
          editTextStyle={headerAuthorStyle}
          onPress={goToPublicProfile}
          disabled={disabled}
        >
          {name}
        </ButtonAsText>
        <Text style={headerDetailStyle}>{posted}</Text>
      </View>

      <View style={rightIconViewStyle}>
        <ActionButtonStill
          buttonStyle={buttonStyle}
          iconName={'pushpino'}
          iconStyle={pinButtonStyle}
          iconSize={20}
          onPress={pinPress}
        />
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    paddingBottom: 10,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative'
  },
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 10
  },
  headerAuthorStyle: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  headerDetailStyle: {
    fontSize: 14,
    fontWeight: '100',
    color: 'gray'
  },
  thumbnailStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  rightIconViewStyle: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 5
  },
  buttonStyle: {
    alignItems: 'flex-start'
  },
  pinStyle: {
    transform: [
      { scaleX: -1 }
    ]
  },
  pinnedStyle: {
    color: disabledGray,
    transform: [
      { scaleX: -1 }
    ]
  },
};

export default Banner;
