import {ImageSourcePropType, TextInputProps, ViewStyle} from 'react-native';
import {LatLng} from 'react-native-maps';

export interface custIconProps {
  type:
    | 'zocial'
    | 'octicon'
    | 'material'
    | 'material-community'
    | 'ionicon'
    | 'foundation'
    | 'evilicon'
    | 'entypo'
    | 'font-awesome'
    | 'font-awesome-5'
    | 'simple-line-icon'
    | 'feather'
    | 'antdesign'
    | 'fontisto';
  name: string;
  size: number;
  color: string;
  raised?: boolean;
  containerStyle?: ViewStyle;
}

export interface custAuthInputProps extends TextInputProps {
  leftIcon?: boolean;
  errorText?: string;
  iconProps?: Partial<custIconProps>;
  showHidePassword?: boolean;
}

export interface custTextInputProps extends custAuthInputProps {
  textRef?: any;
  label?: string;
  height?: any;
  required?: boolean;
  dropIcon?: boolean;
  info?: string;
  textPaddingLeft?: number;
  verification?: boolean;
  verified?: boolean;
  verifyHander?: () => void;
  onClear?: () => void;
}

export interface custTextInputState {
  modalVisible: boolean;
}

export interface CustDataPickerProps {
  items: string[];
  label: string;
  placeholder: string;
  required?: boolean;
  editable?: boolean;
  iconProps?: Partial<custIconProps>;
  value: string;
  onChangeText?: (value) => void;
  onEndEditing?: (event) => void;
  errorText?: string;
  leftIcon?: boolean;
}

export interface CustDataPickerState {
  items: string[];
  visible: boolean;
  value: string;
}

export interface dateAndTimePickerProps {
  label: string;
  required?: boolean;
  placeholder: string;
  value?: string;
  onChangeText?: (value) => void;
  onEndEditing?: (event) => void;
  errorText?: string;
  display?: any;
  mode?: any;
  info?: string;
  leftIcon?: boolean;
  maximumDate?: Date;
}

export interface dateAndTimePickerState {
  show: boolean;
  selectedDate: string;
  date: any;
}

export interface phoneTextInputProps extends dateAndTimePickerProps {
  verification?: boolean;
  verified?: boolean;
  code?: string;
  verifyHander?: () => void;
  phonecode?: boolean;
  iconProps?: Partial<custIconProps>;
}

export interface phoneTextInputState {
  modalVisible: boolean;
  callingCode: string;
  phoneNumber: string;
}

interface settings {
  mediaType: string;
  path: string;
  fileName: string;
  returnKey: string;
  successMsg: string;
  failureMsg: string;
}
export interface progressProps {
  option: settings;
  onCompleteUpload: (returnKey) => void;
  onCloseUpload: () => void;
}
export interface progressState {
  image: any;
  uploading: boolean;
  transferred: number;
  formatText: string;
  cameraOn: boolean;
  indeterminate: boolean;
}

export interface buttonProp {
  hightlight?: boolean;
  disabled?: boolean;
  title?: string;
  size?: number;
  style?: ViewStyle;
  type?: 'default' | 'gradient' | 'dashed' | 'main';
  iconProps?: Partial<custIconProps>;
  onPress: () => void;
}

export interface MarkerProp {
  label: string;
  icon: ImageSourcePropType;
  iconType?: 'profile' | 'medicCamp';
  coordinate: LatLng;
  tooltip?: string;
  borderColor?: string;
}

export interface TabProp {
  tabValue: any;
  handleTabChange: (value) => void;
  defaultSelectedTab: number;
  tabSize: string;
}

export interface custSwitchTabProps extends custAuthInputProps {
  handleTabChange?: Function;
  tabvalue?: any;
  defaultSelectedTab: number;
}

interface uploadOptionType {
  mediaType: string;
  path: string;
  fileName: string;
  successMsg: string;
  failureMsg: string;
  returnKey: string;
}

export interface uploadImageProps extends custAuthInputProps {
  name: string;
  label: string;
  required?: boolean;
  dropIcon?: boolean;
  info?: string;
  textPaddingLeft?: number;
  verification?: boolean;
  verified?: boolean;
  verifyHander?: () => void;
}

export interface uploadImageState {
  showUpload: boolean;
  uploadOtion: uploadOptionType;
  uploadPicUri: string;
  uploadPic: string;
}
