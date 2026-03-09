import React, {FC, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
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
import {
  BottomNavigation,
  CustomSegmentedTab,
  CustSearchInput,
  PatientDetailsHeader,
} from '../../../components';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import SegmentedTab from '../../../components/segmentedTab';
import {inject, observer} from 'mobx-react';
import Avatar from '../../../components/Avatar';
import {getPTPDistance} from '../../../services/locationService';
type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type HandOverProps = {
  navigation: drawerNavigationProp;
  medicProviders: any;
  medicCamps: any;
  profile: any;
};

const Handover: FC<HandOverProps> = (props) => {
  const [searchResult, setSearchResult] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [campData, setCampData] = useState<Array<any>>([]);
  const [medicData, setMedicData] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);

  const handleTabChange = (value: number) => {
    onClearSearch();
    setData(value == 0 ? medicData : campData);
  };

  const checkElement = (epcrData: any, event: string) => {
    return epcrData.filter(function (item) {
      let filteritem = item ? item.name.toUpperCase() : ''.toUpperCase();
      let searchData = event.toUpperCase();
      return filteritem.indexOf(searchData) > -1;
    });
  };

  const onChangeSearchText = (text: string) => {
    if (text.length > 0) {
      let Search = checkElement(data, text);
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
  const assistProfileClicked = () => {};
  const assistProfileChanged = (assistObj) => {};
  useEffect(() => {
    props.medicProviders.medics.map((medicRec) => {
      if (medicRec.fbUserID == props.profile.profile.fbUserID) return;
      if (medicRec.status != 'available') return;
      var _medic = {
        ...medicRec,
        type: 'medic',
        distance: getPTPDistance(
          props.profile.profile.medicLocn,
          medicRec.medicCurrLocn,
        ),
      };
      setMedicData((medic) => [...medic, _medic]);
    });
  }, [props.medicProviders.medics]);
  useEffect(() => {
    props.medicCamps.medicCamps.map((campRec) => {
      var _camp = {
        ...campRec,
        type: 'medicCamp',
        distance: getPTPDistance(
          props.profile.profile.medicLocn,
          campRec.medicCurrLocn,
        ),
      };
      setCampData((camp) => [...camp, _camp]);
    });
  }, [props.medicCamps.medicCamps]);
  useEffect(() => {
    if (medicData.length > 0) setData(medicData);
  }, [medicData]);
  const EpcrHandoverCell = (src: any) => {
    return (
      <View
        style={[
          styles.medicListContainer,
          commonStyles.roundedButtonBoxShadow,
        ]}>
        <View style={{flex: 0.2}}>
          {src.item.type == 'medic' && (
            <Avatar
              size={40}
              source={src.item.profilePicUri}
              status={src.item.status}
            />
          )}
          {src.item.type == 'medicCamp' && (
            <Image
              style={styles.medicCampIcon}
              source={Constants.MEDIC_CAMP_ICON}
            />
          )}
        </View>
        <View style={{flex: 0.6}}>
          <Text style={styles.medicName}>{src.item.name}</Text>
        </View>
        <View style={{flex: 0.2}}>
          <Text style={styles.distanceTxt}>{src.item.distance}</Text>
        </View>
      </View>
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
        <View style={[commonStyles.container, commonStyles.containerSpacing]}>
          <View style={commonStyles.headerContainer}>
            <PatientDetailsHeader
              profileChanged={assistProfileChanged}
              profileClicked={assistProfileClicked}
            />
          </View>
          <View style={commonStyles.contentContainer}>
            <CustomSegmentedTab
              defaultSelectedTab={0}
              tabValue={['Medic', 'Medic Center']}
              handleTabChange={handleTabChange}
              tabSize="medium"
            />
            <View style={{padding: boxModelSize.m}}>
              <Text
                style={[
                  commonStyles.whiteBoxTitle,
                  {textAlign: 'center', paddingBottom: boxModelSize.m},
                ]}>
                Handover
              </Text>
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
                  //onEndEditing={handleSubmit(onSubmit)}
                />
              </View>
              <View>
                <FlatList
                  style={{height: '70%'}}
                  scrollEnabled={true}
                  data={
                    searchResult.length > 0
                      ? searchResult
                      : searchText.length > 0
                      ? []
                      : data
                  }
                  keyExtractor={(item: any) => item.fbUserID}
                  renderItem={({item}: any) => {
                    return <EpcrHandoverCell item={item} />;
                  }}
                />
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
  medicListContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGrey,
    borderRadius: scale(50),
    padding: boxModelSize.m,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: boxModelSize.l,
  },
  medicName: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h6,
    color: Colors.primary,
  },
  distanceTxt: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
    color: Colors.bodyTextGrey,
  },
  medicCampIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(30),
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

export default inject(
  'medicProviders',
  'medicCamps',
  'profile',
)(observer(Handover));
