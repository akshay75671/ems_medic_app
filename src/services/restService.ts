import Axios from 'axios';
import Config from '../core/config';
import {getUserAccessToken} from './authServices';
import CryptoJS from 'react-native-crypto-js';

export const emsDevelopment = (_data) => {
  return new Promise((reslove, reject) => {
    getUserAccessToken()
      .then((accessToken) => {
        var data = JSON.stringify({
          query: _data,
          variables: {},
        });
        let emsObj = {token: accessToken, body: data};
        var config = {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            ems: CryptoJS.AES.encrypt(
              JSON.stringify(emsObj),
              Config.CRYPTO_KEY,
            ).toString(),
          },
        };
        Axios.post(Config.BASE_URL, data, config)
          .then((result) => {
            //console.log(result);
            reslove(result.config);
          })
          .catch((error) => {
            reject(error.message);
          });
      })
      .catch((error) => {
        //console.log(error);
        reject(error.message);
      });
  });
};
