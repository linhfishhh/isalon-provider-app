import React, {Component} from "react";
import {SectionList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import {FormattedNumber} from "react-native-globalize";


const dumpItems = [
    {
        id: 25563685,
        time: '08:30',
        total: 350,
        count: 2,
    },
    {
        id: 25563687,
        time: '09:30',
        total: 200,
        count: 1,
    },
    {
        id: 25563688,
        time: '10:00',
        total: 500,
        count: 3,
    },
    {
        id: 25563690,
        time: '11:00',
        total: 300,
        count: 2,
    },
    {
        id: 25563691,
        time: '12:00',
        total: 450,
        count: 2,
    },
    {
        id: 25563692,
        time: '13:00',
        total: 750,
        count: 2,
    },
    {
        id: 25563685,
        time: '08:30',
        total: 350,
        count: 2,
    },
    {
        id: 25563687,
        time: '09:30',
        total: 200,
        count: 1,
    },
];
type Props = {};
export default class MemberBookingHistoryScreen extends Component<Props> {
    constructor(props) {
        super(props);
        let records = [];
        for (let i=10;i<=30; i++){
            records.push(
                {
                    title: ''+i+'/07/2018',
                    data: dumpItems,
                    total: 5000
                }
            )
        }
        this.state = {
            records: records
        }
    }
    _header = () => {
        return (
            <View style={Styles.header}>
                <Text style={Styles.headerTitle}>Tổng tiền</Text>
                <Text style={Styles.headerAmount}>350.000K</Text>
            </View>
        )
    };
    _renderSectionHeader = ({section}) => {
        return (
            <View style={Styles.sectionHeader}>
                <Text style={Styles.sectionHeaderTitle}>{section.title}</Text>
                <Text
                    style={Styles.sectionHeaderAmount}
                >
                    <FormattedNumber
                        value={section.total}
                    />
                    K
                </Text>
            </View>
        )
    };
    _renderItem = ({item, section}) => {
        return (
            <View style={Styles.item}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate('booking_detail')
                    }}
                    style={Styles.itemWrapper}>
                    <View style={Styles.itemInfo}>
                        <Text style={Styles.itemID}>#{item.id}</Text>
                        <Text style={Styles.itemMeta}>
                            {item.time}, {section.title}
                        </Text>
                    </View>
                    <View style={Styles.itemPriceService}>
                        <Text style={Styles.itemPrice}>
                          <FormattedNumber
                            value={item.total}
                          />K</Text>
                        <Text style={Styles.itemServices}>{item.count} dịch vụ</Text>
                    </View>
                    <Icon style={Styles.itemIcon} name={'keyboard-arrow-right'} />
                </TouchableOpacity>
            </View>
        )
    };
    _keyExtractor = (item, index) => {
      return index;
    };
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
                headerTitle={'Giao dịch tháng này'}
                headerTitleColor={Colors.LIGHT}
            >
                <View style={Styles.pageWrapperInner}>
                    <SectionList
                        style={Styles.content}
                        sections={this.state.records}
                        ListHeaderComponent={this._header}
                        renderSectionHeader={this._renderSectionHeader}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                    />
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
        alignItems: "flex-start"
    },
    pageWrapperInner: {
        flex: 1,
        width: "100%",
    },
    content: {
        flex: 1,
    },
    header: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT
    },
    headerTitle: {
       fontSize: 18,
        textTransform: 'uppercase',
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        marginBottom: 5
    },
    headerAmount: {
        fontSize: 45,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold'
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.SILVER_LIGHT,
        paddingRight: 60,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    sectionHeaderTitle: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        flex: 1
    },
    sectionHeaderAmount: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT
    },
    itemWrapper: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemInfo: {
        flex: 1
    },
    itemID: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    itemMeta: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
    },
    itemPrice: {
        fontSize: 18,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold'
    },
    itemServices: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    itemIcon: {
        color: Colors.SILVER,
        fontSize: 25,
        width: 40,
        textAlign: 'right'
    }
});
