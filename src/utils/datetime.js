import moment from "moment";
import "moment/src/locale/vi";

const datetimeFormat = (time, format = "DD-MM-YYYY | HH:mm") =>
  time ? moment.utc(time).local().format(format) : "";

const datetimeUTCFormat = (time, format = "DD-MM-YYYY | HH:mm") =>
  time ? moment.utc(time).format(format) : "";

const datetimeNow = () =>
  moment().locale("vi").format("dddd DD/MM/YYYY, h:mm:ss");

export { datetimeFormat, datetimeUTCFormat, datetimeNow };
