import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView, RefreshControl, Modal, SectionList
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

type Props = {};
export default class MemberProfileScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            sections: [
                {
                    title: 'THÔNG TIN CƠ BẢN',
                    data: [
                        {
                            title: 'Thông tin salon',
                            action: () => {
                                this.props.navigation.navigate('edit_basic_info')
                            }
                        },
                        {
                            title: "Giờ làm việc",
                            action: () => {
                                this.props.navigation.navigate('salon_time')
                            }
                        },
                        {
                            title: "Bản đồ vị trí",
                            action: () => {
                                this.props.navigation.navigate('salon_map')
                            }
                        }
                    ]
                },
                {
                    title: 'CHI TIẾT & DỊCH VỤ',
                    data: [
                        {
                            title: 'Dịch vụ',
                            action: () => {
                                this.props.navigation.navigate('list_cats')
                            }
                        },
                        {
                            title: "Khuyến mãi giảm giá",
                            action: () => {
                                this.props.navigation.navigate('edit_sale')
                            }
                        },
                        {
                            title: "Đội ngũ stylist",
                            action: () => {
                                this.props.navigation.navigate('edit_stylist')
                            }
                        },
                        {
                            title: "Thương hiệu sử dụng",
                            action: () => {
                                this.props.navigation.navigate('edit_brand')
                            }
                        },
                        {
                            title: "Tác phẩm nổi bật",
                            action: () => {
                                this.props.navigation.navigate('edit_showcase')
                            }
                        },
                    ]
                }
            ],
        }
    }
    _renderItem = ({item, index}) => {
        return (
            <View style={[Styles.itemWrapper]}>
                <TouchableOpacity
                    onPress={item.action}
                    style={[Styles.item, index===0 && Styles.itemFirst]}>
                    <Text numberOfLines={1} style={Styles.itemText}>{item.title}</Text>
                    <Icon style={Styles.itemIcon} name={'keyboard-arrow-right'} />
                </TouchableOpacity>
            </View>
        )
    };
    _keyExtractor = (item, index) => {
        return index;
    };
    _renderSectionHeader = ({section}) => {
        return (
            <View style={Styles.sectionHeader}>
                <Text style={Styles.sectionHeaderText}>{section.title}</Text>
            </View>
        )
    };
    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.XAM}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'CẬP NHẬT SALON'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={30}
            >
                <SectionList
                    style={Styles.list}
                    renderItem={this._renderItem}
                    sections={this.state.sections}
                    keyExtractor={this._keyExtractor}
                    renderSectionHeader={this._renderSectionHeader}
                    stickySectionHeadersEnabled={false}
                />
            </PageContainer>
        )
    }
}

const Styles = StyleSheet.create({
    pageWrapper:{
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
    },
    closeButton: {
        color: Colors.LIGHT
    },
    headerContainer: {
        backgroundColor: Colors.DARK
    },
    list: {
        flex: 1
    },
    sectionHeader: {
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 30,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    sectionHeaderText: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        textTransform: 'uppercase',

    },
    itemWrapper: {
        backgroundColor: Colors.LIGHT,
        paddingLeft: 30,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 25
    },
    itemFirst: {
        borderTopWidth: 0
    }
});