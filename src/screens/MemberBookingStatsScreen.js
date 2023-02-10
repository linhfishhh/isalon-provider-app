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

type Props = {};
class MemberBookingStatsScreen extends Component<Props> {
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
      total: 0,
      isLastPage: false,
      fetching: false,
      sum: 0,
      showTool: false,
      filter: {
        startDate: undefined,
        endDate: undefined,
        status: [],
        created_at: true,
      },
      oldFilter: {
        startDate: undefined,
        endDate: undefined,
        status: [],
        created_at: true,
      },
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
    };
  }

  _showDateTimePicker1 = () =>
    this.setState({ isDateTimePickerVisible1: true });

  _hideDateTimePicker1 = () =>
    this.setState({ isDateTimePickerVisible1: false });

  _handleDatePicked1 = (date) => {
    console.log("A date has been picked: ", date);
    this.setState(
      {
        filter: {
          ...this.state.filter,
          startDate: moment(date).format("DD/MM/YYYY"),
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
          endDate: moment(date).format("DD/MM/YYYY"),
        },
      },
      this._hideDateTimePicker2
    );
  };

  getStatusString = () => {
    let rs = "";
    this.state.filter.status.every((item, index) => {
      if (index !== 0) {
        rs += ", ";
      }
      rs += Utils.getBookingStatus(item).text;
      return item;
    });
    return rs;
  };

  _header = () => {
    return (
      <View style={Styles.header}>
        <Text style={Styles.headerTitle}>
          {this.state.total} đặt chỗ
          {this.state.filter.startDate && this.state.filter.endDate ? (
            <Text>
              <Text style={{ color: Colors.PRIMARY, fontWeight: "bold" }}>
                {this.state.filter.created_at ? " đặt từ\n" : " làm từ\n"}
              </Text>
              <Text style={{ color: Colors.SECONDARY, fontWeight: "bold" }}>
                {this.state.filter.startDate}
              </Text>{" "}
              đến{" "}
              <Text style={{ color: Colors.SECONDARY, fontWeight: "bold" }}>
                {this.state.filter.endDate}
              </Text>
            </Text>
          ) : undefined}
        </Text>
        <Text style={Styles.headerAmount}>
          {numeral(this.state.sum).format("0,000")}₫
        </Text>
        <Text
          numberOfLines={1}
          style={[Styles.headerTitle, { color: Colors.PRIMARY }]}
        >
          {this.state.filter.status.length === 0
            ? "Tất cả trạng thái"
            : this.getStatusString()}
        </Text>
      </View>
    );
  };
  _renderItem = ({ item }) => {
    let status = Utils.getBookingStatus(item.status);
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
              Đặt lúc: {item.create_time}, {item.create_date}
            </Text>
            <Text style={[Styles.itemMeta, { color: Colors.SECONDARY }]}>
              Làm vào: {item.time}, {item.date}
            </Text>
            <Text style={[Styles.itemMeta, Styles.itemStatus]}>
              <Text style={{ color: Colors.SILVER_DARK }}>{status.text}</Text>
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
          let url = "booking/stats" + "?page=" + this.state.currentPage;
          if (
            this.state.filter.startDate !== undefined &&
            this.state.filter.endDate !== undefined
          ) {
            url +=
              "&start_date=" +
              this.state.filter.startDate +
              "&end_date=" +
              this.state.filter.endDate;
          }
          url += "&created_at=" + (this.state.filter.created_at ? "1" : "0");
          if (this.state.filter.status.length > 0) {
            this.state.filter.status.every((item) => {
              url += "&status[]=" + item;
              return item;
            });
          }
          console.log("----------------", url);
          let rs = await Utils.getAxios(this.props.account.token).get(url);
          console.log(rs.data.items);
          let items = rs.data.items;
          if (!refresh) {
            items = [...this.state.items, ...items];
          }
          this.setState({
            refreshing: false,
            loading: false,
            fetching: false,
            total: rs.data.total,
            currentPage: rs.data.currentPage,
            isLastPage: rs.data.currentPage === rs.data.lastPage,
            items: items,
            sum: rs.data.sum,
            oldFilter: this.state.filter,
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
        headerTitle={"Thống kê nâng cao"}
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
                  <View style={Styles.filterSelects}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          filter: {
                            ...this.state.filter,
                            created_at: true,
                          },
                        });
                      }}
                      style={Styles.filterSelect}
                    >
                      <Icon
                        style={[
                          Styles.filterSelectIcon,
                          this.state.filter.created_at &&
                            Styles.filterSelectIconSL,
                        ]}
                        name={
                          this.state.filter.created_at
                            ? "radio-button-checked"
                            : "radio-button-unchecked"
                        }
                      />
                      <Text
                        style={[
                          Styles.filterSelectText,
                          this.state.filter.created_at &&
                            Styles.filterSelectTextSL,
                        ]}
                      >
                        Lọc theo ngày đặt
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          filter: {
                            ...this.state.filter,
                            created_at: false,
                          },
                        });
                      }}
                      style={Styles.filterSelect}
                    >
                      <Icon
                        style={[
                          Styles.filterSelectIcon,
                          !this.state.filter.created_at &&
                            Styles.filterSelectIconSL,
                        ]}
                        name={
                          !this.state.filter.created_at
                            ? "radio-button-checked"
                            : "radio-button-unchecked"
                        }
                      />
                      <Text
                        style={[
                          Styles.filterSelectText,
                          !this.state.filter.created_at &&
                            Styles.filterSelectTextSL,
                        ]}
                      >
                        Lọc theo ngày làm
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                    {Utils.getBookingStatusList.map((item, idx) => {
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
                            {item.title}
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
                        created_at: true,
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
                    Không có đơn đặt chỗ tương ứng
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
})(MemberBookingStatsScreen);

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
    paddingBottom: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
  },
  headerTitle: {
    fontSize: 14,
    //textTransform: 'uppercase',
    fontFamily: GlobalStyles.FONT_NAME,
    color: Colors.SILVER_DARK,
    marginBottom: 5,
    textAlign: "center",
  },
  headerAmount: {
    fontSize: 45,
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
    flex: 1,
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
  },
  itemStatus: {
    marginTop: 5,
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
