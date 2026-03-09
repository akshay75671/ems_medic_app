import React, {useState, useEffect, FC, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import {
  BottomNavigation,
  CustButton,
  CustIcon,
  CustMapView,
  EPCRCards,
} from '../../components';
import Constants from '../../core/constants';
import {
  commonStyles,
  Colors,
  Fonts,
  fontSize,
  boxModelSize,
} from '../../styles';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {observer, inject} from 'mobx-react';
import {HomeDrawerMenuParamList} from '../../types/navigationsTypes';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {scale} from 'react-native-size-matters';
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {getProfileStateColor} from '../../core/utils';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type eventHomeProps = {
  navigation: drawerNavigationProp;
  userW3WLocation: any;
  assistRequests: any;
  profile: any;
  medicProviders: any;
  medicCamps: any;
  eventStore: any;
};
const EventHome: FC<eventHomeProps> = (props) => {
  const [fullScreenMap, setFullScreenMap] = useState(false);
  const [userMarker, setUserMarker] = useState(null);
  const [medicMarkers, setMedicMarkers] = useState([]);
  const [screenFocused, setScreenFocused] = useState<boolean>(false);
  const button_size = 109;
  const button_icon_size = 30;
  let watchID: any;
  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => setScreenFocused(false);
    }, []),
  );
  useEffect(() => {
    if (userMarker)
      setUserMarker({
        ...userMarker,
        borderColor: props.profile.profile.statusColor,
      });
  }, [props.profile.profile.status]);
  useEffect(() => {
    setUserMarker({
      label: 'Your Location',
      icon: {uri: props.profile.profile.profilePicUri},
      tooltip: 'w3w: apple.mango.banana',
      borderColor: props.profile.profile.statusColor,
      coordinate: JSON.parse(JSON.stringify(props.profile.profile.medicLocn)),
    });
  }, [props.profile.profile]);
  function setWatchPosition() {
    watchID = Geolocation.watchPosition(
      (position) => {
        if (Platform.OS == 'ios') {
          check(PERMISSIONS.IOS.LOCATION_ALWAYS)
            .then((result) => {
              switch (result) {
                case RESULTS.GRANTED:
                  var _coords = position.coords;
                  setUserMarker({
                    ...userMarker,
                    coordinate: {
                      latitude: _coords.latitude,
                      longitude: _coords.longitude,
                    },
                  });
                  break;
              }
            })
            .catch((error) => {
              console.log('iOS location permission error: ' + error);
            });
        } else {
          let _coords = position.coords;
          props.userW3WLocation.convertGeoToW3W(_coords);

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
        }
      },
      (error) => console.log('Location error :' + JSON.stringify(error)),
      {
        enableHighAccuracy: true,
        useSignificantChanges: false,
        distanceFilter: 2.0,
      },
    );
  }
  useEffect(() => {
    props.assistRequests.startRequestListener(props.eventStore.event.eventID);
    props.assistRequests.startHandoverListener(
      props.eventStore.event.eventID,
      props.profile.profile.fbUserID,
    );
    setWatchPosition();
    return () => {
      Geolocation?.clearWatch(watchID);
    };
  }, []);
  useEffect(() => {
    props.medicProviders.medics.map((medicRec) => {
      if (medicRec.fbUserID == props.profile.profile.fbUserID) return;
      var _medic = {
        label: medicRec.name,
        icon: {uri: medicRec.profilePicUri},
        coordinate: JSON.parse(JSON.stringify(medicRec.medicCurrLocn)),
        borderColor: getProfileStateColor(medicRec.status),
      };
      setMedicMarkers((medicMarkers) => [...medicMarkers, _medic]);
    });
  }, [props.medicProviders.medics]);
  useEffect(() => {
    props.medicCamps.medicCamps.map((medicRec) => {
      let _medic = {
        label: medicRec.name,
        icon: Constants.MEDIC_CAMP_ICON,
        iconType: 'medicCamp',
        coordinate: JSON.parse(JSON.stringify(medicRec.medicCurrLocn)),
      };
      setMedicMarkers((medicMarkers) => [...medicMarkers, _medic]);
    });
  }, [props.medicCamps.medicCamps]);
  // useEffect(() => {
  //   if (props.assistRequests.isEPCRgenerated)
  //     props.navigation.navigate('OnScene');
  // }, [props.assistRequests.isEPCRgenerated]);
  const goToAssistRequest = () => {
    if (props.assistRequests.assistRequests.length > 0)
      props.navigation.navigate('AssistRequest');
  };
  const openLeftMenu = () => {
    props.navigation.openDrawer();
  };
  //console.log('w3w string : ' + JSON.stringify(Store.userW3WLocation.w3words));
  const epcrProfileHandler = (index) => {
    if (props.navigation.canGoBack) props.navigation.goBack();
  };
  const assistProfileChanged = () => {};
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {!fullScreenMap ? (
        <View style={commonStyles.topBGContainer}>
          <View style={commonStyles.bgImageContainer}>
            <Image
              style={commonStyles.bgImage}
              source={Constants.BACKGROUND_IMAGE}
            />
          </View>
        </View>
      ) : null}
      {!fullScreenMap ? (
        <View style={commonStyles.bottomBGContainer}></View>
      ) : null}
      <View style={commonStyles.masterContainer}>
        <View
          style={
            !fullScreenMap
              ? [commonStyles.container, commonStyles.containerSpacing]
              : {flex: 1}
          }>
          {!fullScreenMap ? (
            <View style={styles.eventDetailsContainer}>
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  paddingTop: scale(8),
                }}>
                <TouchableOpacity onPress={openLeftMenu}>
                  <CustIcon
                    type="font-awesome"
                    name="bars"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 0.25,
                  alignItems: 'center',
                  paddingTop: scale(8),
                }}>
                <Image source={Constants.EMS_LOGO} style={styles.eventLogo} />
              </View>
              <View style={{flex: 0.65}}>
                <Text style={styles.eventTitle}>
                  {props.eventStore.event.name}
                </Text>
                <View style={styles.eventDateTimeContainer}>
                  <Text style={styles.eventDate}>
                    {moment().format('ddd Do MMM')}
                  </Text>
                  <Text style={styles.eventTime}>
                    {' '}
                    - {moment().format(Constants.TIME_FORMAT)}
                  </Text>
                </View>
                <Text style={styles.medicName}>
                  {props.profile.profile.fullName}
                </Text>
              </View>
            </View>
          ) : null}
          <View style={!fullScreenMap ? styles.mapMasterContainer : {flex: 1}}>
            <View style={!fullScreenMap ? styles.mapContainer : {flex: 1}}>
              {userMarker && (
                <CustMapView
                  userMarker={userMarker}
                  //patientMarker={patientMarker}
                  showSearch={true}
                  medicMarkers={medicMarkers}
                  isFullScreen={fullScreenMap}
                  mapTapped={() => setFullScreenMap(!fullScreenMap)}
                />
              )}
            </View>
            {!fullScreenMap && props.assistRequests.familyList.length > 0 && (
              <View style={styles.epcrCardContainer}>
                <EPCRCards
                  displayType="whiteBox"
                  dataRefresh={screenFocused}
                  onTapInfo={epcrProfileHandler}
                  onProfileChange={assistProfileChanged}
                />
              </View>
            )}
          </View>
          {!fullScreenMap ? (
            <View style={styles.menuButtonsContainer}>
              <View style={styles.menuSubContainer}>
                <View style={styles.menuEachContainer}>
                  <CustButton
                    title="Assist Requests"
                    onPress={goToAssistRequest}
                    type="main"
                    hightlight={props.assistRequests.assistRequests.length > 0}
                    size={button_size}
                    iconProps={{
                      type: 'antdesign',
                      name: 'solution1',
                      size: button_icon_size,
                      color:
                        props.assistRequests.assistRequests.length > 0
                          ? Colors.white
                          : Colors.primary,
                    }}
                  />
                  {props.assistRequests.assistRequests.length > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {props.assistRequests.assistRequests.length ?? '0'}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.menuEachContainer}>
                  <CustButton
                    title="Event"
                    onPress={() => {}}
                    type="main"
                    size={button_size}
                    iconProps={{
                      type: 'antdesign',
                      name: 'calendar',
                      size: button_icon_size,
                      color: Colors.primary,
                    }}
                  />
                </View>
                <View style={styles.menuEachContainer}>
                  <CustButton
                    title="Safeguard"
                    onPress={() => {}}
                    type="main"
                    size={button_size}
                    iconProps={{
                      type: 'material-community',
                      name: 'briefcase-plus',
                      size: button_icon_size + 5,
                      color: Colors.primary,
                    }}
                  />
                </View>
              </View>
              <View style={styles.menuSubContainer}>
                <View style={styles.menuEachContainer}>
                  <CustButton
                    title="Send Alert"
                    onPress={() => {}}
                    type="main"
                    size={button_size}
                    iconProps={{
                      type: 'material-community',
                      name: 'message-alert-outline',
                      size: button_icon_size,
                      color: Colors.primary,
                    }}
                  />
                </View>
                <View style={styles.menuEachContainer}>
                  <CustButton
                    title="Event Manager"
                    onPress={() => {}}
                    type="main"
                    size={button_size}
                    iconProps={{
                      type: 'feather',
                      name: 'phone-call',
                      size: button_icon_size,
                      color: Colors.primary,
                    }}
                  />
                </View>
                <View style={styles.menuEachContainer}>
                  <CustButton
                    title="Medical Support"
                    onPress={() => {}}
                    type="main"
                    size={button_size}
                    iconProps={{
                      type: 'antdesign',
                      name: 'customerservice',
                      size: button_icon_size,
                      color: Colors.primary,
                    }}
                  />
                </View>
              </View>
            </View>
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
  eventDetailsContainer: {
    flexDirection: 'row',
    flex: 0.23,
    paddingTop: boxModelSize.xl,
  },
  mapMasterContainer: {
    flex: 0.37,
  },
  menuButtonsContainer: {
    flex: 0.4,
    justifyContent:'center',
    alignItems:'center',
    paddingTop: boxModelSize.l,
  },
  menuSubContainer: {
    flexDirection: 'row',
  },
  menuEachContainer: {
    marginTop: boxModelSize.m,
  },
  mapContainer: {
    backgroundColor: Colors.borderGrey,
    borderRadius: Constants.BOX_REDIUS,
    width: '100%',
    height: '90%',
    overflow: 'hidden',
  },
  eventTitle: {
    color: Colors.white,
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h3,
  },
  eventLogo: {
    width: 40,
    height: 40,
  },
  eventDateTimeContainer: {
    flexDirection: 'row',
    top: -5,
    marginBottom: 5.0,
  },
  eventDate: {
    color: Colors.secondary,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
  },
  eventTime: {
    color: Colors.white,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
  },
  medicW3W: {
    color: Colors.white,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.mainMenuButtonText,
  },
  medicName: {
    color: Colors.white,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.mainMenuMedicText,
  },
  epcrCardContainer: {
    position: 'absolute',
    bottom: scale(-20),
  },
  badge: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(30),
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: Colors.badgeColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: fontSize.default,
  },
});

export default inject(
  'userW3WLocation',
  'assistRequests',
  'profile',
  'medicProviders',
  'medicCamps',
  'eventStore',
)(observer(EventHome));
