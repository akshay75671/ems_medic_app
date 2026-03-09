import fireStore from '@react-native-firebase/firestore';
import {getUserID} from './authServices';

export const fetchAssistSafeguardDetails = (assistUserID) => {
    return new Promise((resolve, reject) => {
        fireStore()
        .collection('safeguards')
        .where('assistUserID', '==', assistUserID)
        .get({source: 'default'})
        .then((querySnapshot) => {
            querySnapshot.docs.length?querySnapshot.forEach(function (doc) {
                resolve({data: doc.data(), id: doc.id});
            }):resolve({data: null, id: null});
        })
        .catch((error) => {
            reject(error.message)
        })
    });
}