import React, {PureComponent} from 'react';
import {Colors, commonStyles, Fonts, fontSize, boxModel} from '../styles';
import {TextInput, View, StyleSheet, Text, Platform} from 'react-native';
import {custAuthInputProps} from '../types/componentsTypes';
import CustIcon from './icon';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

interface custAuthInputState {
  secureText: boolean;
}
class CustAuthInput extends PureComponent<
  custAuthInputProps,
  custAuthInputState
> {
  customInput: React.RefObject<TextInput>;
  constructor(props) {
    super(props);
    this.customInput = React.createRef();
    this.state = {
      secureText: this.props.secureTextEntry,
    };
  }
  enableSecureText = () => {
    this.setState({secureText: !this.state.secureText});
  };
  setInputFoucs = () => {
    this.customInput.current.focus();
  };
  render() {
    const {leftIcon, iconProps, showHidePassword} = this.props;
    return (
      <View style={{marginBottom: 10}}>
        <View
          style={[
            styles.containerDefault,
            {
              borderColor: this.props.errorText
                ? Colors.inputErrorBorder
                : Colors.borderGrey,
            },
          ]}>
          <View style={leftIcon && styles.withIconContainer}>
            {leftIcon && (
              <View style={styles.wiTxtIcon}>
                <CustIcon {...iconProps} />
              </View>
            )}
            <View style={leftIcon ? styles.wiTxtInput : styles.woTxtInput}>
              {this.props.showHidePassword && (
                <View style={styles.eyeContainer}>
                  <TouchableOpacity onPress={this.enableSecureText}>
                    <CustIcon
                      type="font-awesome"
                      name={this.state.secureText ? 'eye' : 'eye-slash'}
                      size={22}
                      color={Colors.iconGrey}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <TextInput
                ref={this.customInput}
                style={[
                  styles.default,
                  showHidePassword &&
                    boxModel({type: 'padding', size: 'xxxl', places: 'r'}),
                ]}
                {...this.props}
                secureTextEntry={this.state.secureText}
                placeholderTextColor={Colors.placeholderGrey}
              />
            </View>
          </View>
        </View>
        <View style={styles.errorTextContainer}>
          {this.props.errorText.length > 0 && (
            <Animatable.Text
              animation="shake"
              style={StyleSheet.flatten([
                commonStyles.defaultErrorText,
                styles.errorText,
              ])}>
              {this.props.errorText}
            </Animatable.Text>
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
    zIndex: 1,
    paddingRight: 10,
  },
  containerDefault: {
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: Platform.OS ==='ios' ? scale(9) : null
  },
  iconContainer: {
    position: 'absolute',
  },
  errorTextContainer: {
    //height: 20,
  },
  errorText: {
    paddingLeft: 25,
  },
  withIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wiTxtIcon: {flex: 0.15, alignItems: 'flex-end'},
  wiTxtInput: {flex: 0.85},
  woTxtInput: {paddingLeft: 15},
  eyeContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 2,
    paddingVertical: Platform.OS ==='android' ? scale(8) : null
  },
});

export default CustAuthInput;
