import React, { Component } from "react";
import {
  ScrollView,
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
import numeral from "numeral";
import Utils from "../configs";

type Props = {};
export default class MemberBookingHistoryDetailScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.getParam("data"),
    };
  }
  render() {
    let status = Utils.getBookingStatus(this.state.data.status);
    return (
      <PageContainer
        darkTheme={false}
        contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
        navigation={this.props.navigation}
        backgroundColor={Colors.LIGHT}
        layoutPadding={20}
        headerContainerStyle={{ backgroundColor: Colors.DARK }}
        navigationButtonStyle={{ color: Colors.LIGHT }}
        headerTitle={"Chi tiết giao dịch"}
        headerTitleColor={Colors.LIGHT}
      >
        <ScrollView style={Styles.pageWrapperInner}>
          <View style={Styles.block}>
            <Text style={Styles.blockTitle}>Dịch vụ</Text>
            {this.state.data.services.map((item, index) => {
              return (
                <View key={"service-" + index} style={Styles.service}>
                  <Text style={Styles.serviceName}>
                    {item.name}
                    {item.qty > 1 ? "x" + item.qty : ""}
                  </Text>
                  <Text style={Styles.servicePrice}>
                    {numeral(item.sum).format("0,000")}₫
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={Styles.block}>
            <Text style={Styles.blockTitle}>Hình thức thanh toán</Text>
            <Text style={Styles.commonText}>{this.state.data.payment}</Text>
          </View>
          <View style={Styles.block}>
            <Text style={Styles.blockTitle}>Trang thái</Text>
            <View style={Styles.row}>
              <Text style={Styles.commonText}>{status.text}</Text>
              <Icon
                style={[Styles.iconDone, { color: status.color }]}
                name={status.name}
              />
            </View>
          </View>
          <View style={Styles.block}>
            <View style={Styles.row}>
              <View style={Styles.subBlockLeft}>
                <Text style={Styles.subBlockTitle}>Thời gian làm</Text>
                <Text style={Styles.subBlockText}>{this.state.data.time}</Text>
              </View>
              <View style={Styles.subBlockRight}>
                <Text style={Styles.subBlockTitle}>Ngày</Text>
                <Text style={Styles.subBlockText}>{this.state.data.date}</Text>
              </View>
            </View>
          </View>
          <View style={[Styles.block, Styles.viewDetail]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("home_order_detail", {
                  id: this.state.data.id,
                });
              }}
              style={Styles.viewDetailButton}
            >
              <Text style={Styles.viewDetailText}>Chi tiết đặt chỗ</Text>
              <Icon
                style={Styles.viewDetailIcon}
                name={"keyboard-arrow-right"}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: Colors.SILVER_LIGHT,
  },
  content: {
    flex: 1,
  },
  block: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: Colors.SILVER_LIGHT,
    borderBottomWidth: 1,
    backgroundColor: Colors.LIGHT,
  },
  blockTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
    marginBottom: 5,
  },
  service: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceName: {
    flex: 1,
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_DARK,
  },
  servicePrice: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 18,
    color: Colors.TEXT_DARK,
    fontWeight: "bold",
  },
  commonText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 13,
    color: Colors.TEXT_DARK,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconDone: {
    fontSize: 20,
    marginLeft: 5,
    color: "#29B473",
  },
  subBlockLeft: {
    flex: 1,
    borderRightColor: Colors.SILVER_LIGHT,
    borderRightWidth: 1,
  },
  subBlockRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  subBlockTitle: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.SILVER_DARK,
    marginBottom: 5,
  },
  subBlockText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
  },
  viewDetail: {
    marginTop: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  viewDetailButton: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailText: {
    fontFamily: GlobalStyles.FONT_NAME,
    fontSize: 15,
    color: Colors.TEXT_DARK,
    flex: 1,
  },
  viewDetailIcon: {
    color: Colors.SILVER,
    fontSize: 25,
  },
});
