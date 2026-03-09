import React, {FC, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
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
import {BottomNavigation, CustIcon} from '../../../components';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import epcrHandoverData from '../../../model/epcrhandoverData.json';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LinearGradient from 'react-native-linear-gradient';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
};

const EPCR: FC<navigationProps> = (props) => {
  const [searchResult, setSearchResult] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>('');

  const openLeftMenu = () => {
    props.navigation.openDrawer();
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
      let Search = checkElement(epcrHandoverData.epcrData, text);
      setSearchText(text);
      setSearchResult(Search);
    } else {
      setSearchText('');
      setSearchResult([]);
    }
  };

  const RenderEpcrCell = (item: any) => {
    return (
      <View style={styles.cellContainer}>
        <View
          style={{
            ...styles.cellinnerContainer,
            backgroundColor:
              item.item.status === '1' ? Colors.white : Colors.graycell,
          }}>
          <View style={styles.mainbody1}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.75, y: 0.75}}
              colors={[Colors.white, Colors.borderGrey]}
              style={styles.linearGradientProfileShadow}>
              <View style={styles.profilebody}>
                <Image
                  style={styles.profileimg}
                  source={{uri: item.item.pic}}
                />
              </View>
            </LinearGradient>
            <Text style={styles.nameStyle}>{item.item.name}</Text>
          </View>
          <View style={styles.mainbody2}>
            <View style={styles.inprogressdiv}>
              <Text style={styles.numtext}>{item.item.number}</Text>
              <Text
                style={{
                  ...styles.inprogressTextStyle,
                  color:
                    item.item.status === '1'
                      ? Colors.primaryGradientStart
                      : Colors.green,
                }}>
                {item.item.status === '1' ? '  In Progress' : '  Completed'}
              </Text>
            </View>
            <View>
              <View style={styles.recordnumdiv}>
                <Text style={styles.recordText}>Record Number :</Text>
                <Text style={styles.assignmedicText}>
                  {` ${item.item.recordNum}`}
                </Text>
              </View>
              <View style={styles.assignmedicdiv}>
                <Text style={styles.recordText}>Assigned Medics :</Text>
                <Text
                  style={
                    styles.assignmedicText
                  }>{` ${item.item.assignMedic}`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.mainbody3}>
            <Text style={styles.timeText}>{item.item.lastmsgTime}</Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={styles.assignProfilediv}>
                <View style={styles.innerassignprofilediv}>
                  {item.item.assignUserPic !== '' && (
                    <Image
                      style={styles.profileimg}
                      source={{uri: item.item.pic}}
                    />
                  )}
                </View>
                {item.item.assignUserPic !== '' && (
                  <View style={styles.circlediv} />
                )}
              </View>
              <View>
                {item.item.islock === 'true' && (
                  <View style={styles.lockdiv}>
                    <EvilIcons
                      name={'lock'}
                      size={scale(17)}
                      color={Colors.black}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
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
          <View style={styles.headerContainer}>
            <View style={{position: 'absolute', top: 0, left: 0}}>
              <TouchableOpacity style={{padding: 20.0}} onPress={openLeftMenu}>
                <CustIcon
                  type="font-awesome"
                  name="bars"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.profileDetails}>
              <View>
                <View style={styles.profilePic}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={Constants.DUMMY_PROFILE_PIC}
                  />
                </View>
                <View style={[styles.familyPics, {left: scale(-25)}]}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={Constants.DUMMY_PROFILE_PIC}
                  />
                </View>
                <View style={[styles.familyPics, {right: scale(-25)}]}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={Constants.DUMMY_PROFILE_PIC}
                  />
                </View>
              </View>
              <Text style={styles.epcrNo}>EPCR: 126</Text>
              <Text style={styles.Requested}>Self</Text>
            </View>
          </View>
          <View style={[styles.contentContainer, {padding: boxModelSize.m}]}>
            <TextInput
              style={styles.searchTextinput}
              onChangeText={(text) => onChangeSearchText(text)}
              value={searchText}
              placeholder={'Search'}
            />

            <View style={{marginBottom: 30}}>
              <FlatList
                data={
                  searchResult.length > 0
                    ? searchResult
                    : searchText.length > 0
                    ? []
                    : epcrHandoverData.epcrData
                }
                keyExtractor={(item: any, index: any) => index.toString()}
                renderItem={({item, index}: any) => {
                  return <RenderEpcrCell item={item} />;
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  profileDetails: {flex: 1, alignItems: 'center'},
  contentContainer: {
    flex: 0.85,
    backgroundColor: Colors.backgroundwhite,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  epcrNo: {
    textAlign: 'center',
    color: Colors.secondary,
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h5,
  },
  Requested: {
    textAlign: 'center',
    color: Colors.white,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
  },
  profilePic: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(100),
    overflow: 'hidden',
    borderWidth: scale(1),
    borderColor: '#fff',
    alignSelf: 'center',
  },
  familyPics: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(100),
    overflow: 'hidden',
    borderWidth: scale(1),
    borderColor: '#fff',
    position: 'absolute',
    zIndex: -1,
    opacity: 0.4,
  },

  //epcr rendercell style
  cellContainer: {
    flex: 1,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  cellinnerContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 2,
    borderRadius: 10,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.3,
    shadowColor: Colors.black,
    shadowRadius: 4,
    elevation: 5,
  },
  mainbody1: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  imgbody: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(30),
    overflow: 'hidden',
    borderWidth: scale(2),
  },
  profileimg: {
    height: '100%',
    width: '100%',
  },
  linearGradientProfileShadow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(30),
    width: scale(52),
    height: scale(52),

    shadowOffset: {width: 4, height: 3},
    shadowOpacity: 0.5,
    shadowColor: Colors.black,
    shadowRadius: 4,
    elevation: 5,
  },
  profilebody: {
    shadowOffset: {width: 4, height: 3},
    shadowOpacity: 0.3,
    shadowColor: Colors.black,
    shadowRadius: 4,
    elevation: 5,
    width: scale(50),
    height: scale(50),
    borderRadius: scale(30),
    overflow: 'hidden',
    borderWidth: scale(3),
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  profilecircle: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(30),
    position: 'absolute',
    right: scale(18),
    bottom: 0,
  },
  mainbody2: {
    width: '45%',
    justifyContent: 'space-evenly',
    paddingVertical: 4,
  },
  nameStyle: {
    fontSize: fontSize.h6,
    color: Colors.black,
  },
  inprogressdiv: {
    flexDirection: 'row',
    width: '100%',
  },
  numtext: {
    fontSize: fontSize.h5 - 2,
    color: Colors.primary,
    fontWeight: '900',
  },
  inprogressTextStyle: {
    fontSize: fontSize.h6,
    fontWeight: 'bold',
  },
  recordnumdiv: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 7,
  },
  recordText: {
    fontSize: fontSize.h6 - 2,
    color: Colors.black,
  },
  assignmedicdiv: {
    flexDirection: 'row',
    marginTop: 5,
    width: '100%',
  },
  assignmedicText: {
    fontSize: fontSize.h6 - 2,
    color: Colors.black,
    fontWeight: '700',
  },
  mainbody3: {
    width: '25%',
    paddingVertical: 2,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    left: 10,
  },
  timeText: {
    fontSize: fontSize.mainMenuButtonText,
    color: Colors.black,
  },
  assignProfilediv: {
    overflow: 'hidden',
    width: scale(20),
    height: scale(20),
    right: 10,
  },
  innerassignprofilediv: {
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  circlediv: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(7),
    borderColor: Colors.white,
    borderWidth: 1,
    position: 'absolute',
    right: scale(0),
    bottom: 0,
    backgroundColor: 'green',
  },
  lockdiv: {
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: Colors.black,
    height: scale(20),
    width: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },

  //searchTextInput Style
  searchTextinput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default EPCR;
