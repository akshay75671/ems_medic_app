import fireStore from '@react-native-firebase/firestore';

export const addAssessment = (refID, data) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('medicproviders')
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

export const getAssessment = (refID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('medicproviders')
      .doc(refID)
      .get()
      .then((doc) => {
        reslove(doc.data());
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
