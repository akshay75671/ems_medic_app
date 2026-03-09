import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {scale} from 'react-native-size-matters';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';
import Avatar from './Avatar';

interface EPCRCardProps {
  id?: string;
  epcrNumber?: number;
  name?: string;
  gender?: string;
  age?: string;
  desc?: string;
  pic?: undefined;
  onTapInfo?: (index) => void;
  displayType: 'whiteBox' | 'profileRound';
}

export default function EPCRCard({
  id,
  epcrNumber,
  name,
  gender,
  age,
  desc,
  pic,
  displayType,
  onTapInfo,
}: EPCRCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onTapInfo(id)}>
      {displayType == 'whiteBox' && (
        <View style={[styles.container, commonStyles.whiteBoxShadow]}>
          <View style={styles.sectionOneContainer}>
            <Avatar size={scale(50)} source={pic} />
          </View>
          <View style={styles.sectionTwoContainer}>
            <Text style={styles.ePCRNumber}>EPCR{' ' + epcrNumber}</Text>
            <Text style={styles.name}>{name}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>{gender + ', '}</Text>
              <Text style={styles.label}>{age + ' Yrs'}</Text>
            </View>
            <View style={{width: '95%'}}>
              <Text style={styles.description}>{desc}</Text>
            </View>
          </View>
        </View>
      )}
      {displayType == 'profileRound' && (
        <View style={styles.profileContainer}>
          <Avatar size={scale(50)} source={pic} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: boxModelSize.s,
    borderRadius: scale(10),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: 'center',
    marginBottom: scale(10),
  },
  ePCRNumber: {
    fontFamily: Fonts.primaryBold,
    fontSize: scale(8),
    color: Colors.linkBlue,
    marginTop: scale(5),
  },
  name: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.default,
    color: Colors.black,
  },
  label: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.black,
    fontSize: scale(9),
    marginTop: scale(-5),
  },
  description: {
    fontFamily: Fonts.primaryItalic,
    color: Colors.black,
    fontSize: scale(7),
    marginTop: scale(2.0),
  },
  sectionOneContainer: {
    justifyContent: 'center',
    padding: boxModelSize.s,
  },
  sectionTwoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  profileContainer: {
    alignItems: 'center',
  },
});
