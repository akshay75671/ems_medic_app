import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Narratives from './narratives';
import NarrativesNotes from './narrativesNotes';
import {NarrativeParamList} from '../../../../types/navigationsTypes';

const Stack = createStackNavigator<NarrativeParamList>();

const NonClinicalNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Narratives" headerMode="none">
      <Stack.Screen name="Narratives" component={Narratives} />
      <Stack.Screen
        name="NarrativesNotes"
        component={NarrativesNotes}
        initialParams={{narrativeObj: {}}}
      />
    </Stack.Navigator>
  );
};

export default NonClinicalNavigation;
