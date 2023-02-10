import React, { Component, PureComponent } from "react";
import {
  StatusBar,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  RefreshControl,
  Dimensions,
  Modal,
  ImageBackground,
  FlatList,
} from "react-native";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Path, Svg } from "react-native-svg";
import { connect } from "react-redux";
import Utils from "../configs";
import numeral from "numeral";
import { DotIndicator } from "react-native-indicators";
import WAPanel from "../components/WAPanel";
import { loadHomeTab } from "../redux/tabHome/actions";
import { loadIncomeTab } from "../redux/tabIncome/actions";

type Props = {};
class MemberBookingListAltScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      url: this.props.navigation.getParam("url"),
      title: this.props.navigation.getParam("title")
        ? this.props.navigation.getParam("title")
        : "",
      loading: true,
      refreshing: false,
      currentPage: 0,
      isLastPage: false,
      fetching: false,
    };
  }

  _loadingItem = (refresh = false) => {
    if (this.state.fetching) {
      return;
    }
    let state;
    if (refresh) {
      state = {
        currentPage: 1,
        isLastPage: false,
        refreshing: true,
        loading: false,
        fetching: true,
      };
    } else {
      if (this.state.isLastPage) {
        return;
      }
      state = {
        currentPage: this.state.currentPage + 1,
        refreshing: false,
        loading: true,
        fetching: true,
      };
    }
    this.setState(
      {
        ...state,
      },
      async () => {
        try {
          let rs = await Utils.getAxios(this.props.account.token).get(
            this.state.url + "?page=" + this.state.currentPage
          );
          console.log(rs.data);
          let items = rs.data.items;
          if (!refresh) {
            items = [...this.state.items, ...items];
          }
          this.setState({
            refreshing: false,
            loading: false,
            fetching: false,
            currentPage: rs.data.currentPage,
            isLastPage: rs.data.currentPage === rs.data.lastPage,
            items: items,
          });
        } catch (e) {
          this.setState({
            refreshing: false,
            loading: false,
            fetching: false,
          });
        }
      }
    );
  };

  _keyExtractor = (item, index) => {
    return "" + index;
  };

  _renderItem = ({ item }, index) => {
    return (
      <Item
        loadItem={this._loadingItem}
        navigation={this.props.navigation}
        data={item}
      />
    );
  };

  componentDidMount() {
    this._loadingItem(true);
  }

  _onRefresh = () => {
    this._loadingItem(true);
  };

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        layoutPadding={30}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        navigationButtonStyle={{ color: Colors.LIGHT }}
        headerTitle={this.state.title}
        headerTitleColor={Colors.LIGHT}
      >
        {this.state.refreshing ? (
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            onEndReached={() => {
              this._loadingItem();
            }}
            onEndThreshold={0}
            keyExtractor={this._keyExtractor}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: Colors.LIGHT,
                  height: 100,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors.SILVER_DARK,
                    fontFamily: GlobalStyles.FONT_NAME,
                    fontSize: 14,
                  }}
                >
                  Không có dữ liệu tương ứng
                </Text>
              </View>
            }
            renderItem={this._renderItem}
            data={this.state.items}
          />
        )}
      </PageContainer>
    );
  }
}

class IItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _getStatus = (status) => {
    let { text, name, color } = Utils.getBookingStatus(status);
    return (
      <View style={Styles.itemStatus}>
        <Icon style={[Styles.itemStatusIcon, { color: color }]} name={name} />
        <Text style={Styles.itemStatusText}>{text}</Text>
      </View>
    );
  };
  render() {
    let item = this.props.data;
    return (
      <TouchableOpacity
        style={Styles.item}
        onPress={() => {
          this.props.navigation.navigate("home_order_detail", {
            id: item.id,
          });
        }}
      >
        <View style={Styles.itemHead}>
          <TouchableOpacity style={Styles.itemAvatarWrapper}>
            <Image
              style={Styles.itemAvatar}
              source={{ uri: item.customer.avatar }}
            />
          </TouchableOpacity>
          <View style={Styles.cusInfo}>
            <View style={Styles.orderIDName}>
              <TouchableOpacity style={Styles.orderName}>
                <Text numberOfLines={1} style={Styles.cusNameText}>
                  {item.customer.name}
                </Text>
              </TouchableOpacity>
              <Text style={Styles.orderID}>#{item.id}</Text>
            </View>
            <View style={Styles.cusMeta}>
              <View style={Styles.cusRating}>
                <Text style={Styles.cusRatingNum}>
                  {numeral(item.customer.rating).format("0,000.0")}
                </Text>
                <Svg width={11} height={11}>
                  <Path
                    d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z"
                    fill="#fcb415"
                  />
                </Svg>
              </View>
              <Text style={Styles.cusPhone}>{item.customer.phone}</Text>
            </View>
          </View>
        </View>
        <View style={Styles.itemBody}>
          <Text style={Styles.subTitle}>Dịch vụ</Text>
          {item.services.map((sitem, sindex) => {
            return (
              <View key={sindex} style={Styles.itemDetail}>
                <Text numberOfLines={1} style={Styles.itemDetailName}>
                  {sitem.name}
                  {sitem.qty > 1 ? "x" + sitem.qty : ""}
                </Text>
                <Text style={Styles.itemDetailPrice}>
                  {numeral(sitem.sum).format("0,000")}₫
                </Text>
              </View>
            );
          })}
          <Text style={[Styles.subTitle, { marginTop: 5 }]}>Thời gian làm</Text>
          <View style={Styles.itemBottom}>
            <Text style={Styles.itemDateTime}>
              {item.time}, {item.date}
            </Text>
            {this._getStatus(item.status)}
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("new_booking", {
                id: item.id,
                onAccept: () => {
                  this.props.navigation.navigate("home_booking_list_alt");
                  //this.props.loadHomeTabNewBooking(true);
                  this.props.loadHomeTab(true);
                  this.props.loadIncomeTab(true);
                  this.props.loadItem(true);
                },
                onCancel: () => {
                  this.props.navigation.navigate("home_booking_list_alt");
                  //this.props.loadHomeTabNewBooking(true);
                  this.props.loadHomeTab(true);
                  this.props.loadIncomeTab(true);
                  this.props.loadItem(true);
                },
              });
            }}
            style={Styles.todoButton}
          >
            <Text style={Styles.todoButtonText}>Xử lý ngay</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const Item = connect(
  (state) => {
    return {};
  },
  {
    loadHomeTab,
    loadIncomeTab,
  }
)(IItem);

export default connect(
  (state) => {
    return {
      account: state.account,
    };
  },
  {
    loadIncomeTab,
    loadHomeTab,
  }
)(MemberBookingListAltScreen);

const Styles = StyleSheet.create({
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
  todoButton: {
    backgroundColor: Colors.PRIMARY,
    width: 180,
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center",
  },
  todoButtonText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
  },
  pageWrapper: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: Colors.SILVER_LIGHT,
  },
  item: {
    backgroundColor: Colors.LIGHT,
    marginBottom: 10,
  },
  itemHead: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemAvatarWrapper: {
    marginRight: 15,
  },
  itemAvatar: {
    height: 42,
    width: 42,
    resizeMode: "cover",
    borderRadius: 21,
  },
  cusInfo: {
    flex: 1,
  },
  cusName: {
    marginBottom: 5,
  },
  cusNameText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  cusMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  cusRating: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cusRatingNum: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
    marginRight: 2,
  },
  cusPhone: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.SECONDARY,
    fontWeight: "bold",
  },
  subTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.SILVER_DARK,
    marginBottom: 2,
  },
  itemBody: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
    paddingBottom: 20,
  },
  itemDetailName: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  itemDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemDetailPrice: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  itemBottom: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemDateTime: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  itemStatusText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  itemStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemStatusIcon: {
    fontSize: 20,
    marginRight: 5,
  },
});
