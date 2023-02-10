import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WALoading from "../components/WALoading";
import WAAlert from "../components/WAAlert";
import CalendarStrip from "react-native-calendar-strip";

type Props = {
};

const locale = {
    //name: 'en',
    config: {
        weekdaysShort: 'CN_TH2_TH3_TH4_TH5_TH6_TH7'.split('_'),
        months: 'THÁNG 01_THÁNG 02_THÁNG 03_THÁNG 04_THÁNG 05_THÁNG 06_THÁNG 07_THÁNG 08_THÁNG 09_THÁNG 10_THÁNG 11_THÁNG 12'.split(
            '_'
        ),
    }
};

export default class DealBookingScreen extends Component<Props> {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            times: [
                {
                    time: '08:30'
                },
                {
                    time: '09:00'
                },
                {
                    time: '09:30'
                },
                {
                    time: '10:00'
                },
                {
                    time: '10:30'
                },
                {
                    time: '11:00'
                },
                {
                    time: '11:30'
                },
                {
                    time: '12:00'
                },
                {
                    time: '12:30'
                },
                {
                    time: '13:00'
                },
                {
                    time: '13:30'
                },
                {
                    time: '14:00'
                },
                {
                    time: '14:30'
                },
                {
                    time: '15:00'
                },
                {
                    time: '15:30'
                },
                {
                    time: '16:00'
                },
                {
                    time: '16:30'
                },
                {
                    time: '17:00'
                },
                {
                    time: '17:30'
                },
                {
                    time: '18:00'
                },
            ],
            selectTime: '08:30',
            showLoading: false,
            showAlert: false
        }
    }

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                navigationButtonStyle={{color: Colors.LIGHT}}
                headerTitle={'Thương lượng'}
                headerTitleColor={Colors.LIGHT}

            >
                <TouchableOpacity
                    onPress={()=>{
                        this.reason.blur();
                    }}
                    activeOpacity={1} style={Styles.pageWrapperInner}>
                    <Text style={Styles.label}>Cho khách biết lý do thương lượng</Text>
                    <TextInput
                    placeholder={'Nội dung'}
                    multiline={true}
                    style={Styles.reason}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    spellCheck={false}
                    selectionColor={Colors.PRIMARY}
                    underlineColorAndroid="transparent"
                    ref={reason=>{this.reason = reason}}
                    />
                    <Text style={Styles.label}>Thời gian</Text>
                    <View style={Styles.dates}>
                        <CalendarStrip
                            innerStyle={{
                                marginBottom: 15
                            }}
                            highlightDateNameStyle={{
                                color: Colors.PRIMARY
                            }}
                            highlightDateNumberStyle={{
                                color: Colors.PRIMARY
                            }}
                            calendarHeaderStyle={{
                                marginBottom: 10,
                                fontWeight: 'normal',
                                color: Colors.TEXT_DARK,
                                fontSize: 15
                            }}
                            //locale={locale}
                            weekendDateNameStyle={{
                                color: Colors.TEXT_DARK,
                            }}
                            weekendDateNumberStyle={{
                                color: Colors.TEXT_DARK
                            }}
                            dateNameStyle={{
                                color: Colors.TEXT_DARK
                            }}
                            dateNumberStyle={{
                                color: Colors.TEXT_DARK
                            }}
                        />
                    </View>
                    <View style={Styles.times}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={{flex: 1}}>
                            {
                                this.state.times.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    selectTime: item.time
                                                })
                                            }}
                                            key={index} style={[
                                            Styles.time, item.time === this.state.selectTime && Styles.timeSelected
                                        ]}>
                                            <Text style={[
                                                Styles.timeText,
                                                item.time === this.state.selectTime && Styles.timeTextSeleted
                                            ]}>{item.time}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </TouchableOpacity>
                <View style={Styles.modalButtons}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={Styles.modalButton}>
                        <Text style={Styles.modalButtonText}>Không</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                showLoading: true
                            }, () => {
                                setTimeout(()=>{
                                    this.setState({
                                        showLoading: false,
                                        showAlert: true
                                    }, ()=>{
                                    })
                                }, 1000)
                            })
                        }}
                        style={[Styles.modalButton, Styles.modalButtonAgree]}>
                        <Text style={[Styles.modalButtonText, Styles.modalButtonAgreeText]}>Gừi xác nhận</Text>
                    </TouchableOpacity>
                </View>
                <WALoading show={this.state.showLoading} />
                <WAAlert show={this.state.showAlert} title={'Gừi thành công'} question={'Đã gửi yêu cầu thương lượng của bạn thành công đến khách hàng'}  yes={()=>{
                    this.props.navigation.replace('home')
                }} no={false} titleFirst={true}
                         yesTitle={'Đã hiểu'}
                />
            </PageContainer>
        );
    }
}

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: "flex-start",
        backgroundColor: Colors.LIGHT
    },
    pageWrapperInner: {
        flex: 1,
        width: "100%",
    },
    reason: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.TEXT_DARK,
        marginTop: 15
    },
    label: {
        marginTop: 20,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SILVER_DARK
    },
    times: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 15},
        shadowOpacity: 0.05,
        backgroundColor: Colors.LIGHT,
        //elevation: 5,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 30,
        height: 70
    },
    time: {
        backgroundColor: Colors.TRANSPARENT,
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 10,
        borderRadius: 3,
    },
    timeSelected: {
        backgroundColor: Colors.PRIMARY,
    },
    timeText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 14,

    },
    timeTextSeleted: {
        color: Colors.LIGHT,
    },
    dates: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 15},
        shadowOpacity: 0.05,
        backgroundColor: Colors.LIGHT,
        //elevation: 5,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 5,
        marginTop: 15
    },
    highlightDateNumberStyle: {
        color: Colors.LIGHT,
        backgroundColor: Colors.PRIMARY,
    },
    dateNumberStyle: {
        fontSize: 5,
        paddingRight: 5,
        paddingLeft: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20
    },
    modalButton: {
        borderColor: Colors.SILVER,
        borderWidth: 1,
        borderRadius: 20,
        flex: 1,
        marginRight: 5,
        marginLeft: 5
    },
    modalButtonText: {
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME
    },
    modalButtonAgree: {
        backgroundColor: Colors.PRIMARY,
        borderWidth: 0
    },
    modalButtonAgreeText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME
    }
});
