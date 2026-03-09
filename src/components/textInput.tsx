import React, { PureComponent } from 'react';
import { boxModelSize, Colors, commonStyles, Fonts, fontSize } from '../styles';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { custTextInputProps, custTextInputState } from '../types/componentsTypes';
import CustIcon from './icon';
import { scale } from 'react-native-size-matters';

class CustTextInput extends PureComponent<
  custTextInputProps,
  custTextInputState
  > {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  verifyHandler = () => {
    this.props.verifyHander && this.props.verifyHander();
  };
  render() {
    const {
      leftIcon,
      iconProps,
      errorText,
      label,
      required,
      verification,
      verified,
      dropIcon,
      info,
      autoCompleteType,
      textContentType,
      keyboardType,
    } = this.props;
    return (
      <View
        style={[
          leftIcon && styles.withIconContainer,
          { marginBottom: boxModelSize.m },
        ]}>
        {leftIcon && (
          <View style={styles.wiTxtIcon}>
            <CustIcon {...iconProps} />
          </View>
        )}
        <View style={leftIcon && styles.wiTxtInput}>
          {label && (
            <View style={required && styles.requiredLabel}>
              <Text style={styles.labelDefault}>{label}</Text>
              {required && (
                <Text
                  style={[styles.labelDefault, commonStyles.defaultErrorText]}>
                  *
                </Text>
              )}
            </View>
          )}
          <TextInput
            style={[
              styles.default,
              {
                borderBottomColor: this.props.errorText
                  ? Colors.inputErrorBorder
                  : Colors.borderGrey,
              },
              { paddingLeft: this.props.textPaddingLeft },
              {
                height: this.props.multiline && scale(65),
              },
              {height: this.props.height},
            ]}
            {...this.props}
            placeholderTextColor={Colors.placeholderGrey}
            multiline={this.props.multiline}
            numberOfLines={this.props.numberOfLines}
            textAlignVertical={'center'}
            autoCompleteType={autoCompleteType || 'off'}
            textContentType={textContentType || 'none'}
            keyboardType={keyboardType || 'default'}
          />
          {dropIcon && (
            <View style={styles.dropDownIcon}>
              <CustIcon
                type="entypo"
                name="triangle-down"
                size={18}
                color={Colors.dropDownIcon}
              />
            </View>
          )}
          {errorText != null && (
            <View style={styles.errorAndVerification}>
              <View style={styles.errorTextContainer}>
                {this.props.errorText != '' && (
                  <Animatable.Text
                    animation="shake"
                    style={StyleSheet.flatten([
                      commonStyles.defaultErrorText,
                      styles.errorText,
                    ])}>
                    {errorText}
                  </Animatable.Text>
                )}
              </View>
              {verification && (
                <View style={styles.iconVerification}>
                  {verified && (
                    <CustIcon
                      name="checkmark-circle"
                      type="ionicon"
                      size={14}
                      color={Colors.green}
                    />
                  )}
                  {verified && (
                    <Text
                      style={[
                        commonStyles.defaultErrorText,
                        { color: Colors.green },
                      ]}>
                      Verified
                    </Text>
                  )}
                  {!verified && (
                    <TouchableOpacity onPress={this.verifyHandler}>
                      <Text
                        style={[
                          commonStyles.defaultErrorText,
                          {
                            color: Colors.linkBlue,
                            textDecorationLine: 'underline',
                          },
                        ]}>
                        Verify
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {info && (
                <View style={styles.iconVerification}>
                  <Text
                    style={[
                      commonStyles.defaultErrorText,
                      { color: Colors.iconGrey },
                    ]}>
                    {info}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    textAlignVertical: 'bottom',
    borderBottomWidth: 1,
    padding: 0,
    margin: 0,
    height: 25,
  },
  labelDefault: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: fontSize.h6,
  },
  requiredLabel: {
    flexDirection: 'row',
  },
  errorAndVerification: {
    flexDirection: 'row',
    height: 20,
  },
  errorTextContainer: {
    //height: 20,
    flex: 1,
  },
  iconVerification: {
    flexDirection: 'row',
    flex: 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dropDownIcon: {
    position: 'absolute',
    right: 0,
    bottom: 30,
  },
  errorText: {
    //flex: 0.7,
  },
  withIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  wiTxtIcon: { width: 35, alignItems: 'flex-start' },
  wiTxtInput: { flex: 1 },
});

export default CustTextInput;
