import React, { Component } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import IconM from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import Utils from "../configs";
import { DotIndicator } from "react-native-indicators";
import numeral from "numeral";
import WAAlert from "../components/WAAlert";
import { loadHomeTab } from "../redux/tabHome/actions";
import { loadIncomeTab } from "../redux/tabIncome/actions";
import NavigationService from "../NavigationService";

type Props = {};
class MemberOrderDetailScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        amount_coin: 0,
        amount_money: 0,
      },
      id: this.props.navigation.getParam("id"),
      title: this.props.navigation.getParam("title"),
      backgroundColor: this.props.navigation.getParam("backgroundColor")
        ? this.props.navigation.getParam("backgroundColor")
        : Colors.DARK,
      alert: false,
      alertTitle: "",
      alertMessage: "",
      alertFunc: undefined,
      onAccept: this.props.navigation.getParam("onAccept"),
      onfinish: this.props.navigation.getParam("onfinish"),
      onNotCome: this.props.navigation.getParam("onNotCome"),
    };
  }

  _loadData = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).post(
            "booking/detail",
            {
              id: this.state.id,
            }
          );
          console.log(rq.data);
          this.setState({
            loading: false,
            data: rq.data,
            title: rq.data.order_title,
          });
        } catch (e) {
          if (e.response.status === 404) {
            Alert.alert(e.response.data.message);
          }
          this.props.navigation.goBack();
          console.log(e.response);
        }
      }
    );
  };

  _accept = () => {
    this.setState(
      {
        loading: true,
        alertFunc: undefined,
      },
      async () => {
        try {
          let rs = await Utils.getAxios(this.props.account.token).post(
            "booking/new/accept",
            {
              id: this.state.id,
            }
          );
          this.setState(
            {
              loading: false,
            },
            () => {
              this._loadData();
              this.props.loadHomeTab(true);
              this.props.loadIncomeTab(true);
              if (this.state.onAccept) {
                this.state.onAccept();
              }
            }
          );
        } catch (e) {
          this.setState({
            loading: false,
          });
          console.log(e.response);
        }
      }
    );
  };

  _finish = () => {
    this.setState(
      {
        loading: true,
        alertFunc: undefined,
      },
      async () => {
        try {
          await Utils.getAxios(this.props.account.token).post(
            "booking/finish",
            {
              id: this.state.id,
            }
          );
          this.setState(
            {
              loading: false,
            },
            () => {
              this._loadData();
              this.props.loadHomeTab(true);
              if (this.state.onfinish) {
                this.state.onfinish();
              }
            }
          );
        } catch (e) {
          this.setState({
            loading: false,
          });
        }
      }
    );
  };

  _notCome = () => {
    this.setState(
      {
        loading: true,
        alertFunc: undefined,
      },
      async () => {
        try {
          await Utils.getAxios(this.props.account.token).post(
            "booking/not-come",
            {
              id: this.state.id,
            }
          );
          this.setState(
            {
              loading: false,
            },
            () => {
              this._loadData();
              this.props.loadHomeTab(true);
              if (this.state.onNotCome) {
                this.state.onNotCome();
              }
            }
          );
        } catch (e) {
          this.setState({
            loading: false,
          });
        }
      }
    );
  };

  componentDidMount() {
    this._loadData();
  }

  render() {
    return this.state.loading || this.state.data === undefined ? (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor }}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
        />
        <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
      </View>
    ) : (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={this.state.backgroundColor}
        navigationClose={true}
        navigationButtonStyle={Styles.closeButton}
        layoutPadding={30}
      >
        <View style={Styles.pageWrapperInner}>
          <ScrollView style={Styles.content}>
            <Text style={Styles.title}>Chi tiết đặt chỗ</Text>
            {this.state.title ? (
              <Text style={Styles.subTitle}>{this.state.title}</Text>
            ) : undefined}
            <View style={Styles.order}>
              <View style={Styles.orderHeader}>
                <Text style={Styles.orderTitle}>Đơn đặt chỗ của bạn</Text>
                <Text style={Styles.orderID}>#{this.state.data.id}</Text>
              </View>
              <View style={Styles.orderItems}>
                <View style={Styles.orderItem}>
                  <View style={Styles.orderItemIcon}>
                    {ImageSources.SVG_ORDER_DATE}
                  </View>
                  <View style={Styles.orderItemInfo}>
                    <Text style={Styles.orderItemInfoText}>
                      Ngày {this.state.data.date}
                    </Text>
                  </View>
                </View>
                <View style={Styles.orderItem}>
                  <View style={Styles.orderItemIcon}>
                    {ImageSources.SVG_ORDER_TIME}
                  </View>
                  <View style={Styles.orderItemInfo}>
                    <Text style={Styles.orderItemInfoText}>
                      {this.state.data.time}
                    </Text>
                  </View>
                </View>
                <View style={Styles.orderItem}>
                  <View style={Styles.orderItemIcon}>
                    {ImageSources.SVG_ORDER_ADRESS}
                  </View>
                  <View style={Styles.orderItemInfo}>
                    <View style={Styles.orderItemInfoDescWrapper}>
                      <Text style={Styles.orderItemInfoText}>
                        {this.state.data.salon.name}
                      </Text>
                    </View>
                    <View style={Styles.orderItemInfoDescWrapper}>
                      <Text style={Styles.orderItemInfoDesc}>
                        {this.state.data.salon.address}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={Styles.orderItem}>
                  <View style={Styles.orderItemIcon}>
                    {ImageSources.SVG_ORDER_PAYMENT}
                  </View>
                  <View style={Styles.orderItemInfo}>
                    <Text style={Styles.orderItemInfoText}>
                      Hình thức thanh toán
                    </Text>
                    <View style={Styles.orderItemInfoDescWrapper}>
                      <Text style={Styles.orderItemInfoDesc}>
                        {this.state.data.payment}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={Styles.orderItem}>
                  <View style={Styles.orderItemIcon}>
                    <IconM
                      style={{
                        fontSize: 22,
                        color: Utils.getBookingStatus(this.state.data.status)
                          .color,
                      }}
                      name={Utils.getBookingStatus(this.state.data.status).name}
                    />
                  </View>
                  <View style={Styles.orderItemInfo}>
                    <Text style={Styles.orderItemInfoText}>Trạng thái</Text>
                    <Text style={Styles.orderItemInfoDesc}>
                      {Utils.getBookingStatus(this.state.data.status).text}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={Styles.orderDetails}>
                <View style={Styles.orderColHeaderRow}>
                  <View style={Styles.orderColHeaderLeft}>
                    <Text style={Styles.orderColHeaderText}>Dịch vụ</Text>
                  </View>
                  <View style={Styles.orderColHeaderRight}>
                    <Text style={Styles.orderColHeaderText}>Thành tiền</Text>
                  </View>
                </View>
                {this.state.data.services.map((item, index) => {
                  return (
                    <View key={index} style={Styles.orderDetail}>
                      <View style={Styles.orderDetailLeft}>
                        <Text style={Styles.orderDetailTitle}>{item.name}</Text>
                        <Text style={Styles.orderDetailSub}>
                          Số lương: {item.qty}
                        </Text>
                      </View>
                      <View style={Styles.orderDetailRight}>
                        <Text style={Styles.orderDetailPrice}>
                          {numeral(item.sum).format("0,000")}₫
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              {this.state.data.amount_coin > 0 ? (
                <View style={Styles.orderColHeaderRow}>
                  <View style={Styles.orderColHeaderLeft}>
                    <Text style={Styles.orderColHeaderText}>Tổng xu</Text>
                  </View>
                  <View style={Styles.orderColHeaderRight}>
                    <Text style={Styles.orderColHeaderTextBold}>
                      {" "}
                      {numeral(this.state.data.amount_coin).format("0,000")}xu
                    </Text>
                  </View>
                </View>
              ) : null}
              <View style={Styles.orderColHeaderRow}>
                <View style={Styles.orderColHeaderLeft}>
                  <Text style={Styles.orderColHeaderText}>Tổng tiền</Text>
                </View>
                <View style={Styles.orderColHeaderRight}>
                  <Text style={Styles.orderColHeaderTextBold}>
                    {" "}
                    {numeral(
                      this.state.data.amount_money !== undefined &&
                        this.state.data.amount_money !== null
                        ? this.state.data.amount_money
                        : this.state.data.sum
                    ).format("0,000")}
                    ₫
                  </Text>
                </View>
              </View>
              <View style={Styles.actions}>
                {this.state.data.can_accept ? (
                  <TouchableOpacity
                    onPress={this._accept}
                    style={[
                      Styles.action,
                      { backgroundColor: Colors.SECONDARY },
                    ]}
                  >
                    <Text style={Styles.actionText}>CHẤP NHẬN</Text>
                  </TouchableOpacity>
                ) : undefined}
                {this.state.data.can_reject ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("cancel_booking", {
                        id: this.state.id,
                        onCancel: () => {
                          NavigationService.goBack();
                          this.setState({
                            title: "Bạn đã từ chối yêu cầu đặt chỗ này!",
                          });
                          this._loadData();
                        },
                      });
                    }}
                    style={Styles.action}
                  >
                    <Text style={Styles.actionText}>TỪ CHỐI</Text>
                  </TouchableOpacity>
                ) : undefined}
                {this.state.data.can_finish ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        alert: true,
                        alertTitle: "Hoàn thành",
                        alertMessage:
                          "Salon bạn đã hoàn thành các dịch vụ cho khách hàng?",
                        alertFunc: () => {
                          this._finish();
                        },
                      });
                    }}
                    style={[
                      Styles.action,
                      { backgroundColor: Colors.SECONDARY },
                    ]}
                  >
                    <Text style={Styles.actionText}>HOÀN THÀNH</Text>
                  </TouchableOpacity>
                ) : undefined}
                {this.state.data.can_finish ? (
                  <TouchableOpacity
                    style={Styles.action}
                    onPress={() => {
                      this.setState({
                        alert: true,
                        alertTitle: "Khách vắng",
                        alertMessage:
                          "Khách đã không đến salon thực hiện dịch vụ và bạn đã chờ đủ lâu?",
                        alertFunc: () => {
                          this._notCome();
                        },
                      });
                    }}
                  >
                    <Text style={Styles.actionText}>KHÁCH VẮNG</Text>
                  </TouchableOpacity>
                ) : undefined}
              </View>
            </View>
          </ScrollView>
        </View>
        <WAAlert
          show={this.state.alert}
          title={this.state.alertTitle}
          question={this.state.alertMessage}
          titleFirst={true}
          yes={() => {
            this.setState(
              {
                alert: false,
              },
              () => {
                if (this.state.alertFunc !== undefined) {
                  this.state.alertFunc();
                }
              }
            );
          }}
          no={() => {
            this.setState({
              alert: false,
              alertFunc: undefined,
            });
          }}
        />
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
)(MemberOrderDetailScreen);

const Styles = StyleSheet.create({
  actions: {
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 20,
  },
  action: {
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 30,
    marginTop: 15,
  },
  actionText: {
    fontSize: 15,
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  orderActions: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
  },
  pageWrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: "flex-start",
  },
  pageWrapperInner: {
    flex: 1,
    width: "100%",
    //marginBottom: 30
  },
  closeButton: {
    color: Colors.LIGHT,
  },
  title: {
    color: Colors.LIGHT,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME,
    marginTop: 15,
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 15,
    color: Colors.LIGHT,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME,
    marginBottom: 30,
    marginRight: 30,
  },
  content: {
    flex: 1,
  },
  order: {
    backgroundColor: Colors.LIGHT,
    paddingBottom: 50,
    borderRadius: 5,
  },
  orderHeader: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 4,
  },
  orderTitle: {
    fontSize: 19,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
  },
  orderID: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
  },
  orderItems: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 4,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 7,
    paddingBottom: 7,
  },
  orderItemIcon: {
    width: 25,
    marginRight: 15,
  },
  orderItemInfoText: {
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
  },
  orderItemInfoDesc: {
    fontSize: 12,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,

    marginRight: 20,
  },
  orderColHeaderRow: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  orderColHeaderLeft: {
    flex: 1,
  },
  orderColHeaderRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  orderColHeaderText: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,
  },
  orderDetails: {
    marginTop: 5,
  },
  orderDetail: {
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
  },
  orderDetailLeft: {
    flex: 1,
  },
  orderDetailRight: {
    // width: 80,
    alignItems: "flex-end",
  },
  orderDetailTitle: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
  },
  orderDetailSub: {
    fontSize: 12,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER,
  },
  orderDetailPrice: {
    fontSize: 17,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  orderColHeaderTextBold: {
    fontSize: 17,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
  },
});
