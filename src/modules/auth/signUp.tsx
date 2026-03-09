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
import {CompositeNavigationProp} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import {commonStyles, Colors, boxModel} from '../../styles';
import {styles as authStyles} from './signIn';
import {CustAuthInput, CustIcon} from '../../components';
import Constants from '../../core/constants';
import {
  AuthStackParamList,
  RootStackParamList,
} from '../../types/navigationsTypes';
import {registerUser} from '../../services/authServices';
import {setSessionData} from '../../core/asyncStorage';

interface fieldsType {
  value: string;
  error: string;
}
interface signupState {
  emailID: fieldsType;
  password: fieldsType;
  confirmPassword: fieldsType;
  fadeValue: any;
  authError: string;
  showLoader: boolean;
}
type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList>,
  StackNavigationProp<RootStackParamList>
>;
type signupProps = {
  navigation: NavigationProp;
};
export default class SignUp extends PureComponent<signupProps, signupState> {
  passwordInput: React.RefObject<CustAuthInput>;
  cnfPasswordInput : React.RefObject<CustAuthInput>;
  constructor(props) {
    super(props);
    this.passwordInput = React.createRef();
    this.cnfPasswordInput = React.createRef();
    this.state = {
      emailID: {value: '', error: ''},
      password: {value: '', error: ''},
      confirmPassword: {value: '', error: ''},
      authError: '',
      showLoader: false,
      fadeValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.fadeIn();
  }

  schema = yup.object().shape({
    emailID: yup
      .string()
      .label('emailID')
      .required('No email provided.')
      .email('Email is not valid'),
    password: yup
      .string()
      .label('password')
      .required('No password provided.')
      .min(6, 'Password should be 6 chars minimum.')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/,
        'Password must contain uppercase, Lowercase, Special character and Number',
      ),
    confirmPassword: yup
      .string()
      .label('confirmPassword')
      .required('No password provided.')
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
  gotoLoginScreen = () => {
    this.props.navigation.navigate('Signin');
  };
  doRegister = () => {
    if (this.state.showLoader) return;
    ['emailID', 'password', 'confirmPassword'].map((name) => {
      this.fieldValidation(name, this.state[name].value);
    });
    if (this.state.password.value === this.state.confirmPassword.value) {
      this.schema
        .isValid({
          emailID: this.state.emailID.value.toLowerCase(),
          password: this.state.password.value,
          confirmPassword: this.state.confirmPassword.value,
        })
        .then((isValid) => {
          if (!isValid) return;
          this.setState({showLoader: true});
          registerUser(this.state.emailID.value, this.state.password.value)
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
        });
    } else {
      this.setState({
        confirmPassword: {
          ...this.state.confirmPassword,
          error: 'Password must match',
        },
      });
    }
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

  setFocusField = (ref) => {
    ref.current.setInputFoucs();
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
        <View style={authStyles.bottomBGContainer} />
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
              <Animatable.Text
                duration={500}
                animation="fadeInUp"
                delay={300}
                style={[
                  commonStyles.whiteBoxTitle,
                  {textAlign: 'center'},
                  boxModel({type: 'margin', size: 'm', places: 'b'}),
                ]}>
                Registration
              </Animatable.Text>
              <Animatable.View duration={600} animation="fadeInUp" delay={150}>
                <CustAuthInput
                  placeholder="Your Email ID"
                  keyboardType="email-address"
                  onChangeText={this.handleChangeText.bind(this, 'emailID')}
                  onEndEditing={this.handleBlur.bind(this, 'emailID')}
                  errorText={this.state.emailID.error}
                  onSubmitEditing={()=>this.setFocusField(this.passwordInput)}
                  autoCapitalize="none"
                  leftIcon
                  returnKeyType="next"
                  iconProps={{
                    type: 'antdesign',
                    name: 'mail',
                    size: 25,
                    color: Colors.iconGrey,
                  }}
                />
              </Animatable.View>
              <Animatable.View duration={700} animation="fadeInUp" delay={200}>
                <CustAuthInput
                  placeholder="Your Password"
                  secureTextEntry
                  showHidePassword
                  contextMenuHidden={true}
                  ref={this.passwordInput}
                  onChangeText={this.handleChangeText.bind(this, 'password')}
                  onEndEditing={this.handleBlur.bind(this, 'password')}
                  onSubmitEditing={()=>this.setFocusField(this.cnfPasswordInput)}
                  errorText={this.state.password.error}
                  leftIcon
                  returnKeyType="next"
                  iconProps={{
                    type: 'antdesign',
                    name: 'lock',
                    size: 25,
                    color: Colors.iconGrey,
                  }}
                />
              </Animatable.View>
              <Animatable.View duration={700} animation="fadeInUp" delay={200}>
                <CustAuthInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  showHidePassword
                  contextMenuHidden={true}
                  onChangeText={this.handleChangeText.bind(
                    this,
                    'confirmPassword',
                  )}
                  onEndEditing={this.handleBlur.bind(this, 'confirmPassword')}
                  onSubmitEditing={this.doRegister}
                  returnKeyType="go"
                  ref={this.cnfPasswordInput}
                  errorText={this.state.confirmPassword.error}
                  leftIcon
                  iconProps={{
                    type: 'antdesign',
                    name: 'lock',
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
              <View style={authStyles.authButtonPlaceHolder}></View>
              <Animatable.View
                duration={1000}
                animation="bounceIn"
                delay={700}
                style={authStyles.authButtonContainer}>
                <TouchableOpacity onPress={this.doRegister}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[
                      Colors.primaryGradientStart,
                      Colors.primaryGradientEnd,
                    ]}
                    style={authStyles.authSubmitBtn}>
                    {!this.state.showLoader && (
                      <CustIcon
                        type="antdesign"
                        name="arrowright"
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
            style={[authStyles.signOptionContainer, styles.signOptionContainer]}
          />
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
    flex: Platform.OS==="ios" ? 0.42 : 0.3,
  },
  authMasterField: {
    flex: 0.5,
  },
  signOptionContainer: {
    flex: 0.15,
  },
  authFooter: {
    flex: 0.05,
  },
});
