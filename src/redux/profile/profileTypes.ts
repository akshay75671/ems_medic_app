export const REQUEST_START = 'fetchUserRequest';
export const SHOW_SNACKBAR = 'showSnackBar';

export const FETCH_USERS_SUCCESS = 'fetchUserSuccess';

export const SET_PHONE_NO = 'setPhoneNumber';
export const SET_EMAIL_ID = 'setEmailID';
export const PHONE_NO_VERFICATION = 'phoneNumberVerfication';
export const EMAIL_ID_VERFICATION = 'emailIDVerfication';
export const SHOW_OTP_SCREEN = 'showOTPscreen';
export const SHOW_UPDATE_EMAIL_SCREEN = 'showUpdateEmailScreen';
export const CLEAR_MESSAGE = 'clearErrorMessage';

export interface USER {
  id: string;
  fbUserID: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phoneNo: string;
  phoneNoToken: string;
  phoneCountryCode: string;
  phoneNoVerified: boolean;
  secPhoneNo: string;
  secPhoneNoCountryCode: string;
  gender: string;
  dob: string;
  age: string;
  profilePic: string;
  licenseID: string;
  licenseIDPic: string;
  faceID: boolean;
  fingerID: boolean;
  //active: boolean;
  // status: string;
  // medicRole: string[];
  // controlRole: string[];
  // assistRole: string[];
}
export interface errorMsgTypes {
  action: string;
  error: string;
}
export interface ActionTypes {
  type: string;
  payload: any;
}
export interface StateTypes {
  loading: boolean;
  user: USER;
  message: errorMsgTypes;
  showOTPScreen: boolean;
  showUpdateEmailScreen: boolean;
}
