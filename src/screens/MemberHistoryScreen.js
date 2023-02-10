import React, {Component, PureComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, StatusBar, Image} from 'react-native';
import HomeSectionPageContainer from "../components/HomeSectionPageContainer";
import ImageSources from "../styles/ImageSources";
import Colors from "../styles/Colors";
import GlobalStyles from "../styles/GlobalStyles";
import PageContainer from "../components/PageContainer";
import WAAlert from "../components/WAAlert";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";


export default class MemberHistoryScreen extends PureComponent {
    static defaultProps = {
        perPage: 10,
    };
    constructor(props) {
        super(props);
        this.state = {
            logoutModal: false,
            accountName: 'Minh Trang',
            accountAvatar: ImageSources.IMG_AVATAR_2,
            items: [
                {
                    time: '08:30',
                    date: '02/04/2018',
                    title: 'Đơn đặt chỗ #5896356',
                    minute: 60,
                    salon: 'Viện tóc Envy',
                    address: '07 Nguyễn Khắc Cần, Q. Hoàn Kiếm, Hà Nội',
                    status: 'Đã thanh toán',
                    statusIcon: 'check-circle',
                    statusIconColor: '#2BB673'
                },
                {
                    time: '14:30',
                    date: '02/05/2018',
                    title: 'Đơn đặt chỗ #5896358',
                    minute: 120,
                    salon: 'Viện tóc Envy',
                    address: '30 Chân Cầm, Q. Hoàn Kiếm, Hà Nội',
                    status: 'Đã thanh toán',
                    statusIcon: 'check-circle',
                    statusIconColor: '#2BB673'
                },
            ]
        }
    }
    _loadItems = () => {
        return this.state.items.map((item, index) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.route.navigation.navigate('home_order_detail')
                    }}
                    key={index} style={Styles.item}>
                    <View style={Styles.itemDateTime}>
                        <View style={Styles.itemTimeWrapper}>
                            <Text style={Styles.itemTime}>
                                {item.time}
                            </Text>
                        </View>
                        <Text style={Styles.itemDate}>
                            {item.date}
                        </Text>
                    </View>
                    <View style={Styles.itemInfo}>
                        <Text style={Styles.itemTitle}>{item.title}</Text>
                        <View style={Styles.itemMinuteSalon}>
                            <Text style={Styles.itemMinute}>
                                {item.minute} phút
                            </Text>
                            <Icon style={Styles.itemDot} name={'circle'}/>
                            <Text style={Styles.itemSalon}>
                                {item.salon}
                            </Text>
                        </View>
                        <Text style={Styles.itemAddress}>{item.address}</Text>
                        <View style={Styles.itemStatus}>
                            <Text style={Styles.itemStatusLabel}>Tình trạng</Text>
                            <Icon name={item.statusIcon} style={[Styles.itemIcon, {color: item.statusIconColor}]} />
                            <Text style={Styles.itemStatusText}>{item.status}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
    };
    render() {
        return (
            <HomeSectionPageContainer style={Styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle={'dark-content'}
                />
                <View style={Styles.accountInfo}>
                    <View style={Styles.accountInfoNameWrapper}>
                        <Text numberOfLines={1}
                              style={Styles.accountInfoName}>{this.state.accountName}</Text>
                        <Text style={Styles.headerTitle}>
                            Hiện bạn có {this.state.items.length} đặt chỗ{"\n"}
                            săp diễn ra
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.route.navigation.navigate('home_account_profile');
                        }}
                        style={Styles.avatarWrapper}>
                        <Image style={Styles.avatar} source={this.state.accountAvatar} />
                    </TouchableOpacity>
                </View>
                <View style={Styles.items}>
                    {this._loadItems()}
                </View>
            </HomeSectionPageContainer>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        paddingLeft: 30,
        paddingRight: 30
    },
    avatarWrapper: {
    },
    avatar: {
        width: 70,
        height: 70,
        resizeMode: 'cover',
        borderRadius: 35,

    },
    accountInfo: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 30,
    },
    accountInfoName: {
        fontSize: 30,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold'
    },
    accountInfoNameWrapper: {
        flex: 1
    },
    accountInfoLink: {

    },
    accountInfoLinkText: {
        color: Colors.SILVER,
        fontFamily: GlobalStyles.FONT_NAME
    },
    headerTitle: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        marginTop: 5
    },
    item: {
        borderRadius: 3,
        borderTopWidth: 1,
        borderTopColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderRightWidth: 1,
        borderRightColor: Colors.SILVER_LIGHT,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: Colors.PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: Colors.DARK,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 5,
        backgroundColor: Colors.LIGHT,
        shadowOpacity: 0.1
    },
    itemDateTime: {
      paddingRight: 15,
    },
    itemTime: {
        color: Colors.PRIMARY,
        fontSize: 24,
        fontFamily: GlobalStyles.FONT_NAME,

    },
    itemTimeWrapper: {
        borderBottomColor: Colors.PRIMARY,
        borderBottomWidth: 1,
        marginBottom: 5
    },
    itemDate: {
        fontSize: 12,
        borderBottomColor: Colors.DARK,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    itemInfo: {
        borderLeftColor: Colors.SILVER_LIGHT,
        borderLeftWidth: 1,
        paddingLeft: 15,
        flex: 1
    },
    itemTitle: {
        color: Colors.TEXT_DARK,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    itemMinuteSalon: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    itemDot: {
        color: Colors.SILVER,
        fontSize: 4,
        marginLeft: 3,
        marginRight: 3
    },
    itemMinute: {
        color: Colors.SILVER,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    itemSalon: {
        color: Colors.TEXT_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    itemAddress: {
        color: Colors.SILVER,
        fontSize: 8,
        fontFamily: GlobalStyles.FONT_NAME,
        marginBottom: 5
    },
    itemStatus: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    itemStatusLabel: {
        color: Colors.SILVER,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        marginRight: 10
    },
    itemIcon: {
        fontSize: 13,
        marginRight: 3
    },
    itemStatusText: {
        color: Colors.TEXT_LINK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    }
});
