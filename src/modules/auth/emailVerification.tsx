import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {
  commonStyles,
  Colors,
  boxModel,
  fontSize,
  boxModelSize,
  Fonts,
} from '../../styles';
import {styles as authStyles} from './signIn';
import {CustIcon} from '../../components';
import Constants from '../../core/constants';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
  sendEmailVerification,
  userReload,
  getUserDetails,
  logoutUser,
} from '../../services/authServices';
import {
  AuthStackParamList,
  RootStackParamList,
} from '../../types/navigationsTypes';
import {getSessionDataObject} from '../../core/asyncStorage';
import { verticalScale, scale, ScaledSheet } from 'react-native-size-matters';

type RootScreenRouteProp = RouteProp<RootStackParamList, 'EmailVerification'>;
type navigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'EmailVerification'>,
  StackNavigationProp<AuthStackParamList>
>;
type emailVerificationProps = {
  route: RootScreenRouteProp;
  navigation: navigationProp;
};
type emailVerificationState = {
  fadeValue: any;
  isEmailSend: boolean;
  appBackground: boolean;
  isEmailVerified: boolean;
  showLoader: boolean;
  authError: string;
};

export default class EmailVerification extends PureComponent<
  emailVerificationProps,
  emailVerificationState
> {
  constructor(props) {
    super(props);
    this.state = {
      isEmailSend: false,
      appBackground: false,
      isEmailVerified: false,
      fadeValue: new Animated.Value(0),
      authError: '',
      showLoader: false,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.fadeIn();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (
      nextAppState == 'active' &&
      this.state.appBackground &&
      this.state.isEmailSend
    ) {
      userReload()
        .then(() => {
          getUserDetails().then((user) => {
            this.setState({isEmailVerified: user.emailVerified});
          });
        })
        .catch((error) => {
          this.setState({authError: error});
        });
    } else if (nextAppState == 'background') {
      this.setState({appBackground: true});
    }
  };

  fadeIn = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 0.8, // output
      duration: 2000, // duration of the animation
      delay: 100,
      useNativeDriver: true,
    }).start();
  };
  clickHandler = () => {
    if (!this.state.isEmailVerified) {
      this.setState({showLoader: true});
      sendEmailVerification()
        .then(() => {
          this.setState({isEmailSend: true});
          this.setState({showLoader: false});
        })
        .catch((error) => {
          this.setState({authError: error});
          this.setState({showLoader: false});
        });
    } else if (this.state.isEmailVerified) {
      this.userLogout();
    }
  };
  userLogout = () => {
    getSessionDataObject('userObj').then((response: any) => {
      if (response != null) {
        logoutUser().then(() => {
          this.props.navigation.navigate('Auth');
        });
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  };
  loginHandler = () => {
    this.userLogout();
  };
  signupHandler = () => {
    this.props.navigation.navigate('Auth', {screen: 'Signup'});
  };
  render() {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={authStyles.topBGContainer}>
          <View style={authStyles.bgImageContainer}>
            <Animatable.Image
              style={[authStyles.bgImage, {opacity: this.state.fadeValue}]}
              source={Constants.AUTH_BG_IMAGE}
            />
          </View>
        </View>
        <View style={authStyles.bottomBGContainer}></View>
        <View
          style={[
            authStyles.contentContainer,
            boxModel({type: 'padding', size: 'l', places: 'all'}),
          ]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignSelf:'center'
            }}>
            <View style={[authStyles.contentLogo, styles.contentLogo]}>
              <Animatable.View
                duration={500}
                animation="fadeInUp"
                style={authStyles.logoContainer}>
                <Image
                  style={authStyles.logoImage}
                  source={Constants.EMS_LOGO}
                />
                <Text style={authStyles.logoTitle}>EMS MEDIC</Text>
              </Animatable.View>
              <Animatable.Text
                duration={600}
                delay={50}
                animation="fadeInUp"
                style={[
                  authStyles.logoTxt,
                  boxModel({type: 'margin', size: 'm', places: 'tb'}),
                ]}>
                Welcome back!
              </Animatable.Text>
            </View>
            <View style={authStyles.authMasterField}>
              <Animatable.View
                duration={700}
                animation="fadeInUp"
                delay={100}
                style={[
                  authStyles.authFieldsContainer,
                  commonStyles.whiteBoxShadow,
                  boxModel({type: 'padding', size: 'xl', places: 'all'}),
                ]}>
                {!this.state.isEmailSend && (
                  <View>
                    <Animatable.Text
                      duration={500}
                      animation="fadeInUp"
                      delay={300}
                      style={[
                        commonStyles.whiteBoxTitle,
                        {textAlign: 'center', fontSize:scale(18)},
                        boxModel({type: 'margin', size: 'm', places: 'b'}),
                      ]}>
                      Email Verification
                    </Animatable.Text>
                    <Animatable.View
                      duration={600}
                      animation="fadeInUp"
                      delay={150}>
                      <Image
                        style={styles.emailVerification}
                        source={Constants.EMAIL_VERIFICATION}
                      />
                    </Animatable.View>
                    <Animatable.View
                      duration={900}
                      animation="zoomIn"
                      delay={300}>
                      <Text
                        style={[
                          commonStyles.defaultBodyText,
                          {textAlign: 'center', fontSize:scale(12)},
                          boxModel({type: 'margin', size: 's', places: 'tb'}),
                        ]}>
                        You are almost ready to start. Simply click the button
                        to send verification email to
                      </Text>
                      <Text style={styles.emailID}>
                        {this.props.route.params.email || ''}
                      </Text>
                    </Animatable.View>
                  </View>
                )}
                {this.state.isEmailSend && !this.state.isEmailVerified && (
                  <View>
                    <Animatable.Text
                      duration={500}
                      animation="fadeInUp"
                      delay={300}
                      style={[
                        commonStyles.whiteBoxTitle,
                        {textAlign: 'center', fontSize:scale(18)},
                        boxModel({type: 'margin', size: 'm', places: 'b'}),
                      ]}>
                      Check Your Email
                    </Animatable.Text>
                    <Animatable.View
                      duration={600}
                      animation="fadeInUp"
                      delay={150}>
                      <Image
                        style={styles.emailVerification}
                        source={Constants.EMAIL_VERIFICATION_SEND}
                      />
                    </Animatable.View>
                    <Animatable.View
                      duration={900}
                      animation="zoomIn"
                      delay={300}>
                      <Text
                        style={[
                          commonStyles.defaultBodyText,
                          {textAlign: 'center', fontSize:scale(12)},
                          boxModel({type: 'margin', size: 's', places: 'tb'}),
                        ]}>
                        Please check your email inbox and click on the provided
                        link to verify your email account. if you do not recieve
                        email, click the button to resend
                      </Text>
                    </Animatable.View>
                  </View>
                )}
                {this.state.isEmailSend && this.state.isEmailVerified && (
                  <View>
                    <Animatable.Text
                      duration={500}
                      animation="fadeInUp"
                      delay={300}
                      style={[
                        commonStyles.whiteBoxTitle,
                        {textAlign: 'center', fontSize:scale(18)},
                        boxModel({type: 'margin', size: 'm', places: 'b'}),
                      ]}>
                      Email Verified
                    </Animatable.Text>
                    <Animatable.View
                      duration={600}
                      animation="fadeInUp"
                      delay={150}>
                      <Image
                        style={styles.emailVerification}
                        source={Constants.EMAIL_VERIFICATION_VERIFIED}
                      />
                    </Animatable.View>
                    <Animatable.View
                      duration={900}
                      animation="zoomIn"
                      delay={300}>
                      <Text
                        style={[
                          commonStyles.defaultBodyText,
                          {textAlign: 'center', fontSize:scale(12)},
                          boxModel({type: 'margin', size: 's', places: 'tb'}),
                        ]}>
                        You have successfully verified your email account. Go to
                        login page by clicking below button.
                      </Text>
                    </Animatable.View>
                  </View>
                )}
                {this.state.authError.length > 0 && (
                  <Animatable.Text
                    animation="shake"
                    style={[
                      authStyles.fieldErrorTxt,
                      commonStyles.defaultErrorText,
                      boxModel({type: 'margin', size: 's', places: 'tb'}),
                    ]}>
                    {this.state.authError}
                  </Animatable.Text>
                )}
                <View style={authStyles.authButtonPlaceHolder}></View>
                {!this.state.isEmailSend && (
                  <Animatable.View
                    duration={1000}
                    animation="bounceIn"
                    delay={700}
                    style={authStyles.authButtonContainer}>
                    <TouchableOpacity onPress={this.clickHandler}>
                      <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={[
                          Colors.primaryGradientStart,
                          Colors.primaryGradientEnd,
                        ]}
                        style={[authStyles.authSubmitBtn, {paddingRight: 5}]}>
                        {!this.state.showLoader && (
                          <CustIcon
                            type="font-awesome"
                            name="send"
                            size={30}
                            color={Colors.white}
                            containerStyle={authStyles.btnIconContainer}
                          />
                        )}
                        {this.state.showLoader && (
                          <ActivityIndicator
                            color={Colors.white}
                            size="large"
                            style={authStyles.btnIconContainer}
                          />
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                )}
                {this.state.isEmailSend && !this.state.isEmailVerified && (
                  <Animatable.View
                    duration={1000}
                    animation="bounceIn"
                    delay={700}
                    style={authStyles.authButtonContainer}>
                    <TouchableOpacity onPress={this.clickHandler}>
                      <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={[
                          Colors.primaryGradientStart,
                          Colors.primaryGradientEnd,
                        ]}
                        style={authStyles.authSubmitBtn}>
                        <CustIcon
                          type="material-community"
                          name="email-send"
                          size={35}
                          color={Colors.white}
                          containerStyle={authStyles.btnIconContainer}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                )}
                {this.state.isEmailSend && this.state.isEmailVerified && (
                  <Animatable.View
                    duration={1000}
                    animation="bounceIn"
                    delay={700}
                    style={authStyles.authButtonContainer}>
                    <TouchableOpacity onPress={this.clickHandler}>
                      <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={[
                          Colors.primaryGradientStart,
                          Colors.primaryGradientEnd,
                        ]}
                        style={[authStyles.authSubmitBtn, {paddingRight: 5}]}>
                        <CustIcon
                          type="antdesign"
                          name="login"
                          size={35}
                          color={Colors.white}
                          containerStyle={authStyles.btnIconContainer}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                )}
                <View style={authStyles.authButtonMask}></View>
                <View style={authStyles.authButtonBGContainer}>
                  <View style={authStyles.authButtonBG}></View>
                </View>
              </Animatable.View>
            </View>
            <View
              style={[
                authStyles.signOptionContainer,
                styles.signOptionContainer,
              ]}>
              <View>
                <Animatable.Text
                  duration={800}
                  animation="fadeInUp"
                  delay={500}
                  style={styles.loginInfo}>
                  If you have done verification already. Please go to login page
                  by clicking below link.
                </Animatable.Text>
                <TouchableOpacity onPress={this.loginHandler}>
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
                    Login
                  </Animatable.Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Animatable.View
            duration={800}
            animation="zoomIn"
            delay={200}
            style={[authStyles.authFooter, styles.authFooter]}>
            <View style={authStyles.footerContainer}>
              <View style={authStyles.footerTextOne}>
                <Text style={commonStyles.defaultBodyText}>
                  Not yet registered ?
                </Text>
                <TouchableOpacity onPress={this.signupHandler}>
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
                <TouchableOpacity>
                  <Text
                    style={[
                      commonStyles.primaryBodyTextSemiBold,
                      {textAlign: 'right'},
                    ]}>
                    Emergency
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = ScaledSheet.create({
  contentLogo: {
    flex: 0.25,
  },
  authMasterField: {
    flex: 0.5,
  },
  signOptionContainer: {
    flex: 0.2,
    justifyContent: 'center',
  },
  authFooter: {
    flex: 0.05,
  },
  emailVerification: {
    width: '120@vs',
    height: '100@vs',
    alignSelf: 'center',
  },
  emailID: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h3,
    color: Colors.linkBlue,
    textAlign: 'center',
  },
  loginInfo: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
    color: Colors.bodyTextGrey,
    textAlign: 'center',
  },
});
