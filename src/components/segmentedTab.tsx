import React, {FC, useState} from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import Constants from '../core/constants';
import {boxModel, boxModelSize, Colors, Fonts, fontSize} from '../styles';
import {TabProp} from '../types/componentsTypes';

const SegmentedTab: FC<TabProp> = ({
  tabValue,
  handleTabChange,
  defaultSelectedTab,
  tabSize,
}) => {
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);
  const onTabChange = (value: number) => {
    setSelectedTab(value);
    if (value === 0) {
      handleTabChange(tabValue[0].toLowerCase());
    } else if (value === 1) {
      handleTabChange(tabValue[1].toLowerCase());
    }
  };
  const getFontSize = {
    small: fontSize.default,
    medium: fontSize.h6,
    large: fontSize.h5,
  };
  return (
    <View style={styles.tabContainer}>
      <View
        style={[
          styles.tab,
          styles.leftTab,
          styles[selectedTab == 0 ? 'tabSelected' : 'tabNotSelected'],
        ]}>
        <TouchableWithoutFeedback onPress={() => onTabChange(0)}>
          <Text
            style={[
              styles.tabText,
              {fontSize: getFontSize[tabSize || 'large']},
              styles[selectedTab == 0 ? 'tabSelectedTxt' : 'tabNotSelectedTxt'],
            ]}>
            {tabValue[0]}
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={[
          styles.tab,
          styles.rightTab,
          styles[selectedTab == 1 ? 'tabSelected' : 'tabNotSelected'],
        ]}>
        <TouchableWithoutFeedback onPress={() => onTabChange(1)}>
          <Text
            style={[
              styles.tabText,
              {fontSize: getFontSize[tabSize || 'large']},
              styles[selectedTab == 1 ? 'tabSelectedTxt' : 'tabNotSelectedTxt'],
            ]}>
            {tabValue[1]}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default SegmentedTab;

const styles = StyleSheet.create({
  tabContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: scale(20),
    flex: 1,
  },
  tabText: {
    textAlign: 'center',
    fontFamily: Fonts.primaryRegular,
  },
  tab: {
    flex: 0.5,
    justifyContent: 'center',
    paddingTop: scale(2),
  },
  leftTab: {
    borderTopLeftRadius: Constants.BOX_REDIUS,
    borderBottomLeftRadius: Constants.BOX_REDIUS,
  },
  rightTab: {
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderBottomRightRadius: Constants.BOX_REDIUS,
  },
  tabSelected: {
    backgroundColor: Colors.primary,
  },
  tabNotSelected: {
    backgroundColor: Colors.white,
  },
  tabSelectedTxt: {
    color: Colors.white,
  },
  tabNotSelectedTxt: {
    color: Colors.primary,
  },
});
