import React, {FC, useState, useEffect} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {CustIcon, CustSearchInput} from '../components';

interface CustomMultiPickerProps {
  options?: any;
  defaultSelected?: any;
  ions?: any;
  search?: boolean;
  multiple?: boolean;
  placeholder?: string;
  placeholderTextColor?: string;
  returnValue?: string;
  callback?: (res) => void;

  searchIconName?: string;
  searchIconSize?: number;
  searchIconColor?: string;
  iconSize?: number;

  scrollViewHeight?: string;
  scrollViewStyle?: any;

  itemStyle?: any;
  unselectedItemStyle?: any;

  labelStyle?: any;
  unselectedLabelStyle?: any;

  iconColor?: string;
  unselectedIconColor?: string;

  selectedIconName?: string;
  unselectedIconName?: string;

  showCloseIcon?: boolean;
}

export function CustomMultiPicker(props: CustomMultiPickerProps) {
  const [searchText, setSearchText] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (typeof props.defaultSelected === 'object') {
      setSelected(props.defaultSelected);
    } else {
      _onSelect(selected);
    }

    return () => {};
  }, [props.defaultSelected]);

  function _onSelect(item) {
    var sel = selected;
    if (props.multiple) {
      if (selected.indexOf(item) == -1) {
        setSelected((selected) => [...selected, item]);
        props.callback([...selected, item]);
      } else {
        sel = sel.filter((i) => i != item);
        setSelected(sel);
        props.callback(sel);
      }
    } else {
      if (sel.indexOf(item) == -1) {
        sel = [item];
        setSelected(sel);
        props.callback(sel);
      } else {
        sel = [];
        setSelected(sel);
        props.callback(sel);
      }
    }
  }

  function _onSearch(text) {
    setSearchText(text.length > 0 ? text.toLowerCase() : null);
  }

  function _isSelected(item) {
    if (selected.indexOf(item) == -1) {
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
  const labels = Object.keys(list).map((i) => list[i]);
  const values = Object.keys(list);
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
        {labels.map((label, index) => {
          const itemKey = props.returnValue == 'label' ? label : values[index];
          return _isSelected(itemKey) ? (
            <View
              key={Math.round(Math.random() * 1000000)}
              style={props.itemStyle}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  _onSelect(itemKey);
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CustIcon
                    type="font-awesome-5"
                    name={props.selectedIconName}
                    size={20}
                    color={props.iconColor}
                  />
                  <Text style={props.labelStyle}>{label}</Text>
                </View>
                {props.showCloseIcon ? (
                  <CustIcon
                    type="antdesign"
                    name={'closecircle'}
                    size={props.iconSize}
                    color={props.iconColor}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          ) : (
            <View
              key={Math.round(Math.random() * 1000000)}
              style={props.unselectedItemStyle}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  _onSelect(itemKey);
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CustIcon
                    type="antdesign"
                    name={props.unselectedIconName}
                    size={20}
                    color={props.unselectedIconColor}
                  />
                  <Text style={props.unselectedLabelStyle}>{label}</Text>
                </View>
                {props.showCloseIcon ? (
                  <CustIcon
                    type="antdesign"
                    name={props.unselectedIconName}
                    size={props.iconSize}
                    color={props.unselectedIconColor}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});

export default CustomMultiPicker;
