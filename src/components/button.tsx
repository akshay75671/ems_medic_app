import React, {FC, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts, Colors, fontSize, commonStyles, boxModelSize} from '../styles';
import CustIcon from './icon';
import {buttonProp} from '../types/componentsTypes';
import {scale, verticalScale} from 'react-native-size-matters';

const CustButton: FC<buttonProp> = (props) => {
  const {
    title,
    type,
    size,
    iconProps,
    hightlight,
    onPress,
    style,
    disabled,
  } = props;
  const [imgSrc, setImgSrc] = useState(
    require('../assets/images/main_menu_BG.png'),
  );
  useEffect(() => {
    setImgSrc(
      hightlight
        ? require('../assets/images/main_menu_selected_BG.png')
        : require('../assets/images/main_menu_BG.png'),
    );
  }, [hightlight]);
  if (type == 'main') {
    return (
      <Pressable onPress={onPress}>
        <ImageBackground
          source={imgSrc}
          style={{
            height: verticalScale(size),
            width: scale(size),
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            ...style,
          }}
          imageStyle={{resizeMode: 'stretch'}}>
          <View
            style={[
              styles.mainMenuButtonContainer,
              {
                height: verticalScale(size - size / 8),
                width: scale(size - size / 10),
              },
            ]}>
            <CustIcon {...iconProps} />
            {title && (
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  commonStyles.defaultBodyText,
                  {
                    fontSize: fontSize.mainMenuButtonText,
                    marginTop: boxModelSize.s,
                    color: hightlight ? Colors.white : Colors.bodyTextGrey,
                  },
                ]}>
                {title}
              </Text>
            )}
          </View>
        </ImageBackground>
      </Pressable>
    );
  }
  if (type == 'gradient') {
    return (
      <TouchableOpacity style={{padding: 0, margin: 0}} onPress={onPress}>
        <View style={styles.gradientContainer}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.gradientInnerContainer, commonStyles.whiteBoxShadow]}
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}>
            <CustIcon {...iconProps} />
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }
  if (type == 'dashed') {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.dashedContainer}>
          <View style={styles.dashedInnerContainer}>
            <Text style={styles.dashedTitle}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: disabled ? Colors.iconGrey : Colors.linkBlue,
          },
        ]}>
        <Text
          style={[
            styles.buttonTitle,
            {
              color: disabled ? Colors.borderGrey : Colors.white,
            },
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gradientInnerContainer: {
    borderColor: Colors.secondary,
    height: scale(50),
    width: scale(50),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h5,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
    height: scale(35),
    borderRadius: 5,
  },
  dashedContainer: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderStyle: 'dashed',
    borderRadius: scale(1),
    padding: scale(5),
  },
  dashedInnerContainer: {
    backgroundColor: Colors.lightGrey,
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedTitle: {
    textAlign: 'center',
    color: Colors.bodyTextGrey,
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
  },
  mainMenuButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: boxModelSize.m,
  },
});

export default CustButton;
