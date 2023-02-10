import Utils from '../../configs'
import {aclearError, afetchingDone, afetchingStart, aupdateInfo} from "./types";

export const loadHomeTabNewBooking = () => {

    return async (dispatch, getState) => {
        dispatch(updateInfo({
            fetching: true,
        }));
        let nextNewBooking = getState().tabHome.nextNewBooking;
        try {

            let rnextNewBooking = await Utils.getAxios(getState().account.token).get('booking/new/next');
            nextNewBooking = rnextNewBooking.data;
        }
        catch (e) {
            console.log(e.response);
        }
        finally {
            dispatch(updateInfo({
                fetching: false,
                nextNewBooking: nextNewBooking,
            }));
        }
    }
};

export const loadHomeTab = (force = false) => {

    return async (dispatch, getState) => {
        if(getState().tabHome.fetching){
            return;
        }
        if(force || !getState().tabHome.loaded){
            dispatch(updateInfo({
                fetching: true
            }));
            let loaded = getState().tabHome.loaded;
            let incomeThisWeek = getState().tabHome.incomeThisWeek;
            let incomeToday = getState().tabHome.incomeToday;
            let nextWaitingBooking = getState().tabHome.nextWaitingBooking;
            let nextNewBooking = getState().tabHome.nextNewBooking;
            let nextMayDoneBooking = getState().tabHome.nextMayDoneBooking;
            let homeNews = getState().tabHome.homeNews;
            try {
                let rs = await Utils.getAxios(getState().account.token).get('home-screen');
                let data = rs.data;
                incomeThisWeek = data.incomeThisWeek;
                incomeToday = data.incomeToday;
                nextWaitingBooking = data.nextWaitingBooking;
                nextNewBooking = data.nextNewBooking;
                nextMayDoneBooking = data.nextMayDoneBooking;
                homeNews= data.homeNews;
                console.log(data);
                loaded = true;
            }
            catch (e) {
                console.log(e.response);
            }
            finally {
                dispatch(updateInfo({
                    fetching: false,
                    incomeThisWeek: incomeThisWeek,
                    incomeToday: incomeToday,
                    nextWaitingBooking: nextWaitingBooking,
                    nextNewBooking: nextNewBooking,
                    nextMayDoneBooking: nextMayDoneBooking,
                    homeNews: homeNews,
                    loaded: loaded
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