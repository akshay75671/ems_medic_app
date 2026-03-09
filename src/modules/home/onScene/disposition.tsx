import React, {FC, useState, useEffect} from 'react';
import {Text, View, ScrollView, Image, SafeAreaView} from 'react-native';
import {boxModelSize, commonStyles} from '../../../styles';
import Constants from '../../../core/constants';
import DynamicForm from '../../../components/dynamicForm';
import {
  BottomNavigation,
  PatientDetailsHeader,
  CustomSegmentedTab,
  CustButton,
} from '../../../components';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import {inject, observer} from 'mobx-react';
import Axios from 'axios';
import Config from '../../../core/config';
import {getUserAccessToken} from '../../../services/authServices';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  disposition: any;
  assistRequests: any;
};
const Disposition: FC<navigationProps> = (props) => {
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
    setAssistInfo(assistObj);
  };

  const handleTabChange = (value: number) => {
    setSelectedSeg(value);
  };

  //const submitDispositionFrom = () => {
  // getUserAccessToken().then((accessToken) => {
  //   var _query = `query {\n  triggerEmail {\n    status, message \n  }\n}`;
  //   var data = JSON.stringify({
  //     query: _query,
  //     variables: {},
  //   });
  //   var config = {
  //     headers: {
  //       Authorization: 'Bearer ' + accessToken,
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   Axios.post('https://emsdevelopment.ts.r.appspot.com/ems', data, config)
  //     .then((result) => {
  //       console.log('Email send successfully');
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  // });
  //console.log('called function', formData, assistInfo);
  // props.disposition.setDispositionData(
  //   formData,
  //   assistInfo.assistUserID,
  //   assistInfo.epcrNum,
  //   selectedSeg == 0 ? 'event' : 'ambulance',
  // );
  const submitDispositionFrom = (formData) => {
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
    console.log('name', name);
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
          <View style={commonStyles.contentContainer}>
            <CustomSegmentedTab
              defaultSelectedTab={selectedSeg}
              tabValue={['Event', 'Ambulance']}
              handleTabChange={handleTabChange}
              tabSize="medium"
            />
            <ScrollView style={{marginTop: 15, padding: 10}}>
              {selectedSeg == 0 ? (
                <DynamicForm
                  onSwitchChange={onSwitchChange}
                  onSubmit={submitDispositionFrom}
                  setValues={eventFormData && eventFormData}
                  formType={'EventDisposition'}
                />
              ) : (
                <>
                  {!showAmbulanceFormData && (
                    <DynamicForm
                      onSubmit={() => {}}
                      onSwitchChange={onSwitchChange}
                      setValues={ambulanceFromData && ambulanceFromData}
                      formType={'AmbulanceDisposition'}
                    />
                  )}
                  {showAmbulanceFormData && (
                    <>
                      <DynamicForm
                        onSubmit={submitDispositionFrom}
                        setValues={ambulanceFromData && ambulanceFromData}
                        formType={'AmbulanceForm'}
                      />
                      <View
                        style={{
                          paddingTop: 10,
                        }}>
                        <CustButton
                          title="Cancel"
                          onPress={() =>
                            setShowAmbulanceData(!showAmbulanceFormData)
                          }
                        />
                      </View>
                    </>
                  )}
                </>
              )}
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

export default inject('disposition', 'assistRequests')(observer(Disposition));
