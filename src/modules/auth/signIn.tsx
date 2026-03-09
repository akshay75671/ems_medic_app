import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  NativeModules,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import {
  commonStyles,
  Colors,
  Fonts,
  boxModel,
  boxModelSize,
  fontSize,
} from '../../styles';
import {CustAuthInput, CustIcon} from '../../components';
import Constants from '../../core/constants';
import {
  AuthStackParamList,
  RootStackParamList,
} from '../../types/navigationsTypes';
import {loginUser, logoutUser} from '../../services/authServices';
import ReactNativeBiometrics from 'react-native-biometrics';
import {getSessionDataObject, setSessionData} from '../../core/asyncStorage';
import {userObjTypes} from '../../types/userTypes';
import {CompositeNavigationProp} from '@react-navigation/native';

interface fieldsType {
  value: string;
  error: string;
}
interface signinState {
  bioMetricEnabled: boolean;
  bioMetricError: string;
  fadeValue: any;
  emailID: fieldsType;
  password: fieldsType;
  authError: string;
  showLoader: boolean;
  supportFaceID: boolean;
  supportFingerID: boolean;
  showFaceID: boolean;
  showFingerID: boolean;
}
type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList>,
  StackNavigationProp<RootStackParamList>
>;
type signinProps = {
  navigation: NavigationProp;
};
export default class SignIn extends PureComponent<signinProps, signinState> {
  passwordInput: React.RefObject<CustAuthInput>;
  userSessionObj: userObjTypes;
  unsubscribe: () => void;
  constructor(props) {
    super(props);
    this.passwordInput = React.createRef();
    this.state = {
      bioMetricEnabled: false,
      bioMetricError: '',
      fadeValue: new Animated.Value(0),
      emailID: {value: '', error: ''},
      password: {value: '', error: ''},
      authError: '',
      showLoader: false,
      supportFaceID: false,
      supportFingerID: false,
      showFaceID: false,
      showFingerID: false,
    };
  }
  componentDidMount() {
    this.fadeIn();
    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.focusedHandler,
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  focusedHandler = () => {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const {available, biometryType, error} = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        this.setState({supportFingerID: true});
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        this.setState({supportFaceID: true});
      }
      if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        this.setState({supportFingerID: true});
      }
      if (!available && error) this.setState({bioMetricError: error});
    });

    getSessionDataObject('userObj')
      .then((response: userObjTypes) => {
        if (response != null) {
          //this.userSessionObj = response;
          if (response.user.faceID && this.state.supportFaceID) {
            this.setState({showFaceID: true});
            //this.setState({bioMetricEnabled: true});
          } else if (
            this.state.bioMetricError == 'BIOMETRIC_ERROR_NONE_ENROLLED' &&
            response.user.faceID
          ) {
            Alert.alert(
              'You do not have a face ID registered on your phone. Go to phone settings and register for face ID.',
            );
          }
          if (response.user.fingerID && this.state.supportFingerID) {
            this.setState({showFingerID: true});
            //this.setState({bioMetricEnabled: true});
            this.doFingerPrint();
          } else if (
            this.state.bioMetricError == 'BIOMETRIC_ERROR_NONE_ENROLLED' &&
            response.user.fingerID
          ) {
            Alert.alert(
              'You do not have a fingerprint registered on your phone. Go to phone settings and register for fingerprint.',
            );
          }
        } else {
          console.log('not able to get user session');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  schema = yup.object({
    emailID: yup
      .string()
      .required('No email provided.')
      .email('Email is not valid'),
    password: yup
      .string()
      .required('No password provided.')
      .min(6, 'Password should be 6 chars minimum.')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/,
        'Password must contain uppercase, Lowercase, Special character and Number',
      ),
  });

  fadeIn = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 0.8, // output
      duration: 2000, // duration of the animation
      delay: 100,
      useNativeDriver: true,
    }).start();
  };
  gotoRegisterScreen = () => {
    this.props.navigation.navigate('Signup');
  };
  doFingerPrint = () => {
    ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Confirm fingerprint',
    })
      .then((resultObject) => {
        const {success} = resultObject;
        if (success) {
          setSessionData('signedIn', 'in')
            .then(() => {
              if (this.props.navigation.canGoBack)
                this.props.navigation.goBack();
            })
            .catch((error) => {
              console.log('not able to store session data.');
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  postLogin = () => {
    loginUser(this.state.emailID.value, this.state.password.value)
      .then((response) => {
        if (response == 'SUCCESS') {
          setSessionData('signedIn', 'in')
            .then(() => {
              this.props.navigation.navigate('Init');
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        this.setState({authError: error});
        this.setState({showLoader: false});
      });
  };
  doLogin = () => {
    if (this.state.showLoader) return;
    ['emailID', 'password'].map((name) => {
      this.fieldValidation(name, this.state[name].value);
    });
    this.schema
      .isValid({
        emailID: this.state.emailID.value.toLowerCase(),
        password: this.state.password.value,
      })
      .then((isValid) => {
        if (!isValid) return;
        this.setState({showLoader: true});
        getSessionDataObject('userObj').then((response) => {
          if (response != null) {
            logoutUser().then(() => {
              this.setState({showFingerID: false});
              this.postLogin();
            });
          } else {
            this.postLogin();
          }
        });
      });
  };
  handleChangeText = (name, value: string) => {
    let setObj = {};
    setObj[name] = {...this.state[name], value: value, error: ''};
    this.setState(setObj);
    this.setState({authError: ''});
  };
  handleBlur = (name, event) => {
    this.fieldValidation(name, event.nativeEvent.text);
  };
  fieldValidation = (name, value) => {
    yup
      .reach(this.schema, name)
      .validate(value)
      .then((result) => {
        let setObj = {};
        setObj[name] = {...this.state[name], value: value};
        this.setState(setObj);
      })
      .catch((error) => {
        let setObj = {};
        setObj[name] = {...this.state[name], error: error.errors[0]};
        this.setState(setObj);
      });
  };
  setPasswordFocus = () => {
    this.passwordInput.current.setInputFoucs();
  };
  render() {
    const {
      fadeValue,
      authError,
      bioMetricEnabled,
      emailID,
      password,
      showFaceID,
      showFingerID,
      showLoader,
    } = this.state;
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.topBGContainer}>
          <View style={styles.bgImageContainer}>
            <Animatable.Image
              style={[styles.bgImage, {opacity: fadeValue}]}
              source={Constants.AUTH_BG_IMAGE}
            />
          </View>
        </View>
        <View style={styles.bottomBGContainer}></View>
        <View style={[styles.contentContainer, commonStyles.containerSpacing]}>
          <View style={styles.contentLogo}>
            <Animatable.View
              duration={500}
              animation="fadeInUp"
              style={styles.logoContainer}>
              <Image style={styles.logoImage} source={Constants.EMS_LOGO} />
              <Text style={styles.logoTitle}>EMS MEDIC</Text>
            </Animatable.View>
            <Animatable.Text
              duration={600}
              delay={50}
              animation="fadeInUp"
              style={[
                styles.logoTxt,
                boxModel({type: 'margin', size: 'm', places: 'tb'}),
              ]}>
              Welcome back!
            </Animatable.Text>
          </View>
          <View style={styles.authMasterField}>
            <Animatable.View
              duration={700}
              animation="fadeInUp"
              delay={100}
              style={[
                styles.authFieldsContainer,
                commonStyles.whiteBoxShadow,
                boxModel({type: 'padding', size: 'xl', places: 'all'}),
              ]}>
              {!bioMetricEnabled && (
                <View>
                  <Animatable.Text
                    duration={500}
                    animation="fadeInUp"
                    delay={300}
                    style={[
                      commonStyles.whiteBoxTitle,
                      {textAlign: 'center'},
                      boxModel({type: 'margin', size: 'm', places: 'b'}),
                    ]}>
                    Login
                  </Animatable.Text>
                  <Animatable.View
                    duration={600}
                    animation="fadeInUp"
                    delay={150}>
                    <CustAuthInput
                      placeholder="Your Email ID"
                      keyboardType="email-address"
                      onChangeText={this.handleChangeText.bind(this, 'emailID')}
                      onEndEditing={this.handleBlur.bind(this, 'emailID')}
                      onSubmitEditing={this.setPasswordFocus}
                      errorText={emailID.error}
                      autoCapitalize="none"
                      returnKeyType="next"
                      leftIcon
                      iconProps={{
                        type: 'antdesign',
                        name: 'mail',
                        size: 25,
                        color: Colors.iconGrey,
                      }}
                    />
                  </Animatable.View>
                  <Animatable.View
                    duration={700}
                    animation="fadeInUp"
                    delay={200}>
                    <CustAuthInput
                      placeholder="Your Password"
                      ref={this.passwordInput}
                      secureTextEntry
                      showHidePassword
                      contextMenuHidden={true}
                      onChangeText={this.handleChangeText.bind(
                        this,
                        'password',
                      )}
                      onEndEditing={this.handleBlur.bind(this, 'password')}
                      onSubmitEditing={this.doLogin}
                      errorText={password.error}
                      returnKeyType="go"
                      leftIcon
                      iconProps={{
                        type: 'antdesign',
                        name: 'lock',
                        size: 25,
                        color: Colors.iconGrey,
                      }}
                    />
                  </Animatable.View>
                  <Animatable.View
                    duration={800}
                    animation="fadeInUp"
                    delay={250}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Forgot')}>
                      <Text
                        style={[
                          styles.forgotTxt,
                          commonStyles.defaultBodyText,
                        ]}>
                        Forgot password ?
                      </Text>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>
              )}
              {bioMetricEnabled && (
                <View style={{alignItems: 'center'}}>
                  <Animatable.Text
                    duration={500}
                    animation="fadeInUp"
                    delay={300}
                    style={[
                      commonStyles.whiteBoxTitle,
                      {textAlign: 'center'},
                      boxModel({type: 'margin', size: 'm', places: 'b'}),
                    ]}>
                    {showFingerID ? 'Fingerprint' : 'Face ID'}
                  </Animatable.Text>
                  <Animatable.View
                    duration={500}
                    delay={300}
                    animation="fadeInUp"
                    style={boxModel({type: 'margin', size: 'l', places: 'tb'})}>
                    {showFingerID && (
                      <CustIcon
                        type="entypo"
                        name="fingerprint"
                        size={60}
                        color={Colors.profileImgBG}
                      />
                    )}
                    {showFaceID && (
                      <CustIcon
                        type="material-community"
                        name="face-recognition"
                        size={60}
                        color={Colors.profileImgBG}
                      />
                    )}
                  </Animatable.View>
                  <Animatable.View
                    duration={700}
                    animation="fadeInUp"
                    delay={200}
                    style={[
                      boxModel({type: 'margin', size: 'l', places: 'tb'}),
                      {width: '80%'},
                    ]}>
                    <Text
                      style={[
                        commonStyles.whiteBodyText,
                        {
                          textAlign: 'center',
                        },
                      ]}>
                      Authenticate using {showFingerID ? 'finger' : 'face'} ID
                      instead of entering your password.
                    </Text>
                  </Animatable.View>
                </View>
              )}
              {authError.length > 0 && (
                <Animatable.Text
                  animation="shake"
                  style={[
                    styles.fieldErrorTxt,
                    commonStyles.defaultErrorText,
                    boxModel({type: 'margin', size: 's', places: 'tb'}),
                  ]}>
                  {authError}
                </Animatable.Text>
              )}
              <View style={styles.authButtonPlaceHolder}></View>
              <Animatable.View
                duration={1000}
                animation="bounceIn"
                delay={700}
                style={styles.authButtonContainer}>
                <TouchableOpacity
                  onPress={this.doLogin}
                  style={{padding: 0, margin: 0}}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[
                      Colors.primaryGradientStart,
                      Colors.primaryGradientEnd,
                    ]}
                    style={styles.authSubmitBtn}>
                    {!showLoader && (
                      <CustIcon
                        type="antdesign"
                        name={!bioMetricEnabled ? 'arrowright' : 'close'}
                        size={35}
                        color={Colors.white}
                        containerStyle={styles.btnIconContainer}
                      />
                    )}
                    {showLoader && (
                      <ActivityIndicator
                        color={Colors.white}
                        size="large"
                        style={styles.btnIconContainer}
                      />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
              <View style={styles.authButtonMask}></View>
              <View style={styles.authButtonBGContainer}>
                <View style={styles.authButtonBG}></View>
              </View>
            </Animatable.View>
          </View>
          <View style={styles.signOptionContainer}>
            {showFingerID && (
              <View style={{width: '80%', alignSelf: 'center'}}>
                <Animatable.Text
                  duration={800}
                  animation="fadeInUp"
                  delay={500}
                  style={styles.loginInfo}>
                  You can login using your fingerprint
                </Animatable.Text>
                <TouchableOpacity onPress={this.doFingerPrint}>
                  <Animatable.Text
                    duration={900}
                    animation="fadeInUp"
                    delay={600}
                    style={[
                      commonStyles.whiteBoxTitle,
                      {
                        textAlign: 'center',
                        color: Colors.primary,
                        marginTop: boxModelSize.m,
                      },
                    ]}>
                    Fingerprint
                  </Animatable.Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Animatable.View
            duration={800}
            animation="zoomIn"
            delay={200}
            style={styles.authFooter}>
            <View style={styles.footerContainer}>
              <View style={styles.footerTextOne}>
                <Text style={commonStyles.defaultBodyText}>
                  Not yet registered ?
                </Text>
                <TouchableOpacity onPress={this.gotoRegisterScreen}>
                  <Text
                    style={[
                      commonStyles.primaryBodyTextSemiBold,
                      {marginLeft: 5},
                    ]}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 0.3}}>
                <Text
                  style={[
                    commonStyles.primaryBodyTextSemiBold,
                    {textAlign: 'right'},
                  ]}>
                  Emergency
                </Text>
              </View>
            </View>
          </Animatable.View>
        </View>
      </SafeAreaView>
    );
  }
}

export const styles = StyleSheet.create({
  topBGContainer: {
    flex: 0.5,
    backgroundColor: Colors.primary,
  },
  bottomBGContainer: {
    flex: 0.5,
  },
  bgImageContainer: {
    alignItems: 'flex-end',
  },
  bgImage: {
    width: '90%',
    height: '90%',
  },
  contentContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  contentLogo: {
    flex: Platform.OS==="ios" ? 0.41 : 0.32,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTitle: {
    fontFamily: Fonts.primarySemiBold,
    color: Colors.secondary,
    fontSize: fontSize.h4,
    marginLeft: 10,
  },
  logoImage: {
    width: 35,
    height: 35,
  },
  logoTxt: {
    fontFamily: Fonts.primarySemiBold,
    color: Colors.white,
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 4, height: 2},
    textShadowRadius: 10,
  },
  authMasterField: {
    flex: 0.48,
  },
  authFieldsContainer: {
    backgroundColor: Colors.white,
    borderRadius: Constants.BOX_REDIUS,
  },
  forgotTxt: {
    textAlign: 'right',
  },
  fieldErrorTxt: {
    textAlign: 'center',
  },
  signOptionContainer: {
    flex: 0.15,
  },
  authFooter: {
    flex: 0.05,
    justifyContent: 'flex-end',
  },
  footerContainer: {
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  footerTextOne: {
    flex: 0.7,
    flexDirection: 'row',
  },
  authButtonPlaceHolder: {
    height: Constants.AUTH_BUTTON_BG_SQUARE / 2 - 10,
  },
  authButtonBG: {
    width: Constants.AUTH_BUTTON_BG_SQUARE,
    height: Constants.AUTH_BUTTON_BG_SQUARE,
    borderRadius: 50,
    backgroundColor: Colors.white,
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 0,
    shadowOpacity: 0.1,
    elevation: 10,
  },
  authButtonBGContainer: {
    position: 'absolute',
    bottom: 10 - Constants.AUTH_BUTTON_BG_SQUARE / 2,
    left: (Constants.APP_WIDTH - 20) / 2 - Constants.AUTH_BUTTON_BG_SQUARE / 2,
    zIndex: -1,
  },
  authButtonMask: {
    width: '100%',
    height: Constants.AUTH_BUTTON_BG_SQUARE / 2,
    position: 'absolute',
    bottom: 0,
    left: boxModelSize.xl,
    backgroundColor: Colors.white,
    zIndex: 1,
  },
  authButtonContainer: {
    position: 'absolute',
    bottom: 10 - (Constants.AUTH_BUTTON_BG_SQUARE - 10) / 2,
    left:
      (Constants.APP_WIDTH - 20) / 2 -
      (Constants.AUTH_BUTTON_BG_SQUARE - 10) / 2,
    zIndex: 2,
  },
  authSubmitBtn: {
    width: Constants.AUTH_BUTTON_BG_SQUARE - 10,
    height: Constants.AUTH_BUTTON_BG_SQUARE - 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.secondary,
    zIndex: 3,
  },
  btnIconContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginInfo: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
    color: Colors.bodyTextGrey,
    textAlign: 'center',
  },
});
