import React, { FC, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../styles';
import Constants from '../../core/constants';
import { scale } from 'react-native-size-matters';
import InputSpinner from 'react-native-input-spinner';
import {
  BottomNavigation,
  CustButton,
  PatientDetailsHeader,  
  CustSearchInput,
  Accordian,
  CustIcon
} from '../../components';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { HomeDrawerMenuParamList } from '../../types/navigationsTypes';
import { inject, observer } from 'mobx-react';
import { resourceData } from '../../model/resources.json';
import { medicineList } from '../../model/medicineList.json';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type ResourcesProps = {
  navigation: drawerNavigationProp;
  assistRequests: any;
  resource: any;
};
const Resources: FC<ResourcesProps> = (props) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>([]);
  const [displayItem, setDisplayItem] = useState<Array<any>>([]);
  const [medicineItem, setMedicineItem] = useState<any>({});
  const [newData, setNewData] = useState([]);
  const [assist, setAssist] = useState<any>(null);
  const [addValue, setAddValue] = useState<boolean>(false);
  const [intialValue, setIntialValue] = useState<boolean>(false);

  const goBack = () => {
    if (props.navigation.canGoBack) props.navigation.goBack();
  };
  const assistProfileClicked = () => { };
  const assistProfileChanged = (assistObj) => {
    // setDisplayItem(
    //   props.resource.getResourceData(assistObj.assistUserID).items,
    // );
    if (props.resource.resource.length != 0)
      setDisplayItem(props.resource.getResourceData('5325'))
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
  const onInputSpinnerChange = (key, lable, value) => {
    setNewData(newData.filter(data => data.key != key).concat({ key: key, lable: lable, value: value }))
    if (value != 0) {
      console.log('in if');      
      setMedicineItem({ key, lable, value });
    }
    else {
      console.log('in else');      
      if (Object.keys(medicineItem).length > 0) {
        delete medicineItem[key];
        setMedicineItem({ ...medicineItem });
      }
    }
  };

  const editResourceValue = () => {
    setAddValue(true)
    setIntialValue(false)
    displayItem.map((unit, key) => {
      medicineList.some((data) => {
        if (unit.key === data.key) {
          data.value = unit.value;
        }
      })
    })
    setSearchResult([...medicineList])
  };

  const deleteResourceValue = () => {
    setDisplayItem([])
    medicineList.forEach((key) => {
      key.value = 0
    })
    setSearchResult([...medicineList])
    setIntialValue(true)
  }

  const getData = () => {
    if (props.resource.resource.length != 0) {
      setDisplayItem(props.resource.getResourceData('5325').item)
    }
  }

  useEffect(() => {
    getData()
    setAssist(
      props.assistRequests.getFamilyMemberObject(
        props.assistRequests.selectedProfile,
      ),
    );
  }, []);

  const onsubmit = () => {
    setIntialValue(intialValue => !intialValue)
    const result = newData.filter(item => item.value != 0)
    if (Object.keys(medicineItem).length > 0) {
      let items = {
        epcrNum: '121',
        eventID: 'ipl2020',
        assistUserID: '5325',
        item: result,
      };
      props.resource.setResourceData(items, addValue);
    }
    setNewData([])
    getData()
  }

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
      <View style={commonStyles.bottomBGContainer} />
      <View style={commonStyles.masterContainer}>
        <View style={[commonStyles.container, commonStyles.containerSpacing]}>
          {/* <View style={styles.headerContainer}>
            <PatientDetailsHeader
              profileChanged={assistProfileChanged}
              profileClicked={assistProfileClicked}
              showCloseButton={true}
              closePage={goBack}
            />
          </View> */}
          <View style={[styles.contentContainer, { padding: boxModelSize.m }]}>
            <View>
              <Text
                style={[
                  commonStyles.whiteBoxTitle,
                  { textAlign: 'center', paddingBottom: boxModelSize.m },
                ]}>
                Resources
              </Text>
            </View>
            {displayItem.length != 0 ?
              <View
                style={[
                  commonStyles.roundedRectangeCart,
                  commonStyles.whiteBoxShadow,
                ]}>
                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', width: scale(50), justifyContent: 'space-between', marginBottom: scale(10) }}>
                  <TouchableOpacity onPress={editResourceValue}>
                    <CustIcon
                      type="antdesign"
                      name={'edit'}
                      size={scale(16)}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteResourceValue}>
                    <CustIcon
                      type="antdesign"
                      name={'delete'}
                      size={scale(16)}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Accordian
                  title={'Total Items ' + displayItem.length}
                  data={displayItem}
                />
              </View>
              : null}
            <View style={{ flex: 1, height: '100%', paddingBottom: scale(20) }}>
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
                showsVerticalScrollIndicator={false}
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
                          value={intialValue === false ? src.item.value : '0'}
                          step={1}
                          width={scale(80)}
                          height={scale(40)}
                          buttonTextColor={Colors.bodyTextGrey}
                          buttonFontFamily={Fonts.primaryRegular}
                          buttonFontSize={fontSize.h5}
                          color={'transparent'}
                          buttonStyle={{ width: scale(20) }}
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
            </View>
          </View>
        </View>
      </View>
      <CustButton
        type="default"
        title="View & Submit"
        onPress={onsubmit}
        style={{ position: 'absolute', top: 0, bottom: 100 }}
      />
      <View style={commonStyles.footerContainer}>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.2,
  },
  profileDetails: { flex: 1, paddingTop: boxModelSize.l },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    // zIndex: 1,
  },
  epcrNo: {
    textAlign: 'center',
    color: Colors.secondary,
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h5,
  },
  optionItem: {
    padding: scale(10),
    marginBottom: scale(15),
    height: scale(40),
    flexDirection: 'row',
    borderRadius: scale(45),
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    fontSize: scale(14),
    paddingLeft: scale(10),
  },
});

export default inject('assistRequests', 'resource')(observer(Resources));
