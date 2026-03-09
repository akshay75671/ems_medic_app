import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const Constants = {
  EMS_LOGO: require('../assets/images/logo.png'),
  AUTH_BG_IMAGE: require('../assets/images/human_heart.png'),
  BACKGROUND_IMAGE: require('../assets/images/background.png'),
  EMAIL_VERIFICATION: require('../assets/images/email_verification.png'),
  EMAIL_VERIFICATION_SEND: require('../assets/images/email_verification_send.png'),
  EMAIL_VERIFICATION_VERIFIED: require('../assets/images/email_verification_verified.png'),
  USER_LOGIN: require('../assets/images/user_login.png'),
  OTP_SCREN_IMG: require('../assets/images/otp_screen_img.png'),
  USER_EVENT: require('../assets/images/user_event.png'),
  DUMMY_PROFILE_PIC: require('../assets/images/profile_pic.jpg'),
  SEARCH_MARKER_ICON: require('../assets/images/searchMarker.png'),
  ID_CARD: require('../assets/images/id-card.png'),
  ICON_AWAKE: require('../assets/images/awake.png'),
  ICON_BLEEDING: require('../assets/images/bleeding.png'),
  ICON_BREATHING: require('../assets/images/breathing.png'),
  ICON_COVID: require('../assets/images/covid.png'),
  ICON_HEADACHE: require('../assets/images/headache.png'),
  ICON_VOMITED: require('../assets/images/vomited.png'),
  MAIN_MENU_BUTTON_BG: require('../assets/images/main_menu_BG.png'),
  MEDIC_CAMP_ICON: require('../assets/images/medic_camp.png'),
  DATE_FORMAT: 'MM/DD/YYYY',
  DATE_TIME_FORMAT: 'MM/DD/YYYY hh:mm A',
  TIME_FORMAT: 'h:mm A',
  BOX_REDIUS: 20,
  AUTH_BUTTON_BG_SQUARE: 80,
  APP_WIDTH: width,
  BOX_MODAL_BG_OPACITY: 'rgba(0,0,0,0.5)',
  DISTANCE_UNIT: 'm',
  STORAGE_PROFILE: 'profiles',
  PROFILE_SIGN_PREFIX: 'profiles_sign_',
};

export default Constants;

// unit can be one of:

// m (meter)
// km (kilometers)
// cm (centimeters)
// mm (millimeters)
// mi (miles)
// sm (seamiles)
// ft (feet)
// in (inches)
// yd (yards)
