import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  HomeDrawerMenuParamList,
  RootStackParamList,
} from '../../types/navigationsTypes';
import {CustomDrawerContent} from '../../components';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {setSessionData} from '../../core/asyncStorage';
import {Colors} from '../../styles';
import Landing from './landing';
import AssistRequest from './assistRequest';
import EnRoute from './enRoute';
import EventHome from './eventHome';
import AssistInfo from './assistInfo';
import Vital from './onScene/vital';
import Profile from './profile';
import Chat from '../chat';
import Emergency from '../emergency';
import EPCR from '../epcr';
import Resources from './resources';
import Handover from './onScene/handover';
import Assessment from './onScene/assessment';
import Treatment from './onScene/treatment';
import NonClinical from './onScene/nonClinical';
import Narratives from './onScene/narratives';
import OnScene from './onScene/onScene';
import Demographic from './onScene/demographic';
import Disposition from './onScene/disposition';
import Safeguard from './onScene/safeguard';
import Rma from './onScene/rma';

type RootScreenRouteProp = RouteProp<RootStackParamList, 'Medic'>;
type RootScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Medic'
>;
type drawerScreenProps = {
  navigation: RootScreenNavigationProp;
  route: RootScreenRouteProp;
};

const Drawer = createDrawerNavigator<HomeDrawerMenuParamList>();
const AuthNavigation = (props: drawerScreenProps) => {
  const doLogout = () => {
    setSessionData('signedIn', 'out')
      .then(() => {
        props.navigation.navigate('Init');
      })
      .catch((error) => {
        console.log('not able to set store session data.');
      });
  };
  return (
    <Drawer.Navigator
      initialRouteName={props.route.params.isNewUser ? 'Profile' : 'Home'}
      drawerType="front"
      drawerStyle={{backgroundColor: Colors.drawerPrimaryBG}}
      drawerContentOptions={{
        activeBackgroundColor: Colors.drawerItemBG,
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} doLogout={doLogout} />
      )}>
      <Drawer.Screen name="Home" component={Landing} />
      <Drawer.Screen name="EventHome" component={EventHome} />
      <Drawer.Screen name="AssistRequest" component={AssistRequest} />
      <Drawer.Screen name="EnRoute" component={EnRoute} />
      <Drawer.Screen name="OnScene" component={OnScene} />
      <Drawer.Screen name="Demographic" component={Demographic} />
      <Drawer.Screen name="Assessment" component={Assessment} />
      <Drawer.Screen name="Vitals" component={Vital} />
      <Drawer.Screen name="Treatment" component={Treatment} />
      <Drawer.Screen name="RMA" component={Rma} />
      <Drawer.Screen name="Narratives" component={Narratives} />
      <Drawer.Screen name="Disposition" component={Disposition} />
      <Drawer.Screen name="Handover" component={Handover} />
      <Drawer.Screen name="Safeguard" component={Safeguard} />
      <Drawer.Screen name="NonClinical" component={NonClinical} />
      <Drawer.Screen name="Resource" component={Resources} />
      <Drawer.Screen name="Info" component={AssistInfo} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="EPCR" component={EPCR} />
      <Drawer.Screen name="Emergency" component={Emergency} />
    </Drawer.Navigator>
  );
};

export default AuthNavigation;
