import React, {useState, useRef, useEffect} from 'react';
import MapView, {
  LatLng,
  Marker,
  Callout,
  Polygon,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {
  View,
  Image,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';

import MapViewDirections from 'react-native-maps-directions';
import {MarkerProp} from '../types/componentsTypes';
import {CustCallout, CustIcon, CustSearchInput} from './../components';
import Constants from '../core/constants';
import Config from '../core/config';
import {
  boxModel,
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../styles';

import {useForm, Controller} from 'react-hook-form';
import {convertToCoordinates} from './../services/w3wServices';
import {mapSyle} from '../model/mapStyle.json';
import {observer, inject} from 'mobx-react';
import {scale} from 'react-native-size-matters';

interface CustMapViewProps {
  userMarker: MarkerProp;
  patientMarker?: MarkerProp;
  medicMarkers?: Array<MarkerProp>;
  mapTapped?: () => void;
  navigationUpdate?: (state) => void;
  isFullScreen?: boolean;
  initWithDirection?: boolean;
  userW3WLocation?: any;
  showSearch?: boolean;
  locationFence?: any[];
}

function CustMapView({
  userMarker,
  patientMarker,
  medicMarkers,
  mapTapped,
  isFullScreen,
  userW3WLocation,
  navigationUpdate,
  locationFence,
  showSearch = false,
  initWithDirection = false,
}: CustMapViewProps) {
  const {handleSubmit, control, register, setValue, errors} = useForm();
  const {width, height} = Dimensions.get('window');
  const onSubmit = (data) => {
    convertToCoordinates(data.search)
      .then((res: any) => {
        //{"data":null,"status":"Failed","message":"Invalid What 3 words."}
        //{"data":"{\"country\":\"IN\",\"square\":{\"southwest\":{\"lng\":77.319979,\"lat\":12.911384},\"northeast\":{\"lng\":77.320007,\"lat\":12.911411}},\"nearestPlace\":\"Māgadi, Karnataka\",\"coordinates\":{\"lng\":77.319993,\"lat\":12.911398},\"words\":\"marathons.cute.bunny\",\"language\":\"en\",\"map\":\"https://w3w.co/marathons.cute.bunny\"}","status":"Success","message":"Coordinates retrived from What 3 words."}

        if (res.data.convertToCoordinates.status == 'Success') {
          var data = JSON.parse(res.data.convertToCoordinates.data);
          setSearchLocation({
            label: data.nearestPlace ?? data.words,
            icon: Constants.SEARCH_MARKER_ICON,
            coordinate: {
              latitude: data.coordinates.lat,
              longitude: data.coordinates.lng,
            },
            tooltip: data.words,
          });
          setSerchError(null);

          setTimeout(function () {
            fitToMarkers(true);
          }, 500);
        } else {
          //Error
          //res.data.convertToCoordinates.message
          setSearchLocation(null);
          setSerchError(res.data.convertToCoordinates.message);
        }
      })
      .catch((error) => {
        console.log('search error: ' + error);
      });
  };

  const mapRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: 12.9,
    longitude: 77.5,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [uMarker, setUMarker] = useState(null);
  const [pMarker, setPMarker] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [searchError, setSerchError] = useState(null);
  const [showDirection, setShowDirection] = useState(null);

  function onMapTapped(who: 'map' | 'close') {
    if (who == 'map') if (isFullScreen) return;
    setTimeout(function () {
      fitToMarkers(true);
    }, 500);

    mapTapped ? mapTapped() : null;
  }

  function onNavigate(marker) {
    setShowDirection(marker);

    setTimeout(function () {
      fitToMarkers(true);
    }, 500);
  }

  function onStopNavigation() {
    setShowDirection(null);
  }
  useEffect(() => {
    setPMarker(patientMarker);
  }, [patientMarker]);
  useEffect(() => {
    if (initWithDirection) setShowDirection(pMarker);
  }, [pMarker]);
  useEffect(() => {
    //console.log('map View', userMarker);
    setUMarker(userMarker);

    setTimeout(function () {
      fitToMarkers(true);
    }, 1000);

    return () => {};
  }, [userMarker, showDirection]);

  function fitToMarkers(animate: boolean) {
    if (mapRef?.current == null) {
      return;
    }

    var markers = [];

    if (uMarker) {
      markers.push(uMarker.coordinate);
    }

    if (showDirection) {
      markers.push(showDirection.coordinate);
    } else {
      if (pMarker) {
        markers.push(pMarker.coordinate);
      }

      if (searchLocation) {
        markers.push(searchLocation.coordinate);
      }

      if (medicMarkers) {
        medicMarkers?.forEach((marker) => {
          markers.push(marker.coordinate);
        });
      }
      if (locationFence) {
        locationFence?.forEach((marker) => {
          markers.push(marker);
        });
      }
    }

    mapRef?.current?.fitToCoordinates(markers, {
      edgePadding: {
        top: height / 20,
        right: width / 20,
        bottom: height / 20,
        left: width / 20,
      },
      animated: animate,
    });
  }

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        ref={mapRef}
        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : null}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={region}
        toolbarEnabled={true}
        //customMapStyle={mapSyle}
        onPress={onMapTapped.bind(this, 'map')}
        onMapReady={() => fitToMarkers(true)}
        onLongPress={() => fitToMarkers(true)}>
        {!showDirection && pMarker ? (
          <Marker coordinate={pMarker.coordinate}>
            <Image
              source={pMarker.icon}
              style={[styles.marker, {borderColor: pMarker.borderColor}]}
            />

            <CustCallout
              label={pMarker.label}
              toolTipText={pMarker.tooltip}
              onPress={() => onNavigate(pMarker)}></CustCallout>
          </Marker>
        ) : null}

        {searchLocation && !showDirection ? (
          <Marker coordinate={searchLocation.coordinate}>
            <Image source={searchLocation.icon} style={styles.marker} />

            <CustCallout
              label={searchLocation.label}
              toolTipText={searchLocation.tooltip}
              onPress={() => onNavigate(searchLocation)}></CustCallout>
          </Marker>
        ) : null}

        {uMarker ? (
          <Marker coordinate={uMarker.coordinate}>
            <Image
              source={uMarker.icon}
              style={[styles.marker, {borderColor: uMarker.borderColor}]}
            />

            <CustCallout
              label={uMarker.label}
              toolTipText={userW3WLocation.w3words}></CustCallout>
          </Marker>
        ) : null}

        {medicMarkers.length > 0 && !showDirection ? (
          medicMarkers.map((marker, i) => (
            <Marker key={i} coordinate={marker.coordinate}>
              <Image
                source={marker.icon}
                style={[styles.marker, {borderColor: marker.borderColor}]}
              />

              <CustCallout
                label={marker.label}
                toolTipText={marker.tooltip}
                onPress={() => onNavigate(marker)}></CustCallout>
            </Marker>
          ))
        ) : showDirection ? (
          <Marker coordinate={showDirection.coordinate}>
            <Image
              source={showDirection.icon}
              style={[styles.marker, {borderColor: showDirection.borderColor}]}
            />

            <CustCallout
              label={showDirection.label}
              toolTipText={userW3WLocation.w3words}></CustCallout>
          </Marker>
        ) : null}

        {showDirection ? (
          <MapViewDirections
            mode="WALKING"
            strokeWidth={4}
            origin={showDirection?.coordinate}
            destination={uMarker?.coordinate ?? userMarker.coordinate}
            apikey={Config.GOOGLE_API_KEY}
            strokeColor={Colors.primaryLight}
            onReady={(result) => {
              if (navigationUpdate)
                navigationUpdate({
                  duration: Math.floor(result.duration),
                  distance: result.distance,
                });
              fitToMarkers(true);
            }}
          />
        ) : null}
        {locationFence && locationFence.length > 0 && (
          <Polygon
            coordinates={locationFence}
            fillColor={Colors.locationFench}
            strokeColor={Colors.primary}
          />
        )}
      </MapView>

      {isFullScreen && showSearch ? (
        <View style={{position: 'absolute', width: '100%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{paddingLeft: 10, flexGrow: 1}}>
              <Controller
                name={'search'}
                control={control}
                defaultValue={''}
                rules={{
                  required: {
                    value: true,
                    message: 'Enter some text',
                  },
                }}
                render={(props) => (
                  <CustSearchInput
                    {...props}
                    label={'Search'}
                    required={true}
                    dropIcon={false}
                    leftIcon
                    iconProps={{
                      type: 'font-awesome',
                      name: 'search',
                      size: 20,
                      color: Colors.iconGrey,
                    }}
                    onChangeText={(value) => props.onChange(value)}
                    onEndEditing={handleSubmit(onSubmit)}
                    errorText={
                      errors['search'] ? errors['search'].message : null
                    }
                  />
                )}
              />
            </View>
            <TouchableOpacity
              style={{padding: 10.0}}
              onPress={onMapTapped.bind(this, 'close')}>
              <View style={styles.closeIcon}>
                <CustIcon
                  type="font-awesome"
                  name="close"
                  size={15}
                  color={Colors.white}
                />
              </View>
            </TouchableOpacity>
          </View>
          {searchError ? (
            <TouchableOpacity
              style={{position: 'absolute', padding: 10.0, width: '100%'}}
              onPress={() => setSerchError(null)}>
              <View
                style={{
                  backgroundColor: Colors.inputErrorText,
                  borderRadius: 50.0,
                  height: 44.0,

                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.primaryRegular,
                    fontSize: fontSize.h5,
                  }}>
                  {searchError}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {isFullScreen && showDirection ? (
        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flexGrow: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={onStopNavigation}>
                <View style={styles.stopNavigation}>
                  <CustIcon
                    type="material-community"
                    name="stop-circle"
                    size={45}
                    color={Colors.linkBlue}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.25)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: Constants.BOX_REDIUS,
    alignItems: 'center',
    width: '95%',
  },
  closeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(30),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: scale(30),
    height: scale(30),
    alignSelf: 'center',
    borderRadius: scale(50.0),
    borderWidth: scale(2),
    overflow: 'hidden',
  },
  stopNavigation: {
    width: scale(45),
    height: scale(45),
    margin: boxModelSize.xl,
    backgroundColor: Colors.white,
    borderRadius: scale(45.0),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default inject('userW3WLocation')(observer(CustMapView));
