import React, {FC, useState, useEffect} from 'react';
import {
  I18nManager,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Constants from '../core/constants';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';
import CustButton from './button';
import CustIcon from './icon';

interface otpInputProps {
  info: string;
  error: string;
  onSubmit: (value: string) => void;
  onResend: () => void;
  onClose: () => void;
  clearError: () => void;
}

const OTPInput: FC<otpInputProps> = (props) => {
  const [enteredValues, setEnteredValues] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    if (enteredValues.length == 4) props.onSubmit(enteredValues.join(''));
    props.error != error ? setError(props.error) : setError('');
  }, [enteredValues, props.error]);
  const renderTextFields = () => {
    const array = new Array(4).fill(0);
    return array.map(renderOneInputField);
  };
  const numButtonPressed = (num: string) => {
    if (enteredValues.length != 4) {
      setEnteredValues((values) => [...values, num]);
    }
  };
  const backSpacePressed = () => {
    props.clearError();
    if (enteredValues.length != 0) {
      setEnteredValues(enteredValues.splice(0, enteredValues.length - 1));
    }
  };
  const closeWindow = () => {
    setEnteredValues([]);
    props.onClose();
  };
  const renderOneInputField = (_, index) => {
    return (
      <View pointerEvents="none" key={index + 'view'}>
        <TextInput
          style={styles.otpTextInput}
          underlineColorAndroid="rgba(0,0,0,0)"
          value={enteredValues[index] ? enteredValues[index].toString() : ''}
          textContentType="oneTimeCode"
        />
      </View>
    );
  };
  const resendHandler = () => {
    setEnteredValues([]);
    props.onResend();
  };
  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.otpInputContainer}>
        <View style={commonStyles.topBGContainer}>
          <View style={commonStyles.bgImageContainer}>
            <Image
              style={commonStyles.bgImage}
              source={Constants.BACKGROUND_IMAGE}
            />
          </View>
        </View>
        <View style={commonStyles.bottomBGContainer}></View>
        <View style={commonStyles.masterContainer}>
          <View style={[styles.container, commonStyles.containerSpacing]}>
            <View style={styles.headerContainer}></View>
            <View style={styles.contentContainer}>
              <View style={{alignSelf: 'flex-end'}}>
                <TouchableOpacity onPress={closeWindow}>
                  <CustIcon
                    type="font-awesome"
                    name="close"
                    size={20}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingLeft: boxModelSize.xxl,
                  paddingRight: boxModelSize.xxl,
                }}>
                <Text
                  style={[
                    commonStyles.whiteBoxTitle,
                    {
                      textAlign: 'center',
                      marginTop: boxModelSize.m,
                      marginBottom: boxModelSize.m,
                    },
                  ]}>
                  OTP Verification
                </Text>
                <View>
                  <Text
                    style={[
                      commonStyles.defaultBodyText,
                      {textAlign: 'center'},
                    ]}>
                    Please type the verification code sent to {props.info}
                  </Text>
                </View>
                <View style={styles.numpadContainer}>{renderTextFields()}</View>
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: boxModelSize.l,
                  }}>
                  <Text style={commonStyles.defaultErrorText}>{error}</Text>
                </View>
                <View>
                  <CustButton title="Resend" onPress={resendHandler} />
                </View>
                <View style={[styles.numpadContainer, {flexWrap: 'wrap'}]}>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '1')}>
                    <Text style={styles.numButtonText}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '2')}>
                    <Text style={styles.numButtonText}>2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '3')}>
                    <Text style={styles.numButtonText}>3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '4')}>
                    <Text style={styles.numButtonText}>4</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '5')}>
                    <Text style={styles.numButtonText}>5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '6')}>
                    <Text style={styles.numButtonText}>6</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '7')}>
                    <Text style={styles.numButtonText}>7</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '8')}>
                    <Text style={styles.numButtonText}>8</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '9')}>
                    <Text style={styles.numButtonText}>9</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.numButton}>
                    <Text style={styles.numButtonText}> </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={numButtonPressed.bind(this, '0')}>
                    <Text style={styles.numButtonText}>0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.numButton}
                    onPress={backSpacePressed}>
                    <CustIcon
                      type="ionicon"
                      name="backspace-outline"
                      color={Colors.bodyTextGrey}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  otpInputContainer: {
    zIndex: 2000,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryBackgroundColor,
  },
  container: {flex: 1},
  headerContainer: {
    flex: 0.15,
  },
  contentContainer: {
    flex: 0.85,
    backgroundColor: Colors.white,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    padding: boxModelSize.m,
    zIndex: 1,
  },
  otpTextInput: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: scale(5),
    textAlign: 'center',
    width: scale(40),
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h5,
    backgroundColor: 'white',
    elevation: 10,
  },
  numButton: {
    borderWidth: 0.5,
    borderColor: Colors.borderGrey,
    width: '30%',
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignItems: 'center',
    elevation: 5,
    backgroundColor: Colors.white,
    borderRadius: scale(10),
    marginBottom: scale(25),
  },
  numpadContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: boxModelSize.xl,
    marginBottom: boxModelSize.xl,
  },
  numButtonText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h5,
  },
});

export default OTPInput;
