import React, {FC, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../styles';
import Constants from '../../../core/constants';
import {scale} from 'react-native-size-matters';
import DynamicForm from '../../../components/dynamicForm';
import {BottomNavigation, PatientDetailsHeader} from '../../../components';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  demographic: any;
  assistRequests: any;
};
const Demographic: FC<navigationProps> = (props) => {
  const [address, setAddress] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const assistProfileClicked = () => {};
  const assistProfileChanged = (assistObj) => {
    setFormData(props.demographic.getAssistUserByID(assistObj.assistUserID));
  };
  // useEffect(() => {
  //   setFormData(props.demographic.demographic);
  // }, [props.demographic.demographic]);
  const onSwitchChange = (name, value, formData) => {
    let currentAddress = {};
    if (formData.perAddress)
      currentAddress['curAddress'] = value ? formData.perAddress : '';
    if (formData.perCity)
      currentAddress['curCity'] = value ? formData.perCity : '';
    if (formData.perState)
      currentAddress['curState'] = value ? formData.perState : '';
    if (formData.perCountry)
      currentAddress['curCountry'] = value ? formData.perCountry : '';
    if (formData.perPostcode)
      currentAddress['curPostcode'] = value ? formData.perPostcode : '';
    if (Object.keys(currentAddress).length > 0) setAddress(currentAddress);
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
          <View style={commonStyles.headerContainer}>
            <PatientDetailsHeader
              profileChanged={assistProfileChanged}
              profileClicked={assistProfileClicked}
            />
          </View>
          <View
            style={[commonStyles.contentContainer, {padding: boxModelSize.m}]}>
            <View>
              <Text
                style={[
                  commonStyles.whiteBoxTitle,
                  {textAlign: 'center', paddingBottom: boxModelSize.m},
                ]}>
                Demographics
              </Text>
            </View>
            <ScrollView>
              <DynamicForm
                onSubmit={() => {}}
                onSwitchChange={onSwitchChange}
                setValues={formData}
                formType={'Demographics'}
              />
            </ScrollView>
          </View>
        </View>
        <View style={commonStyles.footerContainer}>
          <BottomNavigation />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default inject('demographic', 'assistRequests')(observer(Demographic));
