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
import WALoading from "../components/WALoading";

type Props = {};
class MemberEditSaleScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        // {
        //     name: 'Undercut',
        //     price: 50,
        //     image: ImageSources.IMG_SERVICE_CAT_1
        // },
      ],
      loading: true,
      alert: false,
      alertMessage: "",
      processing: false,
      editing: false,
      confirm: false,
      target_id: null,
    };
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={Styles.item}>
        <View style={Styles.itemWrapper}>
          <ImageBackground
            source={{ uri: item.image }}
            style={Styles.itemImage}
          />
          <Text style={Styles.itemName}>
            <Text>
              {item.name}
              {"\n"}
            </Text>
            <Text style={{ color: Colors.SILVER_DARK, lineHeight: 20 }}>
              Giảm:
              <Text style={{ color: Colors.PRIMARY, fontWeight: "bold" }}>
                {item.sale_type === 1
                  ? " " + numeral(item.sale_amount).format("0,000") + "₫"
                  : " " + item.sale_percent + "%"}
              </Text>
            </Text>
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[Styles.itemPrice, { color: Colors.SILVER }]}>
              {numeral(item.price_from).format("0,000")}₫
              {item.price_from !== item.price_to
                ? " - " + numeral(item.price_to).format("0,000") + "₫"
                : undefined}
            </Text>
            <Text
              style={[
                Styles.itemPrice,
                { color: Colors.PRIMARY, fontWeight: "bold" },
              ]}
            >
              {numeral(item.new_price_from).format("0,000")}₫
              {item.new_price_from !== item.new_price_to
                ? " - " + numeral(item.new_price_to).format("0,000") + "₫"
                : undefined}
            </Text>
          </View>
          <TouchableOpacity
            hitSlop={Utils.defaultTouchSize}
            onPress={() => {
              this.setState({
                confirm: true,
                target_id: item.sale_id,
              });
            }}
            style={{ width: 30, alignItems: "flex-end" }}
          >
            <Icon style={Styles.itemIcon} name={"remove-circle"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  _keyExtractor = (item, index) => {
    return "item-" + index;
  };

  _load = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).get(
            "edit-salon/sales"
          );
          let items = rq.data;
          console.log(items);
          this.setState({
            loading: false,
            items: items,
          });
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

  afterSave = () => {
    this._load();
  };

  _delete = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).post(
            "edit-salon/sales/" + this.state.target_id + "/remove"
          );
          let items = rq.data;
          console.log(items);
          this._load();
        } catch (e) {
          this.setState({
            loading: false,
          });
          console.log(e.response);
        }
      }
    );
  };

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        navigationButtonStyle={Styles.closeButton}
        headerTitle={"QUẢN LÝ KHUYẾM MÃI"}
        headerTitleColor={Colors.LIGHT}
        headerContainerStyle={Styles.headerContainer}
        layoutPadding={15}
      >
        {this.state.loading ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={Styles.blockTitle}>THÊM DỊCH VỤ</Text>
            <View style={Styles.block}>
              <TouchableOpacity
                hitSlop={Utils.defaultTouchSize}
                onPress={() => {
                  this.props.navigation.navigate("edit_sale_select", {
                    afterSave: this.afterSave,
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
                <Text style={Styles.addButtonText}>Chọn dịch vụ</Text>
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
                  <View style={Styles.empty}>
                    <Icon style={Styles.emptyIcon} name={"error-outline"} />
                    <Text style={Styles.emptyText}>
                      Chưa có dịch vụ nào đang giảm giá, để thêm một dịch vụ
                      giảm giá vui lòng nhấn vào nút "Chọn dịch vụ"
                    </Text>
                  </View>
                </View>
              }
              data={this.state.items}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        )}
        <WALoading show={this.state.processing} />
        <WAAlert
          show={this.state.alert}
          yes={() => {
            this.setState({
              alert: false,
            });
          }}
          no={false}
          question={this.state.alertMessage}
          titleFirst={true}
          title={"Lỗi xảy ra"}
          yesTitle={"Đã hiểu"}
        />
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
            "Bạn có chắn chắn muốn xoá dịch vụ này ra khỏi danh sách khuyến mãi"
          }
          titleFirst={true}
          title={"Huỷ khuyến mãi"}
        />
      </PageContainer>
    );
  }
}
export default connect((state) => {
  return {
    account: state.account,
  };
})(MemberEditSaleScreen);
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
  itemName: {
    flex: 1,
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
    fontSize: 14,
    fontWeight: "bold",
  },
});
