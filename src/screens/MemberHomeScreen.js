import React, { Component } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  View,
} from "react-native";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import WAPanel from "../components/WAPanel";
import { Path, Svg } from "react-native-svg";
import { connect } from "react-redux";
import numeral from "numeral";
import { DotIndicator } from "react-native-indicators";
import { loadHomeTab, loadHomeTabNewBooking } from "../redux/tabHome/actions";
import { loadIncomeTab } from "../redux/tabIncome/actions";
import WAAlert from "../components/WAAlert";
import Utils from "../configs";

class MemberHomeScreen extends Component {
  static defaultProps = {
    accountName: "Minh Trang",
  };
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      loaded: false,
      refreshing: false,
      confirmFinishShow: false,
      isFinishing: false,
      confirmNotComeShow: false,
      isNotCome: false,
    };
  }

  _onRefresh = () => {
    this.props.loadHomeTab(true);
  };

  componentDidUpdate() {}

  render() {
    return this.props.tabHome.fetching ? (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
      </View>
    ) : (
      <ScrollView
        style={Styles.container}
        refreshing={this.state.refreshing}
        refreshControl={
          <RefreshControl
            refreshing={this.props.tabHome.fetching}
            onRefresh={this._onRefresh}
          />
        }
      >
        <Image
          style={Styles.background}
          source={require("../assets/images/home_bg.png")}
        />
        <View style={Styles.content}>
          <View style={Styles.header}>
            <View style={Styles.headerLeft}>
              <Text style={Styles.salonName}>
                {this.props.account.salon.name}
              </Text>
              <Text style={Styles.headerSub}>T???ng doanh thu tu???n n??y</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.jumpTo("account");
              }}
            >
              <Image
                style={Styles.avatar}
                source={{ uri: this.props.account.salon.avatar }}
              />
            </TouchableOpacity>
          </View>
          <Text style={Styles.total}>
            {numeral(this.props.tabHome.incomeThisWeek.sum_income).format(
              "0,000"
            )}
            ???
          </Text>
          {this.props.tabHome.nextNewBooking ? (
            <WAPanel
              title={"?????t ch??? m???i c???n x??? l??"}
              number={this.props.tabHome.nextNewBooking.total_count}
              titleClick={() => {
                this.props.route.navigation.navigate("home_booking_list_alt", {
                  url: "booking/new/list",
                  title: "?????t ch??? m???i c???n x??? l??",
                });
              }}
            >
              <TouchableOpacity
                style={Styles.todo}
                onPress={() => {
                  this.props.route.navigation.navigate("home_order_detail", {
                    id: this.props.tabHome.nextNewBooking.id,
                  });
                }}
              >
                <View style={Styles.todoHead}>
                  <TouchableOpacity>
                    <Image
                      style={Styles.todoAvatar}
                      source={{
                        uri: this.props.tabHome.nextNewBooking.customer.avatar,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={Styles.totoInfo}>
                    <View style={Styles.orderIDName}>
                      <TouchableOpacity style={Styles.orderName}>
                        <Text numberOfLines={1} style={Styles.todoCus}>
                          {this.props.tabHome.nextNewBooking.customer.name}
                        </Text>
                      </TouchableOpacity>
                      <Text style={Styles.orderID}>
                        #{this.props.tabHome.nextNewBooking.id}
                      </Text>
                    </View>
                    <View style={Styles.totoMeta}>
                      <View style={Styles.todoRating}>
                        <Text style={Styles.todoRatingText}>
                          {numeral(
                            this.props.tabHome.nextNewBooking.customer.rating
                          ).format("0,000.0")}
                        </Text>
                        <Svg width={11} height={11}>
                          <Path
                            d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z"
                            fill="#fcb415"
                          />
                        </Svg>
                      </View>
                      <Text style={Styles.todoPhone}>
                        {this.props.tabHome.nextNewBooking.customer.phone}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={Styles.todoSub}>
                  <Text style={Styles.todoSubText}>D???ch v???</Text>
                </View>
                {this.props.tabHome.nextNewBooking.services.map(
                  (item, index) => {
                    return (
                      <View key={index} style={Styles.todoService}>
                        <Text numberOfLines={1} style={Styles.todoServiceName}>
                          {item.name} {item.qty > 1 ? item.qty : ""}
                        </Text>
                        <Text style={Styles.totoServicePrice}>
                          {numeral(item.sum).format("0,000")}???
                        </Text>
                      </View>
                    );
                  }
                )}
                <View style={Styles.toDoDateTime}>
                  <View style={Styles.todoTime}>
                    <Text style={Styles.todoDateTimeTitle}>Th???i gian l??m</Text>
                    <Text style={Styles.todoDateTimeText}>
                      {this.props.tabHome.nextNewBooking.time}
                    </Text>
                  </View>
                  <View style={Styles.todoDate}>
                    <Text style={Styles.todoDateTimeTitle}>Ng??y</Text>
                    <Text style={Styles.todoDateTimeText}>
                      {this.props.tabHome.nextNewBooking.date}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.route.navigation.navigate("new_booking", {
                    id: this.props.tabHome.nextNewBooking.id,
                    onAccept: () => {
                      this.props.route.navigation.navigate("home");
                      //this.props.loadHomeTabNewBooking(true);
                      this.props.loadHomeTab(true);
                      this.props.loadIncomeTab(true);
                    },
                    onCancel: () => {
                      this.props.route.navigation.navigate("home");
                      //this.props.loadHomeTabNewBooking(true);
                      this.props.loadHomeTab(true);
                      this.props.loadIncomeTab(true);
                    },
                  });
                }}
                style={Styles.todoButton}
              >
                <Text style={Styles.todoButtonText}>X??? l?? ngay</Text>
              </TouchableOpacity>
            </WAPanel>
          ) : undefined}

          {this.props.tabHome.nextWaitingBooking ? (
            <WAPanel
              title={"?????t s??? l??m s???p t???i"}
              titleClick={() => {
                this.props.route.navigation.navigate("home_booking_list", {
                  url: "booking/waiting/list",
                  title: "?????t ch??? s??? l??m",
                });
              }}
            >
              <TouchableOpacity
                style={Styles.todo}
                onPress={() => {
                  this.props.route.navigation.navigate("home_order_detail", {
                    id: this.props.tabHome.nextWaitingBooking.id,
                  });
                }}
              >
                <View style={Styles.todoHead}>
                  <TouchableOpacity>
                    <Image
                      style={Styles.todoAvatar}
                      source={{
                        uri: this.props.tabHome.nextWaitingBooking.customer
                          .avatar,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={Styles.totoInfo}>
                    <View style={Styles.orderIDName}>
                      <TouchableOpacity style={Styles.orderName}>
                        <Text numberOfLines={1} style={Styles.todoCus}>
                          {this.props.tabHome.nextWaitingBooking.customer.name}
                        </Text>
                      </TouchableOpacity>
                      <Text style={Styles.orderID}>
                        #{this.props.tabHome.nextWaitingBooking.id}
                      </Text>
                    </View>
                    <View style={Styles.totoMeta}>
                      <View style={Styles.todoRating}>
                        <Text style={Styles.todoRatingText}>
                          {numeral(
                            this.props.tabHome.nextWaitingBooking.customer
                              .rating
                          ).format("0,000.0")}
                        </Text>
                        <Svg width={11} height={11}>
                          <Path
                            d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z"
                            fill="#fcb415"
                          />
                        </Svg>
                      </View>
                      <Text style={Styles.todoPhone}>
                        {this.props.tabHome.nextWaitingBooking.customer.phone}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={Styles.todoSub}>
                  <Text style={Styles.todoSubText}>D???ch v???</Text>
                </View>
                {this.props.tabHome.nextWaitingBooking.services.map(
                  (item, index) => {
                    return (
                      <View key={index} style={Styles.todoService}>
                        <Text numberOfLines={1} style={Styles.todoServiceName}>
                          {item.name} {item.qty > 1 ? item.qty : ""}
                        </Text>
                        <Text style={Styles.totoServicePrice}>
                          {numeral(item.sum).format("0,000")}???
                        </Text>
                      </View>
                    );
                  }
                )}
                <View style={Styles.toDoDateTime}>
                  <View style={Styles.todoTime}>
                    <Text style={Styles.todoDateTimeTitle}>Th???i gian l??m</Text>
                    <Text style={Styles.todoDateTimeText}>
                      {this.props.tabHome.nextWaitingBooking.time}
                    </Text>
                  </View>
                  <View style={Styles.todoDate}>
                    <Text style={Styles.todoDateTimeTitle}>Ng??y</Text>
                    <Text style={Styles.todoDateTimeText}>
                      {this.props.tabHome.nextWaitingBooking.date}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </WAPanel>
          ) : undefined}

          {this.props.tabHome.nextMayDoneBooking ? (
            <WAPanel
              title={"?????t ch??? c?? th??? ho??n th??nh"}
              number={this.props.tabHome.nextMayDoneBooking.total_count}
              titleClick={() => {
                this.props.route.navigation.navigate(
                  "home_booking_list_alt_f",
                  {
                    url: "booking/may-done/list",
                    title: "?????t ch??? c?? th??? ho??n th??nh",
                  }
                );
              }}
            >
              <View style={Styles.todo}>
                <View style={Styles.todoHead}>
                  <TouchableOpacity>
                    <Image
                      style={Styles.todoAvatar}
                      source={{
                        uri: this.props.tabHome.nextMayDoneBooking.customer
                          .avatar,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={Styles.totoInfo}>
                    <View style={Styles.orderIDName}>
                      <TouchableOpacity style={Styles.orderName}>
                        <Text numberOfLines={1} style={Styles.todoCus}>
                          {this.props.tabHome.nextMayDoneBooking.customer.name}
                        </Text>
                      </TouchableOpacity>
                      <Text style={Styles.orderID}>
                        #{this.props.tabHome.nextMayDoneBooking.id}
                      </Text>
                    </View>
                    <View style={Styles.totoMeta}>
                      <View style={Styles.todoRating}>
                        <Text style={Styles.todoRatingText}>
                          {numeral(
                            this.props.tabHome.nextMayDoneBooking.customer
                              .rating
                          ).format("0,000.0")}
                        </Text>
                        <Svg width={11} height={11}>
                          <Path
                            d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z"
                            fill="#fcb415"
                          />
                        </Svg>
                      </View>
                      <Text style={Styles.todoPhone}>
                        {this.props.tabHome.nextMayDoneBooking.customer.phone}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={Styles.todoSub}>
                  <Text style={Styles.todoSubText}>D???ch v???</Text>
                </View>
                {this.props.tabHome.nextMayDoneBooking.services.map(
                  (item, index) => {
                    return (
                      <View key={index} style={Styles.todoService}>
                        <Text numberOfLines={1} style={Styles.todoServiceName}>
                          {item.name} {item.qty > 1 ? item.qty : ""}
                        </Text>
                        <Text style={Styles.totoServicePrice}>
                          {numeral(item.sum).format("0,000")}???
                        </Text>
                      </View>
                    );
                  }
                )}
                <View style={Styles.toDoDateTime}>
                  <View style={Styles.todoTime}>
                    <Text style={Styles.todoDateTimeTitle}>Th???i gian l??m</Text>
                    <Text style={Styles.todoDateTimeText}>
                      {this.props.tabHome.nextMayDoneBooking.time}
                    </Text>
                  </View>
                  <View style={Styles.todoDate}>
                    <Text style={Styles.todoDateTimeTitle}>Ng??y</Text>
                    <Text style={Styles.todoDateTimeText}>
                      {this.props.tabHome.nextMayDoneBooking.date}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      confirmNotComeShow: true,
                    });
                  }}
                  style={[
                    Styles.todoButton,
                    { backgroundColor: Colors.PRIMARY },
                  ]}
                >
                  <Text style={Styles.todoButtonText}>KH??CH V???NG</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      confirmFinishShow: true,
                    });
                  }}
                  style={[
                    Styles.todoButton,
                    { backgroundColor: Colors.SECONDARY },
                  ]}
                >
                  <Text style={Styles.todoButtonText}>HO??N TH??NH</Text>
                </TouchableOpacity>
              </View>
              <WAAlert
                show={this.state.confirmNotComeShow}
                title={"Kh??ch v???ng"}
                question={
                  "Kh??ch ???? kh??ng ?????n th???c hi???n d???ch v??? v?? b???n ???? ch??? kh??ch ????? l??u?"
                }
                yes={() => {
                  this.setState({ confirmNotComeShow: false }, () => {
                    this.setState(
                      {
                        isNotCome: true,
                      },
                      async () => {
                        try {
                          await Utils.getAxios(this.props.account.token).post(
                            "booking/not-come",
                            {
                              id: this.props.tabHome.nextMayDoneBooking.id,
                            }
                          );
                        } catch (e) {
                          console.log(e.response);
                        } finally {
                          this.setState(
                            {
                              isNotCome: false,
                            },
                            () => {
                              this.props.loadHomeTab(true);
                            }
                          );
                        }
                      }
                    );
                  });
                }}
                no={() => {
                  this.setState({ confirmNotComeShow: false });
                }}
                titleFirst={true}
                yesTitle={"????ng"}
                modalStyle={{ backgroundColor: Colors.DARK }}
              />
              <WAAlert
                show={this.state.confirmFinishShow}
                title={"Ho??n th??nh"}
                question={"Salon c???a b???n ???? th???c hi???n ????n ?????t ch??? n??y r???i?"}
                yes={() => {
                  this.setState({ confirmFinishShow: false }, () => {
                    this.setState(
                      {
                        isFinishing: true,
                      },
                      async () => {
                        try {
                          await Utils.getAxios(this.props.account.token).post(
                            "booking/finish",
                            {
                              id: this.props.tabHome.nextMayDoneBooking.id,
                            }
                          );
                        } catch (e) {
                          console.log(e.response);
                        } finally {
                          this.setState(
                            {
                              isFinishing: false,
                            },
                            () => {
                              this.props.loadHomeTab(true);
                            }
                          );
                        }
                      }
                    );
                  });
                }}
                no={() => {
                  this.setState({ confirmFinishShow: false });
                }}
                titleFirst={true}
                yesTitle={"????ng"}
                modalStyle={{ backgroundColor: Colors.DARK }}
              />
              {this.state.isFinishing || this.state.isNotCome ? (
                <View style={Styles.mayDoneOverlay}></View>
              ) : undefined}
            </WAPanel>
          ) : undefined}
          <WAPanel
            title={"Thu nh???p ng??y h??m nay"}
            titleClick={() => {
              this.props.route.navigation.navigate("booking_history_list", {
                url: "booking/today/income/list",
                title: "Thu nh???p t???m t??nh h??m nay",
              });
            }}
          >
            <Text style={Styles.sumTitle}>???? th???c hi???n</Text>
            <View style={[Styles.sumItem]}>
              <View style={Styles.sumItemLeft}>
                <View style={Styles.sumItemTitleIcon}>
                  <Icon style={Styles.sumItemIcon} name={"lens"} />
                  <Text style={Styles.sumItemTitle}>
                    {this.props.tabHome.incomeToday.done_booking.total_booking}{" "}
                    ?????t ch???
                  </Text>
                </View>
              </View>
              <View style={Styles.sumItemRight}>
                <Text style={Styles.sumItemPrice}>
                  {numeral(
                    this.props.tabHome.incomeToday.done_booking.sum_income
                  ).format("0,000")}
                  ???
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[Styles.sumTitle, { flex: 1 }]}>Ch??? th???c hi???n</Text>
              <Text style={Styles.sumTitle}>T???m t??nh</Text>
            </View>
            <View style={[Styles.sumItem, Styles.sumItemLast]}>
              <View style={Styles.sumItemLeft}>
                <View style={Styles.sumItemTitleIcon}>
                  <Icon style={Styles.sumItemIcon} name={"lens"} />
                  <Text style={Styles.sumItemTitle}>
                    {
                      this.props.tabHome.incomeToday.waiting_booking
                        .total_booking
                    }{" "}
                    ?????t ch???
                  </Text>
                </View>
              </View>
              <View style={Styles.sumItemRight}>
                <Text style={Styles.sumItemPrice}>
                  {this.props.tabHome.incomeToday.waiting_booking.sum_income}???
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.route.navigation.navigate("home_booking_list", {
                  url: "booking/waiting/today",
                  title: "?????t ch??? ch??? l??m h??m nay",
                });
              }}
            >
              <Text style={Styles.sumLink}>Ch??? th???c hi???n h??m nay</Text>
            </TouchableOpacity>
          </WAPanel>
          {this.props.tabHome.homeNews.map((item, index) => {
            return (
              <View key={index} style={Styles.news}>
                <Text style={Styles.newsCatName}>{item.cat.name}</Text>
                {item.cover ? (
                  <ImageBackground
                    style={Styles.newsCover}
                    source={{ uri: item.cover }}
                  />
                ) : undefined}
                <Text style={Styles.newsTitle}>{item.title}</Text>
                <Text style={Styles.newsDesc}>{item.desc}</Text>
                <View style={Styles.newsBottom}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.route.navigation.navigate("home_news", {
                        id: item.id,
                      });
                    }}
                    style={Styles.newsMoreButton}
                  >
                    <Text style={Styles.newsMoreButtonText}>XEM CHI TI???T</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

export default connect(
  (state) => {
    return {
      account: state.account,
      tabHome: state.tabHome,
    };
  },
  {
    loadHomeTab,
    loadIncomeTab,
    loadHomeTabNewBooking,
  }
)(MemberHomeScreen);

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  salonName: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 28,
    color: Colors.LIGHT,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSub: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.LIGHT,
  },
  avatar: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 35,
    borderColor: Colors.LIGHT,
    borderWidth: 1,
  },
  total: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 48,
    color: Colors.LIGHT,
    marginBottom: 10,
  },
  sumItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
    marginBottom: 10,
  },
  sumItemLast: {
    borderBottomWidth: 0,
    paddingTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  sumItemLeft: {
    flex: 1,
  },
  sumItemTitleIcon: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sumTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.SILVER_DARK,
    marginBottom: 5,
  },
  sumItemIcon: {
    fontSize: 5,
    color: Colors.SECONDARY,
    marginRight: 5,
  },
  sumItemTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_DARK,
  },
  sumItemPrice: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 20,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  sumLink: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_LINK,
  },
  todoAvatar: {
    height: 40,
    width: 40,
    resizeMode: "cover",
    borderRadius: 20,
    marginRight: 15,
  },
  todoHead: {
    flexDirection: "row",
    alignItems: "center",
  },
  totoInfo: {
    flex: 1,
  },
  todoCus: {
    marginBottom: 2,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  totoMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  todoRating: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  todoRatingText: {
    marginRight: 2,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    color: Colors.TEXT_DARK,
  },
  todoPhone: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.SECONDARY,
    fontWeight: "bold",
  },
  todoSub: {
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    paddingTop: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  todoSubText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.SILVER_DARK,
  },
  todoService: {
    flexDirection: "row",
    alignItems: "center",
  },
  todoServiceName: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  totoServicePrice: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  toDoDateTime: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    paddingTop: 10,
    marginTop: 15,
  },
  todoTime: {
    flex: 1,
    borderRightColor: Colors.SILVER_LIGHT,
    borderRightWidth: 1,
  },
  todoDate: {
    flex: 1,
    alignItems: "flex-end",
  },
  todoDateTimeTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.SILVER_DARK,
    marginBottom: 2,
  },
  todoDateTimeText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  todoPrev: {
    position: "absolute",
    top: "50%",
    height: 50,
    width: 25,
    backgroundColor: Colors.DARK,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    left: -15,
  },
  todoNext: {
    position: "absolute",
    top: "50%",
    height: 50,
    width: 25,
    backgroundColor: Colors.DARK,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    right: -15,
  },
  todoPrevIcon: {
    color: Colors.LIGHT,
    fontSize: 20,
  },
  todoNextIcon: {
    color: Colors.LIGHT,
    fontSize: 20,
  },
  newsCover: {
    height: ((Dimensions.get("window").width - 40) * 10) / 16,
    marginBottom: 15,
  },
  news: {
    backgroundColor: Colors.LIGHT,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  newsCatName: {
    padding: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    color: Colors.SILVER_DARK,
  },
  newsTitle: {
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 20,
    color: Colors.TEXT_DARK,
    marginBottom: 15,
  },
  newsDesc: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_DARK,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
  },
  newsBottom: {
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
  },
  newsMoreButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  newsMoreButtonText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.SECONDARY,
  },
  todoButtonWrapper: {},
  todoButton: {
    backgroundColor: Colors.PRIMARY,
    width: 130,
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "center",
    marginRight: 5,
    marginLeft: 5,
  },
  todoButtonText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
  },
  mayDoneOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  orderIDName: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  orderName: {
    flex: 1,
  },
  orderID: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    fontWeight: "bold",
  },
  noCome: {
    marginTop: 15,
  },
  noComeText: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    textAlign: "center",
  },
});
