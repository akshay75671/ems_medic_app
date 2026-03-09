/**
 * @flow
 */
import {Dimensions, Platform} from 'react-native';

import Colors from './colors';
import Fonts from './fonts';
import boxModel, {boxModelSize} from './boxModel';
import commonStyles, {fontSize} from './common';

const {width} = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth: number = 350;
const scale = (size: number): number => (width / guidelineBaseWidth) * size;

export {Colors, Fonts, commonStyles, boxModel, boxModelSize, fontSize};
