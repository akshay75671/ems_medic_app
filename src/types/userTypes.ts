import {USER} from '../redux/profile/profileTypes';

export interface userObjTypes {
  isNewUser: boolean;
  isBiometricsEnabled: boolean;
  user?: Partial<USER>;
}
