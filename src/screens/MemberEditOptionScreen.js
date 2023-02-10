import React, { Component } from "react";
import {
  Dimensions,
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
import WAColorPicker from "../components/WAColorPicker";
import { toHsv, fromHsv } from "react-native-color-picker";
import Slider from "react-native-slider";
import WALoading from "../components/WALoading";

type Props = {};
class MemberEditOptionScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam("id"),
      service_id: this.props.navigation.getParam("service_id"),
      editMode: this.props.navigation.getParam("id") !== null,
      afterSave: this.props.navigation.getParam("afterSave"),
      loading: false,
      alert: false,
      alertMessage: "",
      processing: false,
      editing: false,
      data: {
        name: "",
        price: 100000,
      },
    };
  }

  _load = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          console.log(this.state.service_id);
          let rq = await Utils.getAxios(this.props.account.token).get(
            "edit-salon/service/" +
              this.state.service_id +
              "/option/" +
              this.state.id +
              "/info"
          );
          let data = rq.data;

          this.setState({
            loading: false,
            data: data,
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
    if (this.state.editMode) {
      this._load();
    } else {
    }
  }

  _getForm = () => {
    let form = new FormData();
    form.append("name", this.state.data.name);
    form.append("price", this.state.data.price);
    return form;
  };

  _create = () => {
    this.setState(
      {
        processing: true,
      },
      async () => {
        try {
          let form = this._getForm();
          let rq = await Utils.getAxios(this.props.account.token, {
            "Content-Type": "multipart/form-data",
          }).post(
            "edit-salon/service/" + this.state.service_id + "/option/create",
            form
          );
          this.setState(
            {
              processing: false,
            },
            () => {
              this.props.navigation.goBack();
              this.state.afterSave();
            }
          );
        } catch (e) {
          this.setState({
            processing: false,
            alert: true,
            alertMessage:
              e.response.status === 422
                ? Utils.getValidationMessage(e.response).replace(/■/g, "")
                : "Có lỗi xảy ra trong quá trình lưu dữ liệu",
          });
          console.log(e.response);
        }
      }
    );
  };

  _update = () => {
    this.setState(
      {
        processing: true,
      },
      async () => {
        try {
          let form = this._getForm();
          console.log(form);
          let rq = await Utils.getAxios(this.props.account.token, {
            "Content-Type": "multipart/form-data",
          }).post(
            "edit-salon/service/" +
              this.state.service_id +
              "/option/" +
              this.state.id +
              "/update",
            form
          );

          this.setState(
            {
              processing: false,
            },
            () => {
              this.props.navigation.goBack();
              this.state.afterSave();
            }
          );
        } catch (e) {
          console.log(e.response);
          this.setState({
            processing: false,
            alert: true,
            alertMessage: e.response
              ? e.response.status === 422
                ? Utils.getValidationMessage(e.response).replace(/■/g, "")
                : "Có lỗi xảy ra trong quá trình lưu dữ liệu"
              : "",
          });
          console.log(e.response);
        }
      }
    );
  };

  _save = () => {
    if (this.state.editMode) {
      this._update();
    } else {
      this._create();
    }
  };

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        navigationButtonStyle={Styles.closeButton}
        headerTitle={this.state.editMode ? "SỬA TUỲ CHỌN" : "THÊM TUỲ CHỌN"}
        headerTitleColor={Colors.LIGHT}
        headerContainerStyle={Styles.headerContainer}
        layoutPadding={15}
        rightComponent={
          !this.state.loading && !this.state.processing ? (
            <TouchableOpacity
              hitSlop={Utils.defaultTouchSize}
              onPress={() => {
                this._save();
              }}
            >
              <Text style={Styles.saveButton}>Lưu</Text>
            </TouchableOpacity>
          ) : undefined
        }
      >
        {this.state.loading ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            <View style={Styles.fieldSet}>
              <Text style={Styles.fieldLabel}>Tên dịch vụ:</Text>
              <TextInput
                style={Styles.field}
                placeholder={"Nhập tên tuỳ chọn..."}
                underlineColorAndroid={Colors.TRANSPARENT}
                spellCheck={false}
                autoCapitalize={"none"}
                autoCorrect={false}
                value={this.state.data.name}
                onChangeText={(text) => {
                  this.setState({
                    data: {
                      ...this.state.data,
                      name: text,
                    },
                  });
                }}
              />
            </View>
            <View style={Styles.fieldSet}>
              <Text style={Styles.fieldLabel}>Giá tuỳ chọn:</Text>
              <TextInput
                style={Styles.field}
                placeholder={"Nhập giá tuỳ chọn..."}
                underlineColorAndroid={Colors.TRANSPARENT}
                spellCheck={false}
                autoCapitalize={"none"}
                autoCorrect={false}
                value={this.state.data.price + ""}
                onChangeText={(text) => {
                  this.setState({
                    data: {
                      ...this.state.data,
                      price: text,
                    },
                  });
                }}
                keyboardType={"numeric"}
              />
            </View>
          </ScrollView>
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
      </PageContainer>
    );
  }
}
export default connect((state) => {
  return {
    account: state.account,
  };
})(MemberEditOptionScreen);
const Styles = StyleSheet.create({
  htmlEmpty: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  htmlEmptyIcon: {
    fontSize: 40,
    marginRight: 15,
    color: Colors.SECONDARY,
  },
  htmlEmptyText: {
    flex: 1,
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  htmlResultWrapper: {
    borderWidth: 1,
    borderColor: Colors.SILVER_LIGHT,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 50,
    marginBottom: 15,
  },
  coverPickerNote: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  coverPicker: {
    flexDirection: "row",
    alignItems: "center",
  },
  coverPickerImage: {
    width: 80,
    height: 80,
    backgroundColor: Colors.SILVER_LIGHT,
    borderRadius: 40,
    marginRight: 15,
    overflow: "hidden",
    resizeMode: "contain",
  },
  slider: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderValue: {
    width: 70,
    textAlign: "right",
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
  },
  sliderControl: {
    flex: 1,
    marginLeft: 5,
  },
  colorPickerResult: {
    height: 42,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.SILVER,
  },
  fieldSet: {
    marginTop: 15,
    marginBottom: 15,
  },
  fieldSetHtml: {},
  fieldLabel: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    marginBottom: 10,
  },
  field: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.SILVER_LIGHT,
    paddingLeft: 10,
    paddingRight: 10,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    borderRadius: 5,
  },
  pageWrapper: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: "flex-start",
  },
  closeButton: {
    color: Colors.LIGHT,
  },
  saveButton: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
  },
  headerContainer: {
    backgroundColor: Colors.DARK,
  },
  addRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  galleryAdd: {
    backgroundColor: Colors.SILVER_LIGHT,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  galleryAddTitle: {
    color: Colors.SILVER_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 16,
  },
  blockGallery: {
    marginBottom: 30,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  logo: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width / 2 - 16 - 10,
    marginLeft: 10,
  },
  logoImageWrapper: {
    borderWidth: 1,
    borderColor: Colors.SILVER_LIGHT,
    flex: 1,
    padding: 15,
  },
  logoImage: {
    height: 80,
    resizeMode: "contain",
  },
  logoFirst: {
    marginLeft: 0,
    marginRight: 10,
  },
  logoRemove: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    right: 0,
    top: 0,
  },
  logoRemoveIcon: {
    color: Colors.LIGHT,
  },
});
