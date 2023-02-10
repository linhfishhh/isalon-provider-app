import Utils from '../../configs'
import {lFetchingDone, lFetchingStart, lUpdateInfo} from "./types";

export const updateCount = () => {
    return async(dispatch, getState) => {
        try {
            let rq = await Utils.getAxios(getState().account.token).get(
                'notification/count'
            );
            console.log(rq.data);
            dispatch(updateInfo({
                count: rq.data
            }));
        }
        catch (e) {
            console.log(e.response);
        }
    }
};

export const readNotify = (id) => {
    return async(dispatch, getState) => {
        try {
            let rq = await Utils.getAxios(getState().account.token).post(
                'notification/'+id+'/read'
            );
            dispatch(
                updateInfo(
                    {
                        count: rq.data
                    }
                )
            );
        }
        catch (e) {
            console.log(e.response);
        }
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