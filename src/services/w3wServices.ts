import axios from 'axios';
import {getUserAccessToken} from './authServices';
import Config from '../core/config';
import {LatLng} from 'react-native-maps';

export const convertTow3w = (coordinate: LatLng) => {
  return new Promise((reslove, reject) => {
    getUserAccessToken()
      .then((accessToken) => {
        //console.log("access token : " + accessToken);
        var _query = `query {\n  convertTo3wa (input : {lat:"${coordinate.latitude}", lng:"${coordinate.longitude}"}) {\n    data, status, message \n  }\n}`;

        var data = JSON.stringify({
          query: _query,
          variables: {},
        });

        var config = {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          },
        };

        axios
          .post(Config.BASE_URL, data, config)
          .then((result) => {
            reslove(result.data);
          })
          .catch((error) => {
            reject({error: error.message});
          });
      })
      .catch((error) => {
        reject({error: error});
      });
  });
};

export const convertToCoordinates = (w3wString: String) => {
  return new Promise((reslove, reject) => {
    getUserAccessToken()
      .then((accessToken) => {
        console.log('access token : ' + accessToken);
        var _query = `query {\n  convertToCoordinates (input : { w3wa:"${w3wString}"}) {\n    data, status, message \n  }\n}`;

        var data = JSON.stringify({
          query: _query,
          variables: {},
        });

        var config = {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          },
        };

        axios
          .post(Config.BASE_URL, data, config)
          .then((result) => {
            reslove(result.data);
          })
          .catch((error) => {
            reject({error: error.message});
          });
      })
      .catch((error) => {
        reject({error: error});
      });
  });
};
