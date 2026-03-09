import {observable, action, decorate} from 'mobx';
import {getImageUriFromStorage, getProfileStateColor} from '../../core/utils';
import {userEmailVerified} from '../../services/authServices';
import {
  addPhoneHistory,
  eventAssignedToMe,
  fetchUserDetails,
  getPhoneNoOTP,
  updatePhoneVerification,
  updateUserDetails,
} from '../../services/profileServices';
import {updateUserEmailID} from '../../services/authServices';
import {emsDevelopment} from '../../services/restService';
import store from '../';

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
  status: string;
  statusColor: string;
  medicLocn: any;
  profilePicUri: string;
  insideEvent: boolean;
}
interface userResponseDataType {
  data: USER;
  id: string;
}
export default class Profile {
  profile: USER = null;
  loading: boolean;
  message: string = '';
  showOTPScreen: boolean = false;
  showUpdateEmailScreen: boolean = false;
  fetchUserData = (position) => {
    this.loading = true;
    fetchUserDetails()
      .then(
        action((response: any) => {
          this.profile = {
            ...this.profile,
            ...response.data,
            status: 'available',
            insideEvent: false,
            medicLocn: position,
            statusColor: getProfileStateColor('available'),
          };
          this.loading = false;
          getImageUriFromStorage('profiles', response.data.profilePic)
            .then(
              action((imageUri: any) => {
                this.profile.profilePicUri = imageUri;
              }),
            )
            .catch((error) => {
              console.log(error);
            });
        }),
      )
      .catch(
        action((msg) => {
          this.loading = false;
          console.log(msg);
        }),
      );
  };
  checkAssignedEvent = () => {
    this.loading = true;
    eventAssignedToMe(this.profile.fbUserID)
      .then(
        action((eventID) => {
          if (eventID) store.eventStore.fetchEventData(eventID);
          this.loading = false;
        }),
      )
      .catch(
        action((msg) => {
          this.loading = false;
          console.log(msg);
        }),
      );
  };
  fetchProfileData = () => {
    this.loading = true;
    fetchUserDetails()
      .then(
        action((response: any) => {
          this.profile = {...this.profile, ...response.data};
          this.profile.id = response.id;
          this.profile.emailVerified = userEmailVerified();
          this.loading = false;
        }),
      )
      .catch(
        action((msg) => {
          console.log(msg);
          this.loading = false;
        }),
      );
  };
  updateUser = (user: USER) => {
    updateUserDetails(this.profile.id, user)
      .then(
        action((response) => {
          this.profile = {...this.profile, ...user};
          this.message = 'Your profile updated successfully';
        }),
      )
      .catch((msg) => {
        console.log(msg);
      });
  };
  updateStatus = (state) => {
    this.profile.status = state;
    this.profile.statusColor = getProfileStateColor(state);
    //store.medicProviders.updateMedicStatus(this.profile.fbUserID);
  };
  verifyEmail = (emailID, logout) => {
    updateUserEmailID(emailID, logout)
      .then(
        action(() => {
          this.showUpdateEmailScreen = true;
        }),
      )
      .catch((msg) => {
        console.log(msg);
      });
  };
  verifyPhone = (mobileNo, code) => {
    var _query = `query {\n  verifyPhoneTokenTrigger (input : {phoneNo:"${
      code + mobileNo
    }"}) {\n    status, message \n  }\n}`;
    this.loading = true;
    emsDevelopment(_query)
      .then(
        action(() => {
          this.showOTPScreen = true;
          this.loading = false;
        }),
      )
      .catch((msg) => {
        console.log(msg);
      });
  };
  verifyPhoneOTP = (otp, code, newPhoneNo, oldPhoneNo) => {
    const refID = this.profile.id;
    this.loading = true;
    getPhoneNoOTP(refID)
      .then(
        action((serverOTP) => {
          if (serverOTP == otp) {
            this.showOTPScreen = false;
            updatePhoneVerification(refID, {
              phoneNoToken: '',
              phoneNo: newPhoneNo,
              phoneNoVerified: true,
              phoneCountryCode: code,
              updatedAt: new Date(),
            })
              .then(
                action(() => {
                  (this.profile.phoneNo = newPhoneNo),
                    (this.profile.phoneCountryCode = code);
                  addPhoneHistory({
                    createdAt: new Date(),
                    fbUserID: this.profile.fbUserID,
                    userID: refID,
                    newPhoneNo: code + newPhoneNo,
                    oldPhoneNo: code + oldPhoneNo,
                  })
                    .then(
                      action(() => {
                        this.profile.phoneNoVerified = true;
                        this.loading = false;
                      }),
                    )
                    .catch(
                      action((msg) => {
                        console.log(msg);
                        this.loading = false;
                      }),
                    );
                }),
              )
              .catch(
                action((msg) => {
                  console.log(msg);
                  this.loading = false;
                }),
              );
          } else {
            //dispatch(updatePhoneVerfication(false));
            this.message = 'The OTP you entered is not valid';
            this.loading = false;
          }
        }),
      )
      .catch(
        action((msg) => {
          console.log(msg);
          this.loading = false;
        }),
      );
  };
  updateUserPlace = (state: boolean) => {
    this.profile.insideEvent = state;
  };
  reset = () => {};
}

decorate(Profile, {
  profile: observable,
  loading: observable,
  message: observable,
  showOTPScreen: observable,
  showUpdateEmailScreen: observable,
  fetchUserData: action,
  checkAssignedEvent: action,
  fetchProfileData: action,
  updateStatus: action,
  verifyPhone: action,
  verifyPhoneOTP: action,
  reset: action,
  updateUserPlace: action,
});
