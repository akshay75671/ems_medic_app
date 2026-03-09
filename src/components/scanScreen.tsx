import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {Colors, Fonts, fontSize} from '../styles';

interface propsTypes {
  scanDone: (value) => void;
}

const ScanScreen: FC<propsTypes> = (props) => {
  const onSuccess = (e) => {
    props.scanDone(e.data);
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      // topContent={
      //   <View style={{width: '70%', backgroundColor: 'yellow'}}>
      //     <Text style={styles.centerText}>Scan the QR Code</Text>
      //   </View>
      // }
      // bottomContent={
      //   <View style={{}}>
      //     <Text style={styles.bottomText}>
      //       You'll be redirected if the QR code is Valid!
      //     </Text>
      //   </View>
      // }
      cameraStyle={{alignSelf: 'center', width: '100%'}}
    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    fontSize: fontSize.h4,
    fontFamily: Fonts.primaryRegular,
    color: Colors.white,
    textAlign: 'center',
  },
  bottomText: {
    fontSize: fontSize.h5,
    color: Colors.primary,
    fontFamily: Fonts.primaryRegular,
    textAlign: 'center',
  },
});

export default ScanScreen;
