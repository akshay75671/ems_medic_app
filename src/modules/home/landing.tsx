import React, {FC, useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../styles';
import Constants from '../../core/constants';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  BottomNavigation,
  CustIcon,
  CustMapView,
  ProgressBar,
} from '../../components';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';
import {getDistance, convertDistance, isPointInPolygon} from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import {
  enableLocationService,
  getPTPDistance,
} from '../../services/locationService';
import {stat} from 'react-native-fs';
import {useFocusEffect} from '@react-navigation/native';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  profile: any;
  medicProviders: any;
  medicCamps: any;
  eventStore: any;
};
const Landing: FC<navigationProps> = (props) => {
  let watchID;
  const [userMarker, setUserMarker] = useState(null);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState('');
  const [showLoader, setLoader] = useState<boolean>(false);
  const [patientMarker, setPatientMarker] = useState(null);
  const [screenFocused, setScreenFocused] = useState<boolean>(false);
  const setWatchPosition = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        let _coords = position.coords;
        let pointInPolygon = isPointInPolygon(
          {
            latitude: _coords.latitude,
            longitude: _coords.longitude,
          },
          JSON.parse(JSON.stringify(props.eventStore.event.locationFence)),
        );
        if (pointInPolygon && screenFocused) {
          Geolocation?.clearWatch(watchID);
          props.profile.updateUserPlace(true);
          props.navigation.navigate('EventHome');
        } else {
          setUserMarker({
            label: 'Your Location',
            icon: {uri: props.profile.profile.profilePicUri},
            tooltip: 'w3w: apple.mango.banana',
            borderColor: props.profile.profile.statusColor,
            coordinate: {
              latitude: _coords.latitude,
              longitude: _coords.longitude,
            },
          });
          setDistance(
            getPTPDistance(
              {
                latitude: _coords.latitude,
                longitude: _coords.longitude,
              },
              props.eventStore.event.location,
            ),
          );
        }
      },
      (error) => console.log('Location error :' + JSON.stringify(error)),
      {
        enableHighAccuracy: true,
        useSignificantChanges: false,
        distanceFilter: 2.0,
      },
    );
  };
  const getCurrentPosition = (hasLocationPermission) => {
    if (!hasLocationPermission) return;
    // props.profile.fetchUserData({
    //   latitude: 12.8615,
    //   longitude: 77.6074,
    // });
    Geolocation.getCurrentPosition((position) => {
      props.profile.fetchUserData({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };
  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => {
        setScreenFocused(false);
        Geolocation?.clearWatch(watchID);
      };
    }, []),
  );

  useEffect(() => {
    enableLocationService(getCurrentPosition);
  }, []);
  useEffect(() => {
    //console.log(props.eventStore.event);
    if (props.eventStore.event) {
      props.medicProviders.fetchMedicData(props.eventStore.event.eventID);
      props.medicCamps.fetchMedicCampsData(props.eventStore.event.eventID);
      setWatchPosition();
      setPatientMarker({
        label: props.eventStore.event.name,
        coordinate: JSON.parse(JSON.stringify(props.eventStore.event.location)),
        icon: Constants.SEARCH_MARKER_ICON,
      });
    }
  }, [props.eventStore.event]);
  useEffect(() => {
    if (props.profile.profile) {
      props.profile.checkAssignedEvent();
    }
  }, [props.profile.profile]);
  useEffect(() => {
    if (
      !props.profile.loading &&
      !props.eventStore.loading &&
      !props.medicProviders.loading &&
      !props.medicCamps.loading
    )
      setLoader(false);
    else setLoader(true);
  }, [
    props.profile.loading,
    props.eventStore.loading,
    props.medicProviders.loading,
    props.medicCamps.loading,
  ]);
  const onUpdate = (state: any) => {
    setDuration(state.duration);
  };
  const openLeftMenu = () => {
    props.navigation.openDrawer();
  };
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {showLoader && <ProgressBar />}
      <View style={commonStyles.topBGContainer}>
        <View style={commonStyles.bgImageContainer}>
          <Image
            style={commonStyles.bgImage}
            source={Constants.BACKGROUND_IMAGE}
          />
        </View>
      </View>
      <View style={commonStyles.bottomBGContainer}></View>
      <View style={commonStyles.masterContainer}>
        <View
          style={[
            commonStyles.container,
            commonStyles.containerSpacing,
            {flex: 1},
          ]}>
          <View style={styles.profileImgContainer}>
            <View style={[styles.profileImgBG]}>
              {props.profile.profile != null && (
                <Image
                  style={{
                    width: scale(115),
                    height: scale(115),
                    borderRadius: scale(80),
                  }}
                  source={{uri: props.profile.profile.profilePicUri}}
                />
              )}
            </View>
            <View style={styles.leftMenuIcon}>
              <TouchableOpacity onPress={openLeftMenu}>
                <CustIcon
                  type="font-awesome"
                  name="bars"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.contentContainer, {padding: boxModelSize.m}]}>
            {props.profile.profile != null && (
              <View style={styles.profileName}>
                <Text
                  style={[
                    commonStyles.whiteBoxTitle,
                    {
                      textAlign: 'center',
                      paddingBottom: boxModelSize.xxl,
                      paddingTop: boxModelSize.xxl,
                    },
                  ]}>
                  {props.profile.profile.fullName}
                </Text>
              </View>
            )}
            {props.eventStore.event == null && (
              <View>
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: boxModelSize.l,
                    marginTop: boxModelSize.l,
                  }}>
                  <Image
                    style={{
                      width: scale(240),
                      height: scale(160),
                      resizeMode: 'contain',
                    }}
                    source={Constants.USER_EVENT}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      commonStyles.defaultBodyText,
                      {textAlign: 'center'},
                    ]}>
                    You are not part of any event
                  </Text>
                </View>
              </View>
            )}
            {userMarker && (
              <View style={{flex: 0.9}}>
                <View style={styles.mapMasterContainer}>
                  <View style={styles.mapContainer}>
                    <CustMapView
                      userMarker={userMarker}
                      patientMarker={patientMarker}
                      showSearch={false}
                      medicMarkers={[]}
                      isFullScreen={false}
                      initWithDirection={true}
                      navigationUpdate={onUpdate}
                      locationFence={JSON.parse(
                        JSON.stringify(props.eventStore.event.locationFence),
                      )}
                    />
                  </View>
                </View>
                <View style={styles.eventInfoContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.label}>Distance:</Text>
                      <Text style={styles.labelHighlight}>{distance}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.label}>Duration:</Text>
                      <Text style={styles.labelHighlight}>
                        {duration + ' min'}
                      </Text>
                    </View>
                  </View>
                  <View style={{marginTop: boxModelSize.l}}>
                    <Text style={styles.eventTitle}>
                      {props.eventStore.event.name}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.label}>
                      {props.eventStore.event.address}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={commonStyles.footerContainer}>
          <BottomNavigation />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileImgContainer: {
    flex: 0.15,
    zIndex: 2,
    alignItems: 'center',
    // backgroundColor:'red'
  },
  profileImgBG: {},
  contentContainer: {
    flex: 0.85,
    backgroundColor: Colors.backgroundwhite,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  profileName: {flex: 0.1, marginBottom: boxModelSize.m},
  mapMasterContainer: {
    flex: 0.6,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderColor: Colors.borderGrey,
    borderWidth: 1,
    borderRadius: Constants.BOX_REDIUS,
  },
  eventInfoContainer: {
    flex: 0.4,
    justifyContent: 'center',
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
    textAlign: 'center',
  },
  labelHighlight: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h6,
    color: Colors.primary,
    paddingLeft: boxModelSize.s,
  },
  eventTitle: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h3,
    color: Colors.primary,
    textAlign: 'center',
  },
  leftMenuIcon: {
    position: 'absolute',
    top: '50%',
    left: '10%',
  },
});

export default inject(
  'profile',
  'medicProviders',
  'medicCamps',
  'eventStore',
)(observer(Landing));
