import React, { Component } from "react";
import {
  KeyboardAvoidingView,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-community/async-storage";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import { connect } from "react-redux";
import {
  createAccount,
  updateInfo,
  updateJoinTOS,
  updateStartupRoute,
} from "../redux/account/actions";
import { DotIndicator } from "react-native-indicators";
import Utils from "../configs";
import ImageSources from "../styles/ImageSources";
import Icon from "react-native-vector-icons/MaterialIcons";
import Svg from "react-native-svg";
import Path from "react-native-svg/elements/Path";
import Circle from "react-native-svg/elements/Circle";

type Props = {};
class MemberAccountDefaultScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.account.tabIndex,
      items: [
        {
          id: 0,
          icon: (
            <Svg height="25" width="34">
              <Path
                d="M14.92,24.11h6.56V9S14,.84,11,.5C8,.84.5,9,.5,9V24.11H8.86V14.92"
                stroke={Colors.PRIMARY}
                fill={Colors.TRANSPARENT}
              />
            </Svg>
          ),
          title: "Màn hình trang chủ của ứng dụng",
        },
        {
          id: 1,
          icon: (
            <Svg height="26" width="34">
              <Path
                d="M4.26,12.71l1,13a.36.36,0,0,0,.38.32l27.79-2.16a.27.27,0,0,0,.25-.3l-1-13.15a.24.24,0,0,0-.25-.22L4.56,12.36A.32.32,0,0,0,4.26,12.71ZM20,22.53a4.09,4.09,0,1,1,3.11-3.64A4.09,4.09,0,0,1,20,22.53Z"
                fill="none"
                stroke={Colors.PRIMARY}
              />
              <Path
                d="M29.88,8.12,26.65.64a.23.23,0,0,0-.31-.12L.7,11.6A.32.32,0,0,0,.53,12l2.85,6.6"
                fill="none"
                stroke={Colors.PRIMARY}
              />
            </Svg>
          ),
          title: "Màn hình trang thống kê thu nhập",
        },
        {
          id: 2,
          icon: (
            <Svg height="26" width="34">
              <Path
                d="M11.4,19.22,5.25,22.49a.7.7,0,0,1-1-.74L5.4,14.82a.7.7,0,0,0-.2-.62l-5-4.92A.7.7,0,0,1,.6,8.09l6.89-1A.7.7,0,0,0,8,6.69L11.1.39a.7.7,0,0,1,1.26,0l3.08,6.29a.7.7,0,0,0,.53.39l6.89,1a.7.7,0,0,1,.39,1.2l-5,4.92a.7.7,0,0,0-.2.62l1.18,6.93a.7.7,0,0,1-1,.74l-6.15-3.26A.7.7,0,0,0,11.4,19.22Z"
                fill={Colors.TRANSPARENT}
                stroke={Colors.PRIMARY}
              />
            </Svg>
          ),
          title: "Màn hình sếp hạng đánh giá phản hồi của khách",
        },
        {
          id: 3,
          icon: (
            <Svg height="25" width="34">
              <Path
                d="M16.54,14.4h0a7.18,7.18,0,0,1-6.39,0h0S.42,18.85.5,22.3a4.33,4.33,0,0,0,3.13,4.2H23.05a4.32,4.32,0,0,0,3.12-4.2C26.25,18.85,16.54,14.4,16.54,14.4Z"
                stroke={Colors.PRIMARY}
                strokeWidth="1"
                fill={Colors.TRANSPARENT}
              />
              <Circle
                cx="13.34"
                cy="7.82"
                r="7.32"
                stroke={Colors.PRIMARY}
                strokeWidth="1"
                fill={Colors.TRANSPARENT}
              />
            </Svg>
          ),
          title: "Màn hình tài khoản và thông tin salon",
        },
      ],
    };
  }

  _save = async () => {
    try {
      await AsyncStorage.setItem("@iSalon:tabIndex", this.state.selected + "");
      this.props.updateInfo({
        tabIndex: this.state.selected,
      });
      this.props.navigation.goBack();
    } catch (error) {
      return Promise.reject({
        title: "Lỗi không xác định",
        message: "Một lỗi không xác định xảy ra, vui lòng đóng app và thử lại",
      });
    }
  };

  _renderItem = ({ item }) => {
    return (
      <View style={Styles.item}>
        <TouchableOpacity
          hitSlop={{
            top: 30,
            bottom: 30,
            left: 30,
            right: 30,
          }}
          onPress={() => {
            this.setState({
              selected: item.id,
            });
          }}
          style={Styles.itemButton}
        >
          {item.icon}
          <Text style={Styles.itemText}>{item.title}</Text>
          <View style={Styles.checker}>
            {this.state.selected === item.id ? (
              <Icon style={Styles.itemIcon} name={"check-circle"} />
            ) : undefined}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <PageContainer
        darkTheme={false}
        navigationButtonStyle={{ color: Colors.LIGHT }}
        contentWrapperStyle={[
          GlobalStyles.pageWrapper,
          NewUserFormStyles.pageWrapper,
          { justifyContent: "flex-start", paddingLeft: 0, paddingRight: 0 },
        ]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        layoutPadding={20}
        headerTitle={"MÀN HÌNH MẶC ĐỊNH"}
        headerTitleColor={Colors.LIGHT}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              this._save();
            }}
            hitSlop={{ top: 30, bottom: 30, right: 30, left: 30 }}
          >
            <Text style={Styles.save}>Lưu</Text>
          </TouchableOpacity>
        }
      >
        <View style={{ paddingLeft: 20 }}>
          <View style={Styles.title}>
            <Text style={[Styles.titleTextSub]}>
              Chọn màn hình mặc định khi bạn đăng nhập vào app thuận tiện nhất
              cho bạn
            </Text>
          </View>
          <FlatList
            data={this.state.items}
            extraData={this.state}
            keyExtractor={(item, index) => {
              return "item" + index;
            }}
            renderItem={this._renderItem}
            style={Styles.list}
          />
        </View>
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
    updateInfo,
  }
)(MemberAccountDefaultScreen);

const Styles = StyleSheet.create({
  title: {
    marginBottom: 30,
    paddingRight: 20,
    marginTop: 30,
  },
  titleText: {
    fontSize: 34,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME,
  },

  titleTextSub: {
    fontSize: 14,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    marginTop: 5,
  },
  titleTextSubError: {
    color: Colors.ERROR,
  },
  save: {
    fontSize: 18,
    fontFamily: this.FONT_NAME,
    color: Colors.PRIMARY,
  },
  item: {
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    flex: 1,
    marginLeft: 15,
  },
  checker: {
    width: 50,
    //backgroundColor: 'red'
  },
  itemIcon: {
    fontSize: 25,
    color: "#00a307",
  },
});
