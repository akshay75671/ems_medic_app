import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Constants from '../../../../core/constants';
import {
  BottomNavigation,
  CustButton,
  CustIcon,
  CustSearchInput,
  CustTextInput,
} from '../../../../components';
import InputSpinner from 'react-native-input-spinner';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../../styles';
import {NonClinicalParamList} from '../../../../types/navigationsTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {medicineList} from '../../../../model/medicineList.json';
import {inject, observer} from 'mobx-react';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import Modal from 'react-native-modal';

type stackNavigationProp = StackNavigationProp<NonClinicalParamList>;
type presentaionProps = {
  navigation: stackNavigationProp;
  profile: any;
  nonClinical: any;
};

const AddPresentation: FC<presentaionProps> = (props) => {
  const [medicineItem, setMedicineItem] = useState<any>({});
  const [medicineConfirmList, setMedicineConfirmList] = useState<Array<any>>(
    [],
  );
  const [searchResult, setSearchResult] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [medicName, setMedicName] = useState<any>({
    value: props.profile.profile.fullName,
    error: undefined,
  });
  const [patientName, setPatientName] = useState<any>({
    value: undefined,
    error: undefined,
  });
  const goBack = () => {
    if (props.navigation.canGoBack()) props.navigation.goBack();
  };
  const onChangeMedicText = (value) => {
    setMedicName({value: value, error: undefined});
  };
  const onChangePatientText = (value) => {
    setPatientName({value: value, error: undefined});
  };
  const checkElement = (data: any, srcText: string) => {
    return data.filter(function (item) {
      let filteritem = item ? item.lable.toUpperCase() : ''.toUpperCase();
      let searchData = srcText.toUpperCase();
      return filteritem.indexOf(searchData) > -1;
    });
  };

  const onChangeSearchText = (text: string) => {
    if (text.length > 0) {
      let Search = checkElement(medicineList, text);
      setSearchText(text);
      setSearchResult(Search);
    } else {
      setSearchText('');
      setSearchResult([]);
    }
  };
  const onClearSearch = () => {
    setSearchText('');
    setSearchResult([]);
  };
  const onFormSubmit = () => {
    let formObj: any = {
      id: uuidv4(),
      patientName: patientName.value,
      medicUserID: props.profile.profile.fullName,
      medicName: medicName.value,
      dateAndTime: moment().format(Constants.DATE_TIME_FORMAT),
      items: medicineConfirmList,
    };

    props.nonClinical.setNonClinicalData(formObj);
    goBack();
  };
  const onViewSubmit = () => {
    if (!medicName.value) {
      setMedicName({value: undefined, error: 'Medic name required'});
      return;
    }
    if (!patientName.value) {
      setPatientName({value: undefined, error: 'Patient name required'});
      return;
    }
    if (Object.keys(medicineItem).length > 0) {
      var itemArr = [];
      for (var key in medicineItem) {
        itemArr.push(medicineItem[key]);
      }
      setMedicineConfirmList(itemArr);
      setShowConfirm(true);
    }
  };
  const onInputSpinnerChange = (key, lable, value) => {
    if (value != 0)
      setMedicineItem({...medicineItem, [key]: {key, lable, value}});
    else {
      if (Object.keys(medicineItem).length > 0) {
        delete medicineItem[key];
        setMedicineItem({...medicineItem});
      }
    }
  };
  const onConfirmClose = () => {
    setShowConfirm(false);
  };
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Modal isVisible={showConfirm}>
        <View style={styles.confirmContainer}>
          <View
            style={[
              commonStyles.closeIconContainer,
              {
                marginLeft: boxModelSize.m,
                zIndex: 2,
                width: '100%',
              },
            ]}>
            <TouchableOpacity onPress={onConfirmClose}>
              <View style={commonStyles.closeIcon}>
                <CustIcon
                  type="antdesign"
                  name="close"
                  size={20}
                  color={Colors.white}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: boxModelSize.xl}}>
            <Text style={styles.totalText}>
              Total Items: {medicineConfirmList.length}
            </Text>
          </View>
          <View>
            <FlatList
              scrollEnabled={true}
              data={medicineConfirmList}
              keyExtractor={(item: any) => item.key + '_confirm'}
              renderItem={(src: any) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: boxModelSize.s,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.borderGrey,
                    }}>
                    <Text style={styles.assistName}>{src.item.lable}</Text>
                    <Text style={styles.assistName}>{src.item.value}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View style={{marginTop: boxModelSize.l}}>
            <CustButton
              title="Submit"
              onPress={onFormSubmit}
              disabled={Object.keys(medicineItem).length == 0}
            />
          </View>
        </View>
      </Modal>
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
              <Text style={commonStyles.navigationText}>Add Presentation</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '49%'}}>
                <CustTextInput
                  label="Patient Name"
                  placeholder="Enter Patient Name"
                  onChangeText={onChangePatientText}
                  errorText={patientName.error}
                  value={patientName.value}
                  autoCompleteType="name"
                  textContentType="name"
                  keyboardType="name-phone-pad"
                  required
                />
              </View>
              <View style={{width: '49%', marginLeft: '2%'}}>
                <CustTextInput
                  label="Medic Name"
                  placeholder="Enter Medic Name"
                  onChangeText={onChangeMedicText}
                  errorText={medicName.error}
                  value={medicName.value}
                  autoCompleteType="name"
                  textContentType="name"
                  keyboardType="name-phone-pad"
                  required
                />
              </View>
            </View>
            <View>
              <CustSearchInput
                value={searchText}
                placeholder="Search"
                label="Search"
                dropIcon={false}
                leftIcon
                iconProps={{
                  type: 'font-awesome',
                  name: 'search',
                  size: 20,
                  color: Colors.iconGrey,
                }}
                onClear={onClearSearch}
                onChangeText={onChangeSearchText}
              />
            </View>
            <FlatList
              scrollEnabled={true}
              data={
                searchResult.length > 0
                  ? searchResult
                  : searchText.length > 0
                  ? []
                  : medicineList
              }
              keyExtractor={(item: any) => item.key}
              renderItem={(src: any) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingLeft: boxModelSize.s,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: boxModelSize.l,
                    }}>
                    <Text>{src.item.lable}</Text>
                    <View>
                      <InputSpinner
                        key={src.item.key}
                        rounded={false}
                        min={0}
                        step={1}
                        width={scale(80)}
                        height={scale(40)}
                        buttonTextColor={Colors.bodyTextGrey}
                        buttonFontFamily={Fonts.primaryRegular}
                        buttonFontSize={fontSize.h5}
                        color={'transparent'}
                        buttonStyle={{width: scale(20)}}
                        inputStyle={{
                          width: scale(40),
                          borderWidth: 1,
                          borderColor: Colors.borderGrey,
                          borderRadius: scale(10),
                          backgroundColor: Colors.white,
                        }}
                        onChange={onInputSpinnerChange.bind(
                          this,
                          src.item.key,
                          src.item.lable,
                        )}
                      />
                    </View>
                  </View>
                );
              }}
            />
            <View style={{marginTop: boxModelSize.l}}>
              <CustButton
                title="View & Submit"
                onPress={onViewSubmit}
                disabled={Object.keys(medicineItem).length == 0}
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
    padding: 20,
    backgroundColor: Colors.white,
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
    fontSize: fontSize.h6,
  },
  title: {
    fontFamily: Fonts.primaryBold,
    color: Colors.primary,
    fontSize: scale(16),
    paddingVertical: scale(5),
    paddingLeft: boxModelSize.l,
  },
  confirmContainer: {
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: Constants.BOX_REDIUS,
    padding: boxModelSize.m,
  },
  totalText: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.bodyTextGrey,
    fontSize: fontSize.h5,
    marginBottom: boxModelSize.l,
  },
});

export default inject('profile', 'nonClinical')(observer(AddPresentation));
