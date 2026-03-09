import fireStore from '@react-native-firebase/firestore';

export const fetchEventData = (refID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('events')
      .where('eventID', '==', refID)
      .get({source: 'default'})
      .then((querySnapshot) => {
        let eventObj;
        querySnapshot.forEach(function (doc) {
          eventObj = doc.data();
        });
        reslove(eventObj && eventObj.eventID == refID ? eventObj : null);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
