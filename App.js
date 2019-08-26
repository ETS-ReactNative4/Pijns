import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert } from 'react-native';
import { AppLoading, Notifications } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import { Provider } from 'react-redux';
import firebase from 'firebase';

import registerForPushNotifications from './services/push_notifications';
import store from './store';
import AppNavigator from './navigation/AppNavigator';

export default class App extends React.Component {
  constructor() {
    super();
    const config = {
      apiKey: 'AIzaSyAkJ1IrLTNndMvek06DEyEHCifEYbecFGQ',
      authDomain: 'pijns-dc1c1.firebaseapp.com',
      databaseURL: 'https://pijns-dc1c1.firebaseio.com',
      projectId: 'pijns-dc1c1',
      storageBucket: 'pijns-dc1c1.appspot.com',
      messagingSenderId: '307732575398'
    };
    firebase.initializeApp(config);
  }

  state = {
    isLoadingComplete: false,
  };

  componentDidMount() {
    registerForPushNotifications();
    Notifications.addListener((notification) => {
      const { data: { text }, origin } = notification;

      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text: 'Ok' }]
        );
      }
    });
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/love-note.png'),
        require('./assets/images/pijn.png'),
        require('./assets/images/comment.png'),
        require('./assets/images/message.png'),
        require('./assets/images/praise.png'),
        require('./assets/images/ellipsis.png'),
        require('./assets/images/heart.png'),
        require('./assets/images/typing.png'),
        require('./assets/images/dot.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'coiny': require('./assets/fonts/Coiny-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
