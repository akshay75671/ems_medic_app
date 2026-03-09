import React, {FC, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  commonStyles,
  Colors,
  boxModel,
  Fonts,
  fontSize,
  boxModelSize,
} from '../../styles';
import {
  CustButton,
  CustDataPicker,
  CustIcon,
  CustTextInput,
  DateAndTimePicker,
  ImageUpload,
  PhoneNumber,
  ProgressBar,
  CustSnackBar,
  CustSwitch,
  BottomNavigation,
  OTPInput,
} from '../../components';
import Constants from '../../core/constants';
import DynamicForm from '../../components/dynamicForm';
import profileForm from '../../model/profile.json';

const ProfileNew: FC = (props) => {
  const [userProfile, setUserProfile] = useState<any>({
    isNewUser: false,
  });
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
        <View
          style={[
            commonStyles.container,
            commonStyles.containerSpacing,
            {flex: userProfile.isNewUser ? 1 : 0.9, zIndex: 1},
          ]}>
          <View style={styles.profileImgContainer}>
            <View style={[styles.profileImgBG, commonStyles.whiteBoxShadow]}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {}}>
                <CustIcon
                  name="user"
                  type="font-awesome"
                  color={Colors.white}
                  size={55}
                />
                <ActivityIndicator size={50} color={Colors.white} />
                <Image
                  style={{width: 115, height: 115, borderRadius: 80}}
                  source={{uri: null}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', right: -10, bottom: 10}}
                onPress={() => {}}>
                <View style={styles.takeProfileImgBG}>
                  <CustIcon
                    name="camera"
                    type="ionicon"
                    color={Colors.profileCameraIcon}
                    size={22}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.contentContainer,
              boxModel({type: 'padding', size: 'xxxl', places: 't'}),
              boxModel({type: 'padding', size: 'm', places: 'rbl'}),
            ]}>
            <ScrollView>
              <DynamicForm
                onSubmit={() => {}}
                onSwitchChange={() => {}}
                setValues={[]}
                formJson={profileForm.profile}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileImgContainer: {
    flex: 0.15,
  },
  contentContainer: {
    flex: 0.85,
    backgroundColor: Colors.white,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  profileImgBG: {
    width: 120,
    height: 120,
    borderRadius: 80,
    backgroundColor: Colors.profileImgBG,
    position: 'absolute',
    bottom: -30,
    left: '31%',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImgTxt: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.profileImgText,
    color: Colors.white,
    paddingTop: 20,
  },
  takeProfileImgBG: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: Colors.profileCameraBG,
  },
  otpMasterContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryBackgroundColor,
  },
  otpHeaderContainer: {
    height: 100,
    alignItems: 'center',
    marginTop: 5,
  },
  otpHeaderImg: {width: 220, height: 193},
  otpHeaderTitle: {
    color: Colors.primary,
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h3,
    marginBottom: 10,
    marginTop: 10,
  },
  otpContentText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
    textAlign: 'center',
  },
  otpResendText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.linkBlue,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  underlineStyleBase: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: Fonts.primarySemiBold,
    color: Colors.primary,
    fontSize: fontSize.h4,
    borderColor: Colors.borderGrey,
    backgroundColor: Colors.white,
  },
  underlineStyleHighLighted: {
    borderColor: Colors.primary,
  },
  licenseIdPicContainer: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 5,
    marginBottom: 10,
  },
  licenseIdPic: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
});

export default ProfileNew;
