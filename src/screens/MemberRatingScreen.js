import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ScrollView, RefreshControl} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {G, Line, Path, Rect, Svg} from "react-native-svg";
import WAStars from "../components/WAStars";
import {connect} from 'react-redux';
import DotIndicator from "react-native-indicators/src/components/dot-indicator";
import {loadRatingTab} from "../redux/tabRating/actions";
import numeral from 'numeral';

class MemberRatingScreen extends Component {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            refreshing: false,
        }
    };

    _onRefresh = () => {
        this.props.loadRatingTab(true)
    };

    render() {
        return (
            this.props.tabRating.fetching?
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                </View>
                :
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.tabRating.fetching}
                        onRefresh={this._onRefresh}
                    />
                }
                style={Styles.container}>
                <View style={Styles.header}>
                    <Text style={Styles.headerText1}>XẾP HẠNG SAO</Text>
                    <Text style={Styles.headerRating}>{numeral(this.props.tabRating.data.rating).format('0,000.0')}</Text>
                    <WAStars rating={this.props.tabRating.data.rating} set={'2'}/>
                    <Text style={Styles.headerText2}>Dịch vụ {numeral(this.props.tabRating.data.rating).format('0,000.0')} sao với {this.props.tabRating.data.ratingCount} đánh giá</Text>
                    <View style={Styles.headerBottom}>
                        <TouchableOpacity style={Styles.headerBlock}
                            onPress={()=>{
                                this.props.route.navigation.navigate('rating_detail')
                            }}
                            >
                            <View style={Styles.headerBlockTitle}>
                                <Text style={Styles.headerTitleText}>{numeral(this.props.tabRating.data.rating).format('0,000.0')}</Text>
                                <Icon style={Styles.headerTitleIcon} name={'keyboard-arrow-right'} />
                            </View>
                            <Text style={Styles.headerBlockContent}>
                                Đánh giá & xếp hạng
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.route.navigation.navigate('rating_desc', {
                                    amount: this.props.tabRating.data.accept,
                                    title: 'Tỉ lệ chấp nhận đặt chỗ',
                                    url: 'rating-screen/accept'
                                })
                            }}
                            style={[Styles.headerBlock, Styles.headerBlockMid]}>
                            <View style={Styles.headerBlockTitle}>
                                <Text style={Styles.headerTitleText}>{this.props.tabRating.data.accept}%</Text>
                                <Icon style={Styles.headerTitleIcon} name={'keyboard-arrow-right'} />
                            </View>
                            <Text style={Styles.headerBlockContent}>
                                Chấp nhận đặt chỗ
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.route.navigation.navigate('rating_desc', {
                                    amount: this.props.tabRating.data.cancel,
                                    title: 'Tỉ lệ huỷ đặt chỗ',
                                    url: 'rating-screen/cancel'
                                })
                            }}
                            style={Styles.headerBlock}>
                            <View style={Styles.headerBlockTitle}>
                                <Text style={Styles.headerTitleText}>{this.props.tabRating.data.cancel}%</Text>
                                <Icon style={Styles.headerTitleIcon} name={'keyboard-arrow-right'} />
                            </View>
                            <Text style={Styles.headerBlockContent}>
                                Hủy đặt chỗ
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={Styles.link}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.route.navigation.navigate('badges')
                        }}
                        style={Styles.linkWrapper}>
                        <Svg
                        height={27}
                        width={30}
                        style={Styles.linkIcon1}
                        >
                            <Path d="M20.65,0c-4.53,0-6.88,4.52-6.88,4.52S11.43,0,6.89,0C4.14,0-1.64,2.6.44,9.64,2.39,16.2,11.21,23,13.77,24c2.56-1,11.38-7.8,13.33-14.36C29.19,2.6,23.41,0,20.65,0Z" fill="#d0d2d3"/>

                        </Svg>
                        <View style={Styles.linkContent}>
                            <View style={Styles.linkTitle}>
                                <Text style={Styles.linkTitleText}>Lời khen của khách hàng</Text>
                            </View>
                            <Text style={Styles.linkDesc}>Tổng số lời khen</Text>
                            <Text style={Styles.linkDescNum}>{this.props.tabRating.data.badge}</Text>
                        </View>
                       <Icon  style={Styles.linkIcon2} name={'keyboard-arrow-right'} />
                    </TouchableOpacity>
                </View>
                <View style={Styles.link}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.route.navigation.navigate('review_list')
                        }}
                        style={Styles.linkWrapper}>
                        <Svg
                            height={27}
                            width={30}
                            style={Styles.linkIcon1}
                        >
                            <Path d="M26.61,19.85h-15l-6,3.75V19.85H2.3A1.8,1.8,0,0,1,.5,18V2.3A1.8,1.8,0,0,1,2.3.5H26.61a1.8,1.8,0,0,1,1.8,1.8V18A1.8,1.8,0,0,1,26.61,19.85Z" fill="none" stroke="#bbbdbf" />
                            <Line x1="5.57" y1="5.31" x2="23.23" y2="5.31" fill="none" stroke="#bbbdbf"/>
                            <Line x1="5.57" y1="10.17" x2="19.21" y2="10.17" fill="none" stroke="#bbbdbf"/>
                            <Line x1="5.57" y1="15.04" x2="13.93" y2="15.04" fill="none" stroke="#bbbdbf" />

                        </Svg>
                        <View style={Styles.linkContent}>
                            <View style={Styles.linkTitle}>
                                <Text style={Styles.linkTitleText}>Phản hồi của khách hàng</Text>
                            </View>
                            <Text style={Styles.linkDesc}>
                                Xem phản hồi từ khách hàng và tìm hiểu{'\n'}
                                cách cải thiện
                            </Text>

                        </View>
                        <Icon  style={Styles.linkIcon2} name={'keyboard-arrow-right'} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

export default connect(
    state => {
        return {
            tabRating: state.tabRating
        }
    },
    {
        loadRatingTab
    }
)(MemberRatingScreen);

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.SILVER_LIGHT
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: Colors.DARK,
        alignItems: 'center'
    },
    headerText1: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_LIGHT
    },
    headerRating: {
        fontSize: 45,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        marginTop: 5,
        marginBottom: 5
    },
    headerText2: {
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_LIGHT,
        marginTop: 10,
    },
    headerBottom: {
      flexDirection: 'row',
        alignItems: 'flex-start',
        borderTopColor: Colors.SILVER,
        borderTopWidth: 1,
        marginTop: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    headerBlock: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    headerBlockMid: {
      borderLeftColor: Colors.SILVER,
      borderLeftWidth: 1,
        borderRightColor: Colors.SILVER,
        borderRightWidth: 1
    },
    headerBlockTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitleIcon: {
        color: Colors.SILVER,
        fontSize: 20,
    },
    headerTitleText: {
        color: Colors.LIGHT,
        fontSize: 18,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        marginBottom: 5
    },
    headerBlockContent: {
        color: Colors.SILVER,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        textAlign: 'center'
    },
    link: {
        backgroundColor: Colors.LIGHT,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
    },
    linkWrapper: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },
    linkTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    linkIcon1: {
        marginRight: 15
    },
    linkDesc: {
        color: Colors.SILVER,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    linkDescNum: {
        color: Colors.PRIMARY,
        fontSize: 16,
        fontFamily: GlobalStyles.FONT_NAME,
        marginTop: 5,
        fontWeight: 'bold'
    },
    linkContent: {
        flex: 1
    },
    linkIcon2: {
        color: Colors.SILVER,
        fontSize: 30
    },
    linkNumber: {
        color: Colors.LIGHT,
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        backgroundColor: Colors.ERROR,
        lineHeight: 20,
        width: 20,
        textAlign: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        marginLeft: 5
    },
    linkTitleText: {
        color: Colors.TEXT_DARK,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
    }
});
