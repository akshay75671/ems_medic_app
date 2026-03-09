import React, {Component} from 'react';
import {StyleSheet, View, Animated, ActivityIndicator} from 'react-native';
import {RootStackParamList} from './types/navigationsTypes';
import {Colors, Fonts} from './styles';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import Constants from './core/constants';
import {
  addEmailHistory,
  fetchUserDetails,
  updateEmailVerification,
} from './services/profileServices';
import {CustSnackBar} from './components';
import {USER} from './redux/profile/profileTypes';
import {userObjTypes} from './types/userTypes';
import {
  clearSession,
  getSessionData,
  setSessionDataObject,
} from './core/asyncStorage';
import {getUserDetails, logoutUser} from './services/authServices';

type RootScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type splashScreenProps = {
  navigation: RootScreenNavigationProp;
};
type splashScreenState = {
  fadeValue: any;
};

export default class SplashScreen extends Component<
  splashScreenProps,
  splashScreenState
> {
  unsubscribe: () => void;
  constructor(props) {
    super(props);
    this.state = {
      fadeValue: new Animated.Value(0),
    };
  }
  componentDidMount() {
    // this.props.navigation.navigate('Medic', {isNewUser: false});
    // this.props.navigation.navigate('EmailVerification', {
    //   email: 'paul@ondace.com',
    // });
    // return;
    //clearSession();
    this.fadeIn();
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      getUserDetails().then((user) => {
        user ? this.checkUserObj(user) : this.props.navigation.navigate('Auth');
      });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  checkUserObj = (authUser) => {
    fetchUserDetails()
      .then((response: any) => {
        const user: USER = response.data;
        if (authUser.email != user.email) {
          updateEmailVerification(user.id, {
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            updatedAt: new Date(),
          })
            .then(() => {
              addEmailHistory({
                createdAt: new Date(),
                fbUserID: user.fbUserID,
                userID: user.id,
                newEmail: authUser.email,
                oldEmail: user.email,
              })
                .then(() => {
                  this.updateSessionData(user, authUser);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.updateSessionData(user, authUser);
        }
      })
      .catch((error) => {
        console.log(error);
        //this.props.navigation.navigate('Auth');
      });
  };
  updateSessionData = (user, authUser) => {
    const userObj: userObjTypes = {
      isNewUser: true,
      isBiometricsEnabled: false,
      user: {faceID: user.faceID, fingerID: user.fingerID},
    };

    if (
      user.fullName &&
      user.fullName.length > 0 &&
      user.gender &&
      user.gender.length > 0 &&
      user.dob &&
      user.dob.length > 0
    )
      userObj.isNewUser = false;
    if (user.faceID || user.fingerID) userObj.isBiometricsEnabled = true;

    setSessionDataObject('userObj', userObj)
      .then(() => {
        this.routing(authUser, userObj);
      })
      .catch((error) => {
        CustSnackBar(error);
      });
  };
  routing = (user, session: userObjTypes) => {
    const {isNewUser, isBiometricsEnabled} = session;
    getSessionData('signedIn')
      .then((signStatus) => {
        if (signStatus != null) {
          if (user && user.emailVerified && signStatus == 'in') {
            this.props.navigation.navigate('Medic', {isNewUser});
          } else if (user && !user.emailVerified && session.isNewUser) {
            this.props.navigation.navigate('EmailVerification', {
              email: user.email,
            });
          } else if (signStatus == 'out' && isBiometricsEnabled) {
            this.props.navigation.navigate('Auth');
          } else if (signStatus == 'out' && !isBiometricsEnabled) {
            logoutUser().then(() => {
              this.props.navigation.navigate('Auth');
            });
          }
        } else {
          this.props.navigation.navigate('Auth');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fadeIn = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1, // output
      duration: 2000, // duration of the animation
      delay: 100,
      useNativeDriver: true,
    }).start();
  };

  render() {
    return (
      <View style={styles.container}>
        <Animatable.Image
          duration={700}
          animation="fadeInUp"
          source={Constants.EMS_LOGO}
          style={styles.logoContainer}
        />
        <Animatable.Text
          animation="fadeInUp"
          delay={50}
          style={styles.logoTitle}>
          EMS MEDIC
        </Animatable.Text>
        <Animated.View style={{opacity: this.state.fadeValue}}>
          <ActivityIndicator
            style={{marginTop: 20}}
            size="large"
            color={Colors.white}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  logoContainer: {
    width: 90,
    height: 90,
  },
  logoTitle: {
    fontFamily: Fonts.primarySemiBold,
    color: Colors.secondary,
    fontSize: 22,
    marginTop: 20,
  },
});
