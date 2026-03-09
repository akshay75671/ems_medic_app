import {applyMiddleware, createStore, compose} from 'redux';
import {persistStore, persistReducer, createTransform} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducers from './reducers';
import JSOG from 'jsog';

const JSOGTransform = createTransform(
  (inboundState, key) => JSOG.encode(inboundState),
  (outboundState, key) => JSOG.decode(outboundState),
);

const enhancers = [
  applyMiddleware(
    thunkMiddleware,
    createLogger({
      collapsed: true,
      // eslint-disable-next-line no-undef
      predicate: () => __DEV__,
    }),
  ),
];

/* eslint-disable no-undef */
const composeEnhancers =
  (__DEV__ &&
    typeof window !== 'undefined' &&
    globalThis.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
/* eslint-enable no-undef */

const enhancer = composeEnhancers(...enhancers);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [JSOGTransform],
  blacklist: [],
};

//const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(reducers, applyMiddleware(thunkMiddleware));
//export const persistor = persistStore(store);
