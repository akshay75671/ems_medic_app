import React, {FC, useState, useCallback} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {scale} from 'react-native-size-matters';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';
import EPCRCards from './EPCRCards';
import CustIcon from './icon';
import Modal from 'react-native-modal';
import OnSceneMenu from './onSceneMenu';
import Constants from '../core/constants';
import {useFocusEffect} from '@react-navigation/native';
import {ScanScreen} from '../components';

interface propsTypes {
  profileClicked: () => void;
  profileChanged: (data) => void;
  closePage?: () => void;
  showCloseButton?: boolean;
}

const PatientDetailsHeader: FC<propsTypes> = (props) => {
  const [onSceneMenu, setOnSceneMenu] = useState<boolean>(false);
  const [screenFocused, setScreenFocused] = useState<boolean>(true);
  const toggleOnSceneMenu = () => {
    setOnSceneMenu(!onSceneMenu);
  };
  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => setScreenFocused(false);
    }, []),
  );
  return (
    <View style={{flex: 1}}>
      <Modal isVisible={onSceneMenu}>
        <View
          style={[
            styles.modalView,
            commonStyles.whiteBoxShadow,
            {padding: boxModelSize.s, height:'58%'},
          ]}>
          <View style={styles.closeIconContainer}>
            <Pressable onPress={toggleOnSceneMenu}>
              <View style={styles.closeIcon}>
                <CustIcon type="antdesign" name="close" size={20} />
              </View>
            </Pressable>
          </View>
          <View style={{height: scale(50)}}></View>
          <ScrollView>
            <OnSceneMenu iconSize={scale(18)} buttonSize={scale(78)} />
          </ScrollView>
        </View>
      </Modal>
      <View style={{position: 'absolute', top: '10%', right: boxModelSize.l, zIndex: 2}}>
        {!props.showCloseButton && (
          <TouchableOpacity onPress={toggleOnSceneMenu} style={{zIndex: 2}}>
            <CustIcon
              type="fontisto"
              size={scale(20)}
              color={Colors.white}
              name="nav-icon-grid"
            />
          </TouchableOpacity>
        )}
        {props.showCloseButton && (
          <TouchableOpacity onPress={props.closePage} style={{zIndex: 2}}>
            <CustIcon
              type="antdesign"
              size={scale(25)}
              color={Colors.white}
              name="close"
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileDetails}>
        <EPCRCards
          showEPCR
          displayType="profileRound"
          dataRefresh={screenFocused}
          onProfileChange={props.profileChanged}
          onTapInfo={props.profileClicked}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileDetails: {
    flex: 1,
    paddingTop: boxModelSize.l,
    zIndex: 1,
  },
  modalView: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: Constants.BOX_REDIUS,
  },
  closeIconContainer: {
    position: 'absolute',
    top: scale(-10),
    width: '103%',
    alignItems: 'center',
  },
  closeIcon: {
    width: scale(35),
    height: scale(35),
    borderRadius: 30,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: Colors.secondaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderStartColor: 'yellow',
  },
});

export default PatientDetailsHeader;
