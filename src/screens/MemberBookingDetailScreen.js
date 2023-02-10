import React, {Component} from "react";
import {ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import {FormattedNumber} from "react-native-globalize";


type Props = {};
export default class MemberBookingDetailScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            services: [
                {
                    name: 'Combo 6 bước cắt tóc',
                    price: 150,
                },
                {
                    name: 'Nhuộm tóc highlight',
                    price: 80,
                },
            ]
        }
    }
    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                navigationButtonStyle={{color: Colors.LIGHT}}
                headerTitle={'Chi tiết giao dịch'}
                headerTitleColor={Colors.LIGHT}
            >
                <ScrollView style={Styles.pageWrapperInner}>
                    <View style={Styles.block}>
                        <Text style={Styles.blockTitle}>
                            Dịch vụ
                        </Text>
                        {
                            this.state.services.map((item, index) => {
                                return (
                                    <View key={'service-'+index} style={Styles.service}>
                                        <Text style={Styles.serviceName}>{item.name}</Text>
                                        <Text style={Styles.servicePrice}>{item.price}K</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={Styles.block}>
                        <Text style={Styles.blockTitle}>
                            Hình thức thanh toán
                        </Text>
                        <Text style={Styles.commonText}>
                            Thanh toán qua nganluong.vn
                        </Text>
                    </View>
                    <View style={Styles.block}>
                        <Text style={Styles.blockTitle}>
                            Trang thái
                        </Text>
                        <View style={Styles.row}>
                            <Text style={Styles.commonText}>
                                Hoàn thành
                            </Text>
                            <Icon style={Styles.iconDone} name={'check-circle'} />
                        </View>
                    </View>
                    <View style={Styles.block}>
                        <View style={Styles.row}>
                            <View style={Styles.subBlockLeft}>
                                <Text style={Styles.subBlockTitle}>Thời gian làm</Text>
                                <Text style={Styles.subBlockText}>08:30</Text>
                            </View>
                            <View style={Styles.subBlockRight}>
                                <Text style={Styles.subBlockTitle}>Ngày</Text>
                                <Text style={Styles.subBlockText}>20/07/2018</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.block, Styles.viewDetail]}>
                            <TouchableOpacity
                             style={Styles.viewDetailButton}
                            >
                                <Text style={Styles.viewDetailText}>Chi tiết đặt chỗ</Text>
                                <Icon style={Styles.viewDetailIcon} name={'keyboard-arrow-right'} />
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
        alignItems: "flex-start"
    },
    pageWrapperInner: {
        flex: 1,
        width: "100%",
        backgroundColor: Colors.SILVER_LIGHT
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
        backgroundColor: Colors.LIGHT
    },
    blockTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        marginBottom: 5
    },
    service: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    serviceName: {
        flex: 1,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.TEXT_DARK
    },
    servicePrice: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold'
    },
    commonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.TEXT_DARK
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconDone: {
        fontSize: 20,
        marginLeft: 5,
        color: '#29B473'
    },
    subBlockLeft: {
        flex: 1,
        borderRightColor: Colors.SILVER_LIGHT,
        borderRightWidth: 1
    },
    subBlockRight: {
        flex: 1,
        alignItems: 'flex-end'
    },
    subBlockTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SILVER_DARK,
        marginBottom: 5
    },
    subBlockText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK
    },
    viewDetail: {
        marginTop: 10,
        paddingTop: 0,
        paddingBottom: 0
    },
    viewDetailButton: {
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewDetailText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        flex: 1
    },
    viewDetailIcon: {
        color: Colors.SILVER,
        fontSize: 25
    }
});
