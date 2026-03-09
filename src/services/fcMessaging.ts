import Messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMessaging {
  private unsubscribe;
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListerners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS == 'ios') {
      await Messaging().registerDeviceForRemoteMessages();
      await Messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission(onRegister: any) {
    Messaging()
      .hasPermission()
      .then((enabled) => {
        enabled
          ? this.getToken(onRegister)
          : this.requestPermission(onRegister);
      })
      .catch((err) => {
        console.error('message permission: ', err);
      });
  }

  getToken = (onRegister: any) => {
    Messaging()
      .getToken()
      .then((fcmToken) => {
        fcmToken
          ? onRegister(fcmToken)
          : console.log('user does not have token');
      })
      .catch((err) => {
        console.error('message getting token: ', err);
      });
  };

  requestPermission = (onRegister: any) => {
    Messaging()
      .requestPermission()
      .then((fcmToken) => {
        this.getToken(onRegister);
      })
      .catch((err) => {
        console.error('message getting permission: ', err);
      });
  };

  createNotificationListerners(
    onRegister: any,
    onNotification: any,
    onOpenNotification: any,
  ) {
    Messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from onNotificationOpenedApp state',
      );
      // console.log(remoteMessage);
      // if (remoteMessage) {
      //   onOpenNotification(remoteMessage.notification);
      // }
    });
    Messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('Notification caused app to open from quit state');
        // console.log(remoteMessage);
        // if (remoteMessage) {
        //   onOpenNotification(remoteMessage.notification);
        // }
      });
    this.unsubscribe = Messaging().onMessage(async (remoteMessage) => {
      console.log('Notification caused app to open from foreground state');
      if (remoteMessage) {
        let notification = null;
        notification =
          Platform.OS === 'ios'
            ? remoteMessage.data.notification
            : remoteMessage.notification;
        onNotification(notification);
      }
    });
    Messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Notification caused app to open from background state');
      // console.log(remoteMessage);
      // if (remoteMessage) {
      //   let notification = null;
      //   notification =
      //     Platform.OS === 'ios'
      //       ? remoteMessage.data.notification
      //       : remoteMessage.notification;
      //   onNotification(notification);
      // }
    });
    Messaging().onTokenRefresh((fcmToken) => {
      onRegister(fcmToken);
    });
  }
  unRegister = () => {
    this.unsubscribe();
  };
}

export const fcMessaging = new FCMessaging();
