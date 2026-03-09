import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Constants from '../../../core/constants';
import {
  BottomNavigation,
  CustIcon,
  IDCard,
  PatientDetails,
  OnSceneMenu,
  CustMapView,
} from '../../../components';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../styles';
import Modal from 'react-native-modal';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';
import {medicCampsData} from '../../../model/medicsData';
import Geolocation from 'react-native-geolocation-service';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type onSceneProps = {
  navigation: drawerNavigationProp;
  profile: any;
  medicCamps: any;
};
const OnScene: FC<onSceneProps> = (props) => {
  const [idCardVisible, setIdCardVisible] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [userMarker, setUserMarker] = useState(null);
  const [medicMarkers, setMedicMarkers] = useState([]);
  const [epcrNum, setEPCRnum] = useState<number>(0);
  useEffect(() => {
    setUserMarker({
      label: 'Your Location',
      icon: {uri: props.profile.profile.profilePicUri},
      tooltip: 'w3w: apple.mango.banana',
      borderColor: props.profile.profile.statusColor,
      coordinate: JSON.parse(JSON.stringify(props.profile.profile.medicLocn)),
    });
  }, [props.profile.profile]);
  useEffect(() => {
    let watchID = Geolocation.watchPosition((position) => {
      let _coords = position.coords;
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
    });
    return () => {
      Geolocation?.clearWatch(watchID);
    };
  }, []);
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
  const toggleMapView = () => {
    setMapView(!mapView);
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
        {!mapView && (
          <View style={[commonStyles.container, commonStyles.containerSpacing]}>
            <View style={styles.headerContainer}></View>
            <View style={[styles.contentContainer, {padding: boxModelSize.m}]}>
              <View style={styles.mapButtonContainer}>
                <Text style={styles.headerText}>{'EPCR ' + epcrNum}</Text>
                <TouchableOpacity
                  style={{paddingLeft: scale(30)}}
                  onPress={toggleMapView}>
                  <CustIcon
                    type="font-awesome-5"
                    size={scale(23)}
                    color={Colors.primary}
                    name="map-marked-alt"
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginVertical: scale(20)}}>
                <PatientDetails
                  showCall={false}
                  showChat={false}
                  onTapViewId={() => {
                    setIdCardVisible(true);
                  }}
                  onTapInfo={onInfoClicked}
                  onTapResource={onResourceClicked}
                  profileChanged={assistProfileChanged}
                  profileClicked={assistProfileClicked}
                />
              </View>
              <View style={{marginTop: boxModelSize.m}}>
                <OnSceneMenu buttonSize={103} iconSize={25} />
              </View>
              <Modal isVisible={idCardVisible}>
                <View
                  style={[
                    {
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                    },
                    commonStyles.containerSpacing,
                  ]}>
                  {idCardVisible ? (
                    <IDCard
                      onClose={() => {
                        setIdCardVisible(false);
                      }}></IDCard>
                  ) : null}
                </View>
              </Modal>
            </View>
          </View>
        )}
        {mapView && (
          <CustMapView
            userMarker={userMarker}
            //patientMarker={patientMarker}
            showSearch={true}
            medicMarkers={medicMarkers}
            isFullScreen={true}
            mapTapped={toggleMapView}
          />
        )}
        <View style={commonStyles.footerContainer}>
          <BottomNavigation />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.05,
  },
  contentContainer: {
    flex: 0.95,
    backgroundColor: Colors.white,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  mapButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: Fonts.primarySemiBold,
    color: Colors.primary,
    fontSize: fontSize.h5,
  },
});

export default inject('profile', 'medicCamps')(observer(OnScene));
