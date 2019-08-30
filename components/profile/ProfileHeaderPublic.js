import React, { Component } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { Button } from '../../components/common';
import { friendRequest, unfriend, fetchFriendList } from '../../actions';
import { disabledGray, buttonBlue } from '../../assets/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ProfileHeaderPublic extends Component {
  state = { unfriend: 'Unfriend' };

  friendRequestButton(profileUserId, currentUser) {
    return (
      <Button
        onPress={() => this.props.friendRequest({ profileUserId, currentUser })}
      >
        Add Friend
      </Button>
    );
  }

  requestedButton() {
    const { buttonBorderGray, buttonTextGray } = styles;

    return (
      <Button
        buttonRestyle={buttonBorderGray}
        textRestyle={buttonTextGray}
        disabled
      >
        Requested
      </Button>
    );
  }

  unfriend(profileUserId, currentUser) {
    this.props.unfriend({ profileUserId, currentUser });
    this.setState({ unfriend: 'in progress...' });
  }

  unfriendButton(profileUserId, currentUser) {
    const { buttonBorderGray, buttonTextGray } = styles;

    return (
      <Button
        onPress={() => this.unfriend(profileUserId, currentUser)}
        buttonRestyle={buttonBorderGray}
        textRestyle={buttonTextGray}
      >
        {this.state.unfriend}
      </Button>
    );
  }

  seeRequestsButton() {
    const { buttonBodyBlue, buttonTextWhite } = styles;

    return (
      <Button
        onPress={() => this.props.redirect('Notifications')}
        buttonRestyle={buttonBodyBlue}
        textRestyle={buttonTextWhite}
      >
        See Requests
      </Button>
    );
  }

  chatButton() {
    const { currentUser, userId, navigationTab, redirect, friend } = this.props;

    redirect('Chats_Chat', {
      user: currentUser, postAuthorId: userId, friend
    });
  }

  renderFriendButtons(status) {
    const { currentUser, userId } = this.props;

    if (!status) {
      return this.friendRequestButton(userId, currentUser);
    } else if (status === 'Requested') {
      return this.requestedButton();
    } else if (status === 'See Requests') {
      return this.seeRequestsButton();
    } else if (status === 'Unfriend') {
      return this.unfriendButton(userId, currentUser);
    }
  }

  render() {
    const { imgSource, name } = this.props;

    const {
      containerStyle, imageStyle, nameStyle, buttonsViewStyle
    } = styles;

    let status = this.props.status;
    if (!status) { status = this.props.friend.status; }

    return (
      <View style={containerStyle}>
        <Image source={imgSource} style={imageStyle} />
        <Text style={nameStyle}>{name}</Text>
          <View style={buttonsViewStyle}>
            {this.renderFriendButtons(status)}
            <Button
              onPress={() => this.chatButton()}
            >Message</Button>
          </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 40,
    marginBottom: 5,
    width: SCREEN_WIDTH
  },
  imageStyle: {
    borderRadius: 70,
    height: 140,
    width: 140,
    marginBottom: 20
  },
  nameStyle: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 35
  },
  buttonsViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    alignSelf: 'stretch'
  },
  buttonBorderGray: {
    borderColor: disabledGray
  },
  buttonTextGray: {
    color: disabledGray
  },
  buttonBodyBlue: {
    borderColor: buttonBlue,
    backgroundColor: buttonBlue
  },
  buttonTextWhite: {
    color: 'white'
  }
};

function mapStateToProps(state) {
  return ({ currentUser: state.user });
}

export default connect(mapStateToProps, {
  friendRequest, unfriend, fetchFriendList
})(ProfileHeaderPublic);
