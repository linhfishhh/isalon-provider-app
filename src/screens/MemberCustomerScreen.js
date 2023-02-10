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
class MemberCustomerScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: this.props.navigation.getParam('data'),
            items: [],
            currentPage: 0,
            isLast: false,
        }
    }

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
            if(this.state.isLast){
                return;
            }
        }
        let page = 1;
        let items = [];
        if(!refresh){
            page = this.state.currentPage + 1;
            items = this.state.items;
        }
        this.setState({
            loading: refresh
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'customer/'+this.state.data.id+'/history?page='+page
                );
                console.log(rq.data);
                this.setState({
                    loading: false,
                    items: items.concat(rq.data.items),
                    currentPage: rq.data.currentPage,
                    isLast: rq.data.isLast
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

    _renderItem = ({item}) => {
        return <Item navigation={this.props.navigation} data={item} />
    };

    _keyExtractor = (item, index) =>{
        return 'item-'+index;
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
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
                        <View style={{flex: 1}}>
                            <View style={Styles.top}>
                                <Image
                                    style={Styles.avatar}
                                    source={{uri: this.state.data.avatar}}
                                />
                                <Text style={Styles.name}>{this.state.data.name}</Text>
                                <Text style={Styles.itemPhone}>{this.state.data.phone}</Text>
                                <View style={Styles.todoRating}>
                                    <Text style={Styles.todoRatingText}>{numeral(this.state.data.rating).format('0,000.0')}</Text>
                                    <Svg
                                        width={11}
                                        height={11}
                                    >
                                        <Path d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z" fill="#fcb415" />
                                    </Svg>
                                </View>
                            </View>
                            <View style={Styles.tabs}>
                                <View style={Styles.tab}>
                                    <Text style={Styles.tabText}>LỊCH SỬ ĐẶT CHỖ</Text>
                                </View>
                            </View>
                            <FlatList
                                style={Styles.list}
                                renderItem={this._renderItem}
                                data={this.state.items}
                                keyExtractor={this._keyExtractor}
                                //stickySectionHeadersEnabled={false}
                                onEndReached={()=>{this._load(false)}}
                                onEndThreshold={0}
                            />
                        </View>

                }
            </PageContainer>
        )
    }
}

class Item extends Component{
    constructor(props){
        super(props);
        this.state = {
            active: false
        }
    }

    render(){
        let item = this.props.data;
        return (
          <View style={Styles.item}>
              <TouchableOpacity
                  hitSlop={Utils.defaultTouchSize}
                  onPress={()=>{this.setState({
                      active: !this.state.active
                  })}}
                  style={Styles.itemTitle}>
                  <Text style={[Styles.itemTitleText, this.state.active && Styles.itemTitleTextActive]}>Đặt chỗ #{item.id} - {item.date}</Text>
                  <Icon style={Styles.itemIcon} name={'keyboard-arrow-'+(this.state.active?'up':'down')} />
              </TouchableOpacity>
              {
                  this.state.active?
                      <View style={Styles.itemInfo}>
                            <Text style={Styles.itemInfoTitle}>Dịch vụ</Text>
                          <View style={Styles.itemInfoRow}>
                             <View style={Styles.itemInfoRowLeft}>
                                 {
                                     item.services.map((service, index) => {
                                         return (
                                             <Text style={Styles.service} key={'service-'+index}>{service.name}</Text>
                                         )
                                     })
                                 }
                             </View>
                              <TouchableOpacity
                                onPress={()=>{
                                    this.props.navigation.navigate('home_order_detail', {
                                        id: item.id
                                    })
                                }}
                              >
                                  <Text style={Styles.detail}>Xem chi tiết</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                      :undefined
              }
          </View>
    );
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberCustomerScreen);

const Styles = StyleSheet.create({
    itemInfoRowLeft: {
        flex: 1,
        marginRight: 10
    },
    detail: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: '#007CFB'

    },
    itemInfoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    service: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.TEXT_DARK,
        marginBottom: 5
    } ,
    itemInfo: {
        marginTop: 15
    },
    itemInfoTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.SILVER_DARK,
        marginBottom: 15
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        paddingBottom: 30,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    itemTitle: {
      flexDirection: 'row',
        alignItems: 'center'
    },
    itemTitleText: {
        flex: 1,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.TEXT_DARK,
    },
    itemTitleTextActive: {
      color: '#007CFB'
    },
    itemIcon: {
        color: Colors.TEXT_DARK,
        fontSize: 20
    },
    itemPhone: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SECONDARY,
        marginBottom: 5
    },
    tabs: {
      flexDirection: 'row',
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    tab: {
      flex: 1,
        alignItems: 'center',
        backgroundColor: '#F1F1F2'
    },
    tabText: {
        lineHeight: 40,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.SILVER_DARK,
    },
    name: {
        marginBottom: 5,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.TEXT_DARK,
    },
    todoRating: {
        flexDirection: 'row',
        alignItems: 'center',
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
      flex: 1,
        backgroundColor: '#F1F1F2'
    },
    top: {
        alignItems: 'center',
        padding: 20,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginBottom: 15
    }
});