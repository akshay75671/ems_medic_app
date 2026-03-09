import {scale} from 'react-native-size-matters';

export const boxModelSize = {
  s: scale(5),
  m: scale(10),
  l: scale(15),
  xl: scale(20),
  xxl: scale(25),
  xxxl: scale(50),
};
const boxModelPlaces = {
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
};
type boxType = {
  type: 'margin' | 'padding';
  size: 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
  places:
    | 't'
    | 'r'
    | 'b'
    | 'l'
    | 'tb'
    | 'lr'
    | 'tl'
    | 'tr'
    | 'bl'
    | 'rl'
    | 'rb'
    | 'trb'
    | 'trl'
    | 'tbl'
    | 'rbl'
    | 'all';
};
const boxModel = ({type, size, places}: boxType) => {
  let _boxModel = {};
  if (places != 'all') {
    places.split('').forEach((place) => {
      _boxModel[type + boxModelPlaces[place]] = boxModelSize[size];
    });
  } else {
    _boxModel['padding'] = boxModelSize[size];
  }
  return _boxModel;
};

export default boxModel;
