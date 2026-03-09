import React, { FC, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native';
import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../styles';
import CustIcon from './icon';
import { CustDataPickerProps } from '../types/componentsTypes';
import CustTextInput from './textInput';
import Modal from 'react-native-modal';
import Constants from '../core/constants';

const DataPicker: FC<CustDataPickerProps> = (props) => {
  const {
    iconProps,
    label,
    required,
    leftIcon,
    editable,
    errorText,
    items,
  } = props;
  useEffect(() => {
    if (props.value != value) setValue(props.value);
  }, [props.value]);
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const dropDownItemSelected = (item) => {
    setVisible(false);
    setValue(item);
    props.onChangeText(item);
  };
  const dropDown = () => {
    setVisible(!visible);

  };
  return (
    <View>
      <TouchableOpacity onPress={dropDown} activeOpacity={0.7}>
        <CustTextInput
          editable={editable}
          leftIcon={leftIcon}
          required={required}
          iconProps={iconProps}
          label={label}
          placeholder={'Select ' + label}
          caretHidden={true}
          dropIcon={true}
          errorText={errorText}
          showSoftInputOnFocus={false}
          //onEndEditing={this.endEditingHandler}
          // onFocus={dropDown}
          value={value}
        />
      </TouchableOpacity>
      <Modal isVisible={visible}>
        <View style={styles.default}>
          <View
            style={[
              commonStyles.closeIconContainer,
              {
                marginLeft: boxModelSize.m,
                width: '100%',
              },
            ]}>
            <TouchableOpacity onPress={dropDown}>
              <View style={commonStyles.closeIcon}>
                <CustIcon
                  type="antdesign"
                  name="close"
                  size={20}
                  color={Colors.white}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: boxModelSize.l, backgroundColor: 'white' }}>
            <FlatList
              data={items}
              keyExtractor={(item: any) => item}
              renderItem={(src: any) => {
                return (
                  <TouchableOpacity
                    onPress={dropDownItemSelected.bind(this, src.item)}>
                    <View style={styles.droDownContainer}>
                      <Text
                        style={[
                          styles.dropDownList,
                          src.item == value && styles.itemHighlight,
                        ]}>
                        {src.item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    paddingHorizontal: boxModelSize.m,
    paddingVertical: boxModelSize.xxl,
    backgroundColor: 'white',
    borderRadius: Constants.BOX_REDIUS,
  },
  pickerContainer: {
    width: '100%',
    height: '40%',
    backgroundColor: Colors.primaryBackgroundColor,
    zIndex: 2,
  },
  pickerHeader: {
    backgroundColor: Colors.primary,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerHeaderTitle: {
    fontFamily: Fonts.primaryMedium,
    fontSize: fontSize.h5,
    color: Colors.white,
  },
  droDownContainer: {
    borderBottomColor: Colors.borderGrey,
    borderBottomWidth: 1,
    padding: 5,
  },
  dropDownList: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
    textAlign: 'center',
  },
  itemHighlight: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default DataPicker;
