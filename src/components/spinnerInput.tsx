import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import {Colors, Fonts, fontSize} from '../styles';

interface buttonProps {
  label: string;
  onSelect: (selected: any) => void;
}
const CustSpinnerInput: FC = () => {
  const onChange = (key) => {
    this.setState({
      selectedValue: key,
    });
  };
  return (
    <View>
      {this.props.spinnerValues.map((res) => {
        return (
          <View key={res.key} style={styles.container}>
            <Text style={styles.text}>{res.text}</Text>
            <Text>
              <InputSpinner
                // max={10}
                rounded={false}
                min={0}
                step={1}
                color={'transparent'}
                buttonTextColor={'#000'}
                inputStyle={{
                  borderWidth: 1,
                  borderColor: '#20232a',
                  borderRadius: 6,
                }}
                onChange={(num) => {
                  this.setState({
                    selectedValue: num,
                  });
                }}
              />
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '90%',
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.primary,
    marginLeft: 5,
    width: '55%',
  },
  label: {
    fontFamily: Fonts.primaryMedium,
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 15,
  },
});

export default CustSpinnerInput;
