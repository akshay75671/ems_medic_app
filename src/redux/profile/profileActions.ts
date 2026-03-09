import axios from 'axios';
import Config from '../../core/config';
import {
  updateUserEmailID,
  userEmailVerified,
} from '../../services/authServices';
import {submitError} from '../../services/errorLog';
import {
  fetchUserDetails,
  updateUserDetails,
  getPhoneNoOTP,
  updatePhoneVerification,
  addPhoneHistory,
  addEmailHistory,
  getEmailOTP,
  updateEmailVerification,
} from '../../services/profileServices';
import {emsDevelopment} from '../../services/restService';
import * as actionTypes from './profileTypes';

interface userResponseDataType {
  data: actionTypes.USER;
  id: string;
}
export const fetchUser = () => {
  return (dispatch) => {
    dispatch(startRequest());
    fetchUserDetails()
      .then((response: any) => {
        dispatch(
          fetchUsersSuccess({
            ...response.data,
            id: response.id,
            emailVerified: userEmailVerified(),
          }),
        );
      })
      .catch((msg) => {
        dispatch(failureRequest({action: 'profile', error: msg}));
      });
  };
};

export const updateUser = (refID, user) => {
  return (dispatch) => {
    //dispatch(startRequest());
    updateUserDetails(refID, user)
      .then((response) => {
        dispatch(
          failureRequest({
            action: 'profile',
            error: 'Your profile updated successfully',
          }),
        );
      })
      .catch((msg) => {
        dispatch(failureRequest({action: 'profile', error: msg}));
      });
  };
};

let axiosConfig = {
  headers: {
    authorization: '',
  },
};

export const verifyEmail = (emailID, logout) => {
  return (dispatch) => {
    updateUserEmailID(emailID, logout)
      .then(() => {
        dispatch(showUpdateEmailScreen(true));
      })
      .catch((msg) => {
        dispatch(failureRequest({action: 'email', error: msg}));
      });
    // dispatch(showOTPScreen(true));
    // var _query = `query {\n  verifyEmailTokenTrigger (input : {email:"${emailID}"}) {\n    status, message \n  }\n}`;
    // dispatch(startRequest());
    // emsDevelopment(_query)
    //   .then(() => {
    //     dispatch(showOTPScreen(true));
    //   })
    //   .catch((error) => {
    //     dispatch(failureRequest(error));
    //   });
  };
};

export const verifyPhone = (mobileNo, code) => {
  return (dispatch) => {
    var _query = `query {\n  verifyPhoneTokenTrigger (input : {phoneNo:"${
      code + mobileNo
    }"}) {\n    status, message \n  }\n}`;
    dispatch(startRequest());
    emsDevelopment(_query)
      .then((result: any) => {
        if (result.data) dispatch(showOTPScreen(true));
      })
      .catch((msg) => {
        submitError('Profile', 'Phone number verification', msg);
        dispatch(failureRequest({action: 'phoneNo', error: msg}));
      });
  };
};

export const verifyPhoneOTP = (
  refID,
  userID,
  otp,
  code,
  newPhoneNo,
  oldPhoneNo,
) => {
  return async (dispatch) => {
    dispatch(clearMessage());
    getPhoneNoOTP(refID)
      .then((serverOTP) => {
        if (serverOTP == otp) {
          dispatch(showOTPScreen(false));
          dispatch(updatePhoneVerfication(false));
          updatePhoneVerification(refID, {
            phoneNoToken: '',
            phoneNo: newPhoneNo,
            phoneNoVerified: true,
            phoneCountryCode: code,
            updatedAt: new Date(),
          })
            .then(() => {
              dispatch(setPhoneNumber(newPhoneNo, code));
              addPhoneHistory({
                createdAt: new Date(),
                fbUserID: userID,
                userID: refID,
                newPhoneNo: code + newPhoneNo,
                oldPhoneNo: code + oldPhoneNo,
              })
                .then(() => {
                  dispatch(updatePhoneVerfication(true));
                })
                .catch((msg) => {
                  dispatch(failureRequest({action: 'profile', error: msg}));
                });
            })
            .catch((msg) => {
              dispatch(failureRequest({action: 'profile', error: msg}));
            });
        } else {
          //dispatch(updatePhoneVerfication(false));
          dispatch(
            failureRequest({
              action: 'otpScreen',
              error: 'The OTP you entered is not valid',
            }),
          );
        }
      })
      .catch((msg) => {
        dispatch(failureRequest({action: 'profile', error: msg}));
      });
  };
};

const setPhoneNumber = (num: string, code: string) => {
  return {
    type: actionTypes.SET_PHONE_NO,
    payload: {phoneNo: num, phoneCountryCode: code},
  };
};

export const setEmailID = (email: string) => {
  return {
    type: actionTypes.SET_EMAIL_ID,
    payload: {email},
  };
};

const showOTPScreen = (status: boolean) => {
  return {
    type: actionTypes.SHOW_OTP_SCREEN,
    payload: status,
  };
};

const updatePhoneVerfication = (status: boolean) => {
  return {
    type: actionTypes.PHONE_NO_VERFICATION,
    payload: status,
  };
};

const updateEmailVerfication = (status: boolean) => {
  return {
    type: actionTypes.EMAIL_ID_VERFICATION,
    payload: status,
  };
};

const startRequest = () => {
  return {
    type: actionTypes.REQUEST_START,
  };
};

const fetchUsersSuccess = (user: actionTypes.USER) => {
  return {
    type: actionTypes.FETCH_USERS_SUCCESS,
    payload: user,
  };
};

const failureRequest = (errorMsg: actionTypes.errorMsgTypes) => {
  return {
    type: actionTypes.SHOW_SNACKBAR,
    payload: errorMsg,
  };
};

const showUpdateEmailScreen = (status: boolean) => {
  return {
    type: actionTypes.SHOW_UPDATE_EMAIL_SCREEN,
    payload: status,
  };
};

const clearMessage = () => {
  return {
    type: actionTypes.CLEAR_MESSAGE,
  };
};
