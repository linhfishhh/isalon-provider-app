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
class MemberEditSaleSelectServiceScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam("id"),
      afterSave: this.props.navigation.getParam("afterSave"),
      items: [
        // {
        //     name: 'Undercut',
        //     price: 50,
        //     image: ImageSources.IMG_SERVICE_CAT_1  afterSave: this.afterSave
        // },
      ],
      loading: false,
      alert: false,
      alertMessage: "",
      processing: false,
      editing: false,
    };
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={Styles.item}>
        <TouchableOpacity
          hitSlop={Utils.defaultTouchSize}
          onPress={() => {
            this.props.navigation.navigate("edit_sale_detail", {
              data: item,
              afterSave: this.state.afterSave,
            });
          }}
          style={Styles.itemWrapper}
        >
          <ImageBackground
            source={{ uri: item.image }}
            style={Styles.itemImage}
          />
          <View style={Styles.itemPriceName}>
            <Text style={Styles.itemName}>{item.name}</Text>
            <Text style={Styles.itemPrice}>
              {numeral(item.price_from).format("0,000")}₫
              {item.price_from !== item.price_to
                ? " - " + numeral(item.price_to).format("0,000") + "₫"
                : ""}
            </Text>
          </View>
          <Icon style={Styles.itemIcon} name={"keyboard-arrow-right"} />
        </TouchableOpacity>
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
            "edit-salon/not-sales"
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

  afterSave = () => {};

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        navigationButtonStyle={Styles.closeButton}
        headerTitle={"CHỌN DỊCH VỤ"}
        headerTitleColor={Colors.LIGHT}
        headerContainerStyle={Styles.headerContainer}
        layoutPadding={15}
      >
        {this.state.loading ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={Styles.blockTitle}>CHỌN DỊCH VỤ CẦN KHUYẾN MÃI</Text>
            <FlatList
              style={Styles.items}
              ListEmptyComponent={
                <View style={Styles.block}>
                  <View style={Styles.items}>
                    {this.state.items.length === 0 ? (
                      <View style={Styles.empty}>
                        <Icon style={Styles.emptyIcon} name={"error-outline"} />
                        <Text style={Styles.emptyText}>
                          Hiện tại salon của bạn không có dịch vụ nào có thể
                          khuyến mãi (Có thể salon chưa có dịch vụ nào hoặc tất
                          cả dịch vụ đã đang khuyến mãi rồi)
                        </Text>
                      </View>
                    ) : (
                      this.state.items.map((item, index) => {
                        return (
                          <View key={index} style={Styles.item}>
                            <Image source={item} style={Styles.logo} />
                            <TouchableOpacity style={Styles.remove}>
                              <Icon style={Styles.removeIcon} name={"remove"} />
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    )}
                  </View>
                </View>
              }
              data={this.state.items}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
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
})(MemberEditSaleSelectServiceScreen);
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
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  itemPriceName: {
    flex: 1,
  },
  itemIcon: {
    color: Colors.SILVER,
    fontSize: 25,
  },
  itemPrice: {
    marginRight: 5,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    fontWeight: "bold",
  },
});
