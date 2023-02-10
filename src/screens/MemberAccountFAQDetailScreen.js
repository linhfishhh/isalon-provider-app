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
  Dimensions,
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

type Props = {};
export default class MemberAccountFAQDetailScreen extends Component<Props> {
  constructor(props) {
    super(props);
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
        layoutPadding={15}
        headerTitle={"Trợ giúp"}
        headerTitleColor={Colors.LIGHT}
      >
        <View style={Styles.pageWrapperInner}>
          <View style={Styles.content}>
            <View style={Styles.title}>
              <Text style={Styles.titleText}>
                {this.props.navigation.state.params.title}
              </Text>
            </View>
            <WebView
              style={Styles.contentText}
              originWhitelist={["*"]}
              startInLoadingState={true}
              source={{
                baseUrl: "",
                html: this.props.navigation.state.params.content,
              }}
            />
          </View>
        </View>
      </PageContainer>
    );
  }
}

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
  },
  closeButton: {
    color: Colors.LIGHT,
    fontFamily: GlobalStyles.FONT_NAME,
  },
  title: {
    marginBottom: 30,
    marginTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
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
    marginLeft: 15,
    marginRight: 15,
    width: Dimensions.get("window").width - 30,
    height: "100%",
  },
});
