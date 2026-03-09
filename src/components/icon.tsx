import React from 'react';
import getIconType from './getIconType';
import {StyleSheet, View} from 'react-native';
import {custIconProps} from '../types/componentsTypes';

const CustIcon = ({...props}: Partial<custIconProps>) => {
  const {
    type,
    name,
    size,
    color,
    raised,
    containerStyle,
    ...attributes
  } = props;
  const IconComponent = getIconType(type);
  return (
    <View style={containerStyle}>
      <IconComponent testID="iconIcon" size={size} name={name} color={color} />
    </View>
  );
};

CustIcon.defaultProps = {
  color: '#ccc',
  raised: false,
  size: 24,
  type: 'material',
};

export default CustIcon;
