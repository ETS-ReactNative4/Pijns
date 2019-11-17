import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import PostListPublic from '../components/post/PostListPublic';
import ProfileHeaderPublic from '../components/profile/ProfileHeaderPublic';
import { friendPostsFetch, clearFriend } from '../actions';

class PublicProfileScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  constructor(props) {
    super(props);
    const profileUser = props.navigation.getParam('profileUser');

    // param comes in as user.userId from search and as user.uid from friends
    const profileId = !profileUser.uid ? profileUser.profileUserId : profileUser.uid;

    this.profileUser = profileUser;
    this.profileId = profileId;
    this.friendStatus = 'waiting';
    props.friendPostsFetch(profileId);
  }

  shouldComponentUpdate(newProps) {
    const { friendId } = newProps.friend;
    return this.profileId === friendId;
  }

  componentWillUnmount() {
    this.props.clearFriend();
  }

  renderHeader = (picture, name, userId, status, redirect, friend) => {
    return (
      <ProfileHeaderPublic
        imgSource={{ uri: `${picture}?type=large` }}
        name={name}
        userId={userId}
        status={status}
        redirect={redirect}
        friend={friend}
      />
    );
  }

  render() {
    const { navigation, posts, friend } = this.props;
    const { navigate } = navigation;
    const redirect = navigate;

    let status = navigation.getParam('status');
    if (!status) { status = friend.status; }
    if (this.friendStatus === 'waiting') { this.friendStatus = status; }

    const {
      profileId, profileUser, friendStatus,
      profileUser: { name, picture }
    } = this;

    return (
      <View style={styles.containerStyle}>
        <View>
          <PostListPublic
            header={this.renderHeader(
              picture, name, profileId, status, redirect, profileUser
            )}
            userId={profileId}
            posts={posts}
            redirect={redirect}
            status={status}
            onProfile
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  }
});

function mapStateToProps(state) {
  const { friend, user, pijnLog, pinboard, postLikes } = state;
  let posts = _.map(state.friend.posts, (val, uid) => {
    const pijnSentToday = !!pijnLog[uid];
    const pinned = !!pinboard[uid];
    const liked = !!postLikes[uid];
    const { navigation } = state;
    return {
      ...val, postId: uid, pijnSentToday, user, navigation, pinned, liked
    };
  }).reverse();
  return { friend, posts };
}

export default connect(mapStateToProps, {
  clearFriend, friendPostsFetch
})(PublicProfileScreen);
