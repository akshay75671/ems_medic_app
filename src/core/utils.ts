import Storage from '@react-native-firebase/storage';
import {Colors} from '../styles';

export const getImageUriFromStorage = (path, fileName) => {
  return new Promise((resolve, reject) => {
    Storage()
      .ref(path)
      .child(fileName)
      .getDownloadURL()
      .then((uriLink) => {
        resolve(uriLink);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const getProfileStateColor = (status: string) => {
  return status == 'engaged'
    ? Colors.secondary
    : status == 'available'
    ? Colors.green
    : Colors.red;
};

export const moveArrayItem = (arr, old_index, new_index) => {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    let k = new_index - arr.length;
    while (k-- + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

export const filterObjectByValue = (obj, predicate) => {
  return Object.keys(obj ?? {})
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
};

export const filterObjectByKey = (obj, predicate) => {
  return Object.keys(obj ?? {})
    .filter((key) => predicate(key))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
};
