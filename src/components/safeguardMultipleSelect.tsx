import React, {FC, useState, useEffect} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {CustIcon, CustSearchInput, CustTextInput} from '../components';
import {scale} from 'react-native-size-matters';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';

interface SafeguardCustomMultiPickerProps {
  options?: any;
  defaultSelected?: any;
  ions?: any;
  search?: boolean;
  multiple?: boolean;
  placeholder?: string;
  placeholderTextColor?: string;
  returnValue?: string;
  callback?: (res) => void;
  handleQuantityChange?: void;
  searchIconName?: string;
  searchIconSize?: number;
  searchIconColor?: string;
  iconSize?: number;

  scrollViewHeight?: string;
  scrollViewStyle?: any;

  itemStyle?: any;
  unselectedItemStyle?: any;

  labelStyle?: any;

  iconColor?: string;
  unselectedIconName?: string;
  selectedIconName?: string;
}

export function SafeguardCustomMultiPicker(
  props: SafeguardCustomMultiPickerProps,
) {
  const [searchText, setSearchText] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [props.options]);

  function _onSelect(safeguard) {
    // var newSafeguard = {...safeguard, id: Math.round(Math.random() * 1000000)};
    // console.log('onSelect safeguard');
    // console.log(safeguard);
    var sel = selected;
    if (props.multiple) {
      var __FOUND = selected.findIndex(function (selectedSafeguarItem, index) {
        if (selectedSafeguarItem.id == safeguard.id)
          return true;
      });

      if (__FOUND == -1) {
        setSelected((selected) => selected.concat(safeguard));
        props.callback([...selected, safeguard]);
      } else {
        sel = sel.filter((i) => i != safeguard);
        setSelected(sel);
        props.callback(sel);
      }
    }
  }

  function _onSearch(text) {
    setSearchText(text.length > 0 ? text.toLowerCase() : null);
  }

  function _isSelected(safeguard) {
    var __FOUND = selected.findIndex(function (selectedSafeguarItem, index) {
      if (selectedSafeguarItem.medicineName == safeguard.medicineName)
        return true;
    });

    if (__FOUND == -1) {
      return false;
    }
    return true;
  }

  function filterObjectByValue(obj, predicate) {
    return Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});
  }

  const list = searchText
    ? filterObjectByValue(props.options, (option) =>
        option.toLowerCase().includes(searchText),
      )
    : props.options;
  console.log('list')
  console.log(list)
  // const safeguardList = Object.keys(list).map((i) => list[i]);
  const safeguardList = list.medicines;
  console.log('safeguardList')
  console.log(safeguardList)
  const values = Object.keys(list);

  // Fetching User Details
  return (
    <View style={{height: props.scrollViewHeight}}>
      {props.search && (
        <CustSearchInput
          {...props}
          label={'Search'}
          required={true}
          dropIcon={false}
          leftIcon
          iconProps={{
            type: 'font-awesome',
            name: 'search',
            size: 20,
            color: props.searchIconColor,
          }}
          onChangeText={(text) => {
            _onSearch(text);
          }}
          //onEndEditing={handleSubmit(onSubmit)}
        />
      )}
      <ScrollView style={[{}, props.scrollViewStyle]}>
        {safeguardList.map((safeguard, index) => {
          const itemKey =
            props.returnValue == 'label'
              ? safeguard.medicineName
              : values[index];

          return _isSelected(safeguard) ? (
            <View
              key={Math.round(Math.random() * 1000000)}
              style={[props.itemStyle, {}]}>
              <TouchableOpacity style={styles.option}>
                <View
                  style={[
                    {flexDirection: 'row', alignItems: 'center'},
                    // styles.safeguardbox,
                  ]}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      _onSelect(safeguard);
                    }}>
                    <CustIcon
                      type="font-awesome"
                      name={props.selectedIconName}
                      size={15}
                      color={props.iconColor}
                    />
                  </TouchableOpacity>
                  <View style={[styles.optionItem, props.labelStyle]}>
                    <View
                      key={safeguard.medicineName}
                      style={[styles.optionItem]}>
                      <View
                        style={[
                          styles.option,
                          commonStyles.roundedButtonBoxShadow,
                        ]}>
                        <View style={styles.safeguardItemContainer}>
                          <View style={[styles.leftContainer]}>
                            <Text style={[styles.label, props.labelStyle]}>
                              {safeguard.medicineName}
                            </Text>
                            <Text style={[props.labelStyle, styles.unit]}>
                              {safeguard.unit}
                            </Text>
                          </View>
                          <View style={[styles.rightContainer]}>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() =>
                                props.handleQuantityChange(
                                  'decrement',
                                  safeguard.medicineName,
                                )
                              }>
                              <View
                                style={[
                                  {flexDirection: 'row', alignItems: 'center'},
                                ]}>
                                <CustIcon
                                  type="antdesign"
                                  name={'minus'}
                                  size={20}
                                  color={Colors.primary}
                                />
                              </View>
                            </TouchableOpacity>
                            <Text style={styles.number}>
                              {safeguard.quantity}
                            </Text>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() =>
                                props.handleQuantityChange(
                                  'increment',
                                  safeguard.medicineName,
                                )
                              }>
                              <View
                                style={[
                                  {flexDirection: 'row', alignItems: 'center'},
                                ]}>
                                <CustIcon
                                  type="antdesign"
                                  name={'plus'}
                                  size={20}
                                  color={Colors.primary}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              key={Math.round(Math.random() * 1000000)}
              style={props.unselectedItemStyle}>
              <TouchableOpacity style={styles.option}>
                <View
                  style={[
                    {flexDirection: 'row', alignItems: 'center'},
                    // styles.safeguardbox,
                  ]}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      _onSelect(safeguard);
                    }}>
                    <CustIcon
                      type="font-awesome-5"
                      name={props.unselectedIconName}
                      size={15}
                      color={'grey'}
                    />
                  </TouchableOpacity>
                  <View style={[styles.optionItem]}>
                    <View key={safeguard.medicineName}>
                      <View
                        style={[
                          styles.option,
                          commonStyles.roundedButtonBoxShadow,
                        ]}>
                        <View style={styles.safeguardItemContainer}>
                          <View style={[styles.leftContainer]}>
                            <Text style={[styles.label]}>
                              {safeguard.medicineName}
                            </Text>
                            <Text style={styles.unit}>{safeguard.unit}</Text>
                          </View>
                          <View style={[styles.rightContainer]}>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() =>
                                props.handleQuantityChange(
                                  'decrement',
                                  safeguard.medicineName,
                                )
                              }>
                              <View
                                style={[
                                  {flexDirection: 'row', alignItems: 'center'},
                                ]}>
                                <CustIcon
                                  type="antdesign"
                                  name={'minus'}
                                  size={20}
                                  color={Colors.primary}
                                />
                              </View>
                            </TouchableOpacity>
                            <Text style={styles.number}>
                              {safeguard.quantity}
                            </Text>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() =>
                                props.handleQuantityChange(
                                  'increment',
                                  safeguard.medicineName,
                                )
                              }>
                              <View
                                style={[
                                  {flexDirection: 'row', alignItems: 'center'},
                                ]}>
                                <CustIcon
                                  type="antdesign"
                                  name={'plus'}
                                  size={20}
                                  color={Colors.primary}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    fontFamily: Fonts.primaryThin,
    fontSize: fontSize.h5,
    alignSelf: 'center',
    color: Colors.primary,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 3,
    paddingBottom: 3,
  },
  rightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '20%',
  },
  leftContainer: {
    width: '70%',
    flexDirection: 'row',
  },
  safeguardItemContainer: {
    flexDirection: 'row',
    width: '100%',
    // height: scale(60),
    // padding: scale(10),
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h5,
    paddingLeft: scale(12),
    alignSelf: 'center',
  },
  number: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h6,
    paddingLeft: scale(8),
    paddingRight: scale(8),
    color: Colors.bodyTextGrey,
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: '#cfcfcf',
  },
  unit: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    paddingLeft: scale(10),
    alignSelf: 'center',
    color: 'grey',
  },
  optionItem: {
    // padding: scale(10),
    // marginBottom: scale(15),
    // height: scale(60),
    flexDirection: 'row',
    borderRadius: scale(45),
  },

  safeguardbox: {
    // height: scale(90),
  },

  checkbox: {
    padding: 2,
  },
});

export default SafeguardCustomMultiPicker;
