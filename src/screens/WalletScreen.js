import React, { Component } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
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
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import get from "lodash/get";
import { datetimeFormat } from "../utils/datetime";

const salonTransactionTypes = {
  type: [
    {
      id: "SERVICE_PAY",
      name: "Người dùng đặt lịch",
      color: "#4796EE",
    },
    {
      id: "ISALON_SETTLEMENT",
      name: "Quyết toán với iSalon",
      color: "#67AD5B",
    },
    {
      id: "UPDATE_COIN",
      name: "Hệ thống thay đổi",
      color: "#8F36AB",
    },
  ],
  typeFromString(str) {
    return this.type.find((item) => item.id === str);
  },
};

type Props = {};
class WalletScreen extends Component<Props> {
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
      showTool: false,
      filter: {
        startDate: undefined,
        endDate: undefined,
        status: [],
      },
      oldFilter: {
        startDate: undefined,
        endDate: undefined,
        status: [],
      },
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      amountMoney: 0,
      amountCoin: 0,
    };
  }

  _showDateTimePicker1 = () =>
    this.setState({ isDateTimePickerVisible1: true });

  _hideDateTimePicker1 = () =>
    this.setState({ isDateTimePickerVisible1: false });

  _handleDatePicked1 = (date) => {
    this.setState(
      {
        filter: {
          ...this.state.filter,
          startDate: moment(date).format("YYYY-MM-DD"),
        },
      },
      this._hideDateTimePicker1
    );
  };

  _showDateTimePicker2 = () =>
    this.setState({ isDateTimePickerVisible2: true });

  _hideDateTimePicker2 = () =>
    this.setState({ isDateTimePickerVisible2: false });

  _handleDatePicked2 = (date) => {
    this.setState(
      {
        filter: {
          ...this.state.filter,
          endDate: moment(date).format("YYYY-MM-DD"),
        },
      },
      this._hideDateTimePicker2
    );
  };

  _header = () => {
    return (
      <View style={Styles.header}>
        <Text style={Styles.headerAmount}>
          {numeral(this.state.amountCoin).format("0,000")} xu
        </Text>
        <Text style={Styles.headerAmount}>
          {numeral(this.state.amountMoney).format("0,000")} ₫
        </Text>
        <View style={Styles.headerTitleContent}>
          <Text style={Styles.headerTitle}>
            {this.state.filter.startDate && (
              <Text>
                {"từ "}
                <Text style={{ color: Colors.SECONDARY, fontWeight: "bold" }}>
                  {this.state.filter.startDate}
                </Text>
              </Text>
            )}
            {this.state.filter.endDate && (
              <Text>
                {" đến "}
                <Text style={{ color: Colors.SECONDARY, fontWeight: "bold" }}>
                  {this.state.filter.endDate}
                </Text>
              </Text>
            )}
          </Text>
        </View>
      </View>
    );
  };
  _renderItem = ({ item }) => {
    const transactionType = salonTransactionTypes.typeFromString(item.type);
    return (
      <View style={Styles.item}>
        <View style={Styles.itemWrapper}>
          <View style={Styles.itemInfo}>
            <Text style={Styles.itemID}>#{item.salonTransactionId}</Text>
            <Text style={Styles.itemMeta}>
              Thời gian: {datetimeFormat(item.createdDate)}
            </Text>
            {item.description && item.description.length > 0 && (
              <Text style={[Styles.itemMeta, { color: Colors.DARK }]}>
                Nội dung: {item.description}
              </Text>
            )}
            <View
              style={[
                Styles.type,
                {
                  borderColor: transactionType.color,
                },
              ]}
            >
              <Text
                style={[
                  Styles.itemMeta,
                  {
                    color: transactionType.color,
                    marginTop: 0,
                  },
                ]}
              >
                {transactionType.name}
              </Text>
            </View>
          </View>
          <View style={Styles.itemPriceService}>
            <Text style={Styles.itemPrice}>
              {numeral(item.amountCoin).format("0,000")} xu
            </Text>
            <Text style={Styles.itemPrice}>
              {numeral(item.amountMoney).format("0,000")} ₫
            </Text>
            {item.totalAmount && (
              <Text>
                {"Tổng: "}
                <Text style={Styles.itemPrice}>
                  {numeral(item.totalAmount).format("0,000")} ₫
                </Text>
              </Text>
            )}
            {item.commissionMoney && (
              <Text>
                {"C.khấu: "}
                <Text style={Styles.itemPrice}>
                  -{numeral(item.commissionMoney).format("0,000")} ₫
                </Text>
              </Text>
            )}
          </View>
        </View>
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
        currentPage: 0,
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
          let url = `/salon-wallets/${this.props.account.salon.salon_id}/self-transactions?page=${this.state.currentPage}&size=20`;
          if (this.state.filter.startDate !== undefined) {
            const t = moment(this.state.filter.startDate + " 00:00:00").format(
              "x"
            );
            url += "&startDate=" + t;
          }
          if (this.state.filter.endDate !== undefined) {
            const t = moment(this.state.filter.endDate + " 23:59:59").format(
              "x"
            );
            url += "&endDate=" + t;
          }
          if (this.state.filter.status.length > 0) {
            url += "&types=" + this.state.filter.status.join(",");
          }
          const rs = await Utils.getNewAxios(
            this.props.account.secondaryToken
          ).get(url);
          let items = get(rs, "data.data.content", []);
          if (!refresh) {
            items = [...this.state.items, ...items];
          }
          const pageable = get(rs, "data.data.pageable", {});
          this.setState({
            refreshing: false,
            loading: false,
            fetching: false,
            total: rs.data.total,
            currentPage: pageable.pageNumber,
            isLastPage: get(rs, "data.data.last", true),
            items: items,
            oldFilter: this.state.filter,
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

  componentDidMount() {
    this._loadingItem(true);
    this._getWalletInfo();
  }

  _onRefresh = () => {
    this._loadingItem(true);
    this._getWalletInfo();
  };

  _getWalletInfo = async () => {
    try {
      let url = "/salon-wallets/salon/" + this.props.account.salon.salon_id;
      let rs = await Utils.getNewAxios(this.props.account.secondaryToken).get(
        url
      );
      const { amountMoney, amountCoin } = rs.data.data;
      this.setState({ amountCoin, amountMoney });
    } catch (e) {}
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
        headerTitle={"Ví"}
        headerTitleColor={Colors.LIGHT}
      >
        {this.state.refreshing ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <View style={Styles.pageWrapperInner}>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible1}
              onConfirm={this._handleDatePicked1}
              onCancel={this._hideDateTimePicker1}
              titleIOS={"Từ ngày"}
              confirmTextIOS={"Chọn"}
              cancelTextIOS={"Huỷ"}
            />
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible2}
              onConfirm={this._handleDatePicked2}
              onCancel={this._hideDateTimePicker2}
              titleIOS={"Đến ngày"}
              confirmTextIOS={"Chọn"}
              cancelTextIOS={"Huỷ"}
            />
            {this.state.showTool ? (
              <View style={Styles.filterTools}>
                <ScrollView style={Styles.filterToolsBody}>
                  <View style={Styles.filterToolDate}>
                    <TouchableOpacity
                      onPress={this._showDateTimePicker1}
                      style={Styles.filterToolDateTextWrapper}
                    >
                      <Text style={Styles.filterToolDateText}>
                        <Text style={Styles.filterToolDateTextInner}>
                          Từ ngày
                        </Text>
                        {this.state.filter.startDate !== undefined
                          ? ":      " + this.state.filter.startDate
                          : "..."}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          filter: {
                            ...this.state.filter,
                            startDate: undefined,
                            endDate: undefined,
                          },
                        });
                      }}
                    >
                      <Icon
                        style={Styles.filterToolsActionIcon}
                        name={"clear"}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={Styles.filterToolDate}>
                    <TouchableOpacity
                      onPress={this._showDateTimePicker2}
                      style={Styles.filterToolDateTextWrapper}
                    >
                      <Text style={Styles.filterToolDateText}>
                        <Text style={Styles.filterToolDateTextInner}>
                          Đến ngày
                        </Text>
                        {this.state.filter.endDate !== undefined
                          ? ":   " + this.state.filter.endDate
                          : "..."}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          filter: {
                            ...this.state.filter,
                            startDate: undefined,
                            endDate: undefined,
                          },
                        });
                      }}
                    >
                      <Icon
                        style={Styles.filterToolsActionIcon}
                        name={"clear"}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={Styles.filterCheckBoxs}>
                    {salonTransactionTypes.type.map((item, idx) => {
                      return (
                        <TouchableOpacity
                          key={"chk-" + idx}
                          onPress={() => {
                            if (
                              this.state.filter.status.indexOf(item.id) > -1
                            ) {
                              this.setState({
                                filter: {
                                  ...this.state.filter,
                                  status: this.state.filter.status.filter(
                                    (st) => {
                                      return st !== item.id;
                                    }
                                  ),
                                },
                              });
                            } else {
                              this.setState({
                                filter: {
                                  ...this.state.filter,
                                  status: this.state.filter.status.concat(
                                    item.id
                                  ),
                                },
                              });
                            }
                          }}
                          style={Styles.filterCheckBox}
                        >
                          <Icon
                            name={
                              this.state.filter.status.indexOf(item.id) > -1
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                            style={Styles.filterCheckBoxIcon}
                          />
                          <Text
                            style={[
                              Styles.filterCheckBoxText,
                              this.state.filter.status.indexOf(item.id) > -1 &&
                                Styles.filterCheckBoxTextSl,
                            ]}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
                <View style={Styles.filterToolsActions}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        {
                          showTool: false,
                        },
                        () => {
                          this._loadingItem(true);
                        }
                      );
                    }}
                    style={Styles.filterToolsAction}
                  >
                    <Text style={Styles.filterToolsActionText}>Áp dụng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showTool: false,
                        filter: this.state.oldFilter,
                      });
                    }}
                    style={Styles.filterToolsAction}
                  >
                    <Text style={Styles.filterToolsActionText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : undefined}
            <View style={Styles.filter}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    showTool: true,
                  });
                }}
                style={[Styles.filterButton, { borderLeftWidth: 0 }]}
              >
                <Icon style={Styles.filterButtonIcon} name={"settings"} />
                <Text style={Styles.filterButtonText}>BỘ LỌC</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      filter: {
                        startDate: undefined,
                        endDate: undefined,
                        status: [],
                      },
                    },
                    () => {
                      this._loadingItem(true);
                    }
                  );
                }}
                style={Styles.filterButton}
              >
                <Icon style={Styles.filterButtonIcon} name={"clear"} />
                <Text style={Styles.filterButtonText}>XOÁ BỘ LỌC</Text>
              </TouchableOpacity>
            </View>
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
                    Không có giao dịch tương ứng
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
})(WalletScreen);

const Styles = StyleSheet.create({
  filterSelectIconSL: {
    color: Colors.LIGHT,
  },
  filterSelectTextSL: {
    color: Colors.LIGHT,
  },
  filterSelects: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterSelect: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  filterSelectIcon: {
    color: Colors.SILVER_DARK,
    marginRight: 5,
    fontSize: 20,
  },
  filterSelectText: {
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
  },
  filterToolDateTextInner: {
    color: Colors.SILVER_LIGHT,
  },
  filterCheckBoxs: {},
  filterCheckBox: {
    borderBottomColor: "#363636",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  filterCheckBoxIcon: {
    color: Colors.SECONDARY,
    lineHeight: 40,
    fontSize: 25,
    marginRight: 15,
  },
  filterCheckBoxText: {
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    lineHeight: 40,
  },
  filterCheckBoxTextSl: {
    color: Colors.LIGHT,
  },
  filterToolDate: {
    borderWidth: 1,
    borderColor: Colors.SILVER_DARK,
    marginBottom: 15,
    paddingLeft: 15,
    flexDirection: "row",
  },
  filterToolDateTextWrapper: {
    flex: 1,
  },
  filterToolDateText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 14,
    lineHeight: 40,
  },
  filterToolsActionIcon: {
    backgroundColor: Colors.SECONDARY,
    width: 40,
    lineHeight: 40,
    textAlign: "center",
    fontSize: 20,
    color: Colors.LIGHT,
  },
  filterToolsBody: {
    marginBottom: 15,
    flex: 1,
  },
  filterToolsActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  filterToolsAction: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 5,
    overflow: "hidden",
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
  },
  filterToolsActionText: {
    color: Colors.LIGHT,
    lineHeight: 40,
    textAlign: "center",
  },
  filterTools: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 1,
    padding: 30,
  },
  filter: {
    backgroundColor: Colors.SECONDARY,
    flexDirection: "row",
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    borderLeftColor: "#48beff",
    borderLeftWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  filterButtonText: {
    lineHeight: 40,
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.LIGHT,
  },
  filterButtonIcon: {
    color: Colors.LIGHT,
    fontSize: 20,
    marginRight: 10,
  },
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
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
  },
  headerTitleContent: {
    alignItems: "flex-start",
    width: "100%",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 14,
    //textTransform: 'uppercase',
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
    textAlign: "center",
  },
  headerAmount: {
    fontSize: 40,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
    marginBottom: 10,
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
    flex: 1.5,
  },
  itemID: {
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.DARK,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemMeta: {
    fontSize: 14,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.PRIMARY,
    marginTop: 4,
  },
  itemStatus: {
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
  },
  itemPriceService: {
    flexDirection: "column",
    alignItems: "flex-end",
    flex: 1,
  },
  itemServices: {
    fontSize: 13,
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
  },
  itemIcon: {
    color: Colors.SILVER,
    fontSize: 25,
    width: 30,
    textAlign: "right",
  },
  type: {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    padding: 4,
    borderRadius: 3,
    borderWidth: 1,
    marginTop: 4,
  },
});
