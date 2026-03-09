import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';

interface buttonState {
  isSelected: boolean;
  selectedValue: string;
}
interface radioValue {
  key: string;
  text: string;
}
interface buttonProps {
  isSelected: boolean;
  radioValues: radioValue[];
  label: string;
  required: boolean;
  errorText: Object;
  onSelect: (selected: any) => void;
}
class CustRadioButton extends Component<buttonProps, buttonState> {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      selectedValue: '',
    };
  }
  componentDidMount() {
    this.setState({isSelected: this.props.isSelected});
  }
  componentDidUpdate(nextProps: buttonProps) {
    if (this.props.isSelected != nextProps.isSelected)
      this.setState({isSelected: this.props.isSelected});
  }
  onChange = (key) => {
    this.setState({isSelected: true}, () => {
      this.props.onSelect(key);
    });
  };
  render() {
    return (
      <View>
        {this.props.label && (
          <View style={this.props.required && styles.requiredLabel}>
            <Text style={styles.labelDefault}>{this.props.label}</Text>
            {this.props.required && (
              <Text
                style={[styles.labelDefault, commonStyles.defaultErrorText]}>
                *
              </Text>
            )}
          </View>
        )}
        <View style={styles.errorAndVerification}>
          <View style={styles.errorTextContainer}>
            {this.props.errorText != '' && !this.state.isSelected && (
              <Animatable.Text
                animation="shake"
                style={StyleSheet.flatten([commonStyles.defaultErrorText])}>
                {this.props.errorText}
              </Animatable.Text>
            )}
          </View>
        </View>
        {this.props.radioValues.map((res) => {
          return (
            <View key={res.key} style={styles.container}>
              <Text style={styles.radioText}>{res.text}</Text>
              <TouchableOpacity
                style={styles.radioCircle}
                onPress={() => {
                  this.onChange(res.key);
                  this.setState({
                    selectedValue: res.key,
                  });
                }}>
                {this.state.selectedValue === res.key && (
                  <View style={styles.selectedRb} />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // width: '90%',
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioText: {
    marginRight: 35,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.primary,
    width: '80%',
  },
  labelDefault: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: fontSize.h6,
  },
  radioCircle: {
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: Colors.primary,
  },
  label: {
    fontFamily: Fonts.primaryMedium,
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 15,
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
});

export default CustRadioButton;
