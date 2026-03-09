import React, {FC, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale} from 'react-native-size-matters';

import Constants from '../../../../core/constants';
import {
  BottomNavigation,
  CustIcon,
  PatientDetailsHeader,
} from '../../../../components';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../../styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {NarrativeParamList} from '../../../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';

type stackNavigationProp = StackNavigationProp<NarrativeParamList>;
type navigationProps = {
  navigation: stackNavigationProp;
  narratives: any;
};

const Narratives: FC<navigationProps> = (props) => {
  const [narrativeData, setNarrativeData] = useState<Array<any>>([]);

  const addNewSet = () => {
    props.navigation.navigate('NarrativesNotes', {narrativeObj: {}});
  };
  const viewSet = (narrative) => {
    props.navigation.navigate('NarrativesNotes', {narrativeObj: narrative});
  };
  const assistProfileClicked = () => {};
  const assistProfileChanged = (assistObj) => {
    setNarrativeData(
      props.narratives.getNarrativesByID(assistObj.assistUserID),
    );
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
        <View style={[commonStyles.containerSpacing, commonStyles.container]}>
          <View style={commonStyles.headerContainer}>
            <PatientDetailsHeader
              profileChanged={assistProfileChanged}
              profileClicked={assistProfileClicked}
            />
          </View>
          <View
            style={[commonStyles.contentContainer, {padding: boxModelSize.m}]}>
            <View style={{padding: boxModelSize.s}}>
              <Text
                style={[
                  commonStyles.whiteBoxTitle,
                  {
                    textAlign: 'center',
                    paddingBottom: boxModelSize.m,
                  },
                ]}>
                Narratives
              </Text>
              <View
                style={[
                  commonStyles.roundedRectangeCart,
                  commonStyles.whiteBoxShadow,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <CustIcon
                      type="foundation"
                      name="clipboard-pencil"
                      size={22}
                      color={Colors.primary}
                    />
                    <Text style={styles.boxTitle}>
                      Set {narrativeData.length + 1}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={addNewSet}
                    style={styles.actionBox}
                    activeOpacity={0.2}>
                    <CustIcon
                      type="antdesign"
                      name={'addfile'}
                      size={scale(14)}
                      color={Colors.primary}
                    />
                    <Text style={styles.assistName}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                data={narrativeData.reverse()}
                keyExtractor={(item: any) => item.id}
                renderItem={(src: any) => {
                  return (
                    <View
                      style={[
                        commonStyles.roundedRectangeCart,
                        commonStyles.whiteBoxShadow,
                      ]}>
                      <View>
                        <Text style={styles.ePCRNumber}>
                          EPCR:{' ' + src.item.epcrNum}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <CustIcon
                            type="foundation"
                            name="clipboard-pencil"
                            size={22}
                            color={Colors.primary}
                          />
                          <Text style={styles.boxTitle}>{src.item.name}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={viewSet.bind(this, src.item)}
                          style={styles.actionBox}
                          activeOpacity={0.2}>
                          <CustIcon
                            type="antdesign"
                            name={'eyeo'}
                            size={scale(16)}
                            color={Colors.primary}
                          />
                          <Text style={styles.assistName}>View</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: boxModelSize.m,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingLeft: boxModelSize.s,
                          }}>
                          <CustIcon
                            type="font-awesome-5"
                            name={'user-nurse'}
                            size={scale(14)}
                            color={Colors.primary}
                          />
                          <Text
                            style={[
                              styles.medicName,
                              {marginLeft: boxModelSize.s},
                            ]}>
                            {src.item.medicName}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <CustIcon
                            type="antdesign"
                            name={'calendar'}
                            size={scale(14)}
                            color={Colors.primary}
                          />
                          <Text
                            style={[
                              styles.medicName,
                              {marginLeft: boxModelSize.s},
                            ]}>
                            {src.item.dateAndTime}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
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
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: boxModelSize.m,
    padding: boxModelSize.s,
    borderRadius: Constants.BOX_REDIUS,
  },
  boxTitle: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.h5,
    marginLeft: boxModelSize.s,
  },
  assistName: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.default,
    marginLeft: boxModelSize.s,
  },
  medicName: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.mainMenuButtonText,
  },
  ePCRNumber: {
    fontFamily: Fonts.primaryBold,
    fontSize: scale(9),
    color: Colors.linkBlue,
    textAlign: 'center',
  },
});

export default inject('narratives')(observer(Narratives));
