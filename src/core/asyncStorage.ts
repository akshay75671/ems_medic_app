import AsyncStorage from '@react-native-community/async-storage';
import CustSnackBar from '../components/snackBar';

export const setSessionData = async (key, value) => {
  try {
    await AsyncStorage.setItem('@' + key, value);
  } catch (error) {
    CustSnackBar(error.message);
  }
};

export const getSessionData = async (key) => {
  try {
    const value = await AsyncStorage.getItem('@' + key);
    return value !== null ? value : null;
  } catch (error) {
    CustSnackBar(error.message);
  }
};

export const setSessionDataObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@' + key, jsonValue);
  } catch (error) {
    CustSnackBar(error.message);
  }
};

export const getSessionDataObject = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@' + key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    CustSnackBar(error.message);
  }
};

export const clearSession = () => {
  AsyncStorage.clear();
};
