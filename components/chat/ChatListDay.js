import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, FlatList } from 'react-native';
import _ from 'lodash';

import ChatListMessage from './ChatListMessage';
import { likeComment } from '../../actions';
import { displayTimeAgo } from '../../functions/common';
import { lightTextGray } from '../../assets/colors';

class ChatListDay extends Component {
  renderMessage = (message) => {
    return (
      <ChatListMessage message={message} />
    );
  }

  render() {
    const { containerStyle } = styles;
    const { date, messages } = this.props.chatDay;

    return (
      <View style={containerStyle}>
        <Text>{date}</Text>
        {
          messages.map(message => {
            return (
              <ChatListMessage message={message} />
            );
          })
        }
      </View>
    );
  }
}
// <FlatList
//   data={messages}
//   renderItem={({ item }) => this.renderMessage(item)}
//   keyExtractor={({ item }, messageId) => messageId.toString()}
//   />

const styles = {
  containerStyle: {
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderColor: '#DDDDDD'
  },
  dateStyle: {

  }
};

function mapStateToProps(state) {
  const { user, activePost, postCommentLikes } = state;
  return { user, activePost, postCommentLikes };
}

export default connect(mapStateToProps, { likeComment })(ChatListDay);
