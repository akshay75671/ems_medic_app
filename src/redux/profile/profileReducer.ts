import * as profileTypes from './profileTypes';

const initialState = {
  user: {
    id: '',
    fbUserID: '',
    fullName: '',
    email: '',
    emailVerified: false,
    phoneNo: '',
    phoneNoToken: '',
    phoneCountryCode: '',
    phoneNoVerified: false,
    secPhoneNo: '',
    secPhoneNoCountryCode: '',
    gender: '',
    dob: '',
    age: '',
    profilePic: '',
    licenseID: '',
    licenseIDPic: '',
    faceID: false,
    fingerID: false,
  },
  showOTPScreen: false,
  showUpdateEmailScreen: false,
  loading: false,
  message: null,
};

const profileReducer = (
  state: profileTypes.StateTypes = initialState,
  action: profileTypes.ActionTypes,
) => {
  switch (action.type) {
    case profileTypes.SET_PHONE_NO:
      return {
        ...state,
        user: {...state.user, ...action.payload},
      };
    case profileTypes.SET_EMAIL_ID:
      return {
        ...state,
        user: {...state.user, ...action.payload},
      };
    case profileTypes.SHOW_OTP_SCREEN:
      return {
        ...state,
        loading: false,
        showOTPScreen: action.payload,
      };
    case profileTypes.SHOW_UPDATE_EMAIL_SCREEN:
      return {
        ...state,
        loading: false,
        showUpdateEmailScreen: action.payload,
      };
    case profileTypes.PHONE_NO_VERFICATION:
      return {
        ...state,
        user: {...state.user, phoneNoVerified: action.payload},
        message: {
          action: 'profile',
          error: 'Phone number verified successfully',
        },
      };
    case profileTypes.EMAIL_ID_VERFICATION:
      return {
        ...state,
        user: {...state.user, emailVerified: action.payload},
        message: {action: 'profile', error: 'Email ID verified successfully'},
      };
    case profileTypes.REQUEST_START:
      return {
        ...state,
        loading: true,
      };
    case profileTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {...state.user, ...action.payload},
      };
    case profileTypes.SHOW_SNACKBAR:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case profileTypes.CLEAR_MESSAGE:
      return {
        ...state,
        message: null,
      };
    default:
      return state;
  }
};

export default profileReducer;
