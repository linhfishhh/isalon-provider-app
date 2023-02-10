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
    ScrollView, RefreshControl, Modal, SectionList, FlatList
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {DotIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import Utils from '../configs';
import WAEmptyPage from "../components/WAEmptyPage";
import numeral from "numeral";
import Svg from "react-native-svg/elements/Svg";
import Path from "react-native-svg/elements/Path";

type Props = {};
class MemberCustomerListScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            sections: [
                {
                    title: 'KHÁCH HÀNG THƯỜNG XUYÊN',
                    currentPage: 0,
                    isLast: false,
                    total: 0,
                    data: [
                    ]
                },
                {
                    title: 'KHÁCH HÀNG BÌNH THƯỜNG',
                    currentPage: 0,
                    isLast: false,
                    total: 0,
                    data: [
                    ]
                }
            ],
            loading: false,
            refresh: false
        }
    }
    _renderItem = ({item, index}) => {
        return (
            <View style={[Styles.itemWrapper]}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate('customer', {
                            data: item
                        })
                    }}
                    style={[Styles.item, index===0 && Styles.itemFirst]}>
                    <Image
                    source={{uri: item.avatar}}
                    style={Styles.itemImage}
                    />
                    <View style={Styles.itemInfo}>
                        <Text numberOfLines={1} style={Styles.itemText}>{item.name}</Text>
                        <Text style={Styles.itemPhone}>{item.phone}</Text>
                        <View style={Styles.todoRating}>
                            <Text style={Styles.todoRatingText}>{numeral(item.rating).format('0,000.0')}</Text>
                            <Svg
                                width={11}
                                height={11}
                            >
                                <Path d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z" fill="#fcb415" />
                            </Svg>
                        </View>
                    </View>
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
            section.data.length>0?
                <View style={Styles.sectionHeader}>
                    <Text style={Styles.sectionHeaderText}>{section.title}</Text>
                </View>
                :undefined
        )
    };

    _renderEmpty = () => {
        return (
            <View style={{padding: 30, backgroundColor: Colors.LIGHT, flex: 1}}>
                <WAEmptyPage title={'Chưa có khách hàng'} subTitle={'Chưa có thông tin khách hàng nào, một khi khách hàng đã sử dụng dịch vụ của salon, bạn có thể tìm lại thông tin họ ở đây'} />
            </View>
        );
    };

    _load = (refresh = true) => {
        if(this.state.loading){
            return
        }
        if(!refresh){
            if(this.state.sections[1].isLast){
                return;
            }
        }
        this.setState({
            loading: refresh
        }, async()=>{
            try {
                let sections = refresh?[]:this.state.sections;
                let page = 1;
                if(!refresh){
                    page = this.state.sections[1].currentPage + 1;
                }
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'customer/list?page='+page
                );
                console.log(rq.data);
                let new_sections = rq.data;
                this.setState({
                    loading: false,
                    sections: [
                        new_sections[0],
                        {
                            ...new_sections[1],
                            data: this.state.sections[1].data.concat(new_sections[1].data)
                        }
                    ]
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
                console.log(e.response);
            }
        });
    };

    componentDidMount(){
        this._load(true);
    }

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.XAM}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'KHÁCH HÀNG'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={20}
            >
                {
                    this.state.loading?
                        <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                            <DotIndicator color={Colors.PRIMARY} size={10} count={3}/>
                        </View>
                        :
                        this.state.sections[0].data.length===0 && this.state.sections[1].data.length === 0?
                            this._renderEmpty()
                            :
                            <SectionList
                                style={Styles.list}
                                renderItem={this._renderItem}
                                sections={this.state.sections}
                                keyExtractor={this._keyExtractor}
                                renderSectionHeader={this._renderSectionHeader}
                                //stickySectionHeadersEnabled={false}
                                stickySectionHeadersEnabled={true}
                                onEndReached={()=>{this._load(false)}}
                                onEndThreshold={0}
                            />
                }
            </PageContainer>
        )
    }
}
export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberCustomerListScreen);

const Styles = StyleSheet.create({
    itemPhone: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SECONDARY,
        marginBottom: 5
    },
    todoRating: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    todoRatingText: {
        marginRight: 2,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.TEXT_DARK,
    },
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
        borderBottomWidth: 1,
        backgroundColor: Colors.XAM
    },
    sectionHeaderText: {
        color: '#000',
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
    itemInfo: {
        flex: 1,
    },
    itemText: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        marginBottom: 5
    },
    itemCount: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
    },
    itemIcon: {
        color: Colors.SILVER,
        fontSize: 25
    },
    itemFirst: {
        borderTopWidth: 0
    },
    itemImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: 15
    }
});