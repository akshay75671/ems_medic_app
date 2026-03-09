import React, {FC, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import SignatureCapture from 'react-native-signature-capture';
import Constants from '../core/constants';
import {boxModelSize, Colors, commonStyles} from '../styles';
import Storage from '@react-native-firebase/storage';
import CustButton from './button';
import CustIcon from './icon';
import ProgressBar from './progressBar';

interface signatureProps {
  onClose: () => void;
  onSave: () => void;
  filePath: string;
  fileName: string;
}
const CustSignature: FC<signatureProps> = (props) => {
  const [signature, setSignature] = useState<boolean>(false);
  const [showProgress, setSshowProgress] = useState<boolean>(false);
  const sign = useRef(null);
  const onSave = () => {
    sign.current.saveImage();
  };
  const onClear = () => {
    setSignature(false);
    sign.current.resetImage();
  };
  const onDragEvent = () => {
    setSignature(true);
  };
  const onSaveEvent = (result) => {
    try {
      setSshowProgress(true);
      const task = Storage().ref(props.filePath).child(props.fileName);
      task
        .putString(result.encoded, 'base64')
        .on('state_changed', (snapshot) => {
          if (snapshot.state == 'success') {
            //setSshowProgress(false);
            props.onSave();
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Modal isVisible={true}>
      {showProgress && <ProgressBar />}
      <View style={styles.signatureContainer}>
        <View
          style={[
            commonStyles.closeIconContainer,
            {
              marginLeft: boxModelSize.m,
              zIndex: 2,
              width: '100%',
            },
          ]}>
          <TouchableOpacity onPress={props.onClose}>
            <View style={commonStyles.closeIcon}>
              <CustIcon
                type="antdesign"
                name="close"
                size={20}
                color={Colors.white}
              />
            </View>
          </TouchableOpacity>
        </View>
        <SignatureCapture
          style={styles.signature}
          showNativeButtons={false}
          onSaveEvent={onSaveEvent}
          onDragEvent={onDragEvent}
          ref={sign}
        />
        <View style={styles.buttonMaster}>
          <View style={styles.innerContainer}>
            <View style={styles.buttonContainer}>
              <CustButton title="Clear" onPress={onClear} />
            </View>
            <View style={styles.buttonContainer}>
              <CustButton title="Save" disabled={!signature} onPress={onSave} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  signatureContainer: {
    flex: 0.5,
    backgroundColor: 'white',
    borderRadius: Constants.BOX_REDIUS,
    padding: boxModelSize.m,
  },
  signature: {
    flex: 1,
  },
  buttonMaster: {
    position: 'absolute',
    bottom: boxModelSize.xl,
    left: boxModelSize.m,
  },
  innerContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    width: '50%',
  },
});

export default CustSignature;
