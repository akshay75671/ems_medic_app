import React, { Component } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar, View, LogBox } from 'react-native';
import RootNavigation from './src';
import { logoutUser } from './src/services/authServices';
import { Colors } from './src/styles';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { Provider as MobxProvider } from 'mobx-react';
import stores from './src/mobx';
import PushNotification from 'react-native-push-notification';

LogBox.ignoreAllLogs()


class App extends Component {
  constructor(props: Readonly<{}>) {
    super(props);
  }
  componentDidMount() {
    PushNotification.configure({
      onRegister: function (token) {
        //console.log('TOKEN:', channelId: token);
      },
      onNotification: function (notification) {
        //console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'ems_medic_channel',
        channelName: 'My channel',
        channelDescription: 'A channel to categorise your notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      //(created) => console.log(`createChannel returned '${created}'`),
    );
  }
  componentWillUnmount() {
    //logoutUser();
    // setSessionData('signedIn', 'in');
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.primaryBackgroundColor }}>
        <StatusBar backgroundColor={Colors.primary}></StatusBar>

        <Provider store={store}>
          <MobxProvider {...stores}>
            <RootNavigation />
          </MobxProvider>
        </Provider>
      </View>
    );
  }
}

export default App;

// import React, { Component } from "react";
// import { Platform, StyleSheet, Text, View, SafeAreaView } from "react-native";
// import { Provider } from "mobx-react";
// import stores from "./src/mobx/testStore";
// import RootNavigator from "./RootNavigator";

// export default class App extends Component {
//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <Provider {...stores}>
//           <RootNavigator />
//         </Provider>
//       </View>
//     );
//   }
// }
