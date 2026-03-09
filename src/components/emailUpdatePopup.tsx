import React, {PureComponent} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../core/constants';
import {
  boxModel,
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../styles';
import CustIcon from './icon';
interface emailVerificationProps {
  userConfirmed: () => void;
  userCancelled: () => void;
  displayState: 'update' | 'login';
}
class EmailUpdateConfirm extends PureComponent<emailVerificationProps> {
  verificationEmailHandler = () => {};
  render() {
    return (
      <Modal animationType="fade" visible transparent>
        <View style={styles.modelView}>
          <View
            style={[
              styles.contentView,
              commonStyles.whiteBoxShadow,
              boxModel({type: 'padding', size: 'l', places: 'all'}),
            ]}>
            {this.props.displayState == 'update' && (
              <View>
                <Animatable.Text
                  duration={1000}
                  animation="fadeInUp"
                  delay={100}
                  style={[
                    commonStyles.whiteBoxTitle,
                    {textAlign: 'center'},
                    boxModel({type: 'margin', size: 'm', places: 'b'}),
                  ]}>
                  Check Your Email
                </Animatable.Text>
                <Animatable.View
                  duration={1000}
                  animation="fadeInUp"
                  delay={200}>
                  <Image
                    style={styles.emailVerification}
                    source={Constants.EMAIL_VERIFICATION_SEND}
                  />
                </Animatable.View>
                <Animatable.View duration={1000} animation="zoomIn" delay={250}>
                  <Text
                    style={[
                      commonStyles.defaultBodyText,
                      {textAlign: 'center'},
                      boxModel({type: 'margin', size: 's', places: 'tb'}),
                    ]}>
                    Please check your email inbox and click on the provided link
                    to update your email account. You have to login by clicking
                    button below if you have updated your email account.
                  </Text>
                </Animatable.View>
                <TouchableOpacity
                  style={{padding: 0, margin: 0}}
                  onPress={this.props.userConfirmed}>
                  <Animatable.View
                    duration={1000}
                    animation="bounceIn"
                    delay={300}
                    style={styles.gradientContainer}>
                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={[
                        styles.gradientInnerContainer,
                        commonStyles.whiteBoxShadow,
                      ]}
                      colors={[
                        Colors.primaryGradientStart,
                        Colors.primaryGradientEnd,
                      ]}>
                      <CustIcon
                        type="antdesign"
                        name="login"
                        size={30}
                        color={Colors.white}
                      />
                    </LinearGradient>
                  </Animatable.View>
                </TouchableOpacity>
                <Animatable.View
                  duration={1000}
                  animation="zoomIn"
                  delay={350}
                  style={{marginTop: boxModelSize.xl}}>
                  <Text
                    style={[
                      commonStyles.defaultBodyText,
                      {textAlign: 'center'},
                      boxModel({type: 'margin', size: 's', places: 'tb'}),
                    ]}>
                    Please check your email address. If you do not have recieve
                    email.
                  </Text>
                </Animatable.View>
                <TouchableOpacity
                  style={{padding: 0, margin: 0}}
                  onPress={this.props.userCancelled}>
                  <Animatable.Text
                    duration={900}
                    animation="zoomIn"
                    delay={600}
                    style={[
                      commonStyles.whiteBoxTitle,
                      {
                        textAlign: 'center',
                        color: Colors.primary,
                      },
                    ]}>
                    Cancel
                  </Animatable.Text>
                </TouchableOpacity>
              </View>
            )}

            {this.props.displayState == 'login' && (
              <View>
                <Animatable.Text
                  duration={1000}
                  animation="fadeInUp"
                  delay={100}
                  style={[
                    commonStyles.whiteBoxTitle,
                    {textAlign: 'center'},
                    boxModel({type: 'margin', size: 'm', places: 'b'}),
                  ]}>
                  Login Required
                </Animatable.Text>
                <Animatable.View
                  duration={1000}
                  animation="fadeInUp"
                  delay={200}>
                  <Image
                    style={styles.emailVerification}
                    source={Constants.USER_LOGIN}
                  />
                </Animatable.View>
                <Animatable.View duration={1000} animation="zoomIn" delay={250}>
                  <Text
                    style={[
                      commonStyles.defaultBodyText,
                      {textAlign: 'center'},
                      boxModel({type: 'margin', size: 's', places: 'tb'}),
                    ]}>
                    Login required since you have updated your email account.
                  </Text>
                </Animatable.View>
                <TouchableOpacity
                  style={{padding: 0, margin: 0}}
                  onPress={this.props.userConfirmed}>
                  <Animatable.View
                    duration={1000}
                    animation="bounceIn"
                    delay={300}
                    style={styles.gradientContainer}>
                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={[
                        styles.gradientInnerContainer,
                        commonStyles.whiteBoxShadow,
                      ]}
                      colors={[
                        Colors.primaryGradientStart,
                        Colors.primaryGradientEnd,
                      ]}>
                      <CustIcon
                        type="antdesign"
                        name="login"
                        size={30}
                        color={Colors.white}
                      />
                    </LinearGradient>
                  </Animatable.View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modelView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.BOX_MODAL_BG_OPACITY,
  },
  contentView: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: Constants.BOX_REDIUS,
    alignItems: 'center',
    width: '95%',
  },
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
    width: 140,
    height: 121,
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
  gradientContainer: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  gradientInnerContainer: {
    borderColor: Colors.secondary,
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmailUpdateConfirm;
