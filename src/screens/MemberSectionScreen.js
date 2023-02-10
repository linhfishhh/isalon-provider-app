import React, { Component } from "react";
import {
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import MemberHomeScreen from "./MemberHomeScreen";
import Colors from "../styles/Colors";
import MemberAccountScreen from "./MemberAccountScreen";
import GlobalStyles from "../styles/GlobalStyles";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Icon from "react-native-vector-icons/MaterialIcons";
import Svg, { Circle, Path } from "react-native-svg";
import MemberIncomeScreen from "./MemberIncomeScreen";
import MemberRatingScreen from "./MemberRatingScreen";
import { updateTabIndex } from "../redux/home/actions";
import { connect } from "react-redux";
import { loadHomeTab } from "../redux/tabHome/actions";
import { loadIncomeTab } from "../redux/tabIncome/actions";
import { loadRatingTab } from "../redux/tabRating/actions";
import { readNotify, updateCount } from "../redux/notify/actions";
import NavigationService from "../NavigationService";
import { updateInfo as updateAccountInfo } from "../redux/account/actions";
import OneSignal from "react-native-onesignal";
import Utils from "../configs";
import { updateDeviceUserIDTag } from "../oneSignal";
import { NavigationActions } from "react-navigation";
import WAAlert from "../components/WAAlert";

class MemberSectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index:
        this.props.account.tabIndex === null ||
        this.props.account.tabIndex === undefined
          ? 0
          : this.props.account.tabIndex,
      routes: this._getDefs(),
      onlineProcessing: false,
      alert: false,
      alertTitle: "",
      alertMessage: "",
    };
  }

  onReceived = (notification) => {
    console.log("onReceived");
    console.log(notification);
    this.props.updateCount();
  };

  ensureNotRoute = (routeNot) => {
    let route = NavigationService.getCurrentRoute();
    if (route) {
      if (route.routeName === routeNot) {
        let navigator = NavigationService.navigator();
        let back = NavigationActions.back();
        navigator.dispatch(back);
      }
    }
  };

  onOpened = ({ action, notification }) => {
    let data = notification.payload.additionalData;
    let scope = data.scope;
    if (scope !== "salon") {
      return;
    }
    let route = data.route ? data.route : null;
    let navigator = NavigationService.navigator();
    if (route) {
      let routeName = route[0];
      let params = route[1];
      this.ensureNotRoute(routeName);
      try {
        this.props.readNotify(data.notification_id);
        if (routeName === "home") {
          console.log(params.tabIndex);
          this.setState(
            {
              index: params.tabIndex,
            },
            () => {
              this.state.routes[params.tabIndex].loadAction();
            }
          );
        }
        setTimeout(() => {
          let navigate = NavigationActions.navigate({
            routeName: routeName,
            params: params,
          });
          navigator.dispatch(navigate);
        }, 100);
      } catch (e) {}
    } else {
      this.ensureNotRoute("home_account_notification");
      this.props.navigation.navigate("home_account_notification");
    }
  };

  onIds = async ({ pushToken, userId }) => {
    console.log(userId);
    this.props.updateAccountInfo({
      device_id: userId,
    });
    await updateDeviceUserIDTag({
      user_id: this.props.account.salon.user_id,
      salon_id: this.props.account.salon.salon_id,
      location: this.props.account.salon.location_id,
    });

    //console.log(store.getState());
  };

  initOneSignal = async () => {
    console.log(Utils.oneSignalAppID);
    OneSignal.init(Utils.oneSignalAppID);
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
    // OneSignal.configure(); // deprecated
    OneSignal.setSubscription(true);
  };

  notiSetup = async () => {
    await this.initOneSignal();
    if (this.state.index === 0) {
      this.props.loadHomeTab();
    } else if (this.state.index === 1) {
      this.props.loadIncomeTab();
    }
    this.props.updateCount();
  };

  componentDidMount() {
    this.notiSetup();
  }

  _getDefs = () => [
    {
      key: "home",
      headerColor: Colors.DARK,
      icon: (
        <Svg height="25" width="25">
          <Path
            d="M14.92,24.11h6.56V9S14,.84,11,.5C8,.84.5,9,.5,9V24.11H8.86V14.92"
            stroke={Colors.SILVER}
            fill={Colors.TRANSPARENT}
          />
        </Svg>
      ),
      icon_active: (
        <Svg height="25" width="25">
          <Path
            d="M14.92,24.11h6.56V9S14,.84,11,.5C8,.84.5,9,.5,9V24.11H8.86V14.92"
            stroke={Colors.SECONDARY}
            fill={Colors.SECONDARY}
          />
        </Svg>
      ),
      title: "TRANG CHỦ",
      screen: MemberHomeScreen,
      navigation: this.props.navigation,
      loadAction: this.props.loadHomeTab,
    },
    {
      key: "income",
      headerColor: Colors.DARK,
      icon: (
        <Svg height="26" width="34">
          <Path
            d="M4.26,12.71l1,13a.36.36,0,0,0,.38.32l27.79-2.16a.27.27,0,0,0,.25-.3l-1-13.15a.24.24,0,0,0-.25-.22L4.56,12.36A.32.32,0,0,0,4.26,12.71ZM20,22.53a4.09,4.09,0,1,1,3.11-3.64A4.09,4.09,0,0,1,20,22.53Z"
            fill="none"
            stroke={Colors.SILVER}
          />
          <Path
            d="M29.88,8.12,26.65.64a.23.23,0,0,0-.31-.12L.7,11.6A.32.32,0,0,0,.53,12l2.85,6.6"
            fill="none"
            stroke={Colors.SILVER}
          />
        </Svg>
      ),
      icon_active: (
        <Svg height="26" width="34">
          <Path
            d="M4.26,12.71l1,13a.36.36,0,0,0,.38.32l27.79-2.16a.27.27,0,0,0,.25-.3l-1-13.15a.24.24,0,0,0-.25-.22L4.56,12.36A.32.32,0,0,0,4.26,12.71ZM20,22.53a4.09,4.09,0,1,1,3.11-3.64A4.09,4.09,0,0,1,20,22.53Z"
            fill={Colors.SECONDARY}
            stroke={Colors.TRANSPARENT}
          />
          <Path
            d="M29.88,8.12,26.65.64a.23.23,0,0,0-.31-.12L.7,11.6A.32.32,0,0,0,.53,12l2.85,6.6"
            fill={Colors.SECONDARY}
            stroke={Colors.TRANSPARENT}
          />
        </Svg>
      ),
      title: "THU NHẬP",
      screen: MemberIncomeScreen,
      navigation: this.props.navigation,
      loadAction: this.props.loadIncomeTab,
    },
    {
      key: "rating",
      headerColor: "#005289",
      title: "XẾP HẠNG",
      icon: (
        <Svg height="26" width="24">
          <Path
            d="M11.4,19.22,5.25,22.49a.7.7,0,0,1-1-.74L5.4,14.82a.7.7,0,0,0-.2-.62l-5-4.92A.7.7,0,0,1,.6,8.09l6.89-1A.7.7,0,0,0,8,6.69L11.1.39a.7.7,0,0,1,1.26,0l3.08,6.29a.7.7,0,0,0,.53.39l6.89,1a.7.7,0,0,1,.39,1.2l-5,4.92a.7.7,0,0,0-.2.62l1.18,6.93a.7.7,0,0,1-1,.74l-6.15-3.26A.7.7,0,0,0,11.4,19.22Z"
            fill={Colors.SILVER}
          />
        </Svg>
      ),
      icon_active: (
        <Svg height="26" width="24">
          <Path
            d="M11.4,19.22,5.25,22.49a.7.7,0,0,1-1-.74L5.4,14.82a.7.7,0,0,0-.2-.62l-5-4.92A.7.7,0,0,1,.6,8.09l6.89-1A.7.7,0,0,0,8,6.69L11.1.39a.7.7,0,0,1,1.26,0l3.08,6.29a.7.7,0,0,0,.53.39l6.89,1a.7.7,0,0,1,.39,1.2l-5,4.92a.7.7,0,0,0-.2.62l1.18,6.93a.7.7,0,0,1-1,.74l-6.15-3.26A.7.7,0,0,0,11.4,19.22Z"
            fill={Colors.SECONDARY}
          />
        </Svg>
      ),
      screen: MemberRatingScreen,
      navigation: this.props.navigation,
      loadAction: this.props.loadRatingTab,
    },
    {
      key: "account",
      headerColor: Colors.DARK,
      title: "TÀI KHOẢN",
      icon: (
        <Svg height="25" width="27">
          <Path
            d="M16.54,14.4h0a7.18,7.18,0,0,1-6.39,0h0S.42,18.85.5,22.3a4.33,4.33,0,0,0,3.13,4.2H23.05a4.32,4.32,0,0,0,3.12-4.2C26.25,18.85,16.54,14.4,16.54,14.4Z"
            stroke={Colors.SILVER}
            strokeWidth="1"
            fill={Colors.TRANSPARENT}
          />
          <Circle
            cx="13.34"
            cy="7.82"
            r="7.32"
            stroke={Colors.SILVER}
            strokeWidth="1"
            fill={Colors.TRANSPARENT}
          />
        </Svg>
      ),
      icon_active: (
        <Svg height="25" width="27">
          <Path
            d="M16.54,14.4h0a7.18,7.18,0,0,1-6.39,0h0S.42,18.85.5,22.3a4.33,4.33,0,0,0,3.13,4.2H23.05a4.32,4.32,0,0,0,3.12-4.2C26.25,18.85,16.54,14.4,16.54,14.4Z"
            stroke={Colors.SECONDARY}
            strokeWidth="1"
            fill={Colors.SECONDARY}
          />
          <Circle
            cx="13.34"
            cy="7.82"
            r="7.32"
            stroke={Colors.SECONDARY}
            strokeWidth="1"
            fill={Colors.SECONDARY}
          />
        </Svg>
      ),
      screen: MemberAccountScreen,
      navigation: this.props.navigation,
      loadAction: () => {},
    },
  ];

  _handleIndexChange = (index) =>
    this.setState({
      index,
    });

  _renderTabBar = (props) => {
    return (
      <View style={Styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          if (!route.icon) {
            return null;
          }
          const active = i === this.state.index;
          return (
            <TouchableOpacity
              key={i}
              style={Styles.tabItem}
              onPress={() =>
                this.setState({ index: i }, () => {
                  route.loadAction();
                })
              }
            >
              {active ? route.icon_active : route.icon}
              <Text
                style={[
                  Styles.tabItemText,
                  active
                    ? { color: Colors.SECONDARY }
                    : { color: Colors.SILVER },
                ]}
              >
                {route.title}
              </Text>
              {route.number ? (
                <View style={Styles.tabNumberWrapper}>
                  <Text style={Styles.tabNumber}>{route.number}+</Text>
                </View>
              ) : undefined}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap(
    this._getDefs().reduce((obj, item) => {
      obj[item.key] = item.screen;
      return obj;
    }, {})
  );

  _toggleOnline = async () => {
    try {
      let rq = await Utils.getAxios(this.props.account.token).post(
        "salon/open",
        {
          open: !this.props.account.salon.open,
        }
      );
      console.log(rq.data);
      this.props.updateAccountInfo({
        salon: {
          ...this.props.account.salon,
          open: !this.props.account.salon.open,
        },
      });
    } catch (e) {
      console.log(e.response);
    }
  };

  render() {
    return (
      <View style={Styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={Colors.TRANSPARENT}
          barStyle={"light-content"}
        />
        <WAAlert
          show={this.state.alert}
          title={this.state.alertTitle}
          question={this.state.alertMessage}
          yes={() => {
            this.setState(
              {
                alert: false,
              },
              () => {
                this._toggleOnline();
              }
            );
          }}
          no={() => {
            this.setState({
              alert: false,
            });
          }}
          titleFirst={true}
        />
        <View
          style={[
            Styles.header,
            {
              backgroundColor: this.state.routes[this.state.index].headerColor,
            },
          ]}
        >
          <View style={Styles.headercontent}>
            <View style={Styles.headerLeft}>
              <Switch
                onValueChange={(value) => {
                  this.setState(
                    {
                      online: value,
                    },
                    () => {
                      if (!value) {
                        this.setState({
                          alert: true,
                          alertTitle: "Ngoại tuyến salon",
                          alertMessage:
                            "Bạn có chắc chắn muốn đóng cửa salon hay không? Salon bạn sẽ không tiếp nhận đơn đặt chỗ sau khi đóng.",
                        });
                      } else {
                        this.setState({
                          alert: true,
                          alertTitle: "Trực tuyến salon",
                          alertMessage:
                            "Bạn muốn mở cửa lại salon và tiếp nhận đơn đặt chỗ mới!",
                        });
                      }
                    }
                  );
                }}
                value={
                  this.props.account.salon.open === 1 ||
                  this.props.account.salon.open === "1" ||
                  this.props.account.salon.open === true ||
                  this.props.account.salon.open === "true"
                }
                // tintColor={Colors.LIGHT}
                trackColor={Colors.SECONDARY}
              />
              <Text style={Styles.online}>
                {this.props.account.salon.open ? "Trực tuyến" : "Ngoại tuyến"}
              </Text>
            </View>
            <View style={Styles.HeaderRight}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("home_account_notification");
                }}
                style={Styles.notification}
              >
                <Svg width={30} height={30}>
                  <Path
                    d="M28.8,25.61a5.46,5.46,0,0,0-4.24-5.29V13a10.17,10.17,0,0,0-7.15-9.7V3a3,3,0,0,0-6,0v.28A10.18,10.18,0,0,0,4.24,13v7.34A5.47,5.47,0,0,0,0,25.61v.63H9.4a5.2,5.2,0,0,0,10,0H28.8ZM14.4,1.26A1.75,1.75,0,0,1,16.15,3a11.16,11.16,0,0,0-1.75-.16A11.16,11.16,0,0,0,12.65,3,1.75,1.75,0,0,1,14.4,1.26Z"
                    fill="#fff"
                  />
                </Svg>
                <View style={Styles.notificationNumber}>
                  <Text style={Styles.notificationNumberText}>
                    {this.props.notify.count > 99
                      ? "99+"
                      : this.props.notify.count}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TabView
          animationEnabled={false}
          swipeEnabled={false}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
          tabBarPosition={"bottom"}
          useNativeDriver
        />
      </View>
    );
  }
}
export default connect(
  (state) => {
    return {
      account: state.account,
      notify: state.notify,
    };
  },
  {
    loadHomeTab,
    loadIncomeTab,
    loadRatingTab,
    updateCount,
    updateAccountInfo,
    readNotify,
  }
)(MemberSectionScreen);
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E7E8",
  },
  header: {
    paddingTop: getStatusBarHeight(),
    backgroundColor: Colors.DARK,
  },
  headercontent: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  online: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    marginLeft: 5,
  },
  HeaderRight: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  notification: {
    position: "relative",
    paddingRight: 20,
  },
  notificationNumber: {
    backgroundColor: Colors.ERROR,
    position: "absolute",
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderColor: Colors.LIGHT,
    borderWidth: 1,
    right: 15,
    top: 0,
  },
  notificationNumberText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.DARK,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    position: "relative",
  },
  tabNumberWrapper: {
    position: "absolute",
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    right: 10,
    top: 5,
  },
  tabNumber: {
    width: 24,
    height: 24,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 24,
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  tabIcon: {},
  tabItemText: {
    fontSize: 10,
    fontFamily: GlobalStyles.FONT_NAME,
    marginTop: 5,
  },
});
