import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {CustButton, CustIcon} from '.';
import Modal from 'react-native-modal';
import {boxModel, Colors, commonStyles} from '../styles';
interface bioMetricsProps {
  type: 'face' | 'finger';
  onClose: () => void;
  onSubmit: () => void;
}
class SetupBiometrics extends Component<bioMetricsProps> {
  render() {
    return (
      <Modal isVisible={true}>
        <Animatable.View
          duration={700}
          animation="slideInUp"
          style={[commonStyles.modalView, commonStyles.whiteBoxShadow]}>
          <View style={{height: '10%'}}></View>
          <Animatable.View
            duration={500}
            delay={400}
            animation="bounceIn"
            style={commonStyles.closeIconContainer}>
            <TouchableOpacity onPress={this.props.onClose}>
              <View style={commonStyles.closeIcon}>
                <CustIcon
                  type="font-awesome"
                  name="close"
                  size={15}
                  color={Colors.white}
                />
              </View>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.Text
            duration={500}
            delay={0}
            animation="fadeInUp"
            style={commonStyles.whiteBoxTitle}>
            set up {this.props.type} id
          </Animatable.Text>
          <Animatable.View
            duration={500}
            delay={300}
            animation="fadeInUp"
            style={boxModel({type: 'margin', size: 'l', places: 'tb'})}>
            {this.props.type == 'finger' && (
              <CustIcon
                type="entypo"
                name="fingerprint"
                size={60}
                color={Colors.profileImgBG}
              />
            )}
            {this.props.type == 'face' && (
              <CustIcon
                type="material-community"
                name="face-recognition"
                size={60}
                color={Colors.profileImgBG}
              />
            )}
          </Animatable.View>
          <Animatable.Text
            duration={500}
            delay={400}
            animation="fadeInUp"
            style={[
              commonStyles.defaultBodyText,
              {width: '80%', textAlign: 'center'},
            ]}>
            You can now use your{' '}
            {this.props.type == 'finger' ? 'finger print' : 'face recognition'}{' '}
            instead of your password to login to EMS Medic
          </Animatable.Text>
          <Animatable.View
            duration={500}
            delay={500}
            animation="fadeInUp"
            style={{marginTop: 10}}>
            <CustButton
              onPress={this.props.onSubmit}
              type="gradient"
              iconProps={{
                type: 'font-awesome',
                name: 'check',
                color: Colors.white,
                size: 25,
              }}
            />
          </Animatable.View>
        </Animatable.View>
      </Modal>
    );
  }
}

export default SetupBiometrics;
