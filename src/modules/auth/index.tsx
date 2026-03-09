import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from './signIn';
import SignUp from './signUp';
import ForgotPassword from './forgotPassword';
import {AuthStackParamList} from '../../types/navigationsTypes';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Signin" headerMode="none">
      <Stack.Screen name="Signin" component={SignIn} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="Forgot" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
