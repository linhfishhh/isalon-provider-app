import React, {Component} from "react";
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
import WAAlert from "../components/WAAlert";
import CalendarStrip from "react-native-calendar-strip";
import {Path, Svg} from "react-native-svg";
import WASelect from "../components/WASelect";
import WAReviewAlt from "../components/WAReviewAlt";
import {connect} from 'react-redux';
import Utils from '../configs';
import {DotIndicator, BallIndicator} from 'react-native-indicators';
import WALightBox from "../components/WALightBox";

const dumpItems = [
    // {
    //     title: 'Chất lượng tuyệt vời',
    //     name: 'Nguyễn văn A',
    //     rating: 4.0,
    //     date: '11:30 - 20/07/2018',
    //     content: 'Màu da đen do tiếp xúc với ánh nắng mặt trời thường làm cho tôi không tự tin mỗi ra với bạn bè .. bạn dẻo dai trắng da trắng mịn màng của tôi,'
    // },
];

type Props = {
};
class MemberReviewListScreen extends Component<Props> {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            filter: 'all',
            data: {
                items: [],
                isLast: false,
                next: 1,
            },
            showLightBox: false,
            lightBoxItems: []
        }
    }

    _showLightBox = (items) => {
        this.setState({
            showLightBox: true,
            lightBoxItems: items
        });
    };

    _renderItem = ({item}) => {
        return (
            <WAReviewAlt showLightBox={this._showLightBox}  style={Styles.item} data={item} />
        )
    };
    _keyExtractor = ({item}, index) => {
        return 'review-'+index;
    };

    _loadItems = (refresh=false) =>{
        console.log(refresh);
        let items = refresh?[]:this.state.data.items;
        if(!refresh && this.state.data.isLast){
            return;
        }
        if(this.state.refreshing || this.state.loading){
            return;
        }
        let page = refresh?1:this.state.data.next;
        let filter = this.state.filter;
        this.setState({
            loading: !refresh,
            refreshing: refresh,
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'rating-screen/reviews?page='+page+'&filter='+filter,
                );
                let data = rq.data;
                //console.log(data);
                this.setState({
                    loading: false,
                    refreshing: false,
                    data: {
                        ...data,
                        items: items.concat(data.items)
                    }
                });
            }
            catch (e) {
                this.setState({
                    loading: false,
                    refreshing: false
                });
                console.log(e.response);
            }
        });
    };

    componentDidMount(){
        this._loadItems(true);
    }

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                navigationButtonStyle={{color: Colors.LIGHT}}
                headerTitle={'Phản hồi của khách'}
                headerTitleColor={Colors.LIGHT}

            >
                <WALightBox navigation={this.props.navigation} onClose={()=>{this.setState({showLightBox: false})}} show={this.state.showLightBox}
                            items={this.state.lightBoxItems}    />
                {
                    this.state.refreshing?
                        <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                        :
                        <FlatList
                            ListHeaderComponent={
                                <View style={Styles.header}>
                                    <Text style={Styles.filterText}>Hiền thị theo</Text>
                                    <WASelect
                                        wrapperStyle={Styles.select}
                                        selectStyle={Styles.selectInput}
                                        iconStyle={Styles.selectIcon}
                                        value={this.state.filter}
                                        onChanged={({label, value})=>{
                                            this.setState({
                                                filter: value
                                            }, ()=>{
                                                this._loadItems(true);
                                            })
                                        }}
                                        items={[
                                            {
                                                label: 'Mọi lúc',
                                                value: 'all'
                                            },
                                            {
                                                label: 'Hôm này',
                                                value: 'today'
                                            },
                                            {
                                                label: 'tuần này',
                                                value: 'week'
                                            },
                                            {
                                                label: 'Tháng này',
                                                value: 'month'
                                            },
                                            {
                                                label: 'Năm này',
                                                value: 'year'
                                            },
                                        ]}
                                    />
                                </View>
                            }
                            style={Styles.list}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                            data={this.state.data.items}
                            ListEmptyComponent={
                                <View style={Styles.empty}>
                                    <Text style={Styles.emptyTextBig}>Không có phản hồi nào!</Text>
                                    <Text style={Styles.emptyText}>
                                        Nếu có phản hồi của khách hàng,{'\n'}
                                        nội dung sẽ hiển thị ở đây.
                                    </Text>
                                </View>
                            }
                            ListFooterComponent={
                                <View style={Styles.reviewsBottom}>
                                    {
                                        !this.state.data.isLast?
                                            !this.state.loading?
                                                <TouchableOpacity
                                                    onPress={()=>{this._loadItems(false)}}
                                                    style={Styles.loadMoreReviews}>
                                                    <Text style={Styles.loadMoreReviewsText}>Xem nhiều hơn</Text>
                                                </TouchableOpacity>
                                                :<BallIndicator size={50} color={Colors.PRIMARY}/>
                                            :undefined
                                    }
                                </View>
                            }
                        />
                }
            </PageContainer>
        );
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberReviewListScreen)

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        paddingBottom: 20
    },
    select: {
      flex: 1,
        marginLeft: 15,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
    },
    selectInput: {
        height: 35
    },
    selectIcon: {
        height: 35,
        lineHeight: 35,
    },
    filterText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK
    },
    list: {
        flex: 1,
        backgroundColor: Colors.LIGHT,
        paddingLeft: 0,
        paddingRight: 0,
    },
    item: {
        marginLeft: 30,
        marginRight: 30
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        marginLeft: 30,
        marginRight: 30,
        padding: 20,
        borderRadius: 5,
    },
    emptyText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SILVER_DARK,
        marginBottom: 15,
        textAlign: 'center'
    },
    emptyTextBig: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold',
        marginBottom: 15
    },
    loadMoreReviews: {
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: Colors.SILVER_LIGHT,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadMoreReviewsText: {
        color: Colors.TEXT_LINK,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME,
        textAlign: 'center'
    },
    reviewsBottom: {
        marginTop: 10,
        marginBottom: 60
    },
});
