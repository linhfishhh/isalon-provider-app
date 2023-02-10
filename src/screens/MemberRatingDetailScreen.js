import React, {Component} from "react";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import {DotIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import Utils from '../configs';
import numeral from 'numeral';

type Props = {
};
class MemberRatingDetailScreen extends Component<Props> {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            rating: 0,
            stars: [],
            desc: ''
        }
    }

    _load = () => {
        this.setState({
            loading: true
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).get('rating-screen/ratings');
                let data = rq.data;
                console.log(data);
                this.setState({
                    loading: false,
                    rating: data.rating,
                    stars: data.stars,
                    desc: data.desc
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
        this._load();
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
                headerTitle={'Chi tiết xếp hạng'}
                headerTitleColor={Colors.LIGHT}

            >
                {
                    this.state.loading?
                        <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
                        :
                        <ScrollView style={{flex: 1}}>
                            <View style={Styles.header}>
                                <Text style={Styles.headerText}>XẾP HẠNG SAO HIỆN TẠI</Text>
                                <View style={Styles.headerRating}>
                                    <Text style={Styles.headerRatingCurrent}>{numeral(this.state.rating).format('0,000.0')}</Text>
                                    <Text style={Styles.headerRatingTotal}>/5</Text>
                                </View>
                                <Text style={Styles.headerDesc}>
                                    {this.state.desc}
                                </Text>
                            </View>
                            <View style={Styles.detail}>
                                <Text style={Styles.detailHeader}>
                                    THỐNG KÊ TOÀN BỘ ĐÁNH GIÁ
                                </Text>
                            </View>
                            <View style={Styles.detailHeaderList}>
                                {
                                    this.state.stars.map((item, index) => {
                                        return (
                                            <View key={index} style={Styles.item}>
                                                <Text style={Styles.itemRating}>{index+1}</Text>
                                                <Image source={require('../assets/images/starz.png')}/>
                                                <View style={Styles.itemPercentWrapper}>
                                                    <View style={
                                                        [
                                                            Styles.itemPercent,
                                                            {
                                                                width: ''+item+'%'
                                                            }
                                                        ]
                                                    }>
                                                    </View>
                                                </View>
                                                <Text style={Styles.itemAmount}>{item}%</Text>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
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
)(MemberRatingDetailScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 30,
        paddingBottom: 30
    },
    headerText: {
        //textAlign: 'center',
        fontSize: 15,
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    },
    headerRating: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 15,
        marginBottom: 15
    },
    headerRatingCurrent: {
        fontSize: 48,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
        marginRight: 5
    },
    headerRatingTotal: {
        fontSize: 24,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER,
        marginBottom: 8
    },
    headerDesc: {
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    detailHeader: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.SILVER_LIGHT,
        color: Colors.SILVER_DARK,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    detailHeaderList: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    itemRating: {
        color: Colors.TEXT_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
        width: 15
    },
    itemPercentWrapper: {
        backgroundColor: Colors.SILVER_LIGHT,
        flex: 1,
        marginLeft: 10,
        marginRight: 10
    },
    itemPercent: {
        height: 10,
        backgroundColor: Colors.SECONDARY
    },
    itemAmount: {
        width: 35,
        textAlign: 'right',
        color: Colors.TEXT_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
});
