import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const loadRatingTab = (force = false) => {
    return async (dispatch, getState) => {
        if(getState().tabRating.fetching){
            return;
        }
        if(force || !getState().tabRating.loaded){
            dispatch(updateInfo({
                fetching: true
            }));
            let loaded = getState().tabRating.loaded;
            let data = getState().tabRating.data;
            try {
                let rq = await Utils.getAxios(getState().account.token).get('rating-screen');
                data = rq.data;
                console.log(data);
                loaded = true;
            }
            catch (e) {
                console.log(e.response);
            }
            finally {
                dispatch(updateInfo({
                    fetching: false,
                    loaded: loaded,
                    data: data
                }));
            }
        }
    }
};

export const setError = (title, msg) =>{
    return {
        type: setError,
        message: msg,
        title: title
    }
};

export const clearError = () =>{
    return {
        type: aclearError,
    }
};

export const starFetching = () =>{
    return {
        type: afetchingStart,
    }
};

export const doneFetching = () =>{
    return {
        type: afetchingDone,
    }
};

export const updateInfo = (info) =>{
    return {
        type: aupdateInfo,
        info : info
    }
};