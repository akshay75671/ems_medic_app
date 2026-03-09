import React, {PureComponent} from 'react';
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
import * as Animatable from 'react-native-animatable';
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
import {connect} from 'react-redux';
import Constants from '../../core/constants';
import {
  fetchUser,
  updateUser,
  verifyPhone,
  verifyPhoneOTP,
  verifyEmail,
} from '../../redux/profile/profileActions';
import * as profileTypes from '../../redux/profile/profileTypes';
import * as yup from 'yup';
import moment from 'moment';
import {getImageUriFromStorage} from '../../core/utils';
import {
  HomeDrawerMenuParamList,
  RootStackParamList,
} from '../../types/navigationsTypes';
import {CompositeNavigationProp} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import SetupBiometrics from '../../components/setupBiometrics';
import ReactNativeBiometrics from 'react-native-biometrics';
import {getSessionDataObject} from '../../core/asyncStorage';
import {userObjTypes} from '../../types/userTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {logoutUser, userReload} from '../../services/authServices';
import fireAuth from '@react-native-firebase/auth';
import EmailUpdateConfirm from '../../components/emailUpdatePopup';

interface fieldsType {
  value: string;
  error: string;
}
interface uploadOptionType {
  mediaType: string;
  path: string;
  fileName: string;
  successMsg: string;
  failureMsg: string;
  returnKey: string;
}
interface profileState {
  id: string;
  fullName: fieldsType;
  email: fieldsType;
  emailVerified: boolean;
  gender: fieldsType;
  age: fieldsType;
  dob: fieldsType;
  phoneNo: fieldsType;
  phoneNoVerified: boolean;
  secPhoneNo: fieldsType;
  phoneCountryCode: string;
  secPhoneNoCountryCode: string;
  profilePic: string;
  licenseID: fieldsType;
  licenseIDPic: string;
  licenseIDPicUri: string;
  profilePicUri: string;
  uploadOtion: uploadOptionType;
  showUpload: boolean;
  profileImgLoader: boolean;
  showOTPScreen: boolean;
  showOTPError: string;
  showUpdateEmailScreen: boolean;
  updateEmailState: 'update' | 'login';
  appBackground: boolean;
  faceID: boolean;
  fingerID: boolean;
  faceIDOption: boolean;
  fingerIDOption: boolean;
  showBioMetricSetup: boolean;
  showBioMetricType: 'face' | 'finger';
  isNewUser: boolean;
  otpInitType: 'email' | 'phone';
  localError: string;
}
type drawerNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<HomeDrawerMenuParamList>,
  StackNavigationProp<RootStackParamList>
>;
type navigationProps = {
  navigation: drawerNavigationProp;
};

interface profileProps extends navigationProps {
  fetchUser: () => void;
  verifyPhone: (phoneNo: string, code: string) => void;
  verifyEmail: (emailID: string, logout: () => void) => void;
  updateUser: (id: string, user: any) => void;
  verifyPhoneOTP: (
    id: string,
    uid: string,
    otp: string,
    code: string,
    newPhoneNo: string,
    oldPhoneNo: string,
  ) => void;
  verifyEmailOTP: (
    id: string,
    uid: string,
    otp: string,
    newEmail: string,
    oldEmail: string,
  ) => void;
  clearMessage: () => void;
  setOTPScreen: () => void;
  userData: profileTypes.USER;
  loading: boolean;
  message: profileTypes.errorMsgTypes;
  showOTPScreen: boolean;
  showUpdateEmailScreen: boolean;
}
const maxDate: string = moment().subtract(1, 'year').toString();
class Profile extends PureComponent<profileProps, profileState> {
  unsubscribe: () => void;
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      fullName: {value: '', error: ''},
      email: {value: '', error: ''},
      gender: {value: '', error: ''},
      age: {value: '', error: ''},
      dob: {value: '', error: ''},
      phoneNo: {value: '', error: ''},
      secPhoneNo: {value: '', error: ''},
      licenseID: {value: '', error: ''},
      profilePic: '',
      phoneCountryCode: '',
      secPhoneNoCountryCode: '',
      profilePicUri: '',
      licenseIDPic: '',
      licenseIDPicUri: '',
      profileImgLoader: false,
      showUpload: false,
      showOTPScreen: false,
      showOTPError: '',
      showUpdateEmailScreen: false,
      emailVerified: false,
      phoneNoVerified: false,
      appBackground: false,
      faceID: false,
      fingerID: false,
      faceIDOption: false,
      fingerIDOption: false,
      showBioMetricSetup: false,
      showBioMetricType: 'finger',
      isNewUser: false,
      updateEmailState: 'update',
      otpInitType: 'phone',
      localError: '',
      uploadOtion: {
        mediaType: '',
        path: '',
        fileName: '',
        successMsg: '',
        failureMsg: '',
        returnKey: '',
      },
    };
  }
  focusedHandler = () => {
    setTimeout(() => {
      this.props.fetchUser();
    }, 1000);
    setTimeout(() => {
      ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
        const {available, biometryType} = resultObject;

        if (available && biometryType === ReactNativeBiometrics.TouchID) {
          this.setState({fingerIDOption: true}, () => {
            this.setState({showBioMetricType: 'finger'}, () => {
              this.setState({showBioMetricSetup: true});
            });
          });
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
          this.setState({faceIDOption: true});
        } else if (
          available &&
          biometryType === ReactNativeBiometrics.Biometrics
        ) {
          this.setState({fingerIDOption: true}, () => {
            this.setState({showBioMetricType: 'finger'}, () => {
              this.setState({showBioMetricSetup: true});
            });
          });
        }
      });
    }, 2000);
    getSessionDataObject('userObj').then((response: userObjTypes) => {
      if (response != null) this.setState({isNewUser: response.isNewUser});
    });
  };
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.focusedHandler,
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  componentDidUpdate(nextProps: profileProps, nextState) {
    const {
      id,
      fullName,
      email,
      emailVerified,
      phoneNo,
      phoneNoVerified,
      phoneCountryCode,
      secPhoneNo,
      secPhoneNoCountryCode,
      gender,
      dob,
      age,
      licenseID,
      licenseIDPic,
      profilePic,
      faceID,
      fingerID,
    } = this.props.userData;
    if (id == '') return null;

    if (id != nextProps.userData.id) {
      this.setState({id: id});
    }
    if (fullName != nextProps.userData.fullName) {
      this.setState({
        fullName: {...this.state.fullName, value: fullName},
      });
    }
    if (email != nextProps.userData.email) {
      this.setState({
        email: {...this.state.email, value: email},
      });
    }
    if (emailVerified != nextProps.userData.emailVerified) {
      this.setState({emailVerified: emailVerified});
    }
    if (phoneNo != nextProps.userData.phoneNo) {
      this.setState({
        phoneNo: {...this.state.phoneNo, value: phoneNo},
      });
    }
    if (phoneNoVerified != nextProps.userData.phoneNoVerified) {
      this.setState({phoneNoVerified: phoneNoVerified});
    }
    if (phoneCountryCode != nextProps.userData.phoneCountryCode) {
      this.setState({phoneCountryCode: phoneCountryCode});
    }
    if (secPhoneNo != nextProps.userData.secPhoneNo) {
      this.setState({
        secPhoneNo: {
          ...this.state.secPhoneNo,
          value: secPhoneNo,
        },
      });
    }
    if (secPhoneNoCountryCode != nextProps.userData.secPhoneNoCountryCode) {
      this.setState({secPhoneNoCountryCode: secPhoneNoCountryCode});
    }
    if (gender != nextProps.userData.gender) {
      this.setState({
        gender: {...this.state.gender, value: gender},
      });
    }
    if (dob != nextProps.userData.dob) {
      this.setState({
        dob: {...this.state.dob, value: dob},
      });
    }
    if (age != nextProps.userData.age) {
      this.setState({
        age: {...this.state.age, value: age},
      });
    }
    if (licenseID != nextProps.userData.licenseID) {
      this.setState({
        licenseID: {
          ...this.state.licenseID,
          value: licenseID,
        },
      });
    }
    if (profilePic != nextProps.userData.profilePic) {
      this.setState({profilePic: profilePic}, () => {
        this.onImageUploadCompleted('profile');
      });
    }
    if (licenseIDPic != nextProps.userData.licenseIDPic) {
      this.setState({licenseIDPic: licenseIDPic}, () => {
        this.onImageUploadCompleted('license');
      });
    }
    if (this.props.showOTPScreen != nextProps.showOTPScreen) {
      this.setState({showOTPScreen: this.props.showOTPScreen});
    }
    if (this.props.showUpdateEmailScreen != nextProps.showUpdateEmailScreen) {
      this.setState({showUpdateEmailScreen: this.props.showUpdateEmailScreen});
    }
    if (fingerID != nextProps.userData.fingerID) {
      this.setState({fingerID});
    }
    if (faceID != nextProps.userData.faceID) {
      this.setState({faceID});
    }
    if (this.props.message != null) {
      if (this.props.message.error != this.state.localError) {
        this.setState({localError: this.props.message.error});
        if (this.props.message.action == 'profile')
          CustSnackBar(this.props.message.error, this.props.clearMessage);
        if (this.props.message.action == 'email')
          this.setState(
            {
              email: {...this.state.email, error: this.props.message.error},
            },
            () => {
              this.props.clearMessage();
            },
          );
        if (this.props.message.action == 'phoneNo')
          this.setState(
            {
              phoneNo: {...this.state.phoneNo, error: this.props.message.error},
            },
            () => {
              this.props.clearMessage();
            },
          );
        if (this.props.message.action == 'otpScreen')
          this.setState({showOTPError: this.props.message.error}, () => {
            this.props.clearMessage();
          });
      }
    }
  }
  schema = yup.object().shape({
    fullName: yup.string().required('Enter your name'),
    email: yup
      .string()
      .required('No email provided.')
      .email('Email is not valid'),
    phoneNo: yup
      .string()
      .required('Enter your phone number')
      .min(10, 'Enter valid phone number')
      .max(10, 'Enter valid phone number'),
    gender: yup.string().required('Please select gender'),
    dob: yup.string().required('Plese select your DOB'),
    licenseID: yup.string().required('Plese select your registration ID'),
    age: yup.string(),
    secPhoneNoCountryCode: yup.string(),
    phoneCountryCode: yup.string(),
    secPhoneNo: yup.string(),
    profilePic: yup.string(),
    licenseIDPic: yup.string(),
    faceID: yup.boolean(),
    fingerID: yup.boolean(),
    emailVerified: yup.boolean(),
    phoneNoVerified: yup.boolean(),
  });
  handleChangeText = (name: string, value: string) => {
    if (name == 'phoneNo') {
      let splitCode = value.split('-');
      this.setState({
        phoneNo: {...this.state.phoneNo, value: splitCode[1], error: ''},
      });
      this.setState({phoneCountryCode: splitCode[0]});
      if (
        (this.props.userData.phoneNo != '' &&
          this.props.userData.phoneNo != splitCode[1]) ||
        (this.props.userData.phoneCountryCode != '' &&
          this.props.userData.phoneCountryCode != splitCode[0])
      ) {
        this.setState({phoneNoVerified: false});
      } else if (
        this.props.userData.phoneNo != '' &&
        this.props.userData.phoneNoVerified
      ) {
        this.setState({phoneNoVerified: true});
      }
    } else if (name == 'email') {
      this.setState({
        email: {...this.state.email, value: value, error: ''},
      });

      if (
        this.props.userData.email != '' &&
        this.props.userData.email != value
      ) {
        this.setState({emailVerified: false});
      } else if (
        this.props.userData.email != '' &&
        this.props.userData.emailVerified
      ) {
        this.setState({emailVerified: true});
      }
    } else if (name == 'secPhoneNo') {
      let splitCode = value.split('-');
      this.setState({
        secPhoneNo: {...this.state.secPhoneNo, value: splitCode[1], error: ''},
      });
      this.setState({secPhoneNoCountryCode: splitCode[0]});
    } else {
      let setObj = {};
      setObj[name] = {...this.state[name], value: value, error: ''};
      this.setState(setObj);
    }
    if (name == 'dob') {
      if (value == '') {
        this.fieldValidation(name, value);
        return;
      }
      let getAge = moment().diff(moment(value, 'DD/MM/YYYY'), 'years', true);
      let getAgeRound = Math.floor(Number(getAge));
      this.setState({age: {...this.state.age, value: getAgeRound.toString()}});
    }
  };
  handleBlur = (name, event) => {
    let fieldObj: fieldsType = this.state[name];
    this.fieldValidation(name, fieldObj.value);
  };
  fieldValidation = (name, value) => {
    yup
      .reach(this.schema, name)
      .validate(value)
      .catch((error) => {
        let setObj = {};
        setObj[name] = {...this.state[name], error: error.errors[0]};
        this.setState(setObj);
      });
  };
  doUpdateUser = () => {
    const {
      email,
      phoneNo,
      emailVerified,
      phoneNoVerified,
      secPhoneNo,
      fullName,
      gender,
      age,
      dob,
      profilePic,
      licenseID,
      licenseIDPic,
      phoneCountryCode,
      secPhoneNoCountryCode,
      faceID,
      fingerID,
    } = this.state;

    const validateForm: any = {
      email: email.value,
      phoneNo: phoneNo.value,
      fullName: fullName.value,
      gender: gender.value,
      age: age.value,
      dob: dob.value,
      secPhoneNo: secPhoneNo.value,
      licenseID: licenseID.value,
      profilePic,
      licenseIDPic,
      secPhoneNoCountryCode,
      faceID,
      fingerID,
    };

    Object.keys(validateForm).map((field) => {
      this.fieldValidation(field, validateForm[field]);
    });
    this.schema
      .isValid(validateForm)
      .then((flag) => {
        if (flag) {
          if (!phoneNoVerified) {
            this.setState({
              phoneNo: {
                ...this.state.phoneNo,
                error: 'Plase verify your phone number',
              },
            });
            return;
          }
          if (!emailVerified) {
            this.setState({
              email: {
                ...this.state.email,
                error: 'Plase verify your Email ID',
              },
            });
            return;
          }
          if (phoneNo.value.length > 0 && secPhoneNo.value.length > 0) {
            if (
              phoneNo.value == secPhoneNo.value &&
              phoneCountryCode == secPhoneNoCountryCode
            ) {
              this.setState({
                secPhoneNo: {
                  ...secPhoneNo,
                  error: 'phone number already entered',
                },
              });
              return;
            }
          }
          if (profilePic.length == 0) {
            CustSnackBar('plase upload profile picture');
            return;
          }
          if (licenseIDPic.length == 0) {
            CustSnackBar('plase upload your license');
            return;
          }
          const userForm: any = {
            fullName: fullName.value,
            gender: gender.value,
            age: age.value,
            dob: dob.value,
            secPhoneNo: secPhoneNo.value,
            licenseID: licenseID.value,
            profilePic,
            licenseIDPic,
            secPhoneNoCountryCode,
            faceID,
            fingerID,
            updatedAt: new Date(),
          };
          this.props.updateUser(this.props.userData.id, userForm);
          this.setState({isNewUser: false});
        }
      })
      .catch((error) => {
        console.log('validation error', error);
        CustSnackBar('user submit validation error');
      });
  };
  forceLogout = () => {
    logoutUser()
      .then((response) => {
        this.props.navigation.navigate('Auth');
      })
      .catch((error) => {
        console.log('profile user logout', error);
      });
  };
  emailVerifyHandler = () => {
    const {email} = this.state;
    this.setState(
      {
        email: {...email, error: ''},
      },
      () => {
        yup
          .reach(this.schema, 'email')
          .validate(email.value)
          .then(() => {
            this.setState({updateEmailState: 'update'}, () => {
              this.props.verifyEmail(email.value, this.forceLogout);
            });
          })
          .catch((error) => {
            this.setState({
              email: {...this.state.email, error: error.errors[0]},
            });
          });
      },
    );
  };
  phoneVerifyHandler = () => {
    const {phoneNo, phoneCountryCode} = this.state;
    this.setState(
      {
        phoneNo: {...phoneNo, error: ''},
      },
      () => {
        yup
          .reach(this.schema, 'phoneNo')
          .validate(phoneNo.value)
          .then(() => {
            this.setState({otpInitType: 'phone'}, () => {
              this.props.verifyPhone(phoneNo.value, phoneCountryCode);
            });
          })
          .catch((error) => {
            this.setState({
              phoneNo: {...phoneNo, error: error.errors[0]},
            });
          });
      },
    );
  };
  profileImage = () => {
    this.setState(
      {
        uploadOtion: {
          ...this.state.uploadOtion,
          mediaType: '',
          path: 'profiles',
          returnKey: 'profile',
          fileName: 'profile_' + this.props.userData.fbUserID,
          successMsg: 'profile picture uploaded successfully',
          failureMsg: 'profile picture upload failed',
        },
      },
      () => {
        this.setState({showUpload: true});
      },
    );
  };
  profileCamera = () => {
    this.setState(
      {
        uploadOtion: {
          ...this.state.uploadOtion,
          mediaType: 'camera',
          path: 'profiles',
          returnKey: 'profile',
          fileName: 'profile_' + this.props.userData.fbUserID,
          successMsg: 'profile picture uploaded successfully',
          failureMsg: 'profile picture upload failed',
        },
      },
      () => {
        this.setState({showUpload: true});
      },
    );
  };
  licenseUpload = () => {
    this.setState(
      {
        uploadOtion: {
          ...this.state.uploadOtion,
          mediaType: '',
          path: 'licenses',
          returnKey: 'license',
          fileName: 'license_' + this.props.userData.fbUserID,
          successMsg: 'License uploaded successfully',
          failureMsg: 'License upload failed',
        },
      },
      () => {
        this.setState({showUpload: true});
      },
    );
  };
  imageUloadClose = () => {
    this.setState({showUpload: false});
  };

  onImageUploadCompleted = (key) => {
    if (key == 'profile') {
      this.setState({profileImgLoader: true}, () => {
        getImageUriFromStorage(
          'profiles',
          'profile_' + this.props.userData.fbUserID,
        )
          .then((imageUri: any) => {
            this.setState({profilePicUri: imageUri});
          })
          .catch((error) => {
            CustSnackBar('error while get profile picter', error);
          })
          .finally(() => {
            this.setState({
              profilePic: 'profile_' + this.props.userData.fbUserID,
            });
            this.setState({profileImgLoader: false});
          });
      });
    } else if (key == 'license') {
      getImageUriFromStorage(
        'licenses',
        'license_' + this.props.userData.fbUserID,
      )
        .then((imageUri: any) => {
          this.setState({licenseIDPicUri: imageUri});
        })
        .catch((error) => {
          CustSnackBar(error);
        })
        .finally(() => {
          this.setState({
            licenseIDPic: 'license_' + this.props.userData.fbUserID,
          });
        });
    }
    this.imageUloadClose();
  };

  fingerHandler = (state: boolean) => {
    this.setState({fingerID: state});
  };
  faceHandler = (state: boolean) => {
    this.setState({faceID: state});
  };
  closeBioMetricsSetup = () => {
    this.setState({showBioMetricSetup: false});
  };
  submitBioMetricsSetup = () => {
    if (this.state.showBioMetricType == 'finger') {
      this.setState({fingerID: true}, () => {
        this.setState({showBioMetricSetup: false});
      });
    } else if (this.state.showBioMetricType == 'face') {
      this.setState({faceID: true}, () => {
        this.setState({showBioMetricSetup: false});
      });
    }
  };
  otpSubmitHandler = (value: string) => {
    const {id, fbUserID} = this.props.userData;
    const {phoneNo, phoneCountryCode, otpInitType} = this.state;
    if (otpInitType == 'phone')
      this.props.verifyPhoneOTP(
        id,
        fbUserID,
        value,
        phoneCountryCode,
        phoneNo.value,
        this.props.userData.phoneNo,
      );
  };
  otpResendHandler = () => {
    const {otpInitType, phoneNo, phoneCountryCode} = this.state;
    this.setState({showOTPError: ''});
    if (otpInitType == 'phone')
      this.props.verifyPhone(phoneNo.value, phoneCountryCode);
  };
  otpPopupClose = () => {
    //this.setState({showOTPScreen: false});
    this.props.setOTPScreen();
  };
  onClearOTPError = () => {
    this.setState({showOTPError: ''});
    this.setState({localError: ''});
  };
  emailUpdateConfirmed = () => {
    userReload()
      .then((response) => {
        CustSnackBar('Please check your email to update');
      })
      .catch((error) => {
        console.log('profile user reload', error);
        this.setState({showUpdateEmailScreen: false});
        this.forceLogout();
      });
  };
  emailUpdateCancelled = () => {
    userReload()
      .then((response) => {
        this.setState({showUpdateEmailScreen: false});
      })
      .catch((error) => {
        console.log('profile user reload', error);
        this.setState({updateEmailState: 'login'});
      });
  };
  render() {
    const {loading} = this.props;
    const {
      showUpload,
      uploadOtion,
      showOTPScreen,
      profilePicUri,
      profileImgLoader,
      fullName,
      email,
      emailVerified,
      phoneNo,
      phoneNoVerified,
      phoneCountryCode,
      secPhoneNo,
      secPhoneNoCountryCode,
      gender,
      dob,
      age,
      licenseID,
      licenseIDPicUri,
      faceID,
      faceIDOption,
      fingerID,
      fingerIDOption,
      showBioMetricSetup,
      showBioMetricType,
      isNewUser,
      showOTPError,
      showUpdateEmailScreen,
      updateEmailState,
    } = this.state;
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        {showBioMetricSetup && isNewUser && (
          <SetupBiometrics
            type={showBioMetricType}
            onClose={this.closeBioMetricsSetup}
            onSubmit={this.submitBioMetricsSetup}
          />
        )}
        {loading && <ProgressBar />}
        {showUpload && (
          <ImageUpload
            option={uploadOtion}
            onCloseUpload={this.imageUloadClose}
            onCompleteUpload={this.onImageUploadCompleted}
          />
        )}
        {showOTPScreen && (
          <OTPInput
            info={phoneCountryCode + phoneNo.value}
            onResend={this.otpResendHandler}
            onSubmit={this.otpSubmitHandler}
            onClose={this.otpPopupClose}
            clearError={this.onClearOTPError}
            error={showOTPError}
          />
        )}
        {showUpdateEmailScreen && (
          <EmailUpdateConfirm
            userConfirmed={this.emailUpdateConfirmed}
            userCancelled={this.emailUpdateCancelled}
            displayState={updateEmailState}
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
          <View
            style={[
              commonStyles.container,
              commonStyles.containerSpacing,
              {flex: isNewUser ? 1 : 0.9, zIndex: 1},
            ]}>
            <View style={styles.profileImgContainer}>
              <Animatable.View
                duration={1000}
                delay={500}
                animation="bounceIn"
                style={[styles.profileImgBG, commonStyles.whiteBoxShadow]}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={this.profileImage}>
                  {profilePicUri == '' && !profileImgLoader && (
                    <CustIcon
                      name="user"
                      type="font-awesome"
                      color={Colors.white}
                      size={55}
                    />
                  )}
                  {profileImgLoader && (
                    <ActivityIndicator size={50} color={Colors.white} />
                  )}
                  {profilePicUri != '' && !profileImgLoader && (
                    <Image
                      style={{width: 115, height: 115, borderRadius: 80}}
                      source={{uri: profilePicUri}}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{position: 'absolute', right: -10, bottom: 10}}
                  onPress={this.profileCamera}>
                  <View style={styles.takeProfileImgBG}>
                    <CustIcon
                      name="camera"
                      type="ionicon"
                      color={Colors.profileCameraIcon}
                      size={22}
                    />
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            </View>
            <View
              style={[
                styles.contentContainer,
                boxModel({type: 'padding', size: 'xxxl', places: 't'}),
                boxModel({type: 'padding', size: 'm', places: 'rbl'}),
              ]}>
              <ScrollView>
                <Animatable.View duration={500} delay={0} animation="fadeInUp">
                  <CustTextInput
                    label="Name"
                    placeholder="Your Name"
                    onChangeText={this.handleChangeText.bind(this, 'fullName')}
                    onEndEditing={this.handleBlur.bind(this, 'fullName')}
                    errorText={fullName.error}
                    value={fullName.value}
                    autoCompleteType="name"
                    textContentType="name"
                    keyboardType="name-phone-pad"
                    leftIcon
                    required
                    iconProps={{
                      type: 'antdesign',
                      name: 'user',
                      size: 30,
                      color: Colors.iconGrey,
                    }}
                  />
                </Animatable.View>
                <Animatable.View
                  duration={500}
                  delay={100}
                  animation="fadeInUp">
                  <CustTextInput
                    label="Email"
                    placeholder="Your Email ID"
                    keyboardType="email-address"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    verification
                    verified={emailVerified}
                    verifyHander={this.emailVerifyHandler}
                    leftIcon
                    required
                    onChangeText={this.handleChangeText.bind(this, 'email')}
                    onEndEditing={this.handleBlur.bind(this, 'email')}
                    errorText={email.error}
                    value={email.value}
                    iconProps={{
                      type: 'antdesign',
                      name: 'mail',
                      size: 30,
                      color: Colors.iconGrey,
                    }}
                  />
                </Animatable.View>
                <Animatable.View
                  duration={500}
                  delay={200}
                  animation="fadeInUp">
                  <PhoneNumber
                    label="Mobile"
                    placeholder="Your mobile number"
                    onChangeText={this.handleChangeText.bind(this, 'phoneNo')}
                    onEndEditing={this.handleBlur.bind(this, 'phoneNo')}
                    errorText={phoneNo.error}
                    value={phoneNo.value}
                    code={phoneCountryCode}
                    verification={true}
                    verified={phoneNoVerified}
                    verifyHander={this.phoneVerifyHandler}
                    phonecode
                    leftIcon
                    required
                    iconProps={{
                      type: 'antdesign',
                      name: 'mobile1',
                      size: 30,
                      color: Colors.iconGrey,
                    }}
                  />
                </Animatable.View>
                <Animatable.View
                  duration={500}
                  delay={300}
                  animation="fadeInUp">
                  <PhoneNumber
                    label="Alternative Contact"
                    placeholder="Your alternative number"
                    onChangeText={this.handleChangeText.bind(
                      this,
                      'secPhoneNo',
                    )}
                    onEndEditing={this.handleBlur.bind(this, 'secPhoneNo')}
                    errorText={secPhoneNo.error}
                    code={secPhoneNoCountryCode}
                    value={secPhoneNo.value}
                    phonecode
                    leftIcon
                    iconProps={{
                      type: 'material',
                      name: 'mobile-screen-share',
                      size: 30,
                      color: Colors.iconGrey,
                    }}
                  />
                </Animatable.View>
                <Animatable.View
                  duration={500}
                  delay={400}
                  animation="fadeInUp">
                  <CustDataPicker
                    items={['Male', 'Female', 'Others']}
                    label="Gender"
                    placeholder="Select gender"
                    required
                    onChangeText={this.handleChangeText.bind(this, 'gender')}
                    onEndEditing={this.handleBlur.bind(this, 'gender')}
                    errorText={gender.error}
                    value={gender.value}
                    leftIcon
                    iconProps={{
                      type: 'font-awesome',
                      name: 'transgender-alt',
                      size: 29,
                      color: Colors.iconGrey,
                    }}
                  />
                </Animatable.View>
                <Animatable.View
                  duration={500}
                  delay={500}
                  animation="fadeInUp">
                  <DateAndTimePicker
                    label="Date of birth"
                    required
                    leftIcon
                    placeholder="Choose a Date"
                    onChangeText={this.handleChangeText.bind(this, 'dob')}
                    onEndEditing={this.handleBlur.bind(this, 'dob')}
                    errorText={dob.error}
                    value={dob.value}
                    maximumDate={new Date(maxDate)}
                    info={'Age: ' + Math.floor(Number(age.value))}
                  />
                </Animatable.View>
                <Animatable.View
                  duration={500}
                  delay={600}
                  animation="fadeInUp">
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.8}}>
                      <CustTextInput
                        label="Registration ID"
                        placeholder="Your registration ID"
                        onChangeText={this.handleChangeText.bind(
                          this,
                          'licenseID',
                        )}
                        onEndEditing={this.handleBlur.bind(this, 'licenseID')}
                        errorText={licenseID.error}
                        value={licenseID.value}
                        autoCompleteType="name"
                        textContentType="name"
                        keyboardType="name-phone-pad"
                        leftIcon
                        required
                        iconProps={{
                          type: 'material-community',
                          name: 'file-document-edit-outline',
                          size: 30,
                          color: Colors.iconGrey,
                        }}
                      />
                    </View>
                    <View style={{flex: 0.2}}>
                      <CustButton
                        title="Upload your license ID"
                        type="gradient"
                        iconProps={{
                          type: 'font-awesome',
                          name: 'upload',
                          size: 20,
                          color: Colors.white,
                        }}
                        onPress={this.licenseUpload}
                      />
                    </View>
                  </View>
                </Animatable.View>
                <Animatable.View
                  duration={500}
                  delay={700}
                  animation="fadeInUp">
                  {licenseIDPicUri != '' && (
                    <View style={styles.licenseIdPicContainer}>
                      <Image
                        source={{uri: licenseIDPicUri}}
                        style={styles.licenseIdPic}
                      />
                    </View>
                  )}
                </Animatable.View>
                {faceIDOption ||
                  (fingerIDOption && (
                    <Animatable.View
                      duration={500}
                      delay={800}
                      animation="fadeInUp">
                      <Text style={commonStyles.formSubTitle}>
                        activate biometrics login
                      </Text>
                    </Animatable.View>
                  ))}
                {fingerIDOption && (
                  <View
                    style={[
                      commonStyles.devider,
                      commonStyles.textWithSwitchButtonRow,
                    ]}>
                    <Text style={commonStyles.defaultBodyText}>
                      Finger Print
                    </Text>
                    <CustSwitch
                      isEnabled={true}
                      isOnOrOff={fingerID}
                      onSelect={this.fingerHandler}
                    />
                  </View>
                )}
                {faceIDOption && (
                  <View
                    style={[
                      commonStyles.devider,
                      commonStyles.textWithSwitchButtonRow,
                    ]}>
                    <Text style={commonStyles.defaultBodyText}>
                      Face Recognition
                    </Text>
                    <CustSwitch
                      isEnabled={true}
                      isOnOrOff={faceID}
                      onSelect={this.faceHandler}
                    />
                  </View>
                )}
                <Animatable.View
                  duration={500}
                  delay={900}
                  animation="fadeInUp"
                  style={{marginTop: boxModelSize.l}}>
                  <CustButton title="Update" onPress={this.doUpdateUser} />
                </Animatable.View>
              </ScrollView>
            </View>
          </View>
          {!isNewUser && (
            <View style={commonStyles.footerContainer}>
              <BottomNavigation />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

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

const mapStateToProps = (state) => {
  return {
    userData: state.profile.user,
    showOTPScreen: state.profile.showOTPScreen,
    showUpdateEmailScreen: state.profile.showUpdateEmailScreen,
    message: state.profile.message,
    loading: state.profile.loading,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchUser: () => dispatch(fetchUser()),
    updateUser: (id, user) => dispatch(updateUser(id, user)),
    verifyPhone: (phoneNo, code) => dispatch(verifyPhone(phoneNo, code)),
    verifyPhoneOTP: (id, uid, otp, code, newPhoneNo, oldPhoneNo) =>
      dispatch(verifyPhoneOTP(id, uid, otp, code, newPhoneNo, oldPhoneNo)),
    verifyEmail: (emailID, logout) => dispatch(verifyEmail(emailID, logout)),
    clearMessage: () => dispatch({type: profileTypes.CLEAR_MESSAGE}),
    setOTPScreen: () =>
      dispatch({type: profileTypes.SHOW_OTP_SCREEN, payload: false}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
