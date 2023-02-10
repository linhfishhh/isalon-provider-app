import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { G, Line, Path, Rect, Svg } from "react-native-svg";
import { connect } from "react-redux";
import { loadIncomeTab } from "../redux/tabIncome/actions";
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import numeral from "numeral";

class MemberIncomeScreen extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      refreshing: false,
    };
  }
  _onRefresh = () => {
    this.props.loadIncomeTab(true);
  };
  render() {
    let incomeThisWeek = this.props.tabIncome.incomeThisWeek;
    return this.props.tabIncome.fetching ? (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
      </View>
    ) : (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.tabIncome.fetching}
            onRefresh={this._onRefresh}
          />
        }
        style={Styles.container}
      >
        <View style={Styles.sumWeek}>
          <TouchableOpacity
            onPress={() => {
              this.props.route.navigation.navigate("booking_history_list", {
                url: "booking/this-week/list",
                title: "Tạm tính tuần này",
              });
            }}
            style={[Styles.sum]}
          >
            <View style={Styles.sumTitleWrapper}>
              <Text style={Styles.sumTitle}>Thu nhập tạm tính tuần này</Text>
              <Text style={Styles.sumTitleNumber}>
                {numeral(incomeThisWeek.total_booking).format("0,000")}
              </Text>
            </View>
            <Text style={Styles.sumValue}>
              {numeral(incomeThisWeek.sum_income).format("0,000")}₫
            </Text>
            <Icon style={Styles.sumIcon} name={"keyboard-arrow-right"} />
          </TouchableOpacity>
        </View>
        <View style={Styles.sumWeekDetails}>
          <TouchableOpacity
            onPress={() => {
              this.props.route.navigation.navigate("booking_history_list", {
                url: "booking/this-week/done/list",
                title: "Hoàn thành tuần này",
              });
            }}
            style={[Styles.sum, Styles.sumSmall, Styles.sumDone]}
          >
            <View style={Styles.sumTitleWrapper}>
              <Text style={[Styles.sumTitle, Styles.sumTitleSmall]}>
                Hoàn thành
              </Text>
              <Text style={[Styles.sumTitleNumber, Styles.sumTitleNumberSmall]}>
                {numeral(incomeThisWeek.done_booking.total_booking).format(
                  "0,000"
                )}
              </Text>
            </View>
            <Text style={[Styles.sumValue, Styles.sumValueSmall]}>
              {numeral(incomeThisWeek.done_booking.sum_income).format("0,000")}₫
            </Text>
            <Icon
              style={[Styles.sumIcon, Styles.sumIconSmall]}
              name={"keyboard-arrow-right"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.route.navigation.navigate("booking_history_list", {
                url: "booking/this-week/waiting/list",
                title: "Đang chờ tuần này",
              });
            }}
            style={[Styles.sum, Styles.sumSmall]}
          >
            <View style={Styles.sumTitleWrapper}>
              <Text style={[Styles.sumTitle, Styles.sumTitleSmall]}>
                Đang chờ
              </Text>
              <Text style={[Styles.sumTitleNumber, Styles.sumTitleNumberSmall]}>
                {numeral(incomeThisWeek.waiting_booking.total_booking).format(
                  "0,000"
                )}
              </Text>
            </View>
            <Text style={[Styles.sumValue, Styles.sumValueSmall]}>
              {numeral(incomeThisWeek.waiting_booking.sum_income).format(
                "0,000"
              )}
              ₫
            </Text>
            <Icon
              style={[Styles.sumIcon, Styles.sumIconSmall]}
              name={"keyboard-arrow-right"}
            />
          </TouchableOpacity>
        </View>
        <Text style={Styles.blockTitle}>CÁC THÔNG TIN KHÁC</Text>
        <TouchableOpacity
          onPress={() => {
            this.props.route.navigation.navigate("booking_history_list", {
              url: "booking/this-month/done/list",
              title: "Thu nhập tháng này",
            });
          }}
          style={Styles.info}
        >
          <Svg height={25} width={25}>
            <Rect
              x="0.5"
              y="2.45"
              width="23.52"
              height="22.3"
              rx="4.6"
              ry="4.6"
              fill="none"
              stroke="#231f20"
              stroke-miterlimit="10"
            />
            <Line
              x1="0.5"
              y1="8.2"
              x2="24.02"
              y2="8.2"
              fill="none"
              stroke="#231f20"
              stroke-miterlimit="10"
            />
            <Rect
              x="16.18"
              y="16.35"
              width="4.37"
              height="4.37"
              rx="1.04"
              ry="1.04"
              fill="none"
              stroke="#231f20"
              stroke-miterlimit="10"
            />
            <G>
              <Line
                x1="5.97"
                x2="5.97"
                y2="2.45"
                fill="none"
                stroke="#231f20"
                stroke-miterlimit="10"
              />
              <Line
                x1="18.55"
                x2="18.55"
                y2="2.45"
                fill="none"
                stroke="#231f20"
                stroke-miterlimit="10"
              />
            </G>
          </Svg>
          <View style={Styles.infoBody}>
            <Text>Thu nhập tháng này</Text>
          </View>
          <Icon style={[Styles.infoIcon]} name={"keyboard-arrow-right"} />
        </TouchableOpacity>
        {/*<TouchableOpacity*/}
        {/*onPress={()=>{*/}
        {/*this.props.route.navigation.navigate('booking_history_list', {*/}
        {/*url: 'booking/all-time/list',*/}
        {/*title: 'Lịch sử thu nhập'*/}
        {/*});*/}
        {/*}}*/}
        {/*style={Styles.info}>*/}
        {/*<Svg*/}
        {/*height={25}*/}
        {/*width={25}>*/}
        {/*<G>*/}
        {/*<Path d="M24.38,14l-1.26-1.26a1.32,1.32,0,0,0-1.87,0l-6.8,6.8L13.51,23l-.23.22a.43.43,0,0,0,0,.63h0a.43.43,0,0,0,.31.13.42.42,0,0,0,.31-.13l.23-.23,3.44-.94,6.81-6.8a1.33,1.33,0,0,0,0-1.87ZM15.46,19.8,20,15.27l1.88,1.88-4.53,4.53Zm-.39.86,1.42,1.42-2,.53Zm8.68-5.39L22.5,16.53l-1.88-1.88,1.26-1.26a.45.45,0,0,1,.61,0l1.26,1.26a.44.44,0,0,1,0,.62Z" fill="#231f20"/>*/}
        {/*<Path d="M11.94,5.31a.44.44,0,0,0-.44.44.44.44,0,0,0,.44.44h8a.44.44,0,0,0,.44-.44.44.44,0,0,0-.44-.44Z" fill="#231f20"/>*/}
        {/*<Path d="M20.34,11.94a.44.44,0,0,0-.44-.44h-8a.44.44,0,1,0,0,.88h8a.44.44,0,0,0,.44-.44Z" fill="#231f20"/>*/}
        {/*<Path d="M9.1,3.2a.43.43,0,0,0-.62,0L5.71,6.47,4,5.21a.43.43,0,0,0-.61.08.44.44,0,0,0,.08.62l2,1.52a.44.44,0,0,0,.61-.07l3-3.53A.44.44,0,0,0,9.1,3.2Z" fill="#231f20"/>*/}
        {/*<Path d="M9.1,9.39a.44.44,0,0,0-.62,0L5.71,12.66,4,11.4a.42.42,0,0,0-.61.09.44.44,0,0,0,.08.62l2,1.51a.44.44,0,0,0,.61-.07l3-3.53a.44.44,0,0,0-.05-.63Z" fill="#231f20"/>*/}
        {/*<Path d="M8.48,16.07,5.71,19.3,4,18a.42.42,0,0,0-.61.09.44.44,0,0,0,.08.62l2,1.51a.46.46,0,0,0,.27.09.45.45,0,0,0,.34-.15l3-3.54A.43.43,0,0,0,9.1,16a.44.44,0,0,0-.62,0Z" fill="#231f20"/>*/}
        {/*<Path d="M11.06,23H5.39a4.5,4.5,0,0,1-4.5-4.5V5.39A4.49,4.49,0,0,1,5.39.89H18.5A4.5,4.5,0,0,1,23,5.39v5.22a.44.44,0,0,0,.44.45.45.45,0,0,0,.44-.45V5.39A5.39,5.39,0,0,0,18.5,0H5.39A5.4,5.4,0,0,0,0,5.39V18.5a5.39,5.39,0,0,0,5.39,5.38h5.67a.44.44,0,0,0,.44-.44.44.44,0,0,0-.44-.44Z" fill="#231f20"/>*/}
        {/*</G>*/}
        {/*</Svg>*/}
        {/*<View style={Styles.infoBody}>*/}
        {/*<Text>Lịch sử thu nhập</Text>*/}
        {/*</View>*/}
        {/*<Icon style={[Styles.infoIcon]} name={'keyboard-arrow-right'} />*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          onPress={() => {
            this.props.route.navigation.navigate("booking_stats");
          }}
          style={Styles.info}
        >
          <Svg height={25} width={25}>
            <G>
              <Path
                d="M24.38,14l-1.26-1.26a1.32,1.32,0,0,0-1.87,0l-6.8,6.8L13.51,23l-.23.22a.43.43,0,0,0,0,.63h0a.43.43,0,0,0,.31.13.42.42,0,0,0,.31-.13l.23-.23,3.44-.94,6.81-6.8a1.33,1.33,0,0,0,0-1.87ZM15.46,19.8,20,15.27l1.88,1.88-4.53,4.53Zm-.39.86,1.42,1.42-2,.53Zm8.68-5.39L22.5,16.53l-1.88-1.88,1.26-1.26a.45.45,0,0,1,.61,0l1.26,1.26a.44.44,0,0,1,0,.62Z"
                fill="#231f20"
              />
              <Path
                d="M11.94,5.31a.44.44,0,0,0-.44.44.44.44,0,0,0,.44.44h8a.44.44,0,0,0,.44-.44.44.44,0,0,0-.44-.44Z"
                fill="#231f20"
              />
              <Path
                d="M20.34,11.94a.44.44,0,0,0-.44-.44h-8a.44.44,0,1,0,0,.88h8a.44.44,0,0,0,.44-.44Z"
                fill="#231f20"
              />
              <Path
                d="M9.1,3.2a.43.43,0,0,0-.62,0L5.71,6.47,4,5.21a.43.43,0,0,0-.61.08.44.44,0,0,0,.08.62l2,1.52a.44.44,0,0,0,.61-.07l3-3.53A.44.44,0,0,0,9.1,3.2Z"
                fill="#231f20"
              />
              <Path
                d="M9.1,9.39a.44.44,0,0,0-.62,0L5.71,12.66,4,11.4a.42.42,0,0,0-.61.09.44.44,0,0,0,.08.62l2,1.51a.44.44,0,0,0,.61-.07l3-3.53a.44.44,0,0,0-.05-.63Z"
                fill="#231f20"
              />
              <Path
                d="M8.48,16.07,5.71,19.3,4,18a.42.42,0,0,0-.61.09.44.44,0,0,0,.08.62l2,1.51a.46.46,0,0,0,.27.09.45.45,0,0,0,.34-.15l3-3.54A.43.43,0,0,0,9.1,16a.44.44,0,0,0-.62,0Z"
                fill="#231f20"
              />
              <Path
                d="M11.06,23H5.39a4.5,4.5,0,0,1-4.5-4.5V5.39A4.49,4.49,0,0,1,5.39.89H18.5A4.5,4.5,0,0,1,23,5.39v5.22a.44.44,0,0,0,.44.45.45.45,0,0,0,.44-.45V5.39A5.39,5.39,0,0,0,18.5,0H5.39A5.4,5.4,0,0,0,0,5.39V18.5a5.39,5.39,0,0,0,5.39,5.38h5.67a.44.44,0,0,0,.44-.44.44.44,0,0,0-.44-.44Z"
                fill="#231f20"
              />
            </G>
          </Svg>
          <View style={Styles.infoBody}>
            <Text>Thông kê nâng cao</Text>
          </View>
          <Icon style={[Styles.infoIcon]} name={"keyboard-arrow-right"} />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default connect(
  (state) => {
    return {
      tabIncome: state.tabIncome,
    };
  },
  {
    loadIncomeTab,
  }
)(MemberIncomeScreen);

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SILVER_LIGHT,
  },
  sumWeek: {
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
    backgroundColor: Colors.LIGHT,
  },
  sum: {
    //flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
    position: "relative",
  },
  sumTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    color: Colors.SILVER_DARK,
  },
  sumTitleWrapper: {
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  sumTitleSmall: {
    fontSize: 15,
  },
  sumTitleNumber: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 10,
    color: Colors.LIGHT,
    backgroundColor: Colors.PRIMARY,
    lineHeight: 18,
    width: 18,
    textAlign: "center",
    marginLeft: 5,
    borderRadius: 9,
    overflow: "hidden",
  },
  sumTitleNumberSmall: {
    // lineHeight: 14,
    // width: 14,
    // borderRadius: 7,
    // fontSize: 10,
  },
  sumValue: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 45,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
  },
  sumValueSmall: {
    fontSize: 18,
  },
  sumIcon: {
    position: "absolute",
    right: 15,
    fontSize: 25,
    color: Colors.SILVER,
  },
  sumIconSmall: {
    //fontSize: 20
  },
  sumWeekDetails: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
    backgroundColor: Colors.LIGHT,
  },
  sumSmall: {
    flex: 1,
  },
  sumDone: {
    borderRightWidth: 1,
    borderRightColor: Colors.SILVER_LIGHT,
  },
  blockTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.SILVER_DARK,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  info: {
    backgroundColor: Colors.LIGHT,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  infoBody: {
    marginLeft: 15,
    flex: 1,
  },
  infoIcon: {
    fontSize: 25,
    color: Colors.SILVER,
  },
});
