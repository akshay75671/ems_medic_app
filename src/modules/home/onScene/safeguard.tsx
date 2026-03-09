import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  Modal,
  Keyboard,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../styles';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import Constants from '../../../core/constants';
import {
  BottomNavigation,
  CustButton,
  CustIcon,
  CustSnackBar,
  CustTextInput,
  PatientDetailsHeader,
  ScanScreen,
  CustDataPicker,
  Accordian,
  CustSignature,
} from '../../../components';
import Modals from 'react-native-modal';
import {inject, observer} from 'mobx-react';
import CheckBox from '@react-native-community/checkbox';
import InputSpinner from 'react-native-input-spinner';
import {getImageUriFromStorage} from '../../../core/utils';
import moment from 'moment';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  assistRequests: any;
  safeguard: any;
  profile: any;
};
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const medicineTypeListArr: any[] = [
  {key: 'sheet', value: 'Sheet'},
  {key: 'box', value: 'Box'},
  {key: 'card', value: 'Card'},
  {key: 'tablet', value: 'Tablet'},
  {key: 'bottle', value: 'Bottle'},
  {key: 'syringe', value: 'Syringe'},
  {key: 'patch', value: 'Patch'},
];
const idList: string[] = ['3256', '3257', '3258', '3259', '3260'];
const ViewVitals: FC<navigationProps> = (props) => {
  const [qrCodeModal, setQrCodeModal] = useState<boolean>(false);
  const [addMedicineModal, setAddMedicineModal] = useState<boolean>(false);
  const [medicineList, setMedicineList] = useState<Array<any>>([]);
  const [wholemedicineList, setwholeMedicineList] = useState<Array<any>>([]);
  const [editMedicine, setEditMedicine] = useState<any>(null);
  const [medicineName, setMedicineName] = useState<string>('');
  const [medicineNameError, setMedicineNameError] = useState<string>(null);
  const [medicineQuantity, setMedicineQuantity] = useState<number>(1);
  const [medicineType, setMedicineType] = useState<string>('sheet');
  const [value, setValue] = useState<string>(idList[0]);
  const [cutValue, setCutValue] = useState<boolean>(false);
  const [copyValue, setCopyValue] = useState<boolean>(false);
  const [pastemedicineList, setpasteMedicineList] = useState<Array<any>>([]);
  const [pastevalue, setPasteValue] = useState<string>(idList[0]);
  const [graytxt, setGrayTxt] = useState<boolean>(false);
  const [selectallcheck, setSelectAllCheck] = useState<boolean>(false);
  const [keyboardshow, setKeyboardShow] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [signImgPath, setSignImgPath] = useState<string>(undefined);
  const [isEditable, setEditable] = useState<boolean>(true);
  const [showSignature, setShowSignature] = useState<boolean>(false);

  const toggleQrCodeModal = () => {
    setQrCodeModal(!qrCodeModal);
  };
  const handleQrCodeScan = async (value) => {
    setQrCodeModal(false);
  };
  const medicineNameChanged = (mName) => {
    setMedicineName(mName);
    setMedicineNameError(null);
  };
  const medicineTypeChanged = (mType) => {
    setMedicineType(mType);
  };
  const medicineQuantityChanged = (mQuantity) => {
    setMedicineQuantity(mQuantity);
  };
  const showAddMedicineModal = (mQuantity) => {
    setAddMedicineModal(true);
  };

  const closeAddMedicineModal = (mQuantity) => {
    setAddMedicineModal(false);
  };
  const addMedicine = () => {
    let found = true;
    if (medicineName == '') {
      setMedicineNameError('Enter medicine name');
      return;
    }
    found = false;
    medicineList.map((item) => {
      if (
        item.medicineName === medicineName &&
        item.medicineType === medicineType
      ) {
        setMedicineNameError('Enter diffrenent name or type');
        found = true;
      }
    });
    if (!found) {
      props.safeguard[editMedicine ? 'updateMedicine' : 'addMedicine'](
        value,
        {
          id: editMedicine
            ? editMedicine.id
            : 'medicine_Row_' + (medicineList.length + 1),
          selected: false,
          medicineName,
          medicineQuantity,
          medicineType,
        },
        getMedicineList,
      );
      setMedicineName('');
      setMedicineQuantity(1);
      setMedicineType('sheet');
      setEditMedicine(null);
    }
  };
  const onSubmit = () => {
    if (summary.length == 0) {
      CustSnackBar('Please enter note');
      return;
    }
    if (!signImgPath) {
      CustSnackBar('Please upload medic signature');
      return;
    }
  };
  useEffect(() => {
    getMedicineList();
    props.safeguard.setAllIdList(idList);
  }, [value]);
  const medicinSelected = (medicinID) => {
    setSelectAllCheck(false);
    setMedicineNameError(null);
    var tempArr: any[] = [...medicineList];
    tempArr.forEach((item, index) => {
      if (item.id == medicinID) item.selected = !item.selected;
    });
    setMedicineList(tempArr);
    setpasteMedicineList(tempArr);
    setGrayTxt(false);
  };
  const selectAll = () => {
    setSelectAllCheck((selectallcheck) => !selectallcheck);
    setMedicineNameError(null);
    var tempArr: any[] = [...medicineList];
    if (selectallcheck === false) {
      tempArr.forEach((item) => {
        item.selected = true;
      });
    } else {
      tempArr.forEach((item) => {
        item.selected = false;
      });
    }
    setMedicineList(tempArr);
    setpasteMedicineList(tempArr);
  };
  const getSelectedMedicineList = () => {
    let tempArr: any[] = [];
    medicineList.forEach((item, index) => {
      if (item.selected) tempArr.push(item);
    });
    return tempArr;
  };
  const editMedicineList = () => {
    var selectedList = getSelectedMedicineList();
    if (selectedList.length == 1) {
      setEditMedicine(selectedList[0]);
      setMedicineName(selectedList[0].medicineName);
      setMedicineQuantity(selectedList[0].medicineQuantity);
      setMedicineType(selectedList[0].medicineType);
      setAddMedicineModal(true);
    } else {
      CustSnackBar('Select one item to edit');
    }
  };
  const getMedicineList = () => {
    if (props.safeguard.safeguards.length > 0)
      setMedicineList(props.safeguard.getMedicine(value, medicineList));
    setSummary(props.safeguard.editNotenTime(summary));
    console.log('list', medicineList);
    // setSummary(props.safeguard)
  };
  const assistProfileClicked = () => {};
  const assistProfileChanged = (assistObj) => {};
  const handleChangeText = (data: string) => {
    setValue(data);
    getMedicineList();
    if (pastevalue != data && copyValue === true) {
      setCutValue(false);
    } else {
      if (graytxt === true) setCutValue(false);
    }
    setSelectAllCheck(false);
  };
  const handleBlur = () => {};
  const cutMedicineValue = () => {
    if (pastemedicineList.length > 0) {
      setPasteValue(value);
      setGrayTxt(true);
      setCutValue(true);
      setCopyValue(false);
    }
  };
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardShow(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardShow(false);
  };

  const copyMedicineValue = () => {
    setCopyValue(true);
    setPasteValue(value);
  };

  const visibleItem = () => {
    setGrayTxt(false);
    setCutValue(false);
    medicineList.map((item) => {
      item.selected = false;
    });
    getMedicineList();
  };

  const pasteMedicineValue = () => {
    if (pastevalue != value) {
      props.safeguard.pasteMedicine(
        value,
        pastemedicineList,
        copyValue,
        pastevalue,
        visibleItem,
      );
      getMedicineList();
      setpasteMedicineList([]);
    }
  };
  const deleteMedicineList = () => {
    props.safeguard.deleteMedicine(value);
    getMedicineList();
  };
  const onChangeHandler = (value) => {
    setSummary(value);
  };
  const openSignature = () => {
    setShowSignature(true);
  };
  const onSignatureClose = () => {
    setShowSignature(false);
  };
  const onSignatureSave = () => {
    setShowSignature(false);
    setMedicSignImg(
      Constants.PROFILE_SIGN_PREFIX + props.profile.profile.fbUserID,
    );
  };
  const setMedicSignImg = (fileName) => {
    getImageUriFromStorage(Constants.STORAGE_PROFILE, fileName)
      .then((imageUri: any) => {
        setSignImgPath(imageUri);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const removeSignature = () => {
    setSignImgPath(undefined);
  };
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Modals
        isVisible={qrCodeModal}
        deviceWidth={screenWidth}
        deviceHeight={screenHeight}
        onBackdropPress={() => setQrCodeModal(false)}
        onSwipeComplete={() => setQrCodeModal(false)}
        swipeDirection="left">
        <View style={styles.closeIconContainer}>
          <TouchableOpacity onPress={toggleQrCodeModal}>
            <View style={styles.closeIcon}>
              <CustIcon type="antdesign" name="close" size={20} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, borderWidth: 2, backgroundColor: Colors.black}}>
          <ScanScreen scanDone={handleQrCodeScan}></ScanScreen>
        </View>
      </Modals>

      <Modal visible={addMedicineModal} transparent animationType="fade">
        <View style={styles.mainpopupOverlay}>
          <ScrollView
            style={[
              styles.addMedicineContainer,
              {
                marginBottom: keyboardshow === false ? scale(50) : 0,
              },
            ]}
            showsVerticalScrollIndicator={true}>
            <View style={{marginTop: scale(10)}}>
              <Accordian
                title={'Total Items ' + medicineList.length}
                data={medicineList}
              />
            </View>
            <View
              style={[
                styles.vitalsBox,
                {padding: boxModelSize.m, marginTop: boxModelSize.xl},
              ]}>
              <View style={styles.vitalSectionBox}>
                <CustTextInput
                  label="Medicine Name"
                  placeholder="Enter Medicine Name"
                  onChangeText={medicineNameChanged}
                  errorText={medicineNameError}
                  value={medicineName}
                />
              </View>
              <View
                style={[
                  styles.vitalSectionBox,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={styles.labelDefault}>Quantity</Text>
                <InputSpinner
                  key={'medQuantity'}
                  rounded={false}
                  min={1}
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
                  value={medicineQuantity}
                  onChange={medicineQuantityChanged}
                />
              </View>
              <View style={styles.vitalSectionBox}>
                <FlatList
                  data={medicineTypeListArr}
                  keyExtractor={(item: any) => item.key}
                  renderItem={(src: any) => {
                    return (
                      <View style={styles.medicineTypeItem}>
                        <View style={styles.medicineName}>
                          <CheckBox
                            value={medicineType == src.item.key}
                            onValueChange={medicineTypeChanged.bind(
                              this,
                              src.item.key,
                            )}
                          />
                          <Text style={styles.assistName}>
                            {src.item.value}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            <View style={{marginBottom: scale(20)}}>
              <CustButton
                title={editMedicine ? 'Update' : 'Add'}
                onPress={addMedicine}
              />
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={closeAddMedicineModal}
            style={{position: 'absolute', top: scale(10), alignSelf: 'center'}}>
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
      </Modal>
      {showSignature && (
        <CustSignature
          fileName={
            Constants.PROFILE_SIGN_PREFIX + props.profile.profile.fbUserID
          }
          filePath={Constants.STORAGE_PROFILE}
          onClose={onSignatureClose}
          onSave={onSignatureSave}
        />
      )}
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
          {/* <View style={commonStyles.headerContainer}>
            {props.assistRequests.familyList.length > 0 && (
              <PatientDetailsHeader
                profileChanged={assistProfileChanged}
                profileClicked={assistProfileClicked}
              />
            )}
            {props.assistRequests.familyList.length == 0 && (
              <View style={styles.headerInner}>
                <TouchableOpacity onPress={toggleQrCodeModal}>
                  <CustIcon
                    size={scale(40)}
                    color={Colors.white}
                    type="antdesign"
                    name="qrcode"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleQrCodeModal}>
                  <CustIcon
                    size={scale(40)}
                    color={Colors.white}
                    type="antdesign"
                    name="search1"
                  />
                </TouchableOpacity>
              </View>
            )} 
          </View>*/}
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: scale(10),
              padding: scale(10),
              marginVertical: scale(10),
            }}>
            <CustDataPicker
              items={idList}
              label="ID List"
              placeholder="Select Id"
              onChangeText={handleChangeText.bind(this)}
              value={value}
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
                Safeguard
              </Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <CustButton
                    onPress={() => {}}
                    type="main"
                    size={70}
                    iconProps={{
                      type: 'antdesign',
                      name: 'search1',
                      size: 30,
                      color: Colors.primary,
                    }}
                  />
                </View>
                <View>
                  <CustButton
                    onPress={() => {}}
                    type="main"
                    size={70}
                    iconProps={{
                      type: 'antdesign',
                      name: 'qrcode',
                      size: 30,
                      color: Colors.primary,
                    }}
                  />
                </View>
                <View>
                  <CustButton
                    onPress={() => {}}
                    type="main"
                    size={70}
                    iconProps={{
                      type: 'material-community',
                      name: 'timetable',
                      size: 30,
                      color: Colors.primary,
                    }}
                  />
                </View>
                <View>
                  <CustButton
                    onPress={() => {}}
                    type="main"
                    size={70}
                    iconProps={{
                      type: 'font-awesome-5',
                      name: 'tablets',
                      size: 30,
                      color: Colors.primary,
                    }}
                  />
                </View>
              </View>
              <View
                style={[
                  commonStyles.roundedRectangeCart,
                  commonStyles.whiteBoxShadow,
                  {marginTop: boxModelSize.l, marginBottom: scale(150)},
                ]}>
                <View style={styles.actionButtonsBox}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={cutMedicineValue}>
                    <CustIcon
                      type="font-awesome"
                      name="cut"
                      color={Colors.bodyTextGrey}
                      size={20}
                    />
                    {/* <Text style={styles.actionButtonName}>Cut</Text> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={copyMedicineValue}>
                    <CustIcon
                      type="font-awesome"
                      name="copy"
                      color={Colors.bodyTextGrey}
                      size={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cutValue === true ? null : pasteMedicineValue}
                    style={[
                      styles.actionButton,
                      {backgroundColor: cutValue === true ? '#ccc' : null},
                    ]}>
                    <CustIcon
                      type="font-awesome"
                      name="paste"
                      color={Colors.bodyTextGrey}
                      size={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={editMedicineList}>
                    <View style={styles.actionButton}>
                      <CustIcon
                        type="font-awesome"
                        name="edit"
                        color={Colors.bodyTextGrey}
                        size={20}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={deleteMedicineList}>
                    <CustIcon
                      type="antdesign"
                      name="delete"
                      color={Colors.bodyTextGrey}
                      size={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={showAddMedicineModal}>
                    <View style={styles.actionButton}>
                      <CustIcon
                        type="ionicon"
                        name="add-circle-outline"
                        color={Colors.bodyTextGrey}
                        size={23}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <ScrollView style={{height: '60%'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CheckBox
                      value={selectallcheck}
                      onValueChange={selectAll}
                    />
                    <Text
                      style={{fontSize: fontSize.h5, color: Colors.primary}}>
                      Select All
                    </Text>
                  </View>
                  <FlatList
                    data={medicineList}
                    keyExtractor={(item: any) => item.id}
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom: scale(20)}}
                    renderItem={(src: any) => {
                      return (
                        <View
                          style={[
                            styles.medicineListItem,
                            {
                              opacity:
                                graytxt === true && src.item.selected === true
                                  ? 0.3
                                  : null,
                            },
                          ]}>
                          <View style={styles.medicineName}>
                            <CheckBox
                              value={src.item.selected}
                              onValueChange={medicinSelected.bind(
                                this,
                                src.item.id,
                              )}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text style={styles.assistName}>
                                {src.item.medicineName}
                              </Text>
                              <Text style={styles.assistName}>{' - '}</Text>
                              <Text style={styles.medicineTypeName}>
                                {src.item.medicineType}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.medicName}>
                            {src.item.medicineQuantity}
                          </Text>
                        </View>
                      );
                    }}
                  />
                  <CustTextInput
                    label={'Notes'}
                    placeholder={'Safeguard Notes'}
                    multiline={true}
                    onChangeText={onChangeHandler}
                    value={summary}
                    required
                  />
                  {/* {isEditable && !signImgPath && (
                    <TouchableOpacity onPress={openSignature}>
                      <View style={[styles.medicSign, styles.narrativeBox]}>
                        <CustIcon
                          type="font-awesome-5"
                          name="file-signature"
                          size={30}
                          color={Colors.primary}
                        />
                        <Text style={styles.signLabel}>Medic Signature</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {signImgPath && (
                    <View style={styles.signaturePicContainer}>
                      <Image
                        style={styles.signaturePic}
                        source={{
                          uri: signImgPath,
                        }}
                      />
                      {isEditable && (
                        <View style={styles.deleteButton}>
                          <TouchableOpacity onPress={removeSignature}>
                            <CustIcon
                              type="antdesign"
                              name="delete"
                              color={Colors.primary}
                              size={30}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )} */}
                  <CustButton title={'Submit'} onPress={getMedicineList} />
                </ScrollView>
              </View>
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
  medicineTypeName: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.linkBlue,
    fontSize: fontSize.mainMenuButtonText,
    textTransform: 'uppercase',
  },
  headerInner: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  closeIconContainer: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    width: '103%',
    alignItems: 'flex-end',
    zIndex: 22,
  },
  closeIcon: {
    width: scale(35),
    height: scale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicineListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGrey,
  },
  medicineTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicineName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonsBox: {
    backgroundColor: Colors.backgroundwhite,
    borderRadius: scale(5),
    padding: boxModelSize.s,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: boxModelSize.l,
  },
  actionButton: {},
  actionButtonName: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.mainMenuButtonText,
    color: Colors.bodyTextGrey,
  },
  addMedicineContainer: {
    backgroundColor: 'white',
    borderRadius: Constants.BOX_REDIUS,
    padding: boxModelSize.m,
    width: scale(320),
    alignSelf: 'center',
    marginTop: boxModelSize.xl,
  },
  vitalsBox: {
    backgroundColor: Colors.lightGrey,
    marginBottom: boxModelSize.l,
    borderRadius: scale(10),
  },
  vitalSectionBox: {
    borderWidth: 1,
    padding: scale(10),
    borderColor: Colors.borderGrey,
    borderRadius: scale(10),
    marginBottom: boxModelSize.m,
  },
  labelDefault: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: fontSize.h6,
  },
  mainpopupOverlay: {
    position: 'relative',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  signLabel: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
    marginTop: boxModelSize.m,
  },
  narrativeBox: {
    backgroundColor: Colors.lightGrey,
    padding: boxModelSize.m,
    marginBottom: boxModelSize.l,
    borderRadius: scale(10),
  },
  medicSign: {
    padding: boxModelSize.m,
    minHeight: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signaturePicContainer: {
    backgroundColor: Colors.backgroundwhite,
    borderRadius: scale(10),
    marginBottom: boxModelSize.m,
    height: scale(120),
    padding: boxModelSize.s,
  },
  signaturePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: boxModelSize.m,
    bottom: boxModelSize.m,
  },
});

export default inject(
  'safeguard',
  'assistRequests',
  'profile',
)(observer(ViewVitals));
