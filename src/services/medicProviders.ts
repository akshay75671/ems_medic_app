import fireStore from '@react-native-firebase/firestore';

export const fetchMedicsDetails = (eventID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('medicprovider_events')
      .where('eventID', '==', eventID)
      .get({source: 'default'})
      .then((querySnapshot) => {
        var user = [];
        querySnapshot.forEach(function (doc) {
          user.push({...doc.data(), id: doc.id});
        });
        reslove(user);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const fetchMedicsInfo = (medicID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('users')
      .where('fbUserID', '==', medicID)
      .get({source: 'default'})
      .then((querySnapshot) => {
        var medic = {};
        querySnapshot.forEach(function (doc) {
          medic['name'] = doc.get('fullName');
          medic['profilePic'] = doc.get('profilePic');
        });
        reslove(medic);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const updateMedictDetails = (refID, data) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('medicprovider_events')
      .doc(refID)
      .update({...data, updatedAt: new Date()})
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
