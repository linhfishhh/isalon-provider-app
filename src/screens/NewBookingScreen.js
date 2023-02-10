import React, {Component, PureComponent} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    Alert,
    StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Path, Svg} from "react-native-svg";
import {DotIndicator} from 'react-native-indicators';
import Utils from '../configs';
import {connect} from 'react-redux';
import numeral from 'numeral';
import moment from "moment";
import {loadHomeTab} from "../redux/tabHome/actions";
import {loadIncomeTab} from "../redux/tabIncome/actions";

type Props = {};
class NewBookingScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            services: [
                {
                    name: 'Hớt tóc name'
                },
                {
                    name: 'Nhuộm tóc highlight'
                }
            ],
            time: '09:30',
            date: '27/07/2018',
            name: 'Thạch Minh Trang',
            rating: 4.5,
            fetching: true,
            error: false,
            errorMessage: '',
            id: this.props.navigation.getParam('id'),
            data: {

            },
            onAccept: this.props.navigation.getParam('onAccept'),
            onCancel: this.props.navigation.getParam('onCancel'),
        }
    }

    _loadInfo = async () => {
        this.setState({
            fetching: true,
            error: false,
            errorMessage: ''
        });
        let data = this.state.data;
        let error = false;
        let errorMessage = '';
        try {
            let rs = await Utils.getAxios(this.props.account.token).get('booking/new/detail?id='+this.state.id);

            data = rs.data;
            console.log(data);
            this.setState({
                fetching: false,
                data: data,
                error: error,
                errorMessage: errorMessage
            });
        }
        catch (e) {
            console.log(e.response);
            error = true;
            errorMessage = e.response.status===422?e.response.data.message:'Lỗi không xác định xảy ra trong quá trình xử lý yêu cầu';
            this.setState({
                fetching: false,
                data: data,
                error: error,
                errorMessage: errorMessage
            });
        }
    };

    _accept = async () => {
        this.setState({
            fetching: true,
            error: false,
            errorMessage: ''
        });
        let error = false;
        let errorMessage = '';
        try {
            let rs = await Utils.getAxios(this.props.account.token).post('booking/new/accept', {
                id: this.state.id
            });
            this.setState({
                fetching: false,
                error: error,
                errorMessage: errorMessage
            }, ()=>{
                    this.state.onAccept();
            });
        }
        catch (e) {
            console.log(e.response);
            error = true;
            errorMessage = e.response.status===422?e.response.data.message:'Lỗi không xác định xảy ra trong quá trình xử lý yêu cầu';
            this.setState({
                fetching: false,
                error: error,
                errorMessage: errorMessage
            });
        }
    };

    componentDidMount(){
        this._loadInfo();
    }

    render() {
        return (
            <PageContainer
                backgroundImage={ImageSources.BG_ACCESS}
                darkTheme={false}
                contentWrapperStyle={Styles.container}
                layoutPadding={30}

            >
                {
                    this.state.fetching?
                    <DotIndicator size={10} count={3} color={Colors.PRIMARY} />
                    :
                    this.state.error?
                        <View style={[Styles.popup, Styles.popupError]}>
                            <Text style={Styles.title}>Lỗi xảy ra</Text>
                            <Text style={Styles.errorMessage}>{this.state.errorMessage}</Text>
                            <TouchableOpacity style={Styles.buttonError}
                                              onPress={()=>{
                                                  this.props.loadHomeTab();
                                                  this.props.loadIncomeTab();
                                                  this.props.navigation.goBack();
                                              }}
                            >
                                <Text style={Styles.buttonTextAlt}>Quay lại</Text>
                            </TouchableOpacity>
                        </View>
                    :
                        <View style={Styles.popup}>
                            <Text style={Styles.title}>Đặt chỗ mới</Text>
                            <Text style={Styles.serviceTitle}>Dịch vụ</Text>
                            {
                                this.state.data.services.map((item, index)=>{
                                    return (
                                        <View key={index} style={Styles.service}>
                                            <Icon style={Styles.dot} name={'lens'} />
                                            <Text style={Styles.serviceName}>{item.name}{item.qty>1?'x'+item.qty:''}</Text>
                                        </View>
                                    )
                                })
                            }
                            <View style={Styles.dateTime}>
                                <View style={Styles.time}>
                                    <Text style={Styles.blockTitle}>Thời gian làm</Text>
                                    <Text style={Styles.blockText}>{this.state.data.time}</Text>
                                </View>
                                <View style={Styles.date}>
                                    <Text style={Styles.blockTitle}>Ngày</Text>
                                    <Text style={Styles.blockText}>{this.state.data.date}</Text>
                                </View>
                            </View>
                            <View style={Styles.cus}>
                                <Text style={Styles.cusName}>{this.state.data.customer.name}</Text>
                                <View style={Styles.rating}>
                                    <Text style={Styles.ratingText}>{numeral(this.state.data.customer.rating).format('0,000.0')}</Text>
                                    <Svg
                                        width={11}
                                        height={11}
                                    >
                                        <Path d="M5.16,8.7,2.38,10.18a.33.33,0,0,1-.47-.34L2.45,6.7a.37.37,0,0,0-.09-.28L.1,4.2a.32.32,0,0,1,.17-.54L3.39,3.2A.32.32,0,0,0,3.63,3L5,.18a.32.32,0,0,1,.57,0L7,3a.32.32,0,0,0,.24.17l3.12.46a.32.32,0,0,1,.18.54L8.26,6.42a.3.3,0,0,0-.09.28L8.7,9.84a.32.32,0,0,1-.46.34L5.46,8.7A.32.32,0,0,0,5.16,8.7Z" fill="#fcb415" />
                                    </Svg>
                                </View>
                            </View>
                            <View style={Styles.buttons}>

                                <TouchableOpacity style={Styles.button}
                                                  onPress={()=>{
                                                      this.props.navigation.navigate('cancel_booking', {
                                                          id: this.state.id,
                                                          onCancel: (navigation) => {
                                                              this.props.navigation.getParam('onCancel')();
                                                          }
                                                      })
                                                  }}
                                >
                                    <Text style={Styles.buttonText}>Hủy...</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={()=>{
                                        this._accept();
                                    }}
                                    style={[Styles.button, Styles.buttonAlt]}>
                                    <Text style={[Styles.buttonText, Styles.buttonTextAlt]}>Đồng ý</Text>
                                </TouchableOpacity>
                            </View>
                            <CountDown time={this.state.data.timeout}/>
                        </View>
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
    },{
        loadHomeTab,
        loadIncomeTab
    }
)(NewBookingScreen);


class CountDown extends Component{
    static defaultProps = {
      time: 3600
    };
    constructor() {
        super();
        this.state = {
            progress: 100,
            remain: undefined,
            id: undefined,
        }
    }

    _run = () => {
        this.setState({
            progress: 100,
            remain: this.props.time,
            id: undefined,
        }, () => {
            let id = setInterval(()=>{
                let r= this.state.remain - 1;
                let p = (r/this.props.time) * 100.0;
                if (r < 0){
                    r = 0;
                }
                if (p < 0){
                    p = 0;
                }
                this.setState({
                    progress: p,
                    remain: r,
                }, () => {
                    if (this.state.remain === 0){
                        clearInterval(this.state.id);
                        //this.props.onTimeOut();
                    }
                })
            }, 1000);
            this.setState({
                id: id
            })
        });
    };

    componentDidMount(): void {
        this._run();
    }


    componentWillUnmount(): void {
        clearInterval(this.state.id);
    }

    render(){
        return(
            <View>
                <View style={Styles.countDown}>
                    <View style={[
                        Styles.progress,
                        {
                            width: ''+this.state.progress+'%'
                        }
                    ]}/>
                </View>
                {
                    this.state.remain?
                        <Text style={Styles.countDownText}>Còn
                            <Text style={Styles.countDownTextBold}>
                                {moment().startOf('day')
                                    .seconds( this.state.remain)
                                    .format(' HH [giờ] mm [phút] ss [giây] ')}
                            </Text>
                            để xử lý yêu cầu này
                        </Text>
                        :undefined
                }
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    errorMessage: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
        color: Colors.LIGHT,
        width: '100%',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 30
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    popup: {
        backgroundColor: Colors.DARK,
        borderRadius: 10,
        padding: 20
    },
    title: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 20,
        textAlign: 'center',
        color: Colors.LIGHT,
        marginBottom: 10
    },
    serviceTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.LIGHT,
        marginBottom: 10
    },
    dot: {
        fontSize: 6,
        color: Colors.LIGHT,
        marginRight: 5
    },
    service: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    serviceName: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.LIGHT,
    },
    dateTime: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15
    },
    time: {
        flex: 1,
        borderRightColor: Colors.LIGHT,
        borderRightWidth: 1
    },
    date: {
        flex: 1,
        alignItems: 'flex-end'
    },
    blockTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.LIGHT,
        marginBottom: 5
    },
    blockText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.LIGHT,
        fontWeight: 'bold'
    },
    cus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15
    },
    cusName: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.LIGHT,
        fontWeight: 'bold',
        flex: 1
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.LIGHT,
        fontWeight: 'bold',
        marginRight: 5
    },
    buttons: {
      flexDirection: 'row',
        marginTop: 20
    },
    button: {
        backgroundColor: Colors.LIGHT,
        flex: 1,
        marginRight: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    buttonError: {
        backgroundColor: Colors.PRIMARY,
        marginRight: 10,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonAlt: {
        marginRight: 0,
        marginLeft: 5,
        backgroundColor: Colors.PRIMARY
    },
    buttonDone: {
        marginRight: 0,
        backgroundColor: Colors.PRIMARY
    },
    buttonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
    },
    buttonTextAlt: {
        color: Colors.LIGHT,

    },
    countDown: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        marginTop: 20,
        marginBottom: 10
    },
    countDownText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        color: Colors.SILVER,
        textAlign: 'center',
        marginTop: 5
    },
    countDownTextBold: {
        color: Colors.LIGHT
    },
    progress: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.PRIMARY
    },
    note: {
        textAlign: 'center',
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        color: Colors.SILVER,
        marginBottom: 15
    },
    noteTimeOut: {
        color: Colors.PRIMARY
    }
});