import React, {PureComponent} from 'react';
import {boxModelSize, Colors, commonStyles, Fonts, fontSize} from '../styles';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {uploadImageProps, uploadImageState} from '../types/componentsTypes';
import CustIcon from './icon';
import {CustButton, ImageUpload, CustSnackBar} from '../components';
import {getImageUriFromStorage} from '../services/profileServices';

class CustUploadImage extends PureComponent<
  uploadImageProps,
  uploadImageState
> {
  constructor(props) {
    super(props);
    this.state = {
      showUpload: false,
      uploadOtion: {
        mediaType: '',
        path: '',
        fileName: '',
        successMsg: '',
        failureMsg: '',
        returnKey: '',
      },
      uploadPicUri: '',
      uploadPic: '',
    };
  }

  verifyHandler = () => {
    this.props.verifyHander && this.props.verifyHander();
  };
  imageUloadClose = () => {
    this.setState({showUpload: false});
  };
  onImageUploadCompleted = (key: string) => {
    const {name} = this.props;
    if (key == name) {
      getImageUriFromStorage(`${name}`, `${name}_123`)
        .then((imageUri: string) => {
          this.setState({uploadPicUri: imageUri});
        })
        .catch((error) => {
          CustSnackBar('error while get profile picter', error);
        })
        .finally(() => {
          this.setState({
            uploadPic: `${name}_123`,
          });
        });
    }
    this.imageUloadClose();
  };

  ImgUpload = () => {
    const {name} = this.props;
    this.setState(
      {
        uploadOtion: {
          ...this.state.uploadOtion,
          mediaType: '',
          path: `${name}`,
          returnKey: `${name}`,
          fileName: `${name}_123`,
          successMsg: `${name} uploaded successfully`,
          failureMsg: `${name} upload failed`,
        },
      },
      () => {
        this.setState({showUpload: true});
      },
    );
  };

  render() {
    const {
      leftIcon,
      iconProps,
      errorText,
      label,
      required,
      verification,
      verified,
      dropIcon,
      info,
      placeholder,
    } = this.props;

    const {showUpload, uploadOtion} = this.state;

    return (
      <View
        style={[
          leftIcon && styles.withIconContainer,
          {marginBottom: boxModelSize.m},
        ]}>
        {showUpload && (
          <ImageUpload
            option={uploadOtion}
            onCloseUpload={this.imageUloadClose}
            onCompleteUpload={(key: string) => this.onImageUploadCompleted(key)}
          />
        )}
        {leftIcon && (
          <View style={styles.wiTxtIcon}>
            <CustIcon {...iconProps} />
          </View>
        )}
        <View style={leftIcon && styles.wiTxtInput}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View style={{flex: 0.8, justifyContent: 'center'}}>
              {label && (
                <View style={required && styles.requiredLabel}>
                  <Text style={styles.labelDefault}>{label}</Text>
                  {required && (
                    <Text
                      style={[
                        styles.labelDefault,
                        commonStyles.defaultErrorText,
                      ]}>
                      *
                    </Text>
                  )}
                </View>
              )}
              <View>
                <TextInput
                  style={[
                    styles.default,
                    {
                      borderBottomColor: this.props.errorText
                        ? Colors.inputErrorBorder
                        : Colors.borderGrey,
                    },
                    {paddingLeft: this.props.textPaddingLeft},
                  ]}
                  {...this.props}
                  placeholderTextColor={Colors.placeholderGrey}
                />
              </View>
              <View>
                <View style={styles.errorTextContainer}>
                  {this.props.errorText != '' && (
                    <Animatable.Text
                      animation="shake"
                      style={StyleSheet.flatten([
                        commonStyles.defaultErrorText,
                        styles.errorText,
                      ])}>
                      {this.props.errorText}
                    </Animatable.Text>
                  )}
                </View>
              </View>
            </View>
            <View style={{flex: 0.2, justifyContent: 'center'}}>
              <CustButton
                title="Upload your ID"
                type="gradient"
                iconProps={{
                  type: 'font-awesome',
                  name: 'upload',
                  size: 20,
                  color: Colors.white,
                }}
                onPress={this.ImgUpload}
              />
            </View>
          </View>

          <Animatable.View duration={500} delay={700} animation="fadeInUp">
            {this.state.uploadPicUri != '' && (
              <View style={styles.licenseIdPicContainer}>
                <Image
                  source={{uri: this.state.uploadPicUri}}
                  style={styles.licenseIdPic}
                />
              </View>
            )}
          </Animatable.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    textAlignVertical: 'bottom',
    borderBottomWidth: 1,
    padding: 0,
    margin: 0,
    height: 25,
  },
  labelDefault: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.primary,
    fontSize: fontSize.h6,
  },
  requiredLabel: {
    flexDirection: 'row',
  },
  errorAndVerification: {
    flexDirection: 'row',
    height: 20,
  },
  errorTextContainer: {
    //height: 20,
    flex: 1,
  },
  iconVerification: {
    flexDirection: 'row',
    flex: 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dropDownIcon: {
    position: 'absolute',
    right: 0,
    bottom: 30,
  },
  errorText: {
    //flex: 0.7,
  },
  withIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  wiTxtIcon: {width: 35, alignItems: 'flex-start'},
  wiTxtInput: {flex: 1},
  licenseIdPicContainer: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 5,
    marginBottom: 10,
  },
  licenseIdPic: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
});

export default CustUploadImage;
