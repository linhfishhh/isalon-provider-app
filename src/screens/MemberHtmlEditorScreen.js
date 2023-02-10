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
  SectionList,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { WebView } from "react-native-webview";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { DotIndicator } from "react-native-indicators";
import { connect } from "react-redux";
import Utils from "../configs";
import WALocation from "../components/WALocation";
import {
  clearLocationData,
  loadLv1 as loadLocationLv1,
  setLv1,
  setLv2,
  setLv3,
} from "../redux/location/actions";
import WAAlert from "../components/WAAlert";

type Props = {};
class MemberHtmlEditorScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alert: false,
      alertMessage: "",
      title: this.props.navigation.getParam("title"),
      html: this.props.navigation.getParam("html"),
      editHtml: this.props.navigation.getParam("html"),
      save: this.props.navigation.getParam("save"),
    };
  }

  componentDidMount() {}
  _save = () => {
    this.state.save(this.state.editHtml);
    this.props.navigation.goBack();
  };

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.XAM}
        navigationButtonStyle={Styles.closeButton}
        headerTitle={this.state.title}
        headerTitleColor={Colors.LIGHT}
        headerContainerStyle={Styles.headerContainer}
        layoutPadding={30}
        rightComponent={
          !this.state.loading ? (
            <TouchableOpacity
              hitSlop={Utils.defaultTouchSize}
              onPress={this._save}
            >
              <Text style={Styles.saveButton}>Lưu</Text>
            </TouchableOpacity>
          ) : undefined
        }
      >
        {this.state.loading ? (
          <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
        ) : (
          <WebView
            onMessage={(event) => {
              const x = event.nativeEvent.data;
              this.setState({
                editHtml: x,
              });
            }}
            style={Styles.html}
            originWhitelist={["*"]}
            startInLoadingState={true}
            bounces={false}
            source={{
              baseUrl: "",
              html:
                `
                                            <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>bootstrap4</title>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote-lite.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote-lite.js"></script>
  </head>
  <body>
    <div id="summernote">` +
                this.state.html +
                `</div>
    <script>
      $('#summernote').summernote({

        toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                 ['para', ['ul', 'ol', 'paragraph']],
                   ['fontsize', ['fontsize']],
        ],
          callbacks: {
    onInit: function(e) {
      $("#summernote").summernote("fullscreen.toggle");
    },
     onChange: function(contents, $editable) {
           window.postMessage(contents);
    }
  }
      });
    </script>
  </body>
</html>

                                            `,
            }}
          />
        )}
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
})(MemberHtmlEditorScreen);

const Styles = StyleSheet.create({
  html: {
    flex: 1,
  },
  saveButton: {
    color: Colors.PRIMARY,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  field: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.SILVER_LIGHT,
    paddingLeft: 10,
    paddingRight: 10,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    borderRadius: 5,
  },
  fieldSet: {
    marginBottom: 15,
  },
  fieldLabel: {
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    marginBottom: 10,
  },
  pageWrapper: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    backgroundColor: Colors.LIGHT,
  },
  closeButton: {
    color: Colors.LIGHT,
  },
  headerContainer: {
    backgroundColor: Colors.DARK,
  },
  selectPickerWrapper: {
    marginBottom: 15,
  },
});
