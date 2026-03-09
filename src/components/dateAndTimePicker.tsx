import React, {
  FC,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import {TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustTextInput from './textInput';
import {
  dateAndTimePickerProps,
  dateAndTimePickerState,
} from '../types/componentsTypes';
import {Colors} from '../styles';
import Constants from '../core/constants';

const DateAndTimePicker: FC<dateAndTimePickerProps> = (props) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (props.value != '' && props.value != null) {
      setDateState();
    } else {
      setSelectedDate('');
      setDate(null);
    }

    return () => {};
  }, [props.value]);

  const setDateState = () => {
    if (props.value == null) return;

    setSelectedDate(props.value);

    let df = 'DD/MM/YYYY';
    if (props.mode == 'time') {
      df = 'DD/MM/YYYY H:mm';
    }
    let dateObj: any = moment(props.value, df);
    let dateFormat = new Date(dateObj);
    setDate(dateFormat);
  };

  const dateFormat = (event, val) => {
    setShow(false);

    if (!val) {
      props.onChangeText(selectedDate);
      return;
    }

    setDate(val);

    let dateString =
      val.getDate() + '/' + (val.getMonth() + 1) + '/' + val.getFullYear();

    if (props.mode == 'time') {
      dateString =
        dateString +
        ' ' +
        val.getHours() +
        ':' +
        (val.getMinutes() < 10 ? '0' + val.getMinutes() : val.getMinutes());
    }

    setSelectedDate(dateString);
    props.onChangeText(dateString);
  };

  const dateTimePickerOpen = () => {
    setShow(true);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={dateTimePickerOpen}
        style={{padding: 0, margin: 0}}>
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 1,
          }}></View>
        <CustTextInput
          label={props.label}
          required={props.required}
          placeholder={props.placeholder}
          value={selectedDate}
          caretHidden={true}
          dropIcon={true}
          showSoftInputOnFocus={false}
          errorText={props.errorText}
          leftIcon={props.leftIcon}
          iconProps={{
            type: 'font-awesome',
            name: 'calendar',
            size: 27,
            color: Colors.iconGrey,
          }}
          info={props.info}
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || new Date()}
          mode={props.mode != null ? props.mode : 'date'}
          is24Hour={false}
          display={props.display != null ? props.display : 'spinner'}
          onChange={dateFormat}
          maximumDate={props.maximumDate || null}
        />
      )}
    </View>
  );
};

export default DateAndTimePicker;
