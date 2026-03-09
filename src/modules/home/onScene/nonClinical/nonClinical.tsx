import React, {FC, useState, useEffect, useCallback} from 'react';
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
import {BottomNavigation, CustIcon, Accordian} from '../../../../components';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../../styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {NonClinicalParamList} from '../../../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';
import {useFocusEffect} from '@react-navigation/native';

type stackNavigationProp = StackNavigationProp<NonClinicalParamList>;
type navigationProps = {
  navigation: stackNavigationProp;
  nonClinical: any;
};

const NonClinical: FC<navigationProps> = (props) => {
  const [nonClinicalData, setNonClinicalData] = useState<Array<any>>([]);
  useFocusEffect(
    useCallback(() => {
      if (props.nonClinical.nonClinical.length > 0)
        setNonClinicalData([...props.nonClinical.nonClinical]);
    }, []),
  );
  const goBack = () => {
    if (props.navigation.canGoBack()) props.navigation.goBack();
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
          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={goBack}
                style={{
                  paddingRight: boxModelSize.l,
                  paddingLeft: boxModelSize.l,
                }}>
                <CustIcon
                  type="antdesign"
                  size={scale(23)}
                  color={Colors.white}
                  name="arrowleft"
                />
              </TouchableOpacity>
              <Text style={commonStyles.navigationText}>Non Clinical</Text>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('AddPresentation')}
              style={[
                {
                  backgroundColor: '#016AA6',
                  padding: 5,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                },
              ]}>
              <Text style={{color: 'white'}}>+ Add Presentation</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <View style={{padding: boxModelSize.l}}>
              <FlatList
                data={nonClinicalData.reverse()}
                keyExtractor={(item: any) => item.id}
                renderItem={(src) => {
                  return (
                    <View
                      style={[
                        commonStyles.roundedRectangeCart,
                        commonStyles.whiteBoxShadow,
                      ]}>
                      <View style={{flexDirection: 'row'}}>
                        <CustIcon
                          type="antdesign"
                          name={'user'}
                          size={25}
                          color={Colors.primary}
                        />
                        <Text
                          style={[styles.medicName, {marginLeft: scale(2)}]}>
                          {src.item.patientName}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 5,
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
                              styles.assistName,
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
                              styles.assistName,
                              {marginLeft: boxModelSize.s},
                            ]}>
                            {src.item.dateAndTime}
                          </Text>
                        </View>
                      </View>
                      <View style={{marginTop: 10}}>
                        <Accordian
                          title={'Total Items ' + src.item.items.length}
                          data={src.item.items}
                        />
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
  headerContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 0.9,
    backgroundColor: Colors.backgroundwhite,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
  },
  medicName: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.h5,
  },
  assistName: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.mainMenuButtonText,
  },
});

export default inject('nonClinical')(observer(NonClinical));
