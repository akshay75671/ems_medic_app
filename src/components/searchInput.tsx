import React, {PureComponent} from 'react';
import {Colors, commonStyles, Fonts, fontSize, boxModel, boxModelSize} from '../styles';
import {TextInput, View, StyleSheet, Text} from 'react-native';
import {custTextInputProps} from '../types/componentsTypes';
import CustIcon from './icon';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {scale} from 'react-native-size-matters';

interface custSearchInputState {}
class CustSearchInput extends PureComponent<
  custTextInputProps,
  custSearchInputState
> {
  customInput: React.RefObject<TextInput>;
  constructor(props) {
    super(props);
    this.customInput = React.createRef();
  }

  setInputFoucs = () => {
    this.customInput.current.focus();
  };
  render() {
    const {leftIcon, iconProps, onClear} = this.props;
    return (
      <View style={{marginTop: boxModelSize.m, marginBottom: boxModelSize.m}}>
        <View
          style={[
            styles.containerDefault,
            {
              borderColor: this.props.errorText
                ? Colors.inputErrorBorder
                : Colors.borderGrey,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10.0,
            }}>
            <View>{leftIcon && <CustIcon {...iconProps} />}</View>

            <View style={{flex: 1}}>
              <TextInput
                ref={this.customInput}
                {...this.props}
                selectTextOnFocus={true}
                placeholderTextColor={Colors.placeholderGrey}
              />
            </View>
            <TouchableOpacity
              style={styles.closeButtonParent}
              onPress={onClear}>
              <CustIcon
                type="ionicon"
                name="close-circle"
                size={scale(25)}
                color={Colors.iconGrey}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.errorTextContainer}>
          {this.props.errorText && (
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
    flex: 1,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    textAlignVertical: 'bottom',
    zIndex: 1,
  },
  containerDefault: {
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    height: 45.0,
    justifyContent: 'center',
  },
  errorTextContainer: {
    //height: 20,
  },
  errorText: {
    paddingLeft: 25,
  },
  closeButtonParent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustSearchInput;