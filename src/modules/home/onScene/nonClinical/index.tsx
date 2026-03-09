import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NonClinical from './nonClinical';
import AddPresentation from './addPresentation';
import {NonClinicalParamList} from '../../../../types/navigationsTypes';

const Stack = createStackNavigator<NonClinicalParamList>();

const NonClinicalNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="NonClinical" headerMode="none">
      <Stack.Screen name="NonClinical" component={NonClinical} />
      <Stack.Screen name="AddPresentation" component={AddPresentation} />
    </Stack.Navigator>
  );
};

export default NonClinicalNavigation;
