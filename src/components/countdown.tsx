import React, {FC, useState, useEffect} from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {boxModelSize, Colors, commonStyles, Fonts} from '../styles';
import {scale} from 'react-native-size-matters';
import {useTimer, useStopwatch} from 'react-timer-hook';

interface CountdownProps {
  initVal: any;
  defaultValue?: any;
  callback?: (res) => void;
}

export function Countdown(props: CountdownProps) {
  const [timeText, setTimeText] = useState(null);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({autoStart: false});

  useEffect(() => {
    setTimeText(props.defaultValue ? props.defaultValue : props.initVal);
    return () => {};
  }, [props.defaultValue, props.initVal]);

  useEffect(() => {
    
    var tText  = (props.initVal - ((minutes * 60) + seconds)).toString();
    setTimeText(tText);
    
    return () => {
    }
  }, [seconds, minutes])

  function _onPress(val) {
    if (val == 'start') {
      //Start timer
      onButtonStart();
    } else if (val == 'stop') {
      //Stop timer
      onButtonStop();
      //props.callback(timeText);
    } else {
      reset();
      //props.callback(null);
    }
  }

  const onButtonStart = () => {
    start();
  };

  const onButtonStop = () => {
    pause();
  };

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection:'row', justifyContent:"center"}}>
        <Text style={{padding: 10.0, color: 'black',  fontSize: 20, fontWeight:'bold'}}>{timeText}</Text>
      </View>
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
            if (isRunning == false) {
              _onPress('start');
            } else {
              _onPress('stop');
            }
          }}>
          <Text style={styles.buttonTextStyle}>
            {isRunning ? 'Stop' : 'Start'}
          </Text>
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
            _onPress('reset');
          }}>
          <Text style={styles.buttonTextStyle}>{'Reset'}</Text>
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

export default Countdown;
