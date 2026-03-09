import React, {FC, useState, useEffect} from 'react';
import {Text, View, ScrollView, Image, SafeAreaView} from 'react-native';
import {boxModelSize, commonStyles} from '../../../styles';
import Constants from '../../../core/constants';
import DynamicForm from '../../../components/dynamicForm';
import {BottomNavigation, PatientDetailsHeader} from '../../../components';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  disposition: any;
  assistRequests: any;
};
const Rma: FC<navigationProps> = (props) => {
  const [address, setAddress] = useState<any>({});
  const [ambulanceFromData, setAmbulanceFromData] = useState<any>({});
  const [eventFormData, setEventFormData] = useState<any>({});
  const [selectedSeg, setSelectedSeg] = useState(0);
  const [assistInfo, setAssistInfo] = useState<any>(null);
  const [showAmbulanceFormData, setShowAmbulanceData] = useState<boolean>(
    false,
  );
  const assistProfileClicked = () => {};
  const assistProfileChanged = (assistObj) => {
    debugger;
    setAssistInfo(assistObj);
  };

  const handleTabChange = (value: number) => {
    setSelectedSeg(value);
  };

  const submitDispositionFrom = (formData) => {
    console.log('called function', formData, assistInfo);
    props.disposition.setDispositionData(
      formData,
      assistInfo.assistUserID,
      assistInfo.epcrNum,
      selectedSeg == 0 ? 'event' : 'ambulance',
    );
  };

  useEffect(() => {
    let formData = props.disposition.getDispositionData(
      'a03TkuE0nkQD9RcZZbI815JAiNN1',
    );
    // let formData = props.disposition.getDispositionData(assistInfo.assistUserID);
    formData && formData.dispositionType == 'event'
      ? setEventFormData(formData.data)
      : setAmbulanceFromData(formData.data);
  }, []);

  const onSwitchChange = (name, value, formData) => {
    setShowAmbulanceData(name == 'ems');
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
                Rma
              </Text>
            </View>

            <ScrollView style={{marginTop: 15}}>
              <DynamicForm
                onSwitchChange={onSwitchChange}
                onSubmit={submitDispositionFrom}
                setValues={eventFormData && eventFormData}
                formType={'RMA'}
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

export default inject('disposition', 'assistRequests')(observer(Rma));
