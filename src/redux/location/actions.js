import Utils from '../../configs'
import {lClearError, lFetchingDone, lFetchingStart, lSetError, lUpdateInfo} from "./types";


export const clearLocationData = () => {
    return async (dispatch, getState) => {
        dispatch(updateInfo({
            fetching: false,
            error: false,
            errorMessage: undefined,
            errorTitle: undefined,
            lv1: [],
            lv1Title: undefined,
            lv1Value: undefined,
            lv2: [],
            lv2Title: undefined,
            lv2Value: undefined,
            lv3: [],
            lv3Title: undefined,
            lv3Value: undefined,
        }));
    }
};

const requestLv1 = () => {
    return Utils.getAxios().post(
        'location/lv1'
    );
};

const requestLv2 = (parent) => {
    return Utils.getAxios().post(
        'location/lv2',
        {
            parent_lv: parent
        }
    );
};

const requestLv3 = (parent) => {
    return Utils.getAxios().post(
        'location/lv3',
        {
            parent_lv: parent
        }
    );
};

export const loadLv1 = (after = ()=>{}) => {
    return async (dispatch, getState) => {
        try{
            dispatch(updateInfo({
                fetching: true
            }));
            let request = await requestLv1();
            let items = request.data;
            dispatch(updateInfo({
                lv1: items,
                lv2Title: undefined,
                lv2Value: undefined
            }));
            after();
        }
        catch (e) {
            console.log(e.response)
        }
        finally {
            dispatch(updateInfo({
                fetching: false
            }));
        }
    }
};

export const setLv1 = (value, after = () => {}) => {
    return (dispatch, getState) => {
        let items = getState().location.lv1;
        let title = '';
        items.every((item) => {
           if (item.value === value+''){
               title = item.label
           }
           else{
               return item;
           }
        });
        dispatch(updateInfo({
            lv1Title: title,
            lv1Value: value
        }));
        dispatch(loadLv2(value, after));
    }
};
export const setLv2 = (value,  after = () => {}) => {
    return (dispatch, getState) => {
        let items = getState().location.lv2;
        let title = '';
        items.every((item) => {
            if (item.value === value+''){
                title = item.label
            }
            else{
                return item;
            }
        });
        dispatch(updateInfo({
            lv2Title: title,
            lv2Value: value,
        }));
        dispatch(loadLv3(value, after));
    }
};
export const setLv3 = (value,  after = () => {}) => {
    return (dispatch, getState) => {
        let items = getState().location.lv3;
        let title = '';
        items.every((item) => {
            if (item.value === value+''){
                title = item.label
            }
            else{
                return item;
            }
        });
        dispatch(updateInfo({
            lv3Title: title,
            lv3Value: value
        }))
        after();
    }
};

export const loadLv2 = (parent, after = ()=>{}) => {
    return async (dispatch, getState) => {
        try{
            dispatch(updateInfo({
                fetching: true
            }));
            let request = await requestLv2(parent);
            let items = request.data;
            dispatch(updateInfo({
                lv2: items,
                lv2Title: undefined,
                lv2Value: undefined,
                lv3Title: undefined,
                lv3Value: undefined,
                fetching: false
            }));
            after();
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false
            }));
        }
    }
};

export const loadLv3 = (parent, after = ()=>{}) => {
    return async (dispatch, getState) => {
        try{
            dispatch(updateInfo({
                fetching: true
            }));
            let request = await requestLv3(parent);
            let items = request.data;

            dispatch(updateInfo({
                lv3: items,
                lv3Title: undefined,
                lv3Value: undefined,
                fetching: false
            }));
            after();
        }
        catch (e) {
        }
        finally {
            dispatch(updateInfo({
                fetching: false
            }));
        }
    }
};

export const setError = (title, msg) =>{
    return {
        type: lSetError,
        message: msg,
        title: title
    }
};

export const clearError = () =>{
    return {
        type: lClearError,
    }
};

export const starFetching = () =>{
    return {
        type: lFetchingStart,
    }
};

export const doneFetching = () =>{
    return {
        type: lFetchingDone,
    }
};

export const updateInfo = (info) =>{
    return {
        type: lUpdateInfo,
        info : info
    }
};