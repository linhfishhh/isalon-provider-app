import AsyncStorage from "@react-native-community/async-storage";
import {
  aClearError,
  aFetchingDone,
  aFetchingStart,
  alogout,
  aSetError,
  aUpdateInfo,
  aUpdateRegisterData,
  aUpdateStartupRoute,
  aUpdateToken,
} from "./types";
import AppConfigs from "../../configs";
import OneSignal from "react-native-onesignal";
import * as DeviceInfo from "react-native-device-info";

export const updateToken = (token) => {
  return {
    type: aUpdateToken,
    token: token,
  };
};

const loadSettings = () =>
  new Promise(async (resolve, reject) => {
    try {
      const token = await AsyncStorage.getItem("@iSalon:token").catch(
        () => null
      );
      const secondaryToken = await AsyncStorage.getItem(
        "@iSalon:secondaryToken"
      ).catch(() => null);
      const welcomed = await AsyncStorage.getItem("@iSalon:welcomed").catch(
        () => null
      );
      const startupRoute = await AsyncStorage.getItem(
        "@iSalon:startupRoute"
      ).catch(() => null);
      const tabIndex = await AsyncStorage.getItem("@iSalon:tabIndex").catch(
        () => 0
      );
      resolve({
        token,
        secondaryToken,
        welcomed,
        startupRoute,
        tabIndex:
          tabIndex === null || tabIndex === undefined ? 0 : tabIndex * 1,
      });
    } catch (e) {
      reject({
        errorTitle: "Lỗi không xác định",
        errorMessage:
          "Có lỗi xảy ra trong quá trình xử lý, vui lòng đóng app và thử lại",
      });
    }
  });

const determineAccessRoute = async () => {
  let rs = "home";
  try {
    let settings = await loadSettings();
    if (settings.startupRoute !== null) {
      rs = settings.startupRoute;
    }
  } catch (error) {
    rs = Promise.reject({
      title: "Lỗi không xác định",
      message: "Một lỗi không xác định xảy ra, vui lòng đóng app và thử lại",
    });
  }
  return rs;
};

const saveAccountSettings = async (settings) => {
  try {
    await AsyncStorage.multiSet(settings);
  } catch (error) {
    return Promise.reject({
      title: "Lỗi không xác định",
      message: "Một lỗi không xác định xảy ra, vui lòng đóng app và thử lại",
    });
  }
};

export const loginWithOldToken = () => {
  return async (dispatch, getState) => {
    let welcomed = "0";
    try {
      let settings = await loadSettings();
      welcomed = settings.welcomed;
      let userData = await verifyToken(settings.token);
      console.log(userData);
      if (userData) {
        dispatch(
          updateInfo({
            salon: userData,
            user_id: userData.user_id,
            token: settings.token,
            secondaryToken: settings.secondaryToken,
            tabIndex: settings.tabIndex,
          })
        );
        dispatch(updateStartupRoute("home"));
      } else {
        if (welcomed === "1") {
          dispatch(updateStartupRoute("access"));
        } else {
          dispatch(updateStartupRoute("welcome"));
        }
      }
    } catch (error) {
      console.log(error + "");
      dispatch(updateStartupRoute("welcome"));
    }
  };
};

export const updateStartupRoute = (route) => {
  return {
    type: aUpdateStartupRoute,
    route: route,
  };
};

const verifyToken = async (token) => {
  try {
    let rs = await AppConfigs.getAxios(token).get("salon/short-info");
    return rs.data;
  } catch (e) {
    console.log(e.response);
    if (e.response.status === 500) {
      return Promise.reject("Lỗi xảy ra trong quá trình xử lý");
    }
    return false;
  }
};

export const login = (username, password) => {
  return async (dispatch, getState) => {
    dispatch(clearError());
    dispatch(starFetching());
    try {
      const api = await doLogin(username, password);
      const settings = await loadSettings();
      console.log(api);
      const token = api.data.token;
      const secondaryToken = api.data.secondaryToken;
      const user = api.data.salon;
      await saveAccountSettings([["@iSalon:token", token]]);
      if (secondaryToken) {
        await saveAccountSettings([["@iSalon:secondaryToken", secondaryToken]]);
      }
      dispatch(
        updateInfo({
          salon: user,
          user_id: user.user_id,
          token,
          secondaryToken,
          tabIndex: settings.tabIndex,
        })
      );
      dispatch(updateStartupRoute("home"));
    } catch (e) {
      dispatch(setError("Lỗi đăng nhập", e + ""));
    } finally {
      dispatch(doneFetching());
    }
  };
};

const doLogin = (username, password) => {
  const deviceId = DeviceInfo.getUniqueID();
  return AppConfigs.getAxios()
    .post("auth/login", {
      email_phone: username,
      password: password,
      uuid: deviceId,
    })
    .catch(function (e) {
      console.log(e.response);
      if (e.response.status === 401) {
        return Promise.reject(e.response.data.message);
      }
      if (e.response.status === 422) {
        return Promise.reject(AppConfigs.getValidationMessage(e.response));
      }
      return Promise.reject("Lỗi xảy ra trong quá trình xử lý");
    });
};

export const logout = () => {
  return async (dispatch) => {
    await saveAccountSettings([["@iSalon:token", ""]]);
    await saveAccountSettings([["@iSalon:secondaryToken", ""]]);
    dispatch({
      type: alogout,
    });
    OneSignal.setSubscription(false);
  };
};

export const setError = (title, msg) => {
  return {
    type: aSetError,
    message: msg,
    title: title,
  };
};

export const clearError = () => {
  return {
    type: aClearError,
  };
};

export const starFetching = () => {
  return {
    type: aFetchingStart,
  };
};

export const doneFetching = () => {
  return {
    type: aFetchingDone,
  };
};

export const updateInfo = (info) => {
  return {
    type: aUpdateInfo,
    info: info,
  };
};

export const registerStepOne = (phone, password, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await AppConfigs.getAxios().post("register/check", {
        phone: phone,
        password: password,
      });
      dispatch(
        updateRegisterData({
          phone: phone,
          password: password,
        })
      );
      //navigation.navigate('verify_phone')
      dispatch(sendPhoneVerify(phone, navigation));
    } catch (e) {
      dispatch(
        setError(
          "Lỗi đăng ký",
          e.response.status === 422
            ? AppConfigs.getValidationMessage(e.response)
            : "Có lỗi xảy ra trong quá trình xác nhận thông tin đăng ký"
        )
      );
      dispatch(doneFetching());
    }
  };
};

const requestNewPhoneVerify = (phone) => {
  return AppConfigs.getAxios().post("verify-phone", {
    phone: phone,
  });
};

export const resendPhoneVerify = (phone) => {
  return async (dispatch) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await requestNewPhoneVerify(phone);
    } catch (e) {
      //console.log(phone);
      dispatch(
        setError(
          "Lỗi đăng ký",
          e.response.status === 400
            ? e.response.data.message
            : "Có lỗi xảy ra trong quá trình gửi mã xác nhận"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const sendPhoneVerify = (phone, navigation) => {
  return async (dispatch) => {
    try {
      await requestNewPhoneVerify(phone);
      navigation.navigate("verify_phone");
    } catch (e) {
      //console.log(e.response);
      dispatch(
        setError(
          "Lỗi đăng ký",
          e.response.status === 400
            ? e.response.data.message
            : "Có lỗi xảy ra trong quá trình gửi mã xác nhận"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const verifyPhoneCode = (phone, code) => {
  return AppConfigs.getAxios().post("verify-phone-code", {
    phone: phone,
    code: code,
  });
};

export const registerStepTwo = (phone, code, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyPhoneCode(phone.trim(), code.trim());
      dispatch(
        updateRegisterData({
          code: code,
        })
      );
      navigation.navigate("new_user_step_one");
    } catch (e) {
      dispatch(
        setError(
          "Lỗi xác nhận",
          e.response.status === 400
            ? e.response.data.message
            : "Có lỗi xảy ra trong quá trình xác nhận mã"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const verifyInfoStepOne = (name, email) => {
  return AppConfigs.getAxios().post("verify-personal-info-step-one", {
    name: name,
    email: email,
  });
};

export const registerStepThree = (name, email, avatar, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyInfoStepOne(name, email);
      dispatch(
        updateRegisterData({
          name: name,
          email: email,
          avatar: avatar,
        })
      );
      navigation.navigate("new_user_step_two");
    } catch (e) {
      dispatch(
        setError(
          "Lỗi xác nhận",
          e.response.status === 422
            ? AppConfigs.getValidationMessage(e.response)
            : "Có lỗi xảy ra trong quá trình xử lý thông tin cá nhân"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const verifyStepTwo = (address, lv1, lv2, lv3) => {
  return AppConfigs.getAxios().post("verify-personal-info-step-two", {
    address: address,
    lv1: lv1,
    lv2: lv2,
    lv3: lv3,
  });
};

export const registerStepFinal = (address, lv1, lv2, lv3, navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyStepTwo(address, lv1, lv2, lv3);
      dispatch(
        updateRegisterData({
          address: address,
          lv1: lv1,
          lv2: lv2,
          lv3: lv3,
        })
      );
      navigation.navigate("agreement");
    } catch (e) {
      dispatch(
        setError(
          "Lỗi xác nhận",
          e.response.status === 422
            ? AppConfigs.getValidationMessage(e.response)
            : "Lỗi khi xác nhận địa chỉ"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requrestJoinTOS = () => {
  return AppConfigs.getAxios().post("get-join-tos");
};

export const updateJoinTOS = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      let rq = await requrestJoinTOS();
      let html = rq.data;
      dispatch(
        updateInfo({
          temp: {
            joinTOS: html,
          },
        })
      );
    } catch (e) {
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requestCreateAccount = (data) => {
  let form = new FormData();
  for (let name in data) {
    if (data[name] !== undefined) {
      form.append(name, data[name]);
    }
  }
  return AppConfigs.getAxios(undefined, {
    "Content-Type": "multipart/form-data",
  }).post("account/create", form);
};

export const createAccount = (navigation) => {
  return async (dispatch, getState) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      const rq = await requestCreateAccount(getState().account.registerData);
      const token = rq.data.token;
      const secondaryToken = rq.data.secondaryToken;
      const user = rq.data.user;
      await saveAccountSettings([["@iSalon:token", token]]);
      if (secondaryToken) {
        await saveAccountSettings([["@iSalon:secondaryToken", secondaryToken]]);
      }
      let route = await determineAccessRoute();
      dispatch(
        updateInfo({
          ...user,
          token: token,
        })
      );
      dispatch(updateStartupRoute(route));
    } catch (e) {
      console.log(e.response);
      //Alert.alert('Lỗi trong quá trình hoàn tất đăng ký');
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requestResetPassword = (username) => {
  return AppConfigs.getAxios().post("account/reset-password", {
    username: username,
  });
};

export const resetPassswordStepOne = (username, navigation) => {
  return async (dispatch) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      let rq = await requestResetPassword(username);
      let phone = rq.data;
      navigation.navigate("reset_pass_verify", {
        phone: phone,
      });
    } catch (e) {
      console.log(e + "");
      dispatch(
        setError(
          "Lỗi xác nhận",
          e.response.status === 422
            ? AppConfigs.getValidationMessage(e.response)
            : e.response.status === 400
            ? e.response.data.message
            : "Lỗi khi xác nhận số điện thoại hoặc emnail"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

export const resetPassswordStepTwo = (phone, code, navigation) => {
  return async (dispatch) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await verifyPhoneCode(phone, code);
      navigation.navigate("new_pass", {
        phone: phone,
        code: code,
      });
    } catch (e) {
      dispatch(
        setError(
          "Lỗi xác nhận",
          e.response.status === 400
            ? e.response.data.message
            : "Có lỗi xảy ra trong quá trình xác nhận mã"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const requestNewPassword = (phone, code, password, cpassword) => {
  return AppConfigs.getAxios().post("account/new-password", {
    phone: phone,
    code: code,
    password: password,
    password_confirmation: cpassword,
  });
};

export const resetPassswordStepThree = (
  phone,
  code,
  password,
  cpassword,
  navigation
) => {
  return async (dispatch) => {
    try {
      dispatch(starFetching());
      dispatch(clearError());
      await requestNewPassword(phone, code, password, cpassword);
      dispatch(
        updateInfo({
          resetPasswordDone: true,
        })
      );
    } catch (e) {
      dispatch(
        setError(
          "Lỗi xác nhận",
          e.response.status === 422
            ? AppConfigs.getValidationMessage(e.response)
            : "Lỗi khi khởi tạo mật khẩu"
        )
      );
    } finally {
      dispatch(doneFetching());
    }
  };
};

const updateRegisterData = (data) => {
  return {
    type: aUpdateRegisterData,
    data: data,
  };
};
