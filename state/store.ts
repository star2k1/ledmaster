import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { bleMiddleware } from './BluetoothLE/listener';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import bleReducer from './BluetoothLE/bleSlice';
import matrixReducer from './Matrix/matrixSlice';
import deviceReducer from './Device/deviceSlice';

const appPersistConfig = {
    key:'root',
    storage: storage,
    whitelist: ['matrix'],
    stateReconciler: autoMergeLevel2
};

const blePersistConfig = {
    key:'ble',
    storage: storage,
    whitelist: ['allDevices']
};

const appReducer = combineReducers({
    ble: persistReducer(blePersistConfig, bleReducer),
    matrix: matrixReducer,
    device: deviceReducer
});

const persistedReducer = persistReducer(appPersistConfig, appReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        }).concat(bleMiddleware.middleware);
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;