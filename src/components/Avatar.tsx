import React, {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import Constants from '../core/constants';
import {getProfileStateColor} from '../core/utils';

interface AvatarProps {
  size: number;
  style?: any;
  source: string;
  status?: string;
}
const Avatar: FC<AvatarProps> = (props) => {
  const {size, style, source, status} = props;
  return (
    <View
      style={{
        width: scale(size),
        height: scale(size),
        alignItems: 'center',
      }}>
      <View
        style={[
          styles.profilePic,
          style,
          {
            width: scale(size),
            height: scale(size),
            borderColor: status ? getProfileStateColor(status) : '#fff',
          },
        ]}>
        <Image
          style={{width: '100%', height: '100%'}}
          source={source ? {uri: source} : Constants.DUMMY_PROFILE_PIC}
        />
      </View>
      {status && (
        <View
          style={[
            styles.availableState,
            {
              width: scale(size / 3),
              height: scale(size / 3),
              right: scale(0),
              backgroundColor: getProfileStateColor(status),
            },
          ]}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    borderRadius: scale(100),
    overflow: 'hidden',
    borderWidth: scale(2),
  },
  availableState: {
    borderRadius: scale(30),
    position: 'absolute',
    bottom: 0,
  },
});

export default Avatar;
