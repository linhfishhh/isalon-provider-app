import React, { Component } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import Utils from "../configs";
import { connect } from "react-redux";
import { DotIndicator } from "react-native-indicators";

type Props = {};
class MemberAccountFAQScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      sections: [],
    };
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={[Styles.itemWrapper]}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("home_account_faq_detail", {
              title: item.title,
              content: `<!DOCTYPE html>
<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body>${item.content}</body></html>`,
            });
          }}
          style={[Styles.item, index === 0 && Styles.itemFirst]}
        >
          <Text numberOfLines={1} style={Styles.itemText}>
            {item.title}
          </Text>
          <Icon style={Styles.itemIcon} name={"keyboard-arrow-right"} />
        </TouchableOpacity>
      </View>
    );
  };
  _keyExtractor = (item, index) => {
    return index;
  };
  _renderSectionHeader = ({ section }) => {
    return (
      <View style={Styles.sectionHeader}>
        <Text style={Styles.sectionHeaderText}>{section.title}</Text>
      </View>
    );
  };

  componentDidMount() {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          let rq = await Utils.getAxios(this.props.account.token).get(
            "faqs-screen"
          );
          let sections = rq.data;
          //console.log(sections);
          this.setState({
            loading: false,
            sections: sections,
          });
        } catch (e) {
          this.setState({
            loading: false,
          });
          console.log(e);
        }
      }
    );
  }

  render() {
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.XAM}
        navigationButtonStyle={Styles.closeButton}
        headerTitle={"Trợ giúp"}
        headerTitleColor={Colors.LIGHT}
        headerContainerStyle={Styles.headerContainer}
        layoutPadding={30}
      >
        {this.state.loading ? (
          <View style={{ flex: 1, backgroundColor: Colors.LIGHT }}>
            <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
          </View>
        ) : (
          <SectionList
            style={Styles.list}
            renderItem={this._renderItem}
            sections={this.state.sections}
            keyExtractor={this._keyExtractor}
            renderSectionHeader={this._renderSectionHeader}
            stickySectionHeadersEnabled={false}
          />
        )}
      </PageContainer>
    );
  }
}

export default connect((state) => {
  return {
    account: state.account,
  };
})(MemberAccountFAQScreen);

const Styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
  },
  closeButton: {
    color: Colors.LIGHT,
  },
  headerContainer: {
    backgroundColor: Colors.DARK,
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 30,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    color: "#000",
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    textTransform: "uppercase",
  },
  itemWrapper: {
    backgroundColor: Colors.LIGHT,
    paddingLeft: 30,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 20,
    borderTopColor: Colors.SILVER_LIGHT,
    borderTopWidth: 1,
    paddingRight: 20,
  },
  itemText: {
    flex: 1,
    color: Colors.TEXT_DARK,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
  },
  itemIcon: {
    color: Colors.SILVER,
    fontSize: 25,
  },
  itemFirst: {
    borderTopWidth: 0,
  },
});
