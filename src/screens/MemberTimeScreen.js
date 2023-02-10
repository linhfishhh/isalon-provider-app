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
import MapView, {Marker} from "react-native-maps";
import {NavigationEvents} from "react-navigation";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Line, Polyline, Svg} from "react-native-svg";
import Moment from 'moment';
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';



type Props = {};
class MemberTimeScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            days: [
                {
                    weekday: 1,
                    title: 'THỨ HAI',
                    start: '00:00',
                    end: '00:00',
                },
                {
                    weekday: 2,
                    title: 'THỨ BA',
                    start: '00:00',
                    end: '00:00',
                },
                {
                    weekday: 3,
                    title: 'THỨ TƯ',
                    start: '00:00',
                    end: '00:00',
                },
                {
                    weekday: 4,
                    title: 'THỨ NĂM',
                    start: '00:00',
                    end: '00:00',
                },
                {
                    weekday: 5,
                    title: 'THỨ SÁU',
                    start: '00:00',
                    end: '00:00',
                },
                {
                    weekday: 6,
                    title: 'THỨ BẢY',
                    start: '00:00',
                    end: '00:00',
                },
                {
                    weekday: 7,
                    title: 'CHỦ NHẬT',
                    start: '00:00',
                    end: '00:00',
                },
            ],
            selected: undefined,
            isDateTimePickerVisible: false,
            editingTime: [
                '00:00',
                '00:00'
            ],
            editingTimeType: undefined,
            pickerDate: new Date(),
            alert: false,
            alertMessage: '',
            loading: true,
            processing: false
        }
    }
    _showDateTimePicker = () => {
        let d = Moment(
            this.state.editingTimeType === 'start'?
                this.state.editingTime[0]
                :this.state.editingTime[1]
            , "HH:mm");

        this.setState({
            isDateTimePickerVisible: true,
            pickerDate: d.toDate()
        })
    };

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let picked = Moment(date).format('HH:mm');
        let newEdit = this.state.editingTime;
        if (this.state.editingTimeType === 'start'){
            newEdit[0] = picked;
        }
        else{
            newEdit[1] = picked;
        }
        this.setState({
            editingTime: newEdit
        }, this._hideDateTimePicker);
    };

    _load = () => {
        this.setState({
            loading: true
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).get('edit-salon/time');
                let data = rq.data;
                let times= this.state.days;
                data.every((item) => {
                    times[item.weekday - 1].start = item.start;
                    times[item.weekday - 1].end = item.end;
                    return item;
                });
                this.setState({
                    loading: false,
                    days: times
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

    _save = () => {
        this.setState({
            processing: true
        }, async() => {
            try {
                let form = this.state.days.map((item) => {
                    return {
                        weekday: item.weekday,
                        start: item.start,
                        end: item.end,
                    };
                });
                form = form.filter((item) => {
                    return item.start !== '00:00' && item.end !== '00:00'
                });
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/time',
                    {
                        data: form
                    }
                );
                let data = rq.data;
                console.log(data);
                this.setState({
                    processing: false
                }, ()=>{
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                this.setState({
                    processing: false,
                    alert: true,
                    alertMessage: e.response.status === 422?Utils.getValidationMessage(e.response):'Có lỗi xảy ra trong quá trình xử lý dữ liệu'
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
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'Ngày giờ làm việc'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
                rightComponent={
                    (
                        !this.state.loading && !this.state.processing?
                            <TouchableOpacity
                                hitSlop={Utils.defaultTouchSize}
                                onPress={this._save}
                            >
                                <Text style={Styles.saveButton}>Lưu</Text>
                            </TouchableOpacity>
                            :undefined
                    )
                }
            >
                {
                    this.state.loading?
                        <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                            <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                        </View>
                        :
                        <View style={{flex: 1}}>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                                mode={'time'}
                                is24Hour={true}
                                titleIOS={'Chọn giờ'}
                                confirmTextIOS={'Chấp nhận'}
                                cancelTextIOS={'Đóng lại'}
                                date={this.state.pickerDate}
                            />
                            <Text style={Styles.title}>NGÀY LÀM VIỆC</Text>
                            <View style={Styles.block}>
                                <View style={Styles.days}>
                                    {
                                        this.state.days.map((item, index)=>{
                                            return (
                                                <View
                                                    key={index}
                                                    style={
                                                        [
                                                            Styles.dayWrapper,
                                                            this.state.selected === index
                                                            && Styles.dayWrapperSelected
                                                        ]
                                                    }
                                                >
                                                    <TouchableOpacity
                                                        onPress={()=>{
                                                            this.setState({
                                                                selected: index,
                                                                editingTime: [
                                                                    item.start,
                                                                    item.end
                                                                ]
                                                            })
                                                        }}
                                                        style={[
                                                            Styles.day,
                                                            this.state.selected === index
                                                            &&  Styles.daySelected
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                Styles.dayTitle,
                                                                this.state.selected === index
                                                                &&  Styles.dayTitleSelected
                                                            ]}
                                                        >{item.title}</Text>
                                                        <Text
                                                            style={[
                                                                Styles.dayTime,
                                                                this.state.selected === index
                                                                &&  Styles.dayTimeSelected
                                                            ]}
                                                        >
                                                            {item.start} - {item.end}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View
                                        style={[Styles.dayWrapper, Styles.dayWrapperAll]}
                                    >
                                        <TouchableOpacity
                                            onPress={()=>{
                                                this.setState({
                                                    selected: 7,
                                                    editingTime: [
                                                        '00:00',
                                                        '00:00'
                                                    ]
                                                })
                                            }}
                                            style={[
                                                Styles.day,
                                                this.state.selected ===7
                                                &&  Styles.daySelected
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    Styles.dayTitleAll,
                                                    this.state.selected ===7
                                                    &&  Styles.dayTitleAllSelected
                                                ]}
                                            >CẢ TUẦN</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <Text style={Styles.title}>GIỜI LÀM VIỆC</Text>
                            <View style={Styles.block}>
                                {
                                    this.state.selected !== undefined?
                                        <View>
                                            <View style={Styles.timePicker}>
                                                <View style={Styles.openTime}>
                                                    <TouchableOpacity
                                                        onPress={()=>{
                                                            this.setState({
                                                                editingTimeType: 'start'
                                                            }, this._showDateTimePicker)
                                                        }}
                                                        style={Styles.openTimeStart}>
                                                        <Text style={Styles.openTimeTitle}>MỞ CỬA</Text>
                                                        <Text style={Styles.openTimeValue}>
                                                            {this.state.editingTime[0]}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <Svg
                                                        style={Styles.openTimeIcon}
                                                        width={25}
                                                        height={10}
                                                    >
                                                        <Line y1="4.6" x2="23.35" y2="4.6" fill="none" stroke="#231f20"/>
                                                        <Polyline points="19.1 8.84 23.34 4.6 19.1 0.35" fill="none" stroke="#231f20"/>
                                                    </Svg>
                                                    <TouchableOpacity
                                                        onPress={()=>{
                                                            this.setState({
                                                                editingTimeType: 'end'
                                                            }, this._showDateTimePicker)
                                                        }}
                                                        style={Styles.openTimeEnd}>
                                                        <Text style={Styles.openTimeTitle}>ĐÓNG CỬA</Text>
                                                        <Text style={Styles.openTimeValue}>{this.state.editingTime[1]}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity
                                                    style={Styles.noWork}
                                                    onPress={()=>{
                                                        this.setState({
                                                            editingTime: [
                                                                '00:00',
                                                                '00:00'
                                                            ]
                                                        })
                                                    }}
                                                >
                                                    <Text style={Styles.openTimeTitle}>HÀNH ĐỘNG</Text>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Icon
                                                            style={Styles.noWorkIcon}
                                                            name={'block'} />
                                                        <Text
                                                            style={Styles.noWorkText}
                                                        >
                                                            NGHỈ
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                onPress={this._apply}
                                                style={Styles.apply}>
                                                <Text
                                                    style={Styles.applyText}
                                                >Áp dụng cho ngày được chọn</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :<View style={Styles.notSelected}>
                                            <Icon style={Styles.notSelectedIcon} name={'timer'} />
                                            <Text style={Styles.notSelectedText}>Chọn ngày từ danh sách bên trên để chỉnh sửa thời gian đóng mở cửa</Text>
                                        </View>
                                }
                            </View>
                        </View>
                }
                <WALoading show={this.state.processing}/>
                <WAAlert show={this.state.alert} yes={()=>{
                    this.setState({
                        alert: false
                    })
                }} no={false}
                         question={this.state.alertMessage}
                         titleFirst={true}
                         title={'Lỗi xảy ra'}
                         yesTitle={'Đã hiểu'}
                />
            </PageContainer>
        )
    }
    _apply = () => {
        if(this.state.selected<7){
            let days = this.state.days;
            days[this.state.selected].start = this.state.editingTime[0];
            days[this.state.selected].end = this.state.editingTime[1];
            this.setState({
                days: days
            })
        }
        else{
            this.setState({
                days: this.state.days.map((item) => {
                    return {
                        ...item,
                        start: this.state.editingTime[0],
                        end: this.state.editingTime[1]
                    }
                })
            })
        }
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberTimeScreen);

const Styles = StyleSheet.create({
    pageWrapper:{
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        justifyContent: 'flex-start',
        backgroundColor: '#F1F1F2',
    },
    closeButton: {
        color: Colors.PRIMARY
    },
    saveButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    headerContainer: {
        backgroundColor: Colors.DARK
    },
    title: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 15,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        paddingBottom: 20
    },
    block: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        paddingBottom: 20,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },
    days: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    dayWrapper: {
        width: '33.33%',
        padding: 7
    },
    dayWrapperAll: {
        width: '66%',
    },
    day: {
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        borderRadius: 5,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    daySelected: {
        borderWidth: 1,
        borderColor: Colors.SECONDARY,
        backgroundColor: Colors.SECONDARY,
    },
    dayTitle: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        textAlign: 'center'
    },
    dayTitleAll: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
    },
    dayTitleSelected: {
        color: Colors.LIGHT,
    },
    dayTitleAllSelected: {
        color: Colors.LIGHT,
    },
    dayTime: {
        color: Colors.SILVER,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 10,
        textAlign: 'center'
    },
    dayTimeSelected: {
        color: Colors.LIGHT,
    },
    timePicker: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 15
    },
    openTime: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    openTimeStart: {
    },
    openTimeEnd: {
    },
    openTimeTitle: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        marginBottom: 5
    },
    openTimeValue: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
    },
    openTimeIcon: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5
    },
    noWork: {
        justifyContent: 'center',
    },
    noWorkText: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
    },
    noWorkIcon: {
        fontSize: 18,
        marginRight: 5,
        color: Colors.PRIMARY
    },
    apply: {
        backgroundColor: Colors.SECONDARY,
        height: 50,
        borderRadius: 2,
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
        marginTop: 15
    },
    applyText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
    },
    notSelected: {
        flexDirection: 'row',
        alignItems:'center'
    },
    notSelectedIcon: {
        fontSize: 40,
        color: Colors.SECONDARY,
        marginRight: 10
    },
    notSelectedText: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        flex: 1
    }
});