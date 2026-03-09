import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

import fireStore from '@react-native-firebase/firestore';
import {getDistance, convertDistance} from 'geolib';
import Constants from '../core/constants';

export const updateLocation = (refID, location) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users')
      .doc(refID)
      .update({
        location: location,
      })
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getPTPDistance = (sourceLocation, distinationLocation) => {
  try {
    let distance: number = getDistance(sourceLocation, distinationLocation, 1);
    let convertedDistance = convertDistance(distance, Constants.DISTANCE_UNIT);
    let final =
      Constants.DISTANCE_UNIT == 'km'
        ? convertedDistance.toFixed(1)
        : convertedDistance;
    return final + ' ' + Constants.DISTANCE_UNIT;
  } catch (error) {
    console.log(error);
  }
};

export const enableLocationService = (callback) => {
  if (Platform.OS == 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'EMS Medic Service Location Permission',
        message:
          'Enabling Location usage will allow us to give you better service.',
        buttonPositive: 'OK',
      },
    ).then((granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        LocationServicesDialogBox?.forceCloseDialog();
        LocationServicesDialogBox?.checkLocationServicesIsEnabled({
          message:
            'Turn on location services to allow "EMS Medic" to determine your location',
          ok: 'Settings',
          cancel: null,
          enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
          showDialog: true, // false => Opens the Location access page directly
          openLocationServices: true, // false => Directly catch method is called if location services are turned off
          preventOutSideTouch: true, //true => To prevent the location services popup from closing when it is clicked outside
          preventBackClick: true, //true => To prevent the location services popup from closing when it is clicked back button
          providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
        })
          .then(
            function (success) {
              // if success then start fetching users location

              if (success.enabled == true) {
                callback(true);
              }
            }.bind(this),
          )
          .catch((error) => {
            console.warn('LSDB error:', error.message);
            enableLocationService(callback);
          });
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        enableLocationService(callback);
      }
    });
  } else {
    //Location service handler for iOS

    Geolocation.requestAuthorization('always');

    callback(true);
  }
};
