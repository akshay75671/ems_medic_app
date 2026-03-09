import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Vitals from './vitals';
import AddVitals from './addVitals';
import ViewVitals from './viewVitals';
import {VitalParamList} from '../../../../types/navigationsTypes';

const Stack = createStackNavigator<VitalParamList>();

const VitalNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Vitals" headerMode="none">
      <Stack.Screen name="Vitals" component={Vitals} />
      <Stack.Screen name="AddVitals" component={AddVitals} />
      <Stack.Screen
        name="ViewVitals"
        component={ViewVitals}
        initialParams={{vitalsObj: {}}}
      />
    </Stack.Navigator>
  );
};

export default VitalNavigation;
