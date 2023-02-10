import React, { Component } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import { DotIndicator } from "react-native-indicators";
import Utils from "../configs";
import { connect } from "react-redux";
import { WebView } from "react-native-webview";

type Props = {};
class HomeNewsScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam("id"),
      data: {
        title: "",
        cover: "",
        content: "",
      },
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
            "news/" + this.state.id
          );
          const data = {
            ...rq.data,
            content: `<!DOCTYPE html>
<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body>${rq.data.content}</body></html>`,
          };
          this.setState({
            loading: false,
            data,
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
        contentWrapperStyle={[
          GlobalStyles.pageWrapper,
          { paddingLeft: 0, paddingRight: 0 },
        ]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        layoutPadding={15}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        navigationButtonStyle={{ color: Colors.LIGHT }}
        headerTitle={this.state.data.title}
        headerTitleColor={Colors.LIGHT}
      >
        {this.state.loading ? (
          <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
        ) : (
          <View style={Styles.pageWrapperInner}>
            <View style={Styles.content}>
              {this.state.data.cover ? (
                <ImageBackground
                  source={{ uri: this.state.data.cover }}
                  style={Styles.cover}
                />
              ) : undefined}
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 25,
                  flex: 1,
                }}
              >
                <WebView
                  style={Styles.contentText}
                  originWhitelist={["*"]}
                  startInLoadingState={true}
                  source={{
                    baseUrl: "",
                    html: this.state.data.content,
                  }}
                />
              </View>
            </View>
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
}, {})(HomeNewsScreen);

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
  content: {
    flex: 1,
  },
  cover: {
    height: (9 / 16) * Dimensions.get("screen").width,
  },
  contentText: {
    width: "100%",
  },
});
