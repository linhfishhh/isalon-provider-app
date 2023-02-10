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
  updateJoinTOS,
  updateStartupRoute,
} from "../redux/account/actions";
import { DotIndicator } from "react-native-indicators";
import Utils from "../configs";
import ImageSources from "../styles/ImageSources";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {};
class MemberAccountTOSScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      content: "",
    };
  }

  _loadContent = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).get(
            "get-tos"
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
          console.log(e + "");
        }
      }
    );
  };

  componentDidMount() {
    this._loadContent();
  }

  render() {
    return (
      <PageContainer
        darkTheme={false}
        navigationButtonStyle={{ color: Colors.LIGHT }}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        contentWrapperStyle={[
          GlobalStyles.pageWrapper,
          NewUserFormStyles.pageWrapper,
          { justifyContent: "flex-start", paddingLeft: 0, paddingRight: 0 },
        ]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        headerTitleColor={Colors.LIGHT}
        headerTitle={"ĐIỀU KHOẢN DỊCH VỤ"}
        layoutPadding={20}
      >
        {this.state.loading ? (
          <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
        ) : (
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              flex: 1,
              paddingTop: 30,
            }}
          >
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
      </PageContainer>
    );
  }
}

export default connect((state) => {
  return {
    account: state.account,
  };
}, {})(MemberAccountTOSScreen);

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
  contentWeb: {
    flex: 1,
  },
});
