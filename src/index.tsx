import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {RootStackParamList} from './types/navigationsTypes';
import EmailVerification from './modules/auth/emailVerification';
import Home from './modules/home';
import AuthNavigation from './modules/auth';
import SplashScreen from './splashScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackScreen = () => (
  <RootStack.Navigator initialRouteName="Init" headerMode="none">
    <RootStack.Screen name="Init" component={SplashScreen} />
    <RootStack.Screen
      name="Medic"
      component={Home}
      initialParams={{isNewUser: true}}
    />
    <RootStack.Screen name="Auth" component={AuthNavigation} />
    <RootStack.Screen
      name="EmailVerification"
      component={EmailVerification}
      initialParams={{email: ''}}
    />
  </RootStack.Navigator>
);

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
};

export default RootNavigation;
