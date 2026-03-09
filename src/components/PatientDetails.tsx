import React, {FC, useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {scale} from 'react-native-size-matters';
import {boxModelSize, Colors, Fonts, fontSize} from '../styles/';
import CustIcon from './icon';
import {custIconProps} from '../types/componentsTypes';
import EPCRCards from './EPCRCards';
import {useFocusEffect} from '@react-navigation/native';

interface propsTypes {
  label: string;
  iconProps: custIconProps;
  direction: 'row' | 'column';
}

const IconLabel = ({label, iconProps, direction}: propsTypes) => {
  if (direction == 'row') {
    return (
      <View style={{flexDirection: direction, paddingLeft: boxModelSize.s}}>
        <View
          style={{
            flex: 0.35,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustIcon {...iconProps} />
        </View>
        <View
          style={{
            flex: 0.65,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={[styles.label, {marginLeft: scale(10)}]}>{label}</Text>
        </View>
      </View>
    );
  } else if (direction == 'column') {
    return (
      <View
        style={{
          flexDirection: direction,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CustIcon {...iconProps} />
        <Text style={[styles.label, {marginTop: scale(5)}]}>{label}</Text>
      </View>
    );
  }
};

interface PatientDetailsProps {
  onTapViewId?: () => void;
  onTapInfo?: () => void;
  onTapResource?: () => void;
  profileChanged?: (obj) => void;
  profileClicked?: () => void;
  showCall: boolean;
  showChat: boolean;
}

const PatientDetails: FC<PatientDetailsProps> = (props) => {
  const verIconSize = 15;
  const harIconSize = 17;
  const {
    onTapViewId,
    onTapInfo,
    onTapResource,
    profileChanged,
    profileClicked,
    showCall,
    showChat,
  } = props;
  const [screenFocused, setScreenFocused] = useState<boolean>(true);
  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => setScreenFocused(false);
    }, []),
  );
  return (
    <View style={styles.container}>
      <View style={styles.sectionOneContainer}>
        <IconLabel
          iconProps={{
            name: 'thermometer-2',
            type: 'font-awesome',
            color: Colors.white,
            size: scale(verIconSize),
          }}
          label="100°"
          direction="row"
        />
        <IconLabel
          iconProps={{
            name: 'heartbeat',
            type: 'font-awesome',
            color: Colors.white,
            size: scale(verIconSize),
          }}
          label="150"
          direction="row"
        />
        <IconLabel
          iconProps={{
            name: 'ioxhost',
            type: 'font-awesome',
            color: Colors.white,
            size: scale(verIconSize),
          }}
          label="90.5"
          direction="row"
        />
      </View>
      <View style={styles.sectionTwoContainer}>
        <View style={styles.viewIdButtonContainer}>
          <TouchableOpacity onPress={onTapViewId}>
            <Text style={styles.viewIdButton}>View ID</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            height: scale(80),
            marginBottom: boxModelSize.m,
          }}>
          <EPCRCards
            showEPCR={false}
            dataRefresh={screenFocused}
            displayType="profileRound"
            onProfileChange={profileChanged}
            onTapInfo={profileClicked}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
          }}>
          {showCall && (
            <TouchableOpacity onPress={() => Alert.alert('Call')}>
              <IconLabel
                iconProps={{
                  name: 'phone',
                  type: 'antdesign',
                  color: Colors.white,
                  size: scale(harIconSize),
                }}
                label="Call"
                direction="column"
              />
            </TouchableOpacity>
          )}
          {showChat && (
            <TouchableOpacity onPress={() => Alert.alert('Chat')}>
              <IconLabel
                iconProps={{
                  name: 'chatbubble-ellipses-outline',
                  type: 'ionicon',
                  color: Colors.white,
                  size: scale(harIconSize),
                }}
                label="Chat"
                direction="column"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onTapResource}>
            <IconLabel
              iconProps={{
                name: 'addfile',
                type: 'antdesign',
                color: Colors.white,
                size: scale(harIconSize),
              }}
              label="Resource"
              direction="column"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onTapInfo}>
            <IconLabel
              iconProps={{
                name: 'infocirlceo',
                type: 'antdesign',
                color: Colors.white,
                size: scale(harIconSize),
              }}
              label="Info"
              direction="column"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: scale(5),
    overflow: 'hidden',
    minHeight: scale(160),
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.white,
    fontSize: fontSize.mainMenuButtonText,
  },
  sectionOneContainer: {
    flex: 0.25,
    backgroundColor: Colors.drawerItemBG,
    justifyContent: 'space-between',
    paddingVertical: scale(20),
  },
  sectionTwoContainer: {
    flex: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingBottom: boxModelSize.m,
  },
  viewIdButtonContainer: {
    alignItems: 'flex-end',
    width: '100%',
    paddingRight: boxModelSize.m,
    paddingTop: boxModelSize.m,
  },
  viewIdButton: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
    color: Colors.white,
    textDecorationLine: 'underline',
  },
});

export default PatientDetails;
