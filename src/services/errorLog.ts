import fireStore from '@react-native-firebase/firestore';
import store from '../mobx/';

export const submitError = (page: string, action: string, msg: string) => {
  fireStore()
    .collection('error_log')
    .add({
      createdAt: new Date(),
      error: msg,
      event: action,
      fullName: store.profile.profile.fullName || '',
      page: page,
      product: 'EMS Medic',
      userID: store.profile.profile.fbUserID || '',
    });
};
