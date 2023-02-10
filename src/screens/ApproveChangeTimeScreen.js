import React, { Component } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import { DotIndicator } from "react-native-indicators";
import Utils from "../configs";
import { connect } from "react-redux";
import { Line, Polyline } from "react-native-svg";
import Svg from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import WAButton from "../components/WAButton";
import numeral from "numeral";
import WAAlert from "../components/WAAlert";
import { loadHomeTab } from "../redux/tabHome/actions";
import { loadIncomeTab } from "../redux/tabIncome/actions";

type Props = {};
class ApproveChangeTimeScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam("id"),
      loading: true,
      error: false,
      data: {
        old_time: "",
        old_date: "",
        new_time: "",
        new_date: "",
        services: [],
        order_id: 0,
      },
      alert: false,
      alertMessage: "",
      alertFunc: () => {},
      successAlert: false,
      successAlertMessage: "",
    };
  }

  accept = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).post(
            "booking/change-request/" + this.state.id + "/accept"
          );
          console.log(rq.data);
          this.setState({
            loading: false,
            successAlert: true,
            successAlertMessage: "Yêu cầu đã được duyệt thành công!",
          });
        } catch (e) {
          this.setState({
            loading: false,
            error: true,
          });
          console.log(e.response);
        }
      }
    );
  };

  cancel = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).post(
            "booking/change-request/" + this.state.id + "/cancel"
          );
          console.log(rq.data);
          this.setState({
            loading: false,
            successAlert: true,
            successAlertMessage: "Yêu cầu đã bị huỷ thành công!",
          });
        } catch (e) {
          this.setState({
            loading: false,
            error: true,
          });
          console.log(e.response);
        }
      }
    );
  };

  _load = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).get(
            "booking/change-request/" + this.state.id + "/info"
          );
          console.log(rq.data);
          this.setState({
            loading: false,
            data: rq.data,
          });
        } catch (e) {
          this.setState({
            loading: false,
            error: true,
          });
          console.log(e.response);
        }
      }
    );
  };

  componentDidMount() {
    this._load();
  }

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[
          GlobalStyles.pageWrapper,
          { paddingLeft: 0, paddingRight: 0 },
        ]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        layoutPadding={15}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        navigationButtonStyle={{ color: Colors.LIGHT }}
        headerTitle={"DUYỆT YÊU CẦU"}
        headerTitleColor={Colors.LIGHT}
      >
        {this.state.loading ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <View style={Styles.pageWrapperInner}>
            {this.state.error ? (
              <View style={Styles.errorBox}>
                <Icon style={Styles.errorBoxIcon} name={"block"} />
                <Text style={Styles.errorBoxText}>
                  Yêu cầu đổi thời gian đã bị huỷ, đã xử lý hoặc không tồn tại
                </Text>
              </View>
            ) : (
              <ScrollView bounces={false} style={Styles.content}>
                <Text style={Styles.pageTitle}>
                  Đơn đặt chỗ #{this.state.data.order_id}
                </Text>
                <View style={Styles.times}>
                  <View style={Styles.arrowWrapper}>
                    <Svg style={Styles.arrow} width={67} height={14}>
                      <Polyline
                        points="59.54 0.71 65.34 6.51 59.54 12.31"
                        fill="none"
                        stroke="#ff5c39"
                        strokeWidth="2"
                      />
                      <Line
                        x1="65.63"
                        y1="6.51"
                        y2="6.51"
                        fill="none"
                        stroke="#ff5c39"
                        strokeWidth="2"
                      />
                    </Svg>
                  </View>
                  <View style={[Styles.time, Styles.timeLeft]}>
                    <View style={Styles.timeBlock}>
                      <Text style={Styles.timeTitle}>Thời gian làm</Text>
                      <Text style={Styles.timeValue}>
                        {this.state.data.old_time}
                      </Text>
                    </View>
                    <View style={[Styles.timeBlock, Styles.timeBlockBottom]}>
                      <Text style={Styles.timeTitle}>Ngày làm</Text>
                      <Text style={Styles.timeValue}>
                        {this.state.data.old_date}
                      </Text>
                    </View>
                  </View>
                  <View style={[Styles.time, Styles.timeRight]}>
                    <View style={Styles.timeBlock}>
                      <Text style={Styles.timeTitle}>Thời gian làm</Text>
                      <Text style={Styles.timeValue}>
                        {this.state.data.new_time}
                      </Text>
                    </View>
                    <View style={[Styles.timeBlock, Styles.timeBlockBottom]}>
                      <Text style={Styles.timeTitle}>Ngày làm</Text>
                      <Text style={Styles.timeValue}>
                        {this.state.data.new_date}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={Styles.serviceTitle}>Thông tin dịch vụ</Text>
                <View style={Styles.services}>
                  {this.state.data.services.map((item, index) => {
                    return (
                      <View key={"sv-" + index} style={Styles.service}>
                        <Text style={Styles.serviceName}>
                          <Icon
                            style={Styles.serviceIcon}
                            name={"brightness-1"}
                          />{" "}
                          {item.name} x{item.qty}
                        </Text>
                        <Text style={Styles.servicePrice}>
                          {numeral(item.sum).format("0,000")}₫
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <View style={Styles.actions}>
                  <WAButton
                    onPress={() => {
                      this.setState({
                        alert: true,
                        alertMessage:
                          "Bạn có chắc chắn chấp nhận yêu cầu đổi thời gian thực hiện này không?",
                        alertFunc: this.accept,
                      });
                    }}
                    style={Styles.button}
                    text={"Đồng ý"}
                  />
                  <WAButton
                    onPress={() => {
                      this.setState({
                        alert: true,
                        alertMessage:
                          "Bạn có chắc chắn muốn từ chối yêu cầu đổi thời gian thực hiện này không?",
                        alertFunc: this.cancel,
                      });
                    }}
                    style={[Styles.button, Styles.buttonWhite]}
                    text={"Từ chối"}
                    textStyle={{ color: Colors.TEXT_DARK }}
                  />
                </View>
                <WAAlert
                  show={this.state.alert}
                  title={"Duyệt yêu cầu"}
                  question={this.state.alertMessage}
                  yes={() => {
                    this.setState(
                      {
                        alert: false,
                      },
                      this.state.alertFunc
                    );
                  }}
                  no={() => {
                    this.setState({
                      alert: false,
                    });
                  }}
                  titleFirst={true}
                  yesTitle={"Có"}
                />
                <WAAlert
                  show={this.state.successAlert}
                  title={"Duyệt yêu cầu"}
                  question={this.state.successAlertMessage}
                  yes={() => {
                    this.setState(
                      {
                        successAlert: false,
                      },
                      () => {
                        this.props.loadHomeTab();
                        this.props.loadIncomeTab();
                        this.props.navigation.goBack();
                      }
                    );
                  }}
                  no={false}
                  titleFirst={true}
                  yesTitle={"Đã hiểu"}
                />
              </ScrollView>
            )}
          </View>
        )}
      </PageContainer>
    );
  }
}
export default connect(
  (state) => {
    return {
      account: state.account,
    };
  },
  {
    loadHomeTab,
    loadIncomeTab,
  }
)(ApproveChangeTimeScreen);

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: "flex-start",
  },
  pageWrapperInner: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
  },
  pageTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.TEXT_DARK,
    marginBottom: 30,
  },
  times: {
    flexDirection: "row",
    marginBottom: 30,
  },
  time: {
    flex: 1,
    alignItems: "center",
    borderColor: Colors.SILVER_LIGHT,
    borderWidth: 1,
    padding: 15,
    borderRadius: 2,
  },
  timeLeft: {
    marginRight: 15,
  },
  timeRight: {
    marginLeft: 15,
  },
  timeTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
    color: Colors.TEXT_DARK,
  },
  timeValue: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.TEXT_DARK,
  },
  timeBlock: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  timeBlockBottom: {
    marginBottom: 0,
  },
  arrowWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    color: Colors.SILVER_DARK,
    marginBottom: 20,
  },
  services: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 2,
    borderLeftColor: Colors.PRIMARY,
    borderLeftWidth: 5,
    borderTopColor: Colors.SILVER_LIGHT,
    borderTopWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    borderRightColor: Colors.SILVER_LIGHT,
    borderRightWidth: 1,
    marginBottom: 30,
  },
  service: {
    marginBottom: 15,
    flexDirection: "row",
  },
  serviceIcon: {
    color: Colors.PRIMARY,
  },
  serviceName: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    color: Colors.TEXT_DARK,
  },
  servicePrice: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    fontWeight: "bold",
  },
  actions: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  button: {
    marginBottom: 15,
  },
  buttonWhite: {
    backgroundColor: Colors.LIGHT,
    borderWidth: 1,
    borderColor: Colors.SILVER,
  },
  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorBoxIcon: {
    fontSize: 50,
    marginBottom: 15,
    color: Colors.ERROR,
  },
  errorBoxText: {
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    textAlign: "center",
    marginLeft: 30,
    marginRight: 30,
  },
});
