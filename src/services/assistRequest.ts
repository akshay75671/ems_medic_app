import fireStore from '@react-native-firebase/firestore';
import stores from '../mobx';

let requestListner;
let handoverListner;

export const startAssistPositionListener = (refID) => {
  requestListner = fireStore()
    .collection('assistrequest')
    .doc(refID)
    .onSnapshot((onSnap) => {
      if (onSnap.exists)
        stores.assistRequests.updateAssistPosition(onSnap.get('assistLocn'));
    });
};
export const startRequestListner = (eventID) => {
  requestListner = fireStore()
    .collection('assistrequest')
    .where('eventID', '==', eventID)
    .where('status', '==', 'active')
    .onSnapshot((onSnap) => {
      var user = [];
      onSnap.docs.forEach((doc) => {
        user.push({...doc.data(), id: doc.id});
      });
      stores.assistRequests.gettingDataFromRequestListener(user);
    });
};
export const stopRequestListner = () => {
  if (requestListner) requestListner();
};
export const startHandoverListner = (eventID, userID) => {
  handoverListner = fireStore()
    .collection('epcr_handover')
    .where('eventID', '==', eventID)
    .where('newFbUserID', '==', userID)
    .where('status', '==', 'active')
    .onSnapshot((onSnap) => {
      var user;
      onSnap.docs.forEach((doc) => {
        user = doc.data();
      });
      stores.assistRequests.gettingDataFromHandoverListener(user);
    });
};
export const stopHandoverListner = () => {
  if (handoverListner) handoverListner();
};
export const addExcludeMedic = (refID, medicList) => {
  try {
    fireStore()
      .collection('assistrequest')
      .doc(refID)
      .update({excludeMedics: medicList});
  } catch (error) {
    console.log(error);
  }
};
export const getFamilyMemebers = (pID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('assisteusers_family')
      .where('parentID', '==', pID)
      .get({source: 'default'})
      .then((querySnapshot) => {
        let users: any[] = [];
        querySnapshot.forEach(function (doc) {
          users.push({...doc.data(), id: doc.id});
        });
        reslove(users);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const updateAssistRequestDetails = (refID, data) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('assistrequest')
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

export const updateAssistFamilyRequestDetails = (assistRefIDs) => {
  return new Promise((reslove, reject) => {
    let batch = fireStore().batch();
    assistRefIDs.forEach((refID, index) => {
      batch.update(fireStore().collection('assisteusers_family').doc(refID), {
        ...{status: 'inProgress'},
        updatedAt: new Date(),
      });
    });
    batch
      .commit()
      .then(() => {
        reslove('SUCCESS');
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getAssistUserDetails = (assistUserID) => {
  return new Promise((reslove, reject) => {
    fireStore()
      .collection('assistusers')
      .where('fbuserID', '==', assistUserID)
      .get({source: 'default'})
      .then((querySnapshot) => {
        let users: any = null;
        querySnapshot.forEach(function (doc) {
          users = {
            age: doc.get('age'),
            fullName: doc.get('fullName'),
            gender: doc.get('gender'),
            profilePic: doc.get('profilePic'),
          };
        });
        reslove(users);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
