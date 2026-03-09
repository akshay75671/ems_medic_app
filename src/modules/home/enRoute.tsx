import React, {FC, useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  Colors,
  Fonts,
  commonStyles,
  boxModelSize,
  boxModel,
  fontSize,
} from '../../styles';
import {scale} from 'react-native-size-matters';
import Constants from '../../core/constants';

import {
  CustIcon,
  CustMapView,
  PatientDetails,
  IDCard,
  BottomNavigation,
} from './../../components';

import {Dimensions, PanResponder, Animated, Easing} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';
import Geolocation from 'react-native-geolocation-service';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type enRouteProps = {
  navigation: drawerNavigationProp;
  assistRequests: any;
  profile: any;
};
const EnRoute: FC<enRouteProps> = (props) => {
  const {height, width} = Dimensions.get('window');
  const [idCardVisible, setIdCardVisible] = useState(false);
  const [cardContainerVisible, setCardContainerVisible] = useState(true);
  const [toTop, setToTop] = useState(true);
  const [sPosition, setSPosition] = useState(
    new Animated.ValueXY({x: 0, y: height - scale(360)}),
  );
  const [userMarker, setUserMarker] = useState(null);
  const [patientMarker, setPatientMarker] = useState(null);
  const [duration, setDuration] = useState<number>(0);
  const [epcrNum, setEPCRnum] = useState<number>(0);
  const [pageMoved, setPageMoved] = useState<boolean>(false);

  useEffect(() => {
    let watchID = Geolocation.watchPosition(
      (position) => {
        setUserMarker({
          label: 'Your Location',
          icon: {uri: props.profile.profile.profilePicUri},
          tooltip: 'w3w: apple.mango.banana',
          borderColor: props.profile.profile.statusColor,
          coordinate: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => console.warn('Location error :' + JSON.stringify(error)),
      {
        enableHighAccuracy: false,
        useSignificantChanges: false,
        distanceFilter: 2.0,
      },
    );
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);
  useEffect(() => {
    setUserMarker({
      label: 'Your Location',
      icon: {uri: props.profile.profile.profilePicUri},
      coordinate: JSON.parse(JSON.stringify(props.profile.profile.medicLocn)),
      tooltip: 'w3w: apple.mango.banana',
      borderColor: props.profile.profile.statusColor,
    });
  }, [props.profile.profile]);
  useEffect(() => {
    setPatientMarker({
      label: props.assistRequests.activeAssistUser.fullName,
      icon: {uri: props.assistRequests.activeAssistUser.profilePicUri},
      coordinate: JSON.parse(
        JSON.stringify(props.assistRequests.activeAssistUser.assistLocn),
      ),
      tooltip: 'w3w: apple.mango.chikoo',
      borderColor: '#ffffff',
    });
  }, [
    props.assistRequests.activeAssistUser.assistLocn.latitude,
    props.assistRequests.activeAssistUser.assistLocn.longitude,
  ]);

  const parentResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (e, gestureState) => {
      return false;
    },
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (e, gestureState) => {
      if (toTop) {
        return gestureState.dy > 6;
      } else {
        return gestureState.dy < -6;
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      //toTop ? snapToBottom() : snapToTop();
    },
    onPanResponderRelease: (evt, gestureState) => {
      toTop ? snapToBottom() : snapToTop();
    },
  });

  function snapToTop() {
    Animated.timing(sPosition, {
      toValue: {x: 0, y: height - scale(360)},
      duration: 300,
      useNativeDriver: false,
      easing: Easing.in(Easing.linear),
    }).start(() => {
      setToTop(true);
    });
  }

  function snapToBottom() {
    Animated.timing(sPosition, {
      toValue: {x: 0, y: height - scale(160)},
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.bounce),
    }).start(() => {
      setToTop(false);
    });
  }
  const onUpdate = (state: any) => {
    setDuration(state.duration);
    if (state.distance * 1000 < 30) {
      setPageMoved(true);
      if (!pageMoved) props.navigation.navigate('OnScene');
    }
  };
  const onInfoClicked = () => {
    props.navigation.navigate('Info');
  };
  const onResourceClicked = () => {
    props.navigation.navigate('Resource');
  };
  const assistProfileChanged = (assistObj) => {
    setEPCRnum(assistObj.epcrNum);
  };
  const assistProfileClicked = () => {};

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.masterContainer}>
        <View style={commonStyles.container}>
          {userMarker && patientMarker && (
            <CustMapView
              userMarker={userMarker}
              patientMarker={patientMarker}
              medicMarkers={[]}
              initWithDirection={true}
              isFullScreen={true}
              navigationUpdate={onUpdate}
            />
          )}

          <Animated.View
            style={[styles.draggable, {height}, sPosition.getLayout()]}
            {...parentResponder.panHandlers}>
            <View
              style={[
                boxModel({type: 'padding', size: 'l', places: 'trl'}),
                {width: '100%'},
              ]}>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    height: scale(5),
                    width: scale(40),
                    backgroundColor: Colors.borderGrey,
                    borderRadius: scale(5),
                  }}></View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: boxModelSize.xl,
                }}>
                <Text style={styles.label}>{'EPCR ' + epcrNum}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <CustIcon
                    type="font-awesome-5"
                    name={'walking'}
                    size={scale(17)}
                    color={Colors.iconGrey}
                  />
                  <Text style={styles.timeLabel}>Started : </Text>
                  <Text style={styles.time}>ETA {duration} min</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                padding: boxModelSize.xl,
                width: '100%',
              }}>
              <PatientDetails
                showCall
                showChat
                onTapViewId={() => {
                  setIdCardVisible(true), setCardContainerVisible(false);
                }}
                onTapInfo={onInfoClicked}
                onTapResource={onResourceClicked}
                profileChanged={assistProfileChanged}
                profileClicked={assistProfileClicked}
              />
            </View>
          </Animated.View>
          {idCardVisible ? (
            <IDCard
              onClose={() => {
                setIdCardVisible(false), setCardContainerVisible(true);
              }}></IDCard>
          ) : null}
        </View>
        <View style={commonStyles.footerContainer}>
          <BottomNavigation />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.primaryBold,
    color: Colors.primary,
    fontSize: fontSize.h5,
  },
  timeLabel: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: scale(11),
    color: Colors.primary,
    marginTop: scale(5),
    paddingLeft: scale(10),
  },
  time: {
    fontFamily: Fonts.primaryRegular,
    fontSize: scale(11),
    color: Colors.placeholderGrey,
    marginTop: scale(5),
  },
  draggable: {
    position: 'absolute',
    right: 0,
    backgroundColor: Colors.white,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    alignItems: 'center',
  },
});

export default inject('assistRequests', 'profile')(observer(EnRoute));
