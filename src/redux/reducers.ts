import {combineReducers} from 'redux';
import profileReducer from './profile/profileReducer';

const appReducer = combineReducers({
  profile: profileReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGGED_OUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
