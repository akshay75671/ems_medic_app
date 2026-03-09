import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {scale} from 'react-native-size-matters';

import Constants from '../../../core/constants';
import {
  BottomNavigation,
  PatientDetailsHeader,
  CustIcon,
  CustomSegmentedTab,
  CustSearchInput,
  DynamicMenu,
  DynamicForm2,
} from '../../../components';
import {boxModelSize, Colors, commonStyles, Fonts} from '../../../styles';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import {observer, inject} from 'mobx-react';
import DynamicFormSearchResult from '../../../components/dynamicFormSearchResult';
import {filterObjectByKey} from '../../../core/utils';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  assessmentStore: any;
  treatmentStore: any;
  assistRequests: any;
};

const Assessment: FC<navigationProps> = (props) => {
  const [searchText, setSearchText] = useState('');
  const [showFrequentlyUsed, setShowFrequentlyUsed] = useState(false);
  const [selectedSeg, setSelectedSeg] = useState(0);
  const [menuItems, setMenuItems] = useState({});
  const [expandedItems, setExpandedItems] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [formHeader, setFormHeader] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [hideList, setHideList] = useState([]);

  const [searchRawData, setSearchRawData] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [formScrollPosition, setFormScrollPosition] = useState(null);

  useEffect(() => {
    setShowForm(null);
    setFormHeader(null);
    setExpandedItems([]);
    setSearchText('');
    setSelectedMenuId(null);
    setSearchRawData(null);
    setShowSearchResult(null);
    setFormScrollPosition(null);

    if (selectedSeg == 0) {
      if (showFrequentlyUsed == true) {
        setMenuItems(
          props.assessmentStore.getPrimaryAssessmentFrequentlyUsedFormData(),
        );
      } else {
        setMenuItems(props.assessmentStore.getPrimaryAssessmentFormData());
      }
    } else {
      setMenuItems(props.assessmentStore.getSecondaryAssessmentFormData());
    }

    return () => {};
  }, [selectedSeg, showFrequentlyUsed]);

  useEffect(() => {
    if (currentUserId) {
      setUserData(props.assessmentStore.getAssistUserDataByID(currentUserId));
      setHideList(
        props.assessmentStore.getAssistUserHideListByID(currentUserId),
      );
    }

    return () => {};
  }, [
    currentUserId,
    props.assessmentStore.assessmentUserData,
    props.assessmentStore.assessmentHideSections,
  ]);

  const assistProfileClicked = () => {};
  const assistProfileChanged = (assistObj) => {
    setSelectedMenuId(null);
    formBackHandler();
    setCurrentUserId(assistObj.assistUserID);
  };

  const handleTabChange = (value: number) => {
    setSelectedSeg(value);
  };

  function _onSearch(text) {
    if (text && text.length < 1) {
      setShowSearchResult(false);
      return;
    }

    var _data =
      showForm != null
        ? showForm
        : {data: menuItems, name: selectedSeg == 0 ? 'Primary' : 'Secondary'};
    setSearchRawData(_data);
    setShowSearchResult(true);
  }

  function onMenuItemTap(item: any) {
    if (item.type == 'form') {
      //show form
      setFormScrollPosition(null);
      setShowForm(item);

      //Check for GCS Form
      checkForFormHeader(item.id);

      setSelectedMenuId(item.id);
    } else {
      var sel = expandedItems;
      if (expandedItems.indexOf(item.id) == -1) {
        setExpandedItems((expandedItems) => [...expandedItems, item.id]);
      } else {
        sel = sel.filter((i) => i != item.id);
        setExpandedItems(sel);
      }
    }
  }

  const formBackHandler = () => {
    setShowForm(null);
    setFormHeader(null);

    if (searchText && searchText?.length > 0) {
      setShowSearchResult(true);
    }
  };

  const saveFormHandler = (newUserData, newHideList) => {
    setHideList(newHideList);
    setUserData(newUserData);

    props.assessmentStore.setAssessmentUserData(
      currentUserId,
      newUserData,
      newHideList,
    );

    if (showForm.id == 'P8') {
      const populateData = filterObjectByKey(newUserData, (option) =>
        option.includes('P8'),
      );

      props.treatmentStore.populateToTreatment(
        currentUserId,
        populateData,
        'P8',
        'P2',
      );
    } else if (showForm.id == 'P2-S3') {
      props.assessmentStore.gcsOperation(currentUserId);
      checkForFormHeader(showForm.id);
    }
  };

  const onSearchRecTap = (item: any) => {
    var _formLevel = item?.pos?.findIndex((i) => i.includes('form_'));

    if (_formLevel != -1) {
      setShowForm(item.value[_formLevel]);
      checkForFormHeader(item.value[_formLevel].id);
    }
    setFormScrollPosition(item?.pos);
    setShowSearchResult(false);
  };

  const checkForFormHeader = (id) => {
    if (id == 'P2-S3') {
      setFormHeader(
        'Total GCS: ' + props.assessmentStore.getGCSTotal(currentUserId),
      );
    } else {
      setFormHeader(null);
    }
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
          <View style={[styles.contentContainer, styles.boxShadow]}>
            <View>
              <Text style={[commonStyles.whiteBoxTitle, {textAlign: 'center'}]}>
                Assessment
              </Text>
            </View>
            <View>
              <CustomSegmentedTab
                defaultSelectedTab={selectedSeg}
                tabValue={['Primary'.toUpperCase(), 'Secondary'.toUpperCase()]}
                handleTabChange={(value: number) => handleTabChange(value)}
                tabSize="medium"
              />
            </View>
            <View
              style={{
                flexShrink: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: boxModelSize.m,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowFrequentlyUsed(!showFrequentlyUsed),
                      setShowSearchResult(false),
                      setSearchText(null);
                  }}>
                  <View style={styles.pcrMenuIcon}>
                    {showFrequentlyUsed ? (
                      <CustIcon
                        type="material"
                        size={scale(23)}
                        color={Colors.white}
                        name="menu"
                      />
                    ) : (
                      <CustIcon
                        type="font-awesome"
                        size={scale(18)}
                        color={Colors.white}
                        name="history"
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={{paddingLeft: 10, flexGrow: 1}}>
                  <CustSearchInput
                    placeholder={'Search'}
                    label={'Search'}
                    required={true}
                    leftIcon
                    iconProps={{
                      type: 'font-awesome',
                      name: 'search',
                      size: 20,
                      color: Colors.iconGrey,
                    }}
                    defaultValue={searchText}
                    onChangeText={(text) => {
                      setSearchText(text);
                    }}
                    onClear={() => {
                      setShowSearchResult(false), setSearchText(null);
                    }}
                    onEndEditing={(val) => _onSearch(searchText)}
                  />
                </View>
              </View>

              {showSearchResult ? (
                <DynamicFormSearchResult
                  data={searchRawData}
                  searchString={searchText}
                  onSearchRecTap={(item) => onSearchRecTap(item)}
                />
              ) : (
                <View style={{flexShrink: 1}}>
                  {showForm ? (
                    <DynamicForm2
                      header={formHeader}
                      form={showForm}
                      updateData={userData}
                      hideList={hideList}
                      positionKey={formScrollPosition}
                      goBack={() => formBackHandler()}
                      saveFormData={(formData, hideList) =>
                        saveFormHandler(formData, hideList)
                      }
                    />
                  ) : (
                    <View style={{flexShrink: 1}}>
                      {showFrequentlyUsed ? (
                        <Text style={styles.title}>Frequently Used</Text>
                      ) : null}
                      <DynamicMenu
                        selectedItemId={selectedMenuId}
                        menuItems={menuItems}
                        hideList={hideList}
                        userData={userData}
                        expandedItems={expandedItems}
                        onTap={onMenuItemTap}
                      />
                    </View>
                  )}
                </View>
              )}
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
    backgroundColor: Colors.white,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  title: {
    fontFamily: Fonts.primaryBold,
    color: Colors.primary,
    fontSize: scale(16),
    paddingVertical: scale(5),
    paddingLeft: boxModelSize.l,
  },
  pcrMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: Colors.linkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default inject(
  'assessmentStore',
  'treatmentStore',
  'assistRequests',
)(observer(Assessment));
