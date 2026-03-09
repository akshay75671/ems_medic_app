import React, {useState} from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import {Colors, Fonts, fontSize} from '../styles';
import {TabProp} from '../types/componentsTypes';

const CustomSegmentedTab: React.FC<TabProp> = ({
  tabValue,
  handleTabChange,
  defaultSelectedTab,
  tabSize,
}) => {
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);
  const onTabChange = (value: number) => {
    setSelectedTab(value);
    if (value === 0) {
      handleTabChange(0);
    } else if (value === 1) {
      handleTabChange(1);
    }
  };

  return (
    <View
      style={{
        ...styles.boxShadow,
        ...styles.tabContainer,
      }}>
      <View
        style={{
          ...styles.lefttab,
          backgroundColor: Colors.white,
        }}>
        <TouchableWithoutFeedback onPress={() => onTabChange(0)}>
          <View>
            <Text
              style={{
                ...styles.tabText,
                color: selectedTab === 0 ? Colors.primary : Colors.iconGrey,
                padding:
                  tabSize === 'small' ? 4 : tabSize === 'medium' ? 6 : 10,
                fontSize:
                  tabSize === 'small'
                    ? fontSize.h6
                    : tabSize === 'medium'
                    ? fontSize.h5
                    : fontSize.h5,
              }}>
              {tabValue[0]}
            </Text>
            <View
              style={{
                height: 4,
                backgroundColor:
                  selectedTab === 0 ? Colors.primary : Colors.white,
              }}></View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          ...styles.righttab,
          backgroundColor: Colors.white,
        }}>
        <TouchableWithoutFeedback onPress={() => onTabChange(1)}>
          <View>
            <Text
              style={{
                ...styles.tabText,
                color: selectedTab === 1 ? Colors.primary : Colors.iconGrey,
                padding:
                  tabSize === 'small' ? 4 : tabSize === 'medium' ? 6 : 10,
                fontSize:
                  tabSize === 'small'
                    ? fontSize.h6
                    : tabSize === 'medium'
                    ? fontSize.h5
                    : fontSize.h5,
              }}>
              {tabValue[1]}
            </Text>
            <View
              style={{
                height: 4,
                backgroundColor:
                  selectedTab === 1 ? Colors.primary : Colors.white,
              }}></View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default CustomSegmentedTab;

const styles = StyleSheet.create({
  tabContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  tabText: {
    paddingTop: 15.0,
    textAlign: 'center',
    fontFamily: Fonts.primaryMedium,
    fontSize: fontSize.h5,
  },
  lefttab: {
    width: '50%',
    borderTopLeftRadius: 20,
  },
  righttab: {
    width: '50%',
    borderTopRightRadius: 20,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
});
