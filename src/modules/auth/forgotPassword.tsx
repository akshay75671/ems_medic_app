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
  Platform
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import {commonStyles, Colors, boxModel} from '../../styles';
import {styles as authStyles} from './signIn';
import {CustAuthInput, CustIcon} from '../../components';
import Constants from '../../core/constants';
import {AuthStackParamList} from '../../types/navigationsTypes';
import {forgotPassword} from '../../services/authServices';

interface fieldsType {
  value: string;
  error: string;
}
type ForgotPasswordState = {
  fadeValue: any;
  emailID: fieldsType;
  authError: string;
  isEmailSend: boolean;
  showLoader: boolean;
};
type AuthScreenNavigationProp = StackNavigationProp<AuthStackParamList>;
type ForgotPasswordProps = {
  navigation: AuthScreenNavigationProp;
};
export default class ForgotPassword extends PureComponent<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  constructor(props) {
    super(props);
    this.state = {
      fadeValue: new Animated.Value(0),
      emailID: {value: '', error: ''},
      authError: '',
      isEmailSend: false,
      showLoader: false,
    };
  }
  componentDidMount() {
    this.fadeIn();
  }
  schema = yup.object({
    emailID: yup
      .string()
      .required('No email provided.')
      .email('Email is not valid'),
  });

  fadeIn = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 0.8, // output
      duration: 2000, // duration of the animation
      delay: 100,
      useNativeDriver: true,
    }).start();
  };

  gotoLoginScreen = () => {
    this.props.navigation.navigate('Signin');
  };

  sendForgotMail = () => {
    if (this.state.showLoader) return;
    if (this.state.isEmailSend) {
      if (this.props.navigation.canGoBack()) this.props.navigation.goBack();
    } else {
      this.fieldValidation(this.state.emailID.value);
      this.schema
        .isValid({
          emailID: this.state.emailID.value.toLowerCase(),
        })
        .then((isValid) => {
          if (!isValid) return;
          this.setState({showLoader: true});
          forgotPassword(this.state.emailID.value)
            .then(() => {
              this.setState({isEmailSend: true});
              this.setState({showLoader: false});
            })
            .catch((error) => {
              this.setState({authError: error});
              this.setState({showLoader: false});
            });
        });
    }
  };
  handleChangeText = (value) => {
    this.setState({emailID: {...this.state.emailID, value: value, error: ''}});
    this.setState({authError: ''});
  };
  handleBlur = (event) => {
    this.fieldValidation(event.nativeEvent.text);
  };
  fieldValidation = (value: string) => {
    yup
      .reach(this.schema, 'emailID')
      .validate(value)
      .then((result) => {
        this.setState({emailID: {...this.state.emailID, value: value}});
      })
      .catch((error) => {
        this.setState({
          emailID: {...this.state.emailID, error: error.errors[0]},
        });
      });
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
          <View style={[authStyles.contentLogo, styles.contentLogo]}>
            <Animatable.View
              duration={500}
              animation="fadeInUp"
              style={authStyles.logoContainer}>
              <Image style={authStyles.logoImage} source={Constants.EMS_LOGO} />
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
          <View style={styles.authMasterField}>
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
                      {textAlign: 'center'},
                      boxModel({type: 'margin', size: 'm', places: 'b'}),
                    ]}>
                    Forgot passoword
                  </Animatable.Text>
                  <Animatable.View
                    duration={600}
                    animation="fadeInUp"
                    delay={150}>
                    <CustAuthInput
                      placeholder="Your Email ID"
                      keyboardType="email-address"
                      onChangeText={this.handleChangeText}
                      onEndEditing={this.handleBlur}
                      errorText={this.state.emailID.error}
                      autoCapitalize="none"
                      leftIcon
                      iconProps={{
                        type: 'antdesign',
                        name: 'mail',
                        size: 25,
                        color: Colors.iconGrey,
                      }}
                    />
                  </Animatable.View>
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
                </View>
              )}
              {this.state.isEmailSend && (
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
                    Check your inbox
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
                        {textAlign: 'center'},
                        boxModel({type: 'margin', size: 's', places: 'tb'}),
                      ]}>
                      Please check your email inbox and click on the provided
                      link to reset your password. You can go to login screen by
                      clicking the button.
                    </Text>
                  </Animatable.View>
                </View>
              )}
              <View style={authStyles.authButtonPlaceHolder}></View>
              <Animatable.View
                duration={1000}
                animation="bounceIn"
                delay={700}
                style={authStyles.authButtonContainer}>
                <TouchableOpacity onPress={this.sendForgotMail}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[
                      Colors.primaryGradientStart,
                      Colors.primaryGradientEnd,
                    ]}
                    style={authStyles.authSubmitBtn}>
                    {!this.state.showLoader && !this.state.isEmailSend && (
                      <CustIcon
                        type="antdesign"
                        name="arrowright"
                        size={35}
                        color={Colors.white}
                        containerStyle={authStyles.btnIconContainer}
                      />
                    )}
                    {!this.state.showLoader && this.state.isEmailSend && (
                      <CustIcon
                        type="antdesign"
                        name="login"
                        size={35}
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
            ]}></View>
          <Animatable.View
            duration={800}
            animation="zoomIn"
            delay={200}
            style={[authStyles.authFooter, styles.authFooter]}>
            <View style={authStyles.footerContainer}>
              <View style={authStyles.footerTextOne}>
                <Text style={commonStyles.defaultBodyText}>
                  Already have an account ?
                </Text>
                <TouchableOpacity onPress={this.gotoLoginScreen}>
                  <Text
                    style={[
                      commonStyles.primaryBodyTextSemiBold,
                      {marginLeft: 5},
                    ]}>
                    Login
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

const styles = StyleSheet.create({
  contentLogo: {
    flex: Platform.OS==="ios" ? 0.45 : 0.4,
  },
  authMasterField: {
    flex: 0.25,
  },
  signOptionContainer: {
    flex: 0.3,
  },
  authFooter: {
    flex: 0.05,
  },
  emailVerification: {
    width: 140,
    height: 121,
    alignSelf: 'center',
  },
});
