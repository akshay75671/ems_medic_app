import fireStore from '@react-native-firebase/firestore';
import {getUserID} from './authServices';

export const fetchUserDetails = () => {
  return new Promise((reslove, reject) => {
    getUserID()
      .then((uid) => {
        fireStore()
          .collection('users')
          .where('fbUserID', '==', uid)
          .get({source: 'default'})
          .then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
              reslove({data: doc.data(), id: doc.id});
            });
          })
          .catch((error) => {
            reject(error.message);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const eventAssignedToMe = (userID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('medicprovider_events')
      .where('fbUserID', '==', userID)
      .get({source: 'default'})
      .then((querySnapshot) => {
        let medicObj;
        querySnapshot.forEach(function (doc) {
          medicObj = doc.data();
        });
        reslove(medicObj.fbUserID == userID ? medicObj.eventID : null);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
export const updateUserDetails = (refID, user) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users')
      .doc(refID)
      .update(user)
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getEmailOTP = (refID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users')
      .doc(refID)
      .get()
      .then((doc) => {
        reslove(doc.get('emailToken'));
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getPhoneNoOTP = (refID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users')
      .doc(refID)
      .get()
      .then((doc) => {
        reslove(doc.get('phoneNoToken'));
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const updateEmailVerification = (refID, data) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users')
      .doc(refID)
      .update(data)
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const updatePhoneVerification = (refID, data) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users')
      .doc(refID)
      .update(data)
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const addEmailHistory = (data) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users_email_history')
      .add(data)
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const addPhoneHistory = (data) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users_phoneno_history')
      .add(data)
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
