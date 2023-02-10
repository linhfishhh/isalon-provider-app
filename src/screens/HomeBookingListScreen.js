import React, {Component, PureComponent} from "react";
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
    Dimensions,
    Modal, ImageBackground, FlatList
} from "react-native";
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
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Path, Svg} from "react-native-svg";

type Props = {};
export default class HomeBookingListScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                {
                    name: 'Trang Thạch',
                    avatar: ImageSources.IMG_AVATAR_2,
                    rating: 4.5,
                    phone: '094 569 5698',
                    date: '20/07/2018',
                    time: '08:30',
                    status: 'Chờ xử lý',
                    icon: 'alarm',
                    iconColor: Colors.PRIMARY,
                    items: [
                        {
                            name: 'Nhuộm tóc highlight',
                            price: 250
                        },
                        {
                            name: 'Duỗi tóc',
                            price: 100
                        },
                    ]
                },
                {
                    name: 'Nguyễn Văn A',
                    avatar: ImageSources.IMG_AVATAR,
                    rating: 2.5,
                    phone: '094 562 5198',
                    date: '20/07/2018',
                    time: '08:30',
                    status: 'Chờ xử lý',
                    icon: 'alarm',
                    iconColor: Colors.PRIMARY,
                    items: [
                        {
                            name: 'Nhuộm tóc highlight',
                            price: 250
                        },
                    ]
                },
                {
                    name: 'Vân Huỳnh',
                    avatar: ImageSources.IMG_AVATAR_2,
                    rating: 3.5,
                    phone: '092 562 5198',
                    date: '20/07/2018',
                    time: '08:30',
                    status: 'Chờ xử lý',
                    icon: 'alarm',
                    iconColor: Colors.PRIMARY,
                    items: [
                        {
                            name: 'Nhuộm tóc highlight',
                            price: 250
                        },
                        {
                            name: 'Duỗi tóc',
                            price: 100
                        },
                    ]
                },
                {
                    name: 'Tú Huỳnh',
                    avatar: ImageSources.IMG_AVATAR,
                    rating: 4.5,
                    phone: '092 522 5198',
                    date: '20/07/2018',
                    time: '08:30',
                    status: 'Chờ xử lý',
                    icon: 'alarm',
                    iconColor: Colors.PRIMARY,
                    items: [
                        {
                            name: 'Duỗi tóc',
                            price: 100
                        },
                    ]
                },
            ]
        }
    };

    _keyExtractor = (item, index) => {
        return '' + index;
    };

    _renderItem = ({item}, index) => {
        return <Item data={item}/>
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={30}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                navigationButtonStyle={{color: Colors.LIGHT}}
                headerTitle={'Danh sách đặt chỗ'}
                headerTitleColor={Colors.LIGHT}
            >
                <FlatList
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    data={this.state.items}
                />
            </PageContainer>
        );
    }
}

class Item extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    };

    render() {
        let item = this.props.data;
        return (
            <View style={Styles.item}>
                <View style={Styles.itemHead}>
                    <TouchableOpacity
                        style={Styles.itemAvatarWrapper}
                    >
                        <Image
                            style={Styles.itemAvatar}
                            source={item.avatar}
                        />
                    </TouchableOpacity>
                    <View
                        style={Styles.cusInfo}
                    >
                        <TouchableOpacity
                            style={Styles.cusName}
                            >
                            <Text style={Styles.cusNameText}>{item.name}</Text>
                        </TouchableOpacity>
                        <View
                        style={Styles.cusMeta}
                        >
                            <View
                                style={Styles.cusRating}
                            >
                                <Text style={Styles.cusRatingNum}>{item.rating}</Text>
                                <Svg
                                    width={11}
                                    height={11}
                                >
                                    <Path d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z" fill="#fcb415" />
                                </Svg>
                            </View>
                            <Text style={Styles.cusPhone}>{item.phone}</Text>
                        </View>
                    </View>
                </View>
                <View style={Styles.itemBody}>
                    <Text style={Styles.subTitle}>Dịch vụ</Text>
                    {
                        item.items.map((sitem, sindex)=>{
                            return (
                                <View key={sindex} style={Styles.itemDetail}>
                                    <Text
                                        numberOfLines={1}
                                        style={Styles.itemDetailName}>
                                        {sitem.name}
                                    </Text>
                                    <Text style={Styles.itemDetailPrice}>{sitem.price}K</Text>
                                </View>
                            )
                        })
                    }
                    <Text style={[Styles.subTitle, {marginTop: 5}]}>Thời gian làm</Text>
                    <View
                    style={Styles.itemBottom}
                    >
                        <Text style={Styles.itemDateTime}>{item.time}, {item.date}</Text>
                        <View style={Styles.itemStatus}>
                            <Icon style={[Styles.itemStatusIcon, {color: item.iconColor}]} name={item.icon} />
                            <Text
                                style={Styles.itemStatusText}
                            >{item.status}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: Colors.SILVER_LIGHT
    },
    item: {
      backgroundColor: Colors.LIGHT,
        marginBottom: 10
    },
    itemHead: {
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 20,
      paddingBottom: 20,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemAvatarWrapper: {
      marginRight: 15
    },
    itemAvatar: {
        height: 42,
        width: 42,
        resizeMode: 'cover',
        borderRadius: 21
    },
    cusInfo: {
        flex: 1
    },
    cusName: {
      marginBottom: 5
    },
    cusNameText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK
    },
    cusMeta: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cusRating: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    cusRatingNum: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        marginRight: 2
    },
    cusPhone: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SECONDARY,
        fontWeight: 'bold'
    },
    subTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.SILVER_DARK,
        marginBottom: 2
    },
    itemBody: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 15,
        paddingBottom: 20
    },
    itemDetailName: {
      flex: 1,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK
    },
    itemDetail: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemDetailPrice: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
        color: Colors.PRIMARY,
        fontWeight: 'bold'
    },
    itemBottom: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemDateTime: {
        flex: 1,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
    },
    itemStatusText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
    },
    itemStatus: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemStatusIcon: {
        fontSize: 20,
        marginRight: 5
    }
});
