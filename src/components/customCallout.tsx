import React from 'react';
import {Callout} from 'react-native-maps';
import {View, Image, Text, ImageSourcePropType, StyleSheet} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {MarkerProp} from '../types/componentsTypes';

import {CustIcon} from './../components';
import {Colors, commonStyles, Fonts, fontSize} from '../styles';

interface Props {
  label: string;
  toolTipText: string;
  onPress?: (marker) => void;
}

export default function CustCallout({label, toolTipText, onPress}: Props) {
  return (
    <Callout tooltip={true} onPress={onPress}>
      <View style={{padding: 10.0}}>
        <View
          style={{
            backgroundColor: 'white',
            width: 15,
            height: 15,
            bottom: 5,
            alignSelf: 'center',
            transform: [{rotate: '45deg'}],
            position: 'absolute',
          }}></View>
        <View
          style={{
            flex: 1,
            marginBottom: 0.0,
            padding: 10.0,
            width: 150.0,
            borderRadius: 10.0,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: onPress ? 'space-between' : 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1.0}}>
            <Text style={[styles.label, {textAlign: onPress? 'left':'center'}]}>{label} </Text>
          </View>

          {onPress ? (
            <CustIcon
              type='material'
              name="directions"
              size={25}
              color={Colors.linkBlue}
            />
          ) : null}
        </View>
      </View>
    </Callout>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.primary,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
  }
});
