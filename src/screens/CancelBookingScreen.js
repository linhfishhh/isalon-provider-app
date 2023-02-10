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
    Modal, ImageBackground
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
import Utils from "../configs";
import {DotIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';

type Props = {
};
class CancelBookingScreen extends Component<Props> {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            showConfirm: false,
            id: this.props.navigation.getParam('id'),
            fetching: false,
            error: false,
            errorMessage: '',
            reasons: [
            ],
            reason: '',
            onCancel: this.props.navigation.getParam('onCancel'),
        }
    }

    _loadReasons = () => {
        this.setState({
            fetching: true
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).get('booking/cancel-reasons');
                console.log(rq.data);
                this.setState({
                    fetching: false,
                    reasons: rq.data
                });
            }
            catch (e) {
                this.setState({
                    fetching: false
                });
                console.log(e+'');
            }
        });
    };

    componentDidMount(){
        this._loadReasons();
    }

    _cancel = async () => {
        this.setState({
            fetching: true,
            error: false,
            errorMessage: ''
        });
        let error = false;
        let errorMessage = '';
        try {
            let rs = await Utils.getAxios(this.props.account.token).post('booking/new/cancel', {
                id: this.state.id,
                note: this.state.reason
            });
            this.setState({
                fetching: false,
                error: error,
                errorMessage: errorMessage
            }, ()=>{
                this.state.onCancel();
            });
        }
        catch (e) {
            console.log(e+'');
            error = true;
            errorMessage = e.response.status===422?e.response.data.message:'Lỗi không xác định xảy ra trong quá trình xử lý yêu cầu';
            this.setState({
                fetching: false,
                error: error,
                errorMessage: errorMessage
            });
        }
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
                headerTitle={'Hủy đặt chỗ'}
                headerTitleColor={Colors.LIGHT}

            >
                {
                    this.state.fetching?
                        <View style={{flex: 1, backgroundColor: Colors.LIGHT, width: '100%'}}>
                            <DotIndicator count={3} size={10} color={Colors.PRIMARY} />
                        </View>
                        :
                        <View style={Styles.pageWrapperInner}>
                            <ScrollView
                                bounces={false}
                                style={Styles.content}>
                                <Text style={Styles.question}>
                                    Tại sao bạn muốn hủy?
                                </Text>
                                <View style={Styles.reasons}>
                                    {
                                        this.state.reasons.map((item, index) => {
                                            return (
                                                <View style={[Styles.reason, index === 0 && Styles.reasonFirst]}
                                                      key={index}
                                                >
                                                    <TouchableOpacity
                                                        onPress={()=>{
                                                            this.setState({
                                                                showConfirm: true,
                                                                reason: item
                                                            })
                                                        }}
                                                        style={Styles.reasonButton}
                                                    >
                                                        <Text style={Styles.reasonText}>
                                                            {item}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                {
                                    1===0?
                                        <View
                                            style={Styles.deny}
                                        >
                                            <TouchableOpacity
                                                onPress={()=>{
                                                    this.props.navigation.navigate('deal_booking')
                                                }}
                                                style={[Styles.reasonButton, Styles.reasonButtonDeny]}
                                            >
                                                <Text style={Styles.reasonText}>
                                                    Thương lượng lại với khách hàng
                                                </Text>
                                            </TouchableOpacity>
                                            <Icon
                                                style={Styles.denyIcon}
                                                name={'keyboard-arrow-right'} />
                                        </View>
                                        :undefined
                                }
                            </ScrollView>
                        </View>
                }
                <WAAlert
                    titleFirst={true}
                    question={'Bạn có chắc chắn muốn huỷ yêu cầu đặt chỗ của khách hàng?'}
                    title={"Huỷ đơn đặt chỗ?"}
                    show={this.state.showConfirm}
                    questionStyle={Styles.alertQuestion}
                    titleStyle={Styles.alertTitleStyle}
                    yes={()=>{
                        this.setState({
                            showConfirm: false
                        }, ()=>{
                            this._cancel();
                        })
                    }}
                    no={()=>{
                        this.setState({
                            showConfirm: false
                        }, ()=>{

                        })
                    }}
                />
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
)(CancelBookingScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        alignItems: "flex-start",
        backgroundColor: Colors.SILVER_LIGHT
    },
    pageWrapperInner: {
        flex: 1,
        width: "100%",
    },
    content: {
        flex: 1,
    },
    question: {
        paddingLeft: 30,
        paddingTop: 30,
        paddingBottom: 30,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
        backgroundColor: Colors.LIGHT
    },
    reasons: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        paddingLeft: 30,
        backgroundColor: Colors.LIGHT,
        marginBottom: 20
    },
    reason: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
    },
    reasonFirst: {
        borderTopWidth: 0,
    },
    reasonButton: {
        paddingTop: 25,
        paddingBottom: 25
    },
    reasonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK
    },
    deny: {
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: Colors.LIGHT,
        flexDirection: 'row',
        alignItems: 'center'
    },
    reasonButtonDeny: {
        flex: 1
    },
    denyIcon: {
        color: Colors.SILVER,
        fontSize: 25
    },
    alertQuestion: {
        fontSize: 15
    },
    alertTitleStyle: {
        fontSize: 20
    }
});
