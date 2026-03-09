import React, {PureComponent} from 'react';
import CountryPicker, {
  CountryModalProvider,
} from 'react-native-country-picker-modal';
import {Colors, Fonts, fontSize} from '../styles';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import CustTextInput from './textInput';
import {
  phoneTextInputProps,
  phoneTextInputState,
} from '../types/componentsTypes';
import CustIcon from './icon';

class PhoneNumber extends PureComponent<
  phoneTextInputProps,
  phoneTextInputState
> {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      callingCode: '',
      phoneNumber: '',
    };
  }
  componentDidMount() {
    this.setState({phoneNumber: this.props.value});
    const fallbackCC =
      this.props.code == '' ? '91' : this.props.code.replace('+', '');
    this.setState({callingCode: fallbackCC});
  }
  componentDidUpdate(nextProps: phoneTextInputProps) {
    if (this.props.value != nextProps.value) {
      this.setState({phoneNumber: this.props.value});
    }
    if (this.props.code != nextProps.code) {
      const fallbackCC =
        this.props.code == '' ? '91' : this.props.code.replace('+', '');
      this.setState({callingCode: fallbackCC});
    }
  }
  returnTextHander = () => {
    this.props.onChangeText(
      '+' + this.state.callingCode + '-' + this.state.phoneNumber,
    );
  };
  changeTextHander = (value) => {
    this.setState({phoneNumber: value}, () => {
      this.returnTextHander();
    });
  };
  endEditingHandler = (event) => {
    this.props.onEndEditing && this.props.onEndEditing(event);
  };
  onSelect = (country) => {
    this.setState({callingCode: country.callingCode[0]}, () => {
      this.returnTextHander();
    });
  };
  setHideModel = () => {
    this.setState({modalVisible: false});
  };
  setShowModel = () => {
    this.setState({modalVisible: true});
  };
  verifyHandler = () => {
    this.props.verifyHander();
  };
  render() {
    const {
      label,
      placeholder,
      required,
      leftIcon,
      errorText,
      iconProps,
      phonecode,
      verification,
      verified,
    } = this.props;
    return (
      <View>
        <View style={styles.textContainer}>
          <CustTextInput
            label={label}
            required={required}
            placeholder={placeholder}
            errorText={errorText}
            leftIcon={leftIcon}
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            keyboardType="number-pad"
            iconProps={iconProps}
            verification={verification}
            verified={verified}
            value={this.state.phoneNumber}
            verifyHander={this.verifyHandler}
            onChangeText={this.changeTextHander}
            onEndEditing={this.endEditingHandler}
            textPaddingLeft={this.state.callingCode.length * 10 + 25}
          />
        </View>
        <View
          style={[styles.callingMasterContainer, {left: leftIcon ? 40 : 0}]}>
          {phonecode && (
            <CountryModalProvider>
              <View style={styles.callingCodeContainer}>
                <TouchableOpacity onPress={this.setShowModel}>
                  <CountryPicker
                    countryCode="IN"
                    onSelect={this.onSelect}
                    withFilter
                    withCallingCode
                    withFlagButton={false}
                    withEmoji
                    withCallingCodeButton={false}
                    withFlag
                    visible={this.state.modalVisible}
                    disableNativeModal={false}
                    onClose={this.setHideModel}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      alignContent: 'center',
                    }}>
                    <Text style={styles.callingCode}>
                      +{this.state.callingCode}
                    </Text>
                    <CustIcon
                      type="entypo"
                      name="triangle-down"
                      size={18}
                      color={Colors.dropDownIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </CountryModalProvider>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {zIndex: 1},
  callingMasterContainer: {
    position: 'absolute',
    top: 25,
    zIndex: 2,
  },
  callingCodeContainer: {},
  callingCode: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.dropDownIcon,
  },
});

export default PhoneNumber;
