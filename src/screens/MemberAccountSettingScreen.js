import React, { Component } from "react";
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
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { getVersion } from "react-native-device-info";
type Props = {};
export default class MemberAccountSettingScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _renderSettings = () => {
    let items = [
      {
        title: "Đổi mật khẩu",
        desc: "",
        icon: true,
        action: () => {
          this.props.navigation.navigate("home_account_change_pass");
        },
      },
      {
        title: "Màn hình mặc định",
        desc: "Chọn màn hình mặc định khi đăng nhập",
        icon: true,
        action: () => {
          this.props.navigation.navigate("home_account_default");
        },
      },
      {
        title: "Điều khoản dịch vụ",
        desc: "Các quy định sử dụng và bảo mật của ứng dụng",
        icon: true,
        action: () => {
          this.props.navigation.navigate("home_account_tos");
        },
      },
      {
        title: "Khởi tạo cấu hình",
        desc: "Phục hồi cấu hình mặc định",
        icon: false,
        action: async () => {
          await AsyncStorage.multiRemove(
            ["@iSalon:welcomed", "@iSalon:tabIndex"],
            (error) => console.log(error)
          );
          alert("Đã khởi tạo thành công");
        },
      },
    ];

    return items.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={item.action}
          key={index}
          style={[
            Styles.setting,
            index === 0 ? Styles.settingFirst : undefined,
          ]}
        >
          <View style={Styles.settingTextWrapper}>
            <Text style={Styles.settingText}>{item.title}</Text>
            {item.desc ? (
              <Text style={Styles.settingDesc}>{item.desc}</Text>
            ) : undefined}
          </View>
          {item.icon ? (
            <View style={Styles.settingIconWrapper}>
              <Icon style={Styles.settingIcon} name={"angle-right"} />
            </View>
          ) : undefined}
        </TouchableOpacity>
      );
    });
  };
  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        navigationButtonStyle={Styles.closeButton}
        layoutPadding={30}
        headerTitle={"CÀI ĐẶT"}
        headerTitleColor={Colors.LIGHT}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
      >
        <View style={Styles.pageWrapperInner}>
          <View style={Styles.settings}>{this._renderSettings()}</View>
          <View style={Styles.accountInfoWrapper}>
            <Text style={Styles.appInfo}>
              <Text style={Styles.appInfoVersion}>V.{getVersion()}</Text> Phát
              triển bởi team iSalon
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={Styles.feedback}>Phản hồi về app</Text>
          </TouchableOpacity>
        </View>
      </PageContainer>
    );
  }
}

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 0,
    alignItems: "flex-start",
  },
  pageWrapperInner: {
    flex: 1,
    width: "100%",
    paddingTop: 30,
  },
  closeButton: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  title: {
    marginBottom: 50,
  },
  titleText: {
    fontSize: 34,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME,
  },
  settings: {
    //flex: 1
  },
  setting: {
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.SILVER_LIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  settingFirst: {
    borderTopWidth: 0,
  },
  settingTextWrapper: {
    flex: 1,
  },
  settingText: {
    color: Colors.TEXT_DARK,
    fontSize: 17,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  settingDesc: {
    color: Colors.SILVER,
    fontSize: 11,
    marginTop: 5,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  settingIconWrapper: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  settingIcon: {
    fontSize: 20,
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  appInfo: {
    fontSize: 11,
    color: Colors.TEXT_LINK,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  appInfoVersion: {
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  accountInfoWrapper: {
    marginTop: 30,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  feedback: {
    color: Colors.TEXT_LINK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
  },
});
