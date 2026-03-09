import fireStore from '@react-native-firebase/firestore';

export const fetchMedicCampsDetails = (eventID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('mediccamp_events')
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
