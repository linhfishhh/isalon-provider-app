import React, { Component } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Line, Path, Svg } from "react-native-svg";
import ImagePicker from "react-native-image-crop-picker";
import ImageSources from "../styles/ImageSources";
import WAAlert from "../components/WAAlert";
import Utils from "../configs";
import { connect } from "react-redux";
import { DotIndicator } from "react-native-indicators";
import numeral from "numeral";

type Props = {};
class MemberEditCatOptionsScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam("id"),
      name: this.props.navigation.getParam("name"),
      updateInfo: this.props.navigation.getParam("updateInfo"),
      items: [],
      loading: true,
      alert: false,
      alertMessage: "",
      processing: false,
      editing: false,
      confirm: false,
      target_id: undefined,
    };
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={Styles.item}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("edit_option", {
              id: item.id,
              service_id: this.state.id,
              afterSave: () => {
                this.afterSave(() => {
                  this.state.updateInfo(
                    this.state.id,
                    0,
                    this._getPriceFrom(),
                    this._getPriceTo()
                  );
                });
              },
            });
          }}
          style={Styles.itemWrapper}
        >
          <View style={Styles.itemPriceName}>
            <Text style={Styles.itemName}>{item.name}</Text>
          </View>
          <Text style={Styles.itemPrice}>
            {numeral(item.price).format("0,000")}₫
          </Text>
          <TouchableOpacity
            hitSlop={Utils.defaultTouchSize}
            onPress={() => {
              this.setState({
                confirm: true,
                target_id: item.id,
              });
            }}
            style={{ width: 30, alignItems: "flex-end" }}
          >
            <Icon style={Styles.itemIcon} name={"remove-circle"} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };
  _keyExtractor = (item, index) => {
    return "item-" + index;
  };

  _delete = () => {
    this.setState(
      {
        processing: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).post(
            "edit-salon/service/" +
              this.state.id +
              "/option/" +
              this.state.target_id +
              "/remove"
          );
          console.log(rq.data);
          this.setState(
            {
              processing: false,
              items: this.state.items.filter((item) => {
                return item.id !== this.state.target_id;
              }),
            },
            () => {
              this.state.updateInfo(
                this.state.id,
                -1,
                this._getPriceFrom(),
                this._getPriceTo()
              );
            }
          );
        } catch (e) {
          this.setState({
            processing: false,
          });
          console.log(e.response);
        }
      }
    );
  };

  _getPriceFrom = () => {
    let rs = Math.min(
      ...this.state.items.map((item) => {
        return item.price;
      })
    );
    return rs;
  };

  _getPriceTo = () => {
    let rs = Math.max(
      ...this.state.items.map((item) => {
        return item.price;
      })
    );
    return rs;
  };

  _load = (after) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).get(
            "edit-salon/service/" + this.state.id + "/options"
          );
          let items = rq.data;
          console.log(items);
          this.setState(
            {
              loading: false,
              items: items,
            },
            () => {
              if (after) {
                after();
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

  componentDidMount() {
    this._load();
  }

  afterSave = (after) => {
    this._load(after);
  };

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        navigationButtonStyle={Styles.closeButton}
        headerTitle={this.state.name}
        headerTitleColor={Colors.LIGHT}
        headerContainerStyle={Styles.headerContainer}
        layoutPadding={15}
      >
        {this.state.loading ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={Styles.blockTitle}>THÊM TUỲ CHỌN</Text>
            <View style={Styles.block}>
              <TouchableOpacity
                hitSlop={Utils.defaultTouchSize}
                onPress={() => {
                  this.props.navigation.navigate("edit_option", {
                    id: null,
                    service_id: this.state.id,
                    afterSave: () => {
                      this.afterSave(() => {
                        this.state.updateInfo(
                          this.state.id,
                          1,
                          this._getPriceFrom(),
                          this._getPriceTo()
                        );
                      });
                    },
                    cat_id: this.state.id,
                  });
                }}
                style={Styles.addButton}
              >
                <Svg width={28} height={28}>
                  <Line
                    x1="13.6"
                    x2="13.6"
                    y2="27.21"
                    fill="none"
                    stroke="#16a6ae"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  />
                  <Line
                    x1="27.21"
                    y1="13.6"
                    y2="13.6"
                    fill="none"
                    stroke="#16a6ae"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  />
                </Svg>
                <Text style={Styles.addButtonText}>Thêm tuỳ chọn</Text>
                <Icon
                  style={Styles.addButtonIcon}
                  name={"keyboard-arrow-right"}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              style={Styles.items}
              ListEmptyComponent={
                <View style={Styles.block}>
                  <View style={Styles.items}>
                    {
                      <View style={Styles.empty}>
                        <Icon style={Styles.emptyIcon} name={"error-outline"} />
                        <Text style={Styles.emptyText}>
                          Dịch vụ này chưa có tuỳ chọn nào, vui lòng nhấn "Thêm
                          tuỳ chọn" để thêm tuỳ chọn.
                        </Text>
                      </View>
                    }
                  </View>
                </View>
              }
              data={this.state.items}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        )}
        <WAAlert
          show={this.state.confirm}
          yes={() => {
            this.setState(
              {
                confirm: false,
              },
              () => {
                this._delete();
              }
            );
          }}
          no={() => {
            this.setState({
              confirm: false,
            });
          }}
          question={
            "Bạn có chắc chắn muốn xoá tuỳ chọn này ra khỏi danh sách tuỳ chọn của dịch vụ"
          }
          titleFirst={true}
          title={"Xoá tuỳ chọn"}
        />
      </PageContainer>
    );
  }
}
export default connect((state) => {
  return {
    account: state.account,
  };
})(MemberEditCatOptionsScreen);
const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: "flex-start",
    backgroundColor: "#F1F1F2",
  },
  closeButton: {
    color: Colors.LIGHT,
  },
  saveButton: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  headerContainer: {
    backgroundColor: Colors.DARK,
  },
  block: {
    backgroundColor: Colors.LIGHT,
    padding: 20,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER_LIGHT,
  },
  blockTitle: {
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    padding: 20,
  },
  empty: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  emptyIcon: {
    fontSize: 40,
    color: Colors.SECONDARY,
  },
  emptyText: {
    flex: 1,
    marginLeft: 10,
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    flex: 1,
    marginLeft: 15,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  addButtonIcon: {
    color: Colors.SILVER,
    fontSize: 25,
  },
  items: {
    flex: 1,
    //marginTop: 15
  },
  itemImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 15,
  },
  item: {
    backgroundColor: Colors.LIGHT,
    paddingLeft: 20,
  },
  itemWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 20,
    borderTopColor: Colors.SILVER_LIGHT,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemPriceName: {
    flex: 1,
  },
  itemName: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  itemIcon: {
    color: Colors.PRIMARY,
    fontSize: 25,
  },
  itemPrice: {
    marginRight: 5,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
    fontWeight: "bold",
  },
  optionBtn: {
    width: 70,
    marginLeft: 20,
    backgroundColor: Colors.SECONDARY,
    padding: 5,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  optionBtnText: {
    fontFamily: GlobalStyles.FONT_NAME,
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
