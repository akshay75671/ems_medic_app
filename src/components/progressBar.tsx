import React, {PureComponent} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import {Colors, commonStyles} from '../styles';
import Constants from '../core/constants';

class ProgressBar extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Modal visible={true} transparent={true} animationType="fade">
        <View style={styles.centeredView}>
          <Animatable.View
            duration={300}
            animation="slideInUp"
            style={[styles.modalView, commonStyles.whiteBoxShadow]}>
            <Progress.CircleSnail
              color={['red', 'green', 'blue']}
              size={50}
              thickness={5}
            />
          </Animatable.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.BOX_MODAL_BG_OPACITY,
    width: '100%',
    height: '100%',
  },
  modalView: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
});

export default ProgressBar;
