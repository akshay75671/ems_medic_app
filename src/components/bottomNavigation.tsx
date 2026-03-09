import React, {FC, useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {boxModelSize, Colors, Fonts, fontSize} from '../styles';
import {useRoute, useNavigation} from '@react-navigation/native';
import CustIcon from './icon';
import {inject, observer} from 'mobx-react';
interface menuItemsTypes {
  item: string;
  label: string;
  type: string;
  name: string;
}
interface bottomNavigationProps {
  profile?: any;
}
const BottomNavigation: FC<bottomNavigationProps> = (props) => {
  const pageName = useRoute().name;
  const navigation = useNavigation();
  const [isUserInside, setIsUserInside] = useState<boolean>(false);
  const menuItems: menuItemsTypes[] = [
    {item: 'EventHome', label: 'Home', type: 'font-awesome-5', name: 'home'},
    {item: 'Chat', label: 'Chat', type: 'entypo', name: 'chat'},
    {
      item: 'EPCR',
      label: 'New EPCR',
      type: 'font-awesome-5',
      name: 'hand-holding-medical',
    },
    {
      item: 'Emergency',
      label: 'Emergency',
      type: 'meterial',
      name: 'add-alert',
    },
  ];
  const clickedHandler = (name) => {
    if (name == 'EventHome' && !isUserInside) navigation.navigate('Home');
    else navigation.navigate(name);
  };
  useEffect(() => {
    if (props.profile.profile)
      setIsUserInside(props.profile.profile.insideEvent);
  }, [props.profile.profile && props.profile.profile.insideEvent]);
  const getColor = (key, type) => {
    if (key == 'Emergency' && type == 'bg') return Colors.requestRejectBG;
    if (key == 'Emergency' && type !== 'bg') return Colors.white;
    if (type == 'icon') return pageName == key ? Colors.white : Colors.primary;
    if (type == 'bg') return pageName == key ? Colors.primary : Colors.white;
    if (type == 'text')
      return pageName == key ? Colors.white : Colors.bodyTextGrey;
  };
  const menuItem = (
    <View style={styles.tabsContainer}>
      {menuItems.map((option, index) => {
        return (
          <TouchableOpacity
            style={[
              styles.tabs,
              {
                backgroundColor: getColor(option.item, 'bg'),
              },
            ]}
            key={option.item}
            onPress={clickedHandler.bind(this, option.item)}>
            <View style={styles.innerTabs}>
              <CustIcon
                type={option.type}
                name={option.name}
                size={25}
                color={getColor(option.item, 'icon')}
              />
              <Text
                style={[
                  styles.tabsName,
                  {
                    color: getColor(option.item, 'text'),
                  },
                ]}>
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
  return (
    <ImageBackground
      source={require('../assets/images/bottom_navigation_bg_img.png')}
      style={{height: '100%', width: '100%', flex: 1}}
      imageStyle={{resizeMode: 'stretch'}}>
      {menuItem}
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  tabsContainer: {
    height: '90%',
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  tabs: {
    flex: 0.25,
  },
  innerTabs: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: boxModelSize.s,
  },
  tabsName: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
    // marginTop: boxModelSize.s,
  },
});

export default inject('profile')(observer(BottomNavigation));
