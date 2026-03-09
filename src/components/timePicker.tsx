import React, {FC, useState, useEffect} from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {CustIcon, CustSearchInput} from '.';
import {boxModelSize, Colors, commonStyles, Fonts} from '../styles';
import {scale} from 'react-native-size-matters';
import moment from 'moment';
import {DateAndTimePicker} from '../components';

interface TimePickerProps {
  defaultValue?: any;
  callback?: (res) => void;
}

export function TimePicker(props: TimePickerProps) {
  const [timeText, setTimeText] = useState(null);

  useEffect(() => {
    setTimeText(props.defaultValue);
    return () => {};
  }, [props.defaultValue]);

  function _onPress(val) {
    if (val == 'now') {
      let dateFormat = moment().format('DD/MM/YYYY H:mm');
      setTimeText(dateFormat);
      props.callback(dateFormat);
    } else {
      setTimeText('');
      props.callback('');
    }
  }

  return (
    <View style={{flexDirection: 'column'}}>
      <DateAndTimePicker
        label={'Time'}
        placeholder="Choose a time"
        required={false}
        onChangeText={(value) => setTimeText(value)}
        errorText={null}
        mode="time"
        display="spinner"
        value={timeText}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.option}></View>

        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed ? Colors.borderGrey : Colors.white,
            },
            styles.option,
            styles.buttonStyle,
            styles.boxShadow,
          ]}
          onPress={() => {
            _onPress('now');
          }}>
          <Text style={styles.buttonTextStyle}>{'Now'}</Text>
        </Pressable>
        <View style={{width: 10}}></View>
        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed ? Colors.borderGrey : Colors.white,
            },
            styles.option,
            styles.buttonStyle,
            styles.boxShadow,
          ]}
          onPress={() => {
            _onPress('clear');
          }}>
          <Text style={styles.buttonTextStyle}>{'Clear'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: scale(15),
  },
  buttonTextStyle: {
    color: Colors.bodyTextGrey,
    fontFamily: Fonts.primaryRegular,
    fontSize: scale(14),
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
    height: scale(40),
    borderRadius: scale(45),
  },
  labelStyle: {
    width: scale(80.0),
    textAlignVertical: 'center',
    color: Colors.primary,
    fontFamily: Fonts.primarySemiBold,
    fontSize: scale(18),
  },
  labelStyleClear: {
    width: scale(80.0),
    textAlignVertical: 'center',
    color: Colors.borderGrey,
    fontFamily: Fonts.primarySemiBold,
    fontSize: scale(18),
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

export default TimePicker;
