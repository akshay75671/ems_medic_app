import {Fonts} from '../styles';
import Snackbar from 'react-native-snackbar';

const CustSnackBar = (message: string, callBack?: () => void) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_SHORT,
    fontFamily: Fonts.primaryRegular,
  });
  setTimeout(() => {
    if (callBack) callBack();
  }, 1500);
};

export default CustSnackBar;
