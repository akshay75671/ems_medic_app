import React from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Constants from '../core/constants';
import {scale} from 'react-native-size-matters';
import {Colors, Fonts} from '../styles';
import CustIcon from './icon';

interface IDCardProps {
  onClose?: () => void;
}

const IDCard = ({onClose}: IDCardProps) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          padding: 20.0,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.label}>Identity Card</Text>
        <TouchableOpacity style={{padding: 5.0}} onPress={onClose}>
          <CustIcon name="close" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View>
        <View style={styles.profilePic}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={Constants.ID_CARD}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    overflow: 'hidden',
    minHeight: scale(160),
    backgroundColor: Colors.white,
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.primary,
    fontSize: scale(16),
  },
  profilePic: {
    borderRadius: scale(20),
    overflow: 'hidden',
    height: scale(180),
    paddingLeft: 20.0,
    paddingRight: 20.0,
    paddingBottom: 20.0,
  },
});

export default IDCard;
