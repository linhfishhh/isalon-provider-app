import React, { Component } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import numeral from "numeral";
import Utils from "../configs";
import { connect } from "react-redux";
import DotIndicator from "react-native-indicators/src/components/dot-indicator";

type Props = {};
class MemberBookingHistoryListScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      url: this.props.navigation.getParam("url"),
      title: this.props.navigation.getParam("title")
        ? this.props.navigation.getParam("title")
        : "",
      loading: false,
      refreshing: false,
      currentPage: 0,
      isLastPage: false,
      fetching: false,
      sum: 0,
    };
  }
  _header = () => {
    return (
      <View style={Styles.header}>
        <Text style={Styles.headerTitle}>Tổng tiền</Text>
        <Text style={Styles.headerAmount}>
          {numeral(this.state.sum).format("0,000")}₫
        </Text>
      </View>
    );
  };
  _renderItem = ({ item }) => {
    return (
      <View style={Styles.item}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("booking_detail_history", {
              data: item,
            });
          }}
          style={Styles.itemWrapper}
        >
          <View style={Styles.itemInfo}>
            <Text style={Styles.itemID}>#{item.id}</Text>
            <Text style={Styles.itemMeta}>
              {item.time}, {item.date}
            </Text>
          </View>
          <View style={Styles.itemPriceService}>
            <Text style={Styles.itemPrice}>
              {numeral(item.sum).format("0,000")}₫
            </Text>
            <Text style={Styles.itemServices}>{item.total} dịch vụ</Text>
          </View>
          <Icon style={Styles.itemIcon} name={"keyboard-arrow-right"} />
        </TouchableOpacity>
      </View>
    );
  };
  _keyExtractor = (item, index) => {
    return index + "";
  };
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
          console.log(rs.data.items);
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
            sum: rs.data.sum,
          });
        } catch (e) {
          console.log(e.response);
          this.setState({
            refreshing: false,
            loading: false,
            fetching: false,
          });
        }
      }
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
        layoutPadding={20}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        navigationButtonStyle={{ color: Colors.LIGHT }}
        headerTitle={this.state.title}
        headerTitleColor={Colors.LIGHT}
      >
        {this.state.refreshing ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <View style={Styles.pageWrapperInner}>
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
              style={Styles.content}
              ListHeaderComponent={this._header}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              data={this.state.items}
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
                      fontSize: 15,
                    }}
                  >
                    Không có dữ liệu tương ứng
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </PageContainer>
    );
  }
}

export default connect((state) => {
  return {
    account: state.account,
  };
})(MemberBookingHistoryListScreen);

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
  },
  pageWrapperInner: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
  },
  header: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
  },
  headerTitle: {
    fontSize: 18,
    textTransform: "uppercase",
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
    marginBottom: 5,
  },
  headerAmount: {
    fontSize: 45,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.SILVER_LIGHT,
    paddingRight: 60,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
    flex: 1,
  },
  sectionHeaderAmount: {
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
  },
  itemWrapper: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemID: {
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
  },
  itemMeta: {
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
  },
  itemPrice: {
    fontSize: 18,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
  },
  itemServices: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
  },
  itemIcon: {
    color: Colors.SILVER,
    fontSize: 25,
    width: 40,
    textAlign: "right",
  },
});
