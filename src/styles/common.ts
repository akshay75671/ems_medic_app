import {StyleSheet, StatusBar, Platform} from 'react-native';
import Fonts from './fonts';
import Colors from './colors';
import boxModel, {boxModelSize} from './boxModel';
import {scale, ScaledSheet} from 'react-native-size-matters';
import Constants from '../core/constants';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const fontSize = {
  h1: scale(32),
  h2: scale(28),
  h3: scale(22),
  h4: scale(18),
  h5: scale(16),
  h6: scale(13),
  default: scale(12),
  mainMenuMedicText: scale(15),
  mainMenuButtonText: scale(11),
  profileImgText: scale(70),
};

export default ScaledSheet.create({
  mt5: {
    marginTop: scale(5),
  },
  //--------------------------------- containers style -------------------------------------------
  safeArea: {
    flex: 1,
    // paddingTop: Platform.select({ios: 0, android: StatusBar.currentHeight}),
    backgroundColor: Colors.primaryBackgroundColor,
  },
  masterContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingTop: getStatusBarHeight(true) + 10,
  },
  container: {
    flex: 0.9,
  },
  footerContainer: {
    flex: 0.1,
  },
  containerSpacing: boxModel({type: 'padding', size: 'm', places: 'rl'}),
  topBGContainer: {
    flex: 0.44,
  },
  bottomBGContainer: {
    flex: 0.56,
  },
  bgImageContainer: {
    alignItems: 'center',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  whiteBoxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roundedButtonBoxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  devider: {
    borderBottomColor: Colors.borderGrey,
    borderBottomWidth: 1,
  },
  //--------------------------------- popup window style -------------------------------------------
  modalView: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: Constants.BOX_REDIUS,
    alignItems: 'center',
  },
  closeIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    top: scale(-10),
  },
  closeIcon: {
    width: scale(35),
    height: scale(35),
    borderRadius: 30,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: Colors.secondaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //--------------------------------- epcr profile header window style -------------------------------------------
  headerContainer: {
    flex: 0.2,
  },
  contentContainer: {
    flex: 0.8,
    backgroundColor: Colors.backgroundwhite,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  navigationText: {
    fontFamily: Fonts.primaryMedium,
    color: Colors.white,
    fontSize: scale(16),
  },
  //--------------------------------- Text style -------------------------------------------
  defaultBodyText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
  },
  whiteBodyText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.bodyTextGrey,
  },
  primaryBodyText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    color: Colors.primary,
  },
  primaryBodyTextSemiBold: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h6,
    color: Colors.primary,
  },
  defaultErrorText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.default,
    color: Colors.inputErrorText,
  },
  whiteBoxTitle: {
    fontFamily: Fonts.primaryMedium,
    fontSize: fontSize.h4,
    textTransform: 'uppercase',
  },
  //--------------------------------- Form Text style -------------------------------------------
  formSubTitle: {
    textAlign: 'center',
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h6,
    color: Colors.primary,
    marginBottom: boxModelSize.l,
    textTransform: 'uppercase',
  },
  textWithSwitchButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop: boxModelSize.m,
    paddingBottom: boxModelSize.m,
  },
  roundedRectangeCart: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 18,
  },
});
