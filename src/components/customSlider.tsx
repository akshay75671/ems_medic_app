import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';

type itemProps = {
  value: any;
  selected: any;
};

const Item: FC<itemProps> = (props) => {
  const checkActive = () => {
    if (props.value == props.selected) return true;
    else return false;
  };

  return (
    <View>
      <Text
        style={[
          checkActive() ? styles.active : styles.inactive,
          {width: 30, position: 'absolute', alignSelf: 'center', bottom: 15},
        ]}>
        {props.value}
      </Text>
      <Text
        style={[
          checkActive() ? styles.activeLine : styles.inactiveLine,
        ]}>
        {'|'}
      </Text>
    </View>
  );
};

type sliderProps = {
  min: any;
  max: any;
  selected: any;
  LRpadding: any;
  styles: any;
  onValueChange?: (val) => void;
};

const CustomSlider: FC<sliderProps> = (props) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(props.selected);

    return () => {};
  }, [props.selected]);

  const onSliderValuesChange = (value) => {
    setSelected(value);
  };

  const onSlidingComplete = (value) => {
    setSelected(value);
    props.onValueChange(value);
  };

  

  const renderScale = () => {
    const items = [];
    for (let i = props.min; i <= props.max; i++) {
      items.push(<Item key={'s_val_' + i} value={i} selected={selected} />);
    }
    return items;
  };

  return (
    <View style={{...props.styles}}>
      <View
        style={[
          styles.column,
          {
            marginLeft: props.LRpadding,
            marginRight: props.LRpadding,
          },
        ]}>
        {renderScale()}
      </View>
      <View style={styles.container}>
        <Slider
          disabled={false}
          style={{
            width: '100%',
            height: 25,
          }}
          value={selected}
          minimumValue={props.min}
          maximumValue={props.max}
          step={1}
          onSlidingComplete={onSlidingComplete}
          onValueChange={onSliderValuesChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    bottom: -10,
  },
  active: {
    textAlign: 'center',
    fontSize: 20,
    color: '#5e5e5e',
    fontWeight: 'bold',
  },
  inactive: {
    textAlign: 'center',
    fontWeight: 'normal',
    color: '#bdc3c7',
  },
  activeLine: {
    textAlign: 'center',
    color: '#5e5e5e',
    fontSize: 10,
  },
  inactiveLine: {
    textAlign: 'center',
    color: '#bdc3c7',
    fontSize: 8,
  },
});

export default CustomSlider;
