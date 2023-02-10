import axios from "axios";
import Colors from "./styles/Colors";
import {
  GOOGLE_MAPS_API_KEY,
  ONESIGNAL_APP_ID,
  API_END_POINT,
  WALLET_END_POINT,
} from "react-native-dotenv";

export default {
  googleMapApiKey: GOOGLE_MAPS_API_KEY,
  oneSignalAppID: ONESIGNAL_APP_ID,
  getAxios: (token = undefined, headers = {}) => {
    return axios.create({
      baseURL: API_END_POINT,
      headers: {
        Accept: "application/json",
        Authorization: token !== undefined ? "Bearer " + token : "",
        ...headers,
      },
    });
  },
  getNewAxios: (token = undefined, headers = {}) => {
    return axios.create({
      baseURL: WALLET_END_POINT,
      headers: {
        Accept: "application/json",
        Authorization: token !== undefined ? "Bearer " + token : "",
        "tenant-id": "isalon",
        ...headers,
      },
    });
  },
  getValidationMessage: (response) => {
    let rs = "";
    let i = 0;
    for (let name in response.data.errors) {
      if (i > 0) {
        rs += "\n";
      }
      rs += "■ " + response.data.errors[name][0];
      i++;
    }
    return rs;
  },

  defaultTouchSize: {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30,
  },
  getBookingStatusList: [
    {
      id: -3,
      title: "Huỷ do quá hạn xử lý",
    },
    {
      id: -2,
      title: "Huỷ bởi salon",
    },
    {
      id: -1,
      title: "Huỷ bởi khách",
    },
    {
      id: 0,
      title: "Chờ salon duyệt",
    },
    {
      id: 1,
      title: "Chờ thanh toán",
    },
    {
      id: 2,
      title: "Chờ thực hiện",
    },
    {
      id: 3,
      title: "Đã hoàn thành",
    },
    {
      id: 4,
      title: "Khách vắng",
    },
  ],
  getBookingStatus: (status) => {
    let name = "";
    let color = "";
    let text = "";
    switch (status) {
      case -3:
        color = Colors.SILVER;
        name = "block";
        text = "Huỷ do quá hạn xử lý";
        break;
      case -2:
        color = Colors.SILVER;
        name = "block";
        text = "Huỷ bởi salon";
        break;
      case -1:
        color = Colors.SILVER;
        name = "block";
        text = "Huỷ bởi khách";
        break;
      case 0:
        color = "#ff931f";
        name = "schedule";
        text = "Chờ salon duyệt";
        break;
      case 1:
        color = Colors.PRIMARY;
        name = "timer";
        text = "Chờ thanh toán";
        break;
      case 2:
        color = Colors.ERROR;
        name = "date-range";
        text = "Chờ thực hiện";
        break;
      case 3:
        color = "#29B473";
        name = "check-circle";
        text = "Đã hoàn thành";
        break;
      case 4:
        color = Colors.SILVER;
        name = "highlight-off";
        text = "Khách vắng";
        break;
    }
    return {
      text: text,
      name: name,
      color: color,
    };
  },
};
