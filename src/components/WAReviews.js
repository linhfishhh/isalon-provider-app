import React, {Component, PureComponent} from 'react';
import Colors from "../styles/Colors";
import ImageSources from "../styles/ImageSources";
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    Platform, ImageBackground,
    Dimensions
} from 'react-native';
import {BallIndicator} from "react-native-indicators";
import GlobalStyles from "../styles/GlobalStyles";
import WAStars from "./WAStars";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';

class Review extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
        }
    }
    render(){
        let item = this.props.data;
        return (
            <View style={Styles.review}>
                <View style={Styles.reviewAvatar}>
                    <Image source={ImageSources.IMG_AVATAR_2} style={Styles.reviewAvatarImage}/>
                </View>
                <View style={Styles.reviewBody}>
                    <Text style={Styles.reviewAuthor}>{item.name}</Text>
                    <Text style={Styles.reviewDate}>{item.date}</Text>
                    <View style={Styles.reviewRating}>
                        <View style={Styles.reviewStars} >
                            <WAStars starStyle={Styles.reviewStar} set={'3'} rating={item.rating} />
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                this.setState({
                                    liked: !this.state.liked
                                })
                            }}
                            style={Styles.reviewLike}>
                            {
                                this.state.liked?
                                    <View style={Styles.reviewLikeCountWrapper}><Text style={Styles.reviewLikeCount}>1</Text></View>
                                    :undefined
                            }
                            <IconFA style={[Styles.reviewLikeIcon, this.state.liked && Styles.reviewLikeIconLiked]} name={'thumbs-up'}/>
                            <Text style={Styles.reviewLikeText}>Hữu ích</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={Styles.reviewTitle}>{'"'}{item.title}{'"'}</Text>
                    <Text style={Styles.reviewContent}>{item.content}</Text>
                </View>
            </View>
        )
    }
}

class Reviews extends PureComponent{
    static defaultProps = {

    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: [
                {
                    name: 'Nguyễn Văn A',
                    date: '11:20 30/12/2018',
                    rating: 4.5,
                    title: 'Tôi rất thích cách phục vụ nơi đây',
                    content: 'Dịch vụ luôn luôn tuyệt vời, miễn phí cà phê hoặc thức uống của sự lựa chọn khi đến, nơi chính nó là thực sự sạch sẽ và được thực hiện tốt trong suốt. Nhân viên luôn thân thiện!'
                },
                {
                    name: 'Nguyễn Văn A',
                    date: '11:20 30/12/2018',
                    rating: 4.5,
                    title: 'Tôi rất thích cách phục vụ nơi đây',
                    content: 'Dịch vụ luôn luôn tuyệt vời, miễn phí cà phê hoặc thức uống của sự lựa chọn khi đến, nơi chính nó là thực sự sạch sẽ và được thực hiện tốt trong suốt. Nhân viên luôn thân thiện!'
                },
            ]
        }
    }
    _loadItem = () => {
        this.setState({
            loading: true
        }, () => {
            setTimeout(() => {
                let items = this.state.items;
                items.push(
                    {
                        name: 'Nguyễn Văn A',
                        date: '11:20 30/12/2018',
                        rating: 4.5,
                        title: 'Tôi rất thích cách phục vụ nơi đây',
                        content: 'Dịch vụ luôn luôn tuyệt vời, miễn phí cà phê hoặc thức uống của sự lựa chọn khi đến, nơi chính nó là thực sự sạch sẽ và được thực hiện tốt trong suốt. Nhân viên luôn thân thiện!'
                    },
                );
                items.push(
                    {
                        name: 'Nguyễn Văn A',
                        date: '11:20 30/12/2018',
                        rating: 4.5,
                        title: 'Tôi rất thích cách phục vụ nơi đây',
                        content: 'Dịch vụ luôn luôn tuyệt vời, miễn phí cà phê hoặc thức uống của sự lựa chọn khi đến, nơi chính nó là thực sự sạch sẽ và được thực hiện tốt trong suốt. Nhân viên luôn thân thiện!'
                    },
                );
                this.setState({
                    items: items,
                    loading: false
                })
            }, 500)
        });
    };
    render(){
        return (
            <View style={Styles.reviews}>
                {
                    this.state.items.map((item, index)=>{
                        return (
                            <Review key={index} data={item}/>
                        )
                    })
                }
                <View style={Styles.reviewsBottom}>
                    {!this.state.loading?
                        <TouchableOpacity
                            onPress={this._loadItem}
                            style={Styles.loadMoreReviews}>
                            <Text style={Styles.loadMoreReviewsText}>Xem nhiều hơn</Text>
                        </TouchableOpacity>
                        :<BallIndicator size={50} color={Colors.PRIMARY}/>
                    }
                </View>
            </View>
        )
    }
}



export default class WAReviews extends PureComponent {
    static defaultProps = {
        position: {},
    };

    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        return (
            <View style={Styles.blockReview}>
                <View style={Styles.blockReviewHead}>
                    <Text numberOfLines={1} style={Styles.blockReviewTitle}>
                        Xếp hạng sao
                    </Text>
                    <Text style={Styles.blockReviewDesc}>
                        Có 25 người đánh giá & nhận xét
                    </Text>
                </View>
                <Reviews/>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    blockReviewHead: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT

    },
    blockReview: {
        borderTopWidth: 5,
        borderTopColor: Colors.SILVER_LIGHT
    },
    blockReviewTitle:{
        color: Colors.TEXT_DARK,
        fontSize: 20,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        marginBottom: 5
    },
    blockReviewDesc: {
        color: Colors.SILVER_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviews: {

    },
    review: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT

    },
    reviewBody: {
        flex: 1
    },
    reviewAvatar: {
        marginRight: 10
    },
    reviewAvatarImage: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        borderRadius: 15
    },
    reviewAuthor: {
        color: Colors.TEXT_DARK,
        fontSize: 13,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviewDate: {
        color: Colors.SILVER_DARK,
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviewRating: {
        flexDirection: 'row'  ,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    reviewStars: {
        flex: 1
    },
    reviewStar: {
        marginRight: 10
    },
    reviewLike: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.SILVER,
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15
    },
    reviewLikeIcon: {
        color: Colors.SILVER,
        marginRight: 5,
        fontSize: 20
    },
    reviewLikeIconLiked: {
        color: Colors.PRIMARY,
    },
    reviewLikeText: {
        color: Colors.SILVER,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME
    },
    reviewLikeCountWrapper: {
        paddingRight: 10,
        marginRight: 10,
        borderRightWidth: 1,
        borderRightColor: Colors.SILVER
    },
    reviewLikeCount: {
        color: Colors.SILVER,
        fontSize: 16,
        fontFamily: GlobalStyles.FONT_NAME,
    },
    reviewTitle: {
        color: Colors.PRIMARY,
        fontSize: 17,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10
    },
    reviewContent: {
        color: Colors.TEXT_DARK,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME,
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
        marginTop: 30,
        marginBottom: 60
    },
});