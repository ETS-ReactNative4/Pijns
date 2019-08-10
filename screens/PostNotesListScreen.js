import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { NoteListItem, PeopleList } from '../components/common';
import { getFriendStatus, fetchPostNotes, notesClear } from '../actions';

class PostNotesListScreen extends Component {
  static navigationOptions = {
    title: 'Notes',
  };

  constructor(props) {
    super(props);
    const postId = this.props.navigation.getParam('postId');

    this.props.fetchPostNotes({ postId });
  }

  componentWillUnmount() {
    this.props.notesClear();
  }

  goToProfile = (note) => {
    const profileUserId = note.uid;
    const { uid } = this.props.currentUser;
    const { getParam, navigate, push } = this.props.navigation;
    const navigationTab = getParam('navigationTab');

    this.props.getFriendStatus({ profileUserId, currentUserId: uid });

    if (profileUserId !== uid) {
      push(`${navigationTab}_PublicProfile`, { profileUser: note, navigationTab });
    } else if (navigationTab === 'Profile') {
      push('Profile');
    } else {
      navigate('Profile');
    }
  }

  renderRow = (note) => {
    return (
      <NoteListItem
        note={note}
        onPress={() => this.goToProfile(note)}
      />
    );
  }

  render() {
    return (
      <PeopleList
        data={this.props.notes}
        renderItem={({ item }) => this.renderRow(item)}
        keyExtractor={({ item }, uid) => uid.toString()}
      />
    );
  }
}

function mapStateToProps(state) {
  let notes = _.map(state.postNotes, (val) => {
    return { ...val };
  }).reverse();
  const { user } = state;
  return { notes, currentUser: user };
}

export default connect(mapStateToProps, {
  getFriendStatus,
  fetchPostNotes,
  notesClear
})(PostNotesListScreen);
