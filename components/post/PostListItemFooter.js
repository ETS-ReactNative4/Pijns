import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';

import { ActionButton } from '../common';
import PostCounts from './PostCounts';
import PostPrayerAnswered from './PostPrayerAnswered';
import {
  commentsPopulate,
  fetchPostCommentLikes,
  setActivePost,
  answerPrayer,
  unanswerPrayer
} from '../../actions';
import { addPijnNotification } from '../../api/notifications';

class PostListItemFooter extends Component {
  state = {
    noteCount: this.props.post.notes ? this.props.post.notes.count : 0,
    commentCount: this.props.post.commentCount || 0,
  }

  goToComments = async () => {
    const { redirect, post, navigationTab } = this.props;
    const { user, postId, author, index, navigation } = post;

    await this.props.fetchPostCommentLikes({ userId: user.uid, postId });
    await this.props.commentsPopulate(postId);
    await this.props.setActivePost({ postId, postAuthor: author });

    navigation.navigate(`${navigationTab}_Comments`, {
      user, postAuthorId: author.id, postId, redirect, index
    });
  };

  goToChat = async () => {
    const { redirect, post, navigationTab } = this.props;
    const { user, postId, author, index, navigation } = post;

    navigation.navigate(`${navigationTab}_Chat`, {
      user, postAuthorId: author.id, postId, redirect, index
    });
  }

  goToPostNotes = async () => {
    const { navigationTab, post } = this.props;
    const { user, postId, author, index, navigation } = post;

    navigation.navigate(`${navigationTab}_Notes`, {
      user, postAuthorId: author.id, postId, index, navigationTab
    });
  };

  displayNoteCount = () => {
    const { post, navigationTab } = this.props;
    const { notes } = post;
    const noteCount = notes ? notes.count : 0;
    return (
      navigationTab === 'FriendPosts' ? this.state.noteCount : noteCount
    );
  }

  displayCommentCount = () => {
    const { post, navigationTab } = this.props;
    const { commentCount } = post;
    let displayCommentCount;

    if (navigationTab === 'FriendPosts') {
      displayCommentCount = this.state.commentCount;
    }
    if (navigationTab === 'MyPosts') {
      displayCommentCount = !commentCount ? 0 : commentCount;
    }

    return displayCommentCount;
  }

  sendPijn = ({ postId, author, currentDate, user, post }) => {
    const { navigationTab } = this.props;

    if (navigationTab === 'FriendPosts') {
      this.setState({ noteCount: this.state.noteCount + 1 });
    }

    this.props.post.sendPijn({ postId, author, currentDate, user });
    this.props.addPijnNotification(user.uid, postId, post);
  }

  worshipHandsPress = ({ postId, user }) => {
    if (this.props.post.answered) {
      this.props.unanswerPrayer({ postId, user });
    } else {
      this.props.answerPrayer({ postId, user });
    }
  }

  postActionButtons({ postId, author, currentDate, user }) {
    const { post } = this.props;
    const { pijnSentToday } = post;
    const { actionsViewStyle, worshipHandsInactive, worshipHandsActive } = styles;
    const whStyle = this.props.post.answered ? worshipHandsActive : worshipHandsInactive;

    return (
      <View style={actionsViewStyle}>
        <ActionButton
          imageSource={require('../../assets/images/pijn.png')}
          iconStyle={{ height: 24, width: 26 }}
          onPress={() => this.sendPijn({ postId, author, currentDate, user, post })}
          disabled={pijnSentToday}
        />
        <ActionButton
          imageSource={require('../../assets/images/comment.png')}
          onPress={this.goToComments}
        />
        {user.uid === author.id ? (
            <ActionButton
              imageSource={require('../../assets/images/praise.png')}
              iconStyle={whStyle}
              onPress={() => this.worshipHandsPress({ postId, user })}
            />
          ) : (
            <ActionButton
              imageSource={require('../../assets/images/message.png')}
              onPress={this.goToChat}
            />
          )
        }
      </View>
    );
  }

  render() {
    const { dividerStyle } = styles;
    const { post, pinnedOnly } = this.props;
    const { user, author, index, postId, answered, pinned } = post;
    const currentDate = new Date(
      new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
    );

    if (pinnedOnly && !pinned) {
      return null;
    }

    return (
      <View>
        <PostCounts
          noteCount={this.displayNoteCount()}
          commentCount={this.displayCommentCount()}
          commentsPress={() => this.goToComments({
            user, postId, author, index
          })}
          notesPress={this.goToPostNotes}
        />
        {answered ? (
          <View>
            <Divider style={dividerStyle} />
            <PostPrayerAnswered date={answered} />
            <Divider style={dividerStyle} />
          </View>
        ) : (
          <Divider style={dividerStyle} />
        )}
        {this.postActionButtons({ postId, author, currentDate, user })}
      </View>
    );
  }
}

const styles = {
  dividerStyle: {
    backgroundColor: '#D3D3D3',
    marginTop: 10,
    marginBottom: 10
  },
  actionsViewStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 60,
    paddingRight: 60
  },
  worshipHandsInactive: {
    height: 24,
    width: 27,
    marginLeft: -1.5,
  },
  worshipHandsActive: {
    height: 24,
    width: 27,
    marginLeft: -1.5,
    tintColor: '#50C35C'
  },
};

function mapStateToProps() {
  return { addPijnNotification };
}

export default connect(mapStateToProps, {
  commentsPopulate,
  setActivePost,
  fetchPostCommentLikes,
  answerPrayer,
  unanswerPrayer,
})(PostListItemFooter);
