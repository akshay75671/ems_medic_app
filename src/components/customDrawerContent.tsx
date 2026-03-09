import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {scale} from 'react-native-size-matters';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';
import Constants from '../core/constants';
import CustIcon from './icon';
import CustSwitch from './switch';
import {inject, observer} from 'mobx-react';
import fonts from '../styles/fonts';
import {getProfileStateColor} from '../core/utils';
import Avatar from './Avatar';

const CustomDrawerContent = (props) => {
  const doLogout = () => {
    props.doLogout();
  };
  const goToProfile = () => {
    props.navigation.navigate('Profile');
  };
  const closeMenu = () => {
    props.navigation.closeDrawer();
  };
  const availableState = (state: boolean) => {
    setAvailable(state);
    props.profile.updateStatus(state ? 'available' : 'notAvailable');
  };
  const [available, setAvailable] = useState<boolean>(true);
  const [engaged, setEngaged] = useState<boolean>(false);
  useEffect(() => {
    if (props.profile.profile)
      setEngaged(props.profile.profile.status == 'inProgress');
  }, [props.profile.profile]);

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.drawerHeaerContent}>
        <View style={styles.closeMenuContainer}>
          <TouchableOpacity onPress={closeMenu}>
            <CustIcon
              type="antdesign"
              name="close"
              size={scale(20)}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: boxModelSize.xl,
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <CustIcon
              type="fontisto"
              name="day-cloudy"
              color={Colors.white}
              size={30}
            />
          </View>
          <View
            style={{
              paddingLeft: boxModelSize.m,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: Fonts.primarySemiBold,
                fontSize: fontSize.h3,
                color: Colors.bodyTextWhite,
              }}>
              20
            </Text>
          </View>
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: Fonts.primarySemiBold,
                fontSize: fontSize.default,
                color: Colors.bodyTextWhite,
              }}>
              O
            </Text>
          </View>
        </View>
        <View
          style={{
            marginBottom: boxModelSize.m,
            marginLeft: boxModelSize.xl,
          }}>
          <Text style={styles.takeBreake}>Cloudy</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: boxModelSize.m,
            marginBottom: boxModelSize.l,
          }}>
          {props.profile.profile != null && (
            <View style={styles.profilePicContainer}>
              <TouchableOpacity onPress={goToProfile}>
                <Avatar
                  size={50}
                  source={props.profile.profile.profilePicUri}
                  status={
                    engaged
                      ? 'engaged'
                      : available
                      ? 'available'
                      : 'notAvailable'
                  }
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.profileDetails}>
            {props.profile.profile != null && (
              <View>
                <Text style={styles.profileName}>
                  {props.profile.profile.fullName}
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.takeBreake}>Take Break</Text>
              <CustSwitch
                onSelect={availableState}
                isEnabled={engaged}
                isOnOrOff={available}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.menuItemContainer}>
        <DrawerItemList {...props} labelStyle={styles.menuItem} />
        <DrawerItem
          labelStyle={styles.menuItem}
          label="Profile"
          onPress={goToProfile}
          icon={({focused, size, color}) => {
            return (
              <CustIcon
                type="antdesign"
                name="user"
                size={scale(20)}
                color={Colors.white}
              />
            );
          }}
        />
        <DrawerItem
          labelStyle={styles.menuItem}
          label="Settings"
          onPress={() => {}}
          icon={({focused, size, color}) => {
            return (
              <CustIcon
                type="feather"
                name="settings"
                size={scale(20)}
                color={Colors.white}
              />
            );
          }}
        />
        <DrawerItem
          labelStyle={styles.menuItem}
          label="Logout"
          onPress={doLogout}
          icon={({focused, size, color}) => {
            return (
              <CustIcon
                type="antdesign"
                name="logout"
                size={scale(20)}
                color={Colors.white}
              />
            );
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerHeaerContent: {
    paddingRight: boxModelSize.m,
  },
  closeMenuContainer: {
    alignItems: 'flex-end',
  },
  availableState: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(30),
    position: 'absolute',
    right: scale(10),
    bottom: 0,
  },
  profilePic: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(30),
    overflow: 'hidden',
    borderWidth: scale(2),
    alignSelf: 'center',
  },
  profilePicContainer: {
    flex: 0.3,
    alignItems: 'center',
  },
  profileDetails: {
    flex: 0.7,
    paddingLeft: boxModelSize.m,
  },
  menuItemContainer: {
    marginLeft: boxModelSize.m,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    borderBottomLeftRadius: Constants.BOX_REDIUS,
  },
  menuItem: {
    fontFamily: Fonts.primaryLight,
    color: Colors.white,
  },
  profileName: {
    fontFamily: Fonts.primarySemiBold,
    color: Colors.white,
  },
  takeBreake: {
    fontFamily: fonts.primaryRegular,
    color: Colors.white,
    fontSize: fontSize.default,
  },
});

export default inject('profile')(observer(CustomDrawerContent));
