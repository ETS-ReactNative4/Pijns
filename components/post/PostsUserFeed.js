import React, { useState } from 'react';
import { View, FlatList } from 'react-native';

import { ButtonAsField } from '../common';
import ListItem from './ListItem';

const PostsUserFeed = ({ user, posts, pinPressed, redirect, navigationTab, fetchUserFeed }) => {
  const [refreshing, setRefreshing] = useState(false);

  const refreshList = async () => {
    setRefreshing(true);
    await fetchUserFeed(user.uid);
    setRefreshing(false);
  };

  const renderRow = (post) => {
    return (
      <ListItem
        post={post}
        redirect={redirect}
        navigationTab={navigationTab}
      />
    );
  };

  const renderOnlyPinnedRow = (post) => {
    return (
      <ListItem
        post={post}
        redirect={redirect}
        pinnedOnly
        navigationTab={navigationTab}
      />
    );
  };

  const renderHeader = () => {
    const { writePostView, buttonStyle } = styles;

    return (
      <View style={writePostView}>
        <ButtonAsField
          onPress={() => redirect('UserFeed_SearchFriends', { navigationTab })}
          buttonRestyle={buttonStyle}
          iconName={'search1'}
        >Search for friends
        </ButtonAsField>
      </View>
    );
  };
  console.log(posts);
  if (pinPressed) {
    return (
      <View style={styles.masterContainerStyle}>
        <FlatList
          data={posts}
          renderItem={({ item }) => renderOnlyPinnedRow(item)}
          ListHeaderComponent={renderHeader}
          keyExtractor={({ item }, postId) => postId.toString()}
          onRefresh={refreshList}
          refreshing={refreshing}
          pinPressed
        />
      </View>
    );
  }

  return (
    <View style={styles.masterContainerStyle}>
      <FlatList
        data={posts}
        renderItem={({ item }) => renderRow(item)}
        ListHeaderComponent={renderHeader}
        keyExtractor={({ item }, postId) => postId.toString()}
        onRefresh={refreshList}
        refreshing={refreshing}
      />
    </View>
  );
};

const styles = {
  masterContainerStyle: {
    flex: 1,
    backgroundColor: '#cef0ff',
  },
  writePostView: {
    paddingTop: 10,
    paddingBottom: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  inputContainerStyle: {
    backgroundColor: '#fff',
    borderRadius: 25,
    margin: 10,
  },
  buttonStyle: {
    borderRadius: 25,
  }
};

export default PostsUserFeed;