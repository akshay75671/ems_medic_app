import React, {FC, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from 'react-native';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../styles';
import Constants from '../../core/constants';
import {scale} from 'react-native-size-matters';

import {BottomNavigation, PatientDetailsHeader} from '../../components';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../types/navigationsTypes';
import LinearGradient from 'react-native-linear-gradient';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type AssistInfoProps = {
  navigation: drawerNavigationProp;
};

const AssistInfo: FC<AssistInfoProps> = (props) => {
  const [assistInfo, setAssistInfo] = useState<string[]>(['Awake']);
  const size: number = 50;
  const infoList: any = {
    Awake: {icon: Constants.ICON_AWAKE, label: 'PT is Unconscious'},
    Breathing: {icon: Constants.ICON_BREATHING, label: 'PT is Not Breathing'},
    Bleeding: {icon: Constants.ICON_BLEEDING, label: 'PT is Bleeding'},
    Vomited: {icon: Constants.ICON_VOMITED, label: 'PT has Vomited'},
    Headache: {icon: Constants.ICON_HEADACHE, label: 'PT has Headache'},
  };
  const goBack = () => {
    if (props.navigation.canGoBack) props.navigation.goBack();
  };
  const assistProfileClicked = () => {};
  const assistProfileChanged = (assistObj) => {
    setAssistInfo(assistObj.info);
  };
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
        <View style={[commonStyles.container, commonStyles.containerSpacing]}>
          <View style={styles.headerContainer}>
            <PatientDetailsHeader
              profileChanged={assistProfileChanged}
              profileClicked={assistProfileClicked}
              showCloseButton={true}
              closePage={goBack}
            />
          </View>
          <View style={[styles.contentContainer, {padding: boxModelSize.m}]}>
            <View style={{padding: boxModelSize.l}}>
              <FlatList
                data={assistInfo}
                keyExtractor={(item: any) => 'id_' + item}
                renderItem={(src: any) => {
                  return (
                    <View style={{marginBottom: boxModelSize.l}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <ImageBackground
                          source={Constants.MAIN_MENU_BUTTON_BG}
                          style={{
                            height: scale(size),
                            width: scale(size),
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                          }}
                          imageStyle={{resizeMode: 'stretch'}}>
                          <View
                            style={[
                              styles.mainMenuButtonContainer,
                              {
                                height: scale(size - size / 8),
                                width: scale(size - size / 10),
                              },
                            ]}>
                            <Image
                              style={styles.icon}
                              source={infoList[src.item].icon}
                              resizeMode="contain"
                            />
                          </View>
                        </ImageBackground>
                        <Text style={styles.infoText}>
                          {infoList[src.item].label}
                        </Text>
                      </View>
                      <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={[
                          Colors.secondaryBackgroundColor,
                          Colors.bodyTextGrey,
                          Colors.secondaryBackgroundColor,
                        ]}
                        style={{
                          height: scale(1),
                          marginTop: boxModelSize.s,
                        }}></LinearGradient>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.2,
  },
  contentContainer: {
    flex: 0.8,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  icon: {
    width: scale(35),
    height: scale(35),
  },
  mainMenuButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: boxModelSize.l,
  },
  infoText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h5,
    color: Colors.primary,
    marginLeft: boxModelSize.l,
  },
});

export default AssistInfo;
