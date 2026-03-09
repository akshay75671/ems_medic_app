import React, {PureComponent} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import Storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {boxModelSize, Colors, commonStyles} from '../styles';
import * as Animatable from 'react-native-animatable';
import CustIcon from './icon';
import CustSnackBar from './snackBar';
import Constants from '../core/constants';
import {progressProps, progressState} from '../types/componentsTypes';
import {scale} from 'react-native-size-matters';

class ImageUpload extends PureComponent<progressProps, progressState> {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploading: false,
      transferred: 0,
      formatText: '',
      indeterminate: true,
      cameraOn: false,
    };
  }
  componentDidMount() {
    if (this.props.option.mediaType == 'camera' && !this.state.cameraOn) {
      this.setState({cameraOn: true}, () => {
        this.chooseCamera();
      });
    }
  }
  // static getDerivedStateFromProps(props: progressProps, state: progressState) {
  //   if (props.option.show != state.open) {
  //     return {
  //       open: props.option.show,
  //     };
  //   } else {
  //     return null;
  //   }
  // }
  chooseCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'EMS Medic Camera Permission',
          message: 'Allow EMS Medic to access camera to take photo',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera({mediaType: 'photo'}, (response: any) => {
          if (response.didCancel) {
            //console.log('User cancelled image picker');
          } else if (response.error) {
            CustSnackBar(response.error);
          } else {
            const source = {uri: response.uri};
            this.setState({image: source});
          }
        });
      }
    } catch (error) {
      CustSnackBar(error.message);
    }
  };
  chooseImage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'EMS Medic Photo Permission',
          message: 'Allow EMS Medic to access photos on your device?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchImageLibrary({mediaType: 'photo'}, (response: any) => {
          if (response.didCancel) {
            //console.log('User cancelled image picker');
          } else if (response.error) {
            CustSnackBar(response.error);
          } else {
            const source = {uri: response.uri};
            this.setState({image: source});
          }
        });
      }
    } catch (error) {
      CustSnackBar(error.message);
    }
  };
  oncloseUpload = () => {
    this.props.onCloseUpload();
  };
  onCompletedUpload = () => {
    this.props.onCompleteUpload(this.props.option.returnKey);
  };
  cancelUpload = () => {
    this.setState({image: null});
  };
  uploadImage = async () => {
    const {uri} = this.state.image;
    const {fileName, path} = this.props.option;
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    this.setState({uploading: true});
    this.setState({transferred: 0});

    try {
      this.setState({indeterminate: false});
      const data = await RNFS.readFile(uploadUri, 'base64');
      const task = Storage().ref(path).child(fileName);
      task.putString(data, 'base64').on('state_changed', (snapshot) => {
        if (snapshot.state != 'success') {
          this.setState({
            formatText:
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) *
                100 +
              '%',
          });
          this.setState({
            transferred:
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 1,
          });
        }

        if (snapshot.state == 'success') this.onCompletedUpload();
      });
    } catch (error) {
      CustSnackBar(error.message);
    }
  };
  render() {
    const {image, uploading} = this.state;
    return (
      <Modal isVisible={true}>
        <Animatable.View
          duration={300}
          animation="slideInUp"
          style={[commonStyles.modalView, commonStyles.whiteBoxShadow]}>
          <View style={{height: '10%'}}></View>
          {uploading && (
            <View style={styles.progressContainer}>
              <Progress.Circle
                style={styles.progress}
                size={120}
                thickness={3}
                showsText={true}
                formatText={() => this.state.formatText}
                progress={this.state.transferred}
                indeterminate={this.state.indeterminate}
              />
            </View>
          )}
          <View style={commonStyles.closeIconContainer}>
            <TouchableOpacity onPress={this.oncloseUpload}>
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
          {image == null ? (
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                marginTop: boxModelSize.l,
              }}>
              <Text
                style={[
                  commonStyles.whiteBoxTitle,
                  {marginBottom: boxModelSize.l},
                ]}>
                Choose Image Source
              </Text>
              <View style={styles.sourceContainer}>
                <TouchableOpacity onPress={this.chooseCamera}>
                  <View style={styles.sourceIcon}>
                    <CustIcon
                      type="font-awesome"
                      name="camera"
                      size={30}
                      color={Colors.primary}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.chooseImage}>
                  <View style={styles.sourceIcon}>
                    <CustIcon
                      type="font-awesome"
                      name="image"
                      size={30}
                      color={Colors.primary}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <Text
                style={[
                  commonStyles.whiteBoxTitle,
                  {marginBottom: boxModelSize.l},
                ]}>
                Upload Image
              </Text>
              <Image source={{uri: image.uri}} style={styles.imageBox} />
              <View style={styles.uploadIconMasterContainer}>
                <TouchableOpacity onPress={this.uploadImage}>
                  <View style={styles.uploadIconContainer}>
                    <View style={styles.uploadIcon}>
                      <CustIcon
                        type="font-awesome"
                        name="upload"
                        size={20}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={commonStyles.defaultBodyText}>Upload</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.cancelUpload}>
                  <View style={styles.uploadIconContainer}>
                    <View style={styles.uploadIcon}>
                      <CustIcon
                        type="font-awesome"
                        name="step-backward"
                        size={20}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={commonStyles.defaultBodyText}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animatable.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  sourceContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  sourceIcon: {
    backgroundColor: Colors.lightGrey,
    padding: 30,
    borderRadius: 20,
  },
  uploadContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imageBox: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  uploadIconMasterContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  uploadIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  uploadIcon: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  progress: {
    margin: 10,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: Constants.BOX_REDIUS,
  },
});

export default ImageUpload;
