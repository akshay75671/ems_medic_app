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
export interface profileTypes {
  loading: boolean;
  user: USER;
  message: string;
  showOTPScreen: boolean;
  fetchUser: () => void;
}
