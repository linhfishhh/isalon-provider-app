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
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
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
import { DotIndicator } from "react-native-indicators";
import { connect } from "react-redux";
import Utils from "../configs";

type Props = {};
class MemberSalonIntroScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      title: "Ứng dụng booking và quản lý booking iSalon",
      content: "",
      loading: true,
    };
  }

  _load = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).get(
            "get-app-intro"
          );
          this.setState({
            loading: false,
            content: `<!DOCTYPE html>
<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body>${rq.data}</body></html>`,
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

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        navigationButtonStyle={Styles.closeButton}
        layoutPadding={30}
        headerTitle={"GIỚI THIỆU"}
        headerTitleColor={Colors.LIGHT}
      >
        <View style={Styles.pageWrapperInner}>
          {this.state.loading ? (
            <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
          ) : (
            <View style={Styles.content}>
              <View style={Styles.title}>
                <Text style={Styles.titleText}>{this.state.title}</Text>
              </View>
              <WebView
                style={Styles.contentWeb}
                originWhitelist={["*"]}
                startInLoadingState={true}
                source={{
                  baseUrl: "",
                  html: this.state.content,
                }}
              />
            </View>
          )}
        </View>
      </PageContainer>
    );
  }
}

export default connect((state) => {
  return {
    account: state.account,
  };
})(MemberSalonIntroScreen);

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: "flex-start",
  },
  pageWrapperInner: {
    flex: 1,
    width: "100%",
    marginBottom: 30,
  },
  closeButton: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  title: {
    marginBottom: 30,
    marginTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
  },
  titleText: {
    fontSize: 20,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
    fontFamily: GlobalStyles.FONT_NAME,
  },
  content: {
    flex: 1,
  },
  contentText: {
    fontSize: 14,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  contentWeb: {
    flex: 1,
    marginRight: 20,
    marginLeft: 20,
  },
});
