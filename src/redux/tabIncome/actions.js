import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const loadIncomeTab = (force = false) => {
    return async (dispatch, getState) => {
        if(getState().tabIncome.fetching){
            return;
        }
        if(force || !getState().tabIncome.loaded){
            dispatch(updateInfo({
                fetching: true
            }));
            let loaded = getState().tabIncome.loaded;
            let incomeThisWeek = getState().tabIncome.incomeThisWeek;
            try {
                let rincomeThisWeek = await Utils.getAxios(getState().account.token).get('income/this-week');
                console.log(rincomeThisWeek);
                incomeThisWeek = rincomeThisWeek.data;
                loaded = true;
            }
            catch (e) {
                console.log(e.response);
            }
            finally {
                dispatch(updateInfo({
                    fetching: false,
                    loaded: loaded,
                    incomeThisWeek: incomeThisWeek
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