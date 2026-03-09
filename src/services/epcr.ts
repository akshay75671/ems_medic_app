import fireStore from '@react-native-firebase/firestore';

export const addEPCR = (epcrs: any[]) => {
  return new Promise((reslove, reject) => {
    let batch = fireStore().batch();
    epcrs.forEach((epcr, index) => {
      batch.set(fireStore().collection('medicprovider_event_epcr').doc(), {
        ...epcr,
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
