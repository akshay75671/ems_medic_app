import fireAuth from '@react-native-firebase/auth';
import fireStore from '@react-native-firebase/firestore';
import {store} from '../redux/store';
import {clearSession} from '../core/asyncStorage';
import {Alert} from 'react-native';

export const getLoginScrenLabels = async () => {
  // const loginScreenKeys = {
  //   title: 'kfxuugw4eqb53fuqa8w',
  //   uerName: 'kfbz1d619fn1jqdmsgw',
  //   password: 'kfxqhgh83pdshi9b6xs',
  // };
  // let loginScreenLabels: any = {};
  // await Object.keys(loginScreenKeys).map((key) => {

  // });
  fireStore()
    .collection('cms_labels')
    .doc('GaHR4c7XtJYyZGtp0PVV')
    .get({source: 'default'})
    .then((snapShot) => {
      console.log(snapShot.data());
      //loginScreenLabels[key] = snapShot.get('value_en');
    });
};

export const logoutUser = async () => {
  try {
    store.dispatch({type: 'USER_LOGGED_OUT'});
    clearSession();
    return await fireAuth().signOut();
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserDetails = async () => {
  try {
    return await fireAuth().currentUser;
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserID = async () => {
  return new Promise((resolve, reject) => {
    try {
      const userID = fireAuth().currentUser.uid;
      resolve(userID);
    } catch (error) {
      reject(error.message);
    }
  });
};

export const updateUserEmailID = async (email, logout) => {
  return new Promise((resolve, reject) => {
    fireAuth()
      .currentUser.verifyBeforeUpdateEmail(email)
      .then((success) => {
        console.log('update email', success);
        resolve('SUCCESS');
      })
      .catch((error) => {
        console.log(error);
        switch (error.code) {
          case 'auth/requires-recent-login':
            Alert.alert(
              'Update Email',
              'This operation is sensitive. Log in again before retrying this request.',
              [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Login', onPress: logout},
              ],
              {cancelable: false},
            );
            break;
          case 'auth/email-already-in-use':
            reject('Email ID already exist');
            break;
          case 'auth/invalid-email':
            reject('Invalid email address format.');
            break;
          case 'auth/too-many-requests':
            reject('Too many request. Try again in a minute.');
            break;
          default:
            reject('Check your internet connection.');
        }
      });
  });
};

export const userEmailVerified = (): boolean => {
  try {
    return fireAuth().currentUser.emailVerified;
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserAccessToken = async () => {
  return new Promise((resolve, reject) => {
    fireAuth()
      .currentUser.getIdTokenResult()
      .then((response) => {
        resolve(response.token);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const userReload = async () => {
  return new Promise((resolve, reject) => {
    fireAuth()
      .currentUser.reload()
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const sendEmailVerification = () => {
  return new Promise((resolve, reject) => {
    console.log('email verification', fireAuth().currentUser);
    fireAuth()
      .currentUser.sendEmailVerification()
      .then(() => {
        resolve('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const registerUser = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    fireAuth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        fireStore()
          .collection('users')
          .add({
            fbUserID: response.user.uid,
            email: response.user.email,
          })
          .then(() => {
            resolve('SUCCESS');
          })
          .catch((error) => {
            console.log(error);
            console.log('not able to insert new user data into firestore.');
          });
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            reject('User already exist. Go to login');
            break;
          case 'auth/invalid-email':
            reject('Invalid email address format.');
            break;
          case 'auth/weak-password':
            reject('Password is too weak.');
            break;
          case 'auth/too-many-requests':
            reject('Too many request. Try again in a minute.');
            break;
          default:
            reject('Check your internet connection.');
        }
      });
  });
};

export const loginUser = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    fireAuth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        resolve('SUCCESS');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            reject('Invalid email address format.');
            break;
          case 'auth/user-not-found':
            reject('User not found.');
            break;
          case 'auth/wrong-password':
            reject('Invalid email address or password.');
            break;
          case 'auth/too-many-requests':
            reject('Too many request. Try again in a minute.');
            break;
          default:
            reject('Check your internet connection.');
        }
      });
  });
};

export const forgotPassword = async (email: string) => {
  return new Promise((resolve, reject) => {
    fireAuth()
      .sendPasswordResetEmail(email)
      .then(() => {
        resolve('SUCCESS');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            reject('Invalid email address format.');
            break;
          case 'auth/user-not-found':
            reject('User not found.');
            break;
          case 'auth/too-many-requests':
            reject('Too many request. Try again in a minute.');
            break;
          default:
            reject('Check your internet connection.');
        }
      });
  });
};
