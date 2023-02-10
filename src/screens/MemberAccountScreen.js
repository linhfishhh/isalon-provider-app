import React, { Component, PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  StatusBar,
  Share,
  ScrollView,
} from "react-native";
import HomeSectionPageContainer from "../components/HomeSectionPageContainer";
import ImageSources from "../styles/ImageSources";
import Colors from "../styles/Colors";
import GlobalStyles from "../styles/GlobalStyles";
import { Circle, Line, Path, Rect, Svg } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import { logout } from "../redux/account/actions";
import { connect } from "react-redux";
import WAAlert from "../components/WAAlert";

class MemberAccountScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      logoutModal: false,
      accountName: "Viện tóc Envy",
      accountAvatar: ImageSources.IMG_AVATAR_2,
      tosAlert: false,
    };
  }

  render() {
    return (
      <HomeSectionPageContainer style={Styles.container}>
        <WAAlert
          show={this.state.tosAlert}
          title={"Bạn đồng ý và tiếp tục?"}
          question={
            <Text>
              Bạn phải hoàn toàn chịu trách nhiệm với những thông tin mình thêm
              mới / cập nhật cũng như đồng ý với các {"\n"}
              <Text
                style={{ color: Colors.PRIMARY, fontWeight: "bold" }}
                onPress={() => {
                  this.setState(
                    {
                      tosAlert: false,
                    },
                    () => {
                      this.props.route.navigation.navigate("home_account_tos");
                    }
                  );
                }}
              >
                chính sách & điều khoản
              </Text>
            </Text>
          }
          yes={() => {
            this.setState(
              {
                tosAlert: false,
              },
              () => {
                this.props.route.navigation.navigate("home_account_profile");
              }
            );
          }}
          no={() => {
            this.setState(
              {
                tosAlert: false,
              },
              () => {}
            );
          }}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={Styles.accountInfo}>
            <View style={Styles.accountInfoNameWrapper}>
              <Text numberOfLines={1} style={Styles.accountInfoName}>
                {this.props.account.salon.name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  //this.props.route.navigation.navigate('home_account_profile');
                  this.setState({
                    tosAlert: true,
                  });
                }}
                style={Styles.accountInfoLink}
              >
                <Text style={Styles.accountInfoLinkText}>Cập nhật Salon</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  tosAlert: true,
                });
              }}
              style={Styles.avatarWrapper}
            >
              <Image
                style={Styles.avatar}
                source={{ uri: this.props.account.salon.avatar }}
              />
            </TouchableOpacity>
          </View>
          <View style={Styles.menu}>{this._renderMenu()}</View>
          <View style={Styles.extraMenu}>
            <TouchableOpacity
              onPress={() => {
                this.props.route.navigation.navigate("app_intro");
              }}
              style={Styles.extraMenuItem}
            >
              <Text style={Styles.extraMenuText}>
                Giới thiệu về ứng dụng iSalon
              </Text>
              <Icon style={Styles.menuIcon} name={"keyboard-arrow-right"} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={() => {}}
          visible={this.state.logoutModal}
        >
          <StatusBar
            translucent={true}
            backgroundColor={"rgba(0, 0, 0, 0.82)"}
            barStyle={"light-content"}
          />
          <View style={Styles.modal}>
            <View style={Styles.modalInner}>
              <Text style={Styles.modalQuestion}>
                Bạn có chắc chắn muốn thoát khỏi ứng dụng không?
              </Text>
              <Text style={Styles.modalTitle}>Bạn đồng ý đăng xuất?</Text>
              <View style={Styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ logoutModal: false });
                  }}
                  style={Styles.modalButton}
                >
                  <Text style={Styles.modalButtonText}>Không</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        logoutModal: false,
                      },
                      () => {
                        this.props.logout();
                        this.props.route.navigation.replace("login");
                      }
                    );
                  }}
                  style={[Styles.modalButton, Styles.modalButtonAgree]}
                >
                  <Text
                    style={[
                      Styles.modalButtonText,
                      Styles.modalButtonAgreeText,
                    ]}
                  >
                    Đồng ý
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </HomeSectionPageContainer>
    );
  }

  _renderMenu = () => {
    let items = [
      {
        icon: ImageSources.SVG_ICON_UPDATE_SALON,
        label: "Cập nhật salon",
        number: 0,
        action: () => {
          this.setState({
            tosAlert: true,
          });
        },
      },
      {
        icon: ImageSources.SVG_ICON_INFO,
        label: "Trợ giúp",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("home_account_faq");
        },
      },
      {
        icon: ImageSources.SVG_ICON_WALLET,
        label: "Ví",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("wallet");
        },
      },
      {
        icon: ImageSources.SVG_ICON_DOLLAR,
        label: "Thanh toán",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("payment");
        },
      },
      {
        icon: ImageSources.SVG_ICON_SETTINGS,
        label: "Cài đặt",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("home_account_setting");
        },
      },
      {
        icon: ImageSources.SVG_ICON_USER_INFO,
        label: "Thông tin khách hàng",
        number: 0,
        action: () => {
          this.props.route.navigation.navigate("customer_list");
        },
      },
      {
        icon: ImageSources.SVG_ICON_LOGOUT,
        label: "Đăng xuất",
        number: 0,
        action: () => {
          this.setState({
            logoutModal: true,
          });
        },
      },
    ];
    return items.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            return item.action ? item.action() : undefined;
          }}
          style={Styles.menuItem}
          key={index}
          activeOpacity={0.5}
        >
          <View style={Styles.menuItemIcon}>{item.icon}</View>
          <View style={Styles.menuLabelWrapper}>
            <Text style={Styles.menuLabel}>{item.label}</Text>
            <Icon style={Styles.menuIcon} name={"keyboard-arrow-right"} />
          </View>
        </TouchableOpacity>
      );
    });
  };
}
export default connect(
  (state) => {
    return {
      account: state.account,
    };
  },
  { logout }
)(MemberAccountScreen);

const Styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    backgroundColor: Colors.SILVER_LIGHT,
  },
  avatarWrapper: {},
  avatar: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 35,
  },
  accountInfo: {
    flexDirection: "row",
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    backgroundColor: Colors.LIGHT,
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 20,
  },
  accountInfoName: {
    fontSize: 30,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontWeight: "bold",
  },
  accountInfoNameWrapper: {
    flex: 1,
  },
  accountInfoLink: {},
  accountInfoLinkText: {
    color: Colors.SILVER,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  menu: {
    backgroundColor: Colors.LIGHT,
    paddingLeft: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuLabelWrapper: {
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  menuLabel: {
    color: Colors.TEXT_DARK,
    fontSize: 15,
    fontFamily: GlobalStyles.FONT_NAME,
    flex: 1,
  },
  menuIcon: {
    marginRight: 20,
    fontSize: 25,
    color: Colors.SILVER_DARK,
  },
  modal: {
    backgroundColor: "rgba(0,0,0,0.82)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalInner: {
    backgroundColor: Colors.LIGHT,
    marginRight: 30,
    marginLeft: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 50,
    paddingBottom: 50,
    borderRadius: 5,
  },
  modalQuestion: {
    color: Colors.TEXT_DARK,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.TEXT_DARK,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalButton: {
    borderColor: Colors.SILVER,
    borderWidth: 1,
    borderRadius: 20,
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
  },
  modalButtonText: {
    textAlign: "center",
    lineHeight: 40,
    fontSize: 14,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  modalButtonAgree: {
    backgroundColor: Colors.PRIMARY,
    borderWidth: 0,
  },
  modalButtonAgreeText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  number: {
    width: 24,
    height: 24,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginRight: 50,
  },
  numberText: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 12,
  },
  extraMenu: {
    backgroundColor: Colors.LIGHT,
    marginTop: 20,
    paddingLeft: 30,
    paddingRight: 0,
    paddingTop: 20,
    paddingBottom: 20,
  },
  extraMenuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraMenuText: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
});
