import React, {FC} from 'react';
import {scale} from 'react-native-size-matters';
import {Colors} from '../styles';
import {useNavigation} from '@react-navigation/native';
import CustButton from './button';
import {StyleSheet, View} from 'react-native';
import {custIconProps} from '../types/componentsTypes';
import CustIcon from './icon';
interface MenuItemTypes {
  id: string;
  iconProps: custIconProps;
  label: string;
}
interface OnSceneMenuProps {
  iconSize?: number;
  buttonSize?: number;
}
const OnSceneMenu: FC<OnSceneMenuProps> = (props) => {
  const iconSize: number = props.iconSize || 35;
  const tabs: MenuItemTypes[] = [
    {
      iconProps: {
        type: 'font-awesome-5',
        name: 'file-alt',
        size: iconSize,
        color: Colors.primary,
      },
      label: 'Demographic',
      id: 'onsceneMenu_1',
    },
    {
      iconProps: {
        type: 'font-awesome-5',
        name: 'file-medical',
        size: iconSize,
        color: Colors.primary,
      },
      label: 'Assessment',
      id: 'onsceneMenu_2',
    },
    {
      iconProps: {
        type: 'font-awesome-5',
        name: 'file-medical-alt',
        size: iconSize,
        color: Colors.primary,
      },
      label: 'Vitals',
      id: 'onsceneMenu_3',
    },
    {
      iconProps: {
        type: 'font-awesome',
        name: 'bed',
        size: iconSize,
        color: Colors.primary,
      },
      label: 'Treatment',
      id: 'onsceneMenu_4',
    },
    {
      iconProps: {
        type: 'ionicon',
        name: 'hand-right',
        size: iconSize,
        color: Colors.primary,
      },
      label: 'RMA',
      id: 'onsceneMenu_5',
    },
    {
      iconProps: {
        type: 'foundation',
        name: 'clipboard-pencil',
        size: iconSize + 5,
        color: Colors.primary,
      },
      label: 'Narratives',
      id: 'onsceneMenu_6',
    },
    {
      iconProps: {
        type: 'fontisto',
        name: 'ambulance',
        size: iconSize,
        color: Colors.primary,
      },
      label: 'Disposition',
      id: 'onsceneMenu_7',
    },
    {
      iconProps: {
        type: 'font-awesome',
        name: 'handshake-o',
        size: iconSize,
        color: Colors.primary,
      },
      label: 'Handover',
      id: 'onsceneMenu_8',
    },
    {
      iconProps: {
        type: 'material-community',
        name: 'briefcase-plus',
        size: iconSize + 5,
        color: Colors.primary,
      },
      label: 'Safeguard',
      id: 'onsceneMenu_9',
    },
  ];
  const navigation = useNavigation();
  const clickedHandler = (name) => {
    navigation.navigate(name);
  };
  const menuItem = (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <View key={tab.id} style={{marginBottom: scale(15)}}>
          <CustButton
            title={tab.label}
            onPress={clickedHandler.bind(this, tab.label)}
            type="main"
            size={props.buttonSize}
            iconProps={tab.iconProps}
          />
        </View>
      ))}
    </View>
  );
  return menuItem;
};
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
});

export default OnSceneMenu;
