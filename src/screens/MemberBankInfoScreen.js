import React, {Component} from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {G, Line, Path, Rect, Svg, Text as SText} from "react-native-svg";
import ImagePicker from 'react-native-image-crop-picker'
import WAAlert from "../components/WAAlert";
import ImageSources from "../styles/ImageSources";
import Utils from '../configs';
import {connect} from  'react-redux';
import {DotIndicator} from 'react-native-indicators';


type Props = {};
class MemberBankInfoScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {
                name: '',
                account: '',
                bank_name: ''
            },
            alert: false,
            alertTitle: '',
            alertMessage: '',
            alertFunc: ()=>{}
        }
    }

    _load = () => {
        this.setState({
            loading: true
        }, async ()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/bank-info'
                );
                console.log(rq.data);
                this.setState({
                    loading: false,
                    data: rq.data
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

    _save = () => {
        if(this.state.loading){
            return;
        }
        this.setState({
            loading: true
        }, async ()=>{
            try {
                console.log(this.state.data);
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/bank-info',
                    this.state.data
                );
                this.setState({
                    loading: false
                }, ()=>{
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                if(e.response){
                    if(e.response.status){
                        this.setState({
                            loading: false,
                            alert: true,
                            alertTitle: 'Lỗi thông tin',
                            alertMessage: e.response.status===422?Utils.getValidationMessage(e.response).replace(/■ /g, ''):'Lỗi không xác định',
                            alertFunc: ()=>{}
                        });
                    }
                }
                else{
                    this.setState({
                        loading: false
                    });
                }
                console.log(e.response);
            }
        });
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'NGÂN HÀNG'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
                rightComponent={
                    (
                        this.state.loading?undefined:
                            <TouchableOpacity
                                hitSlop={Utils.defaultTouchSize}
                                onPress={this._save}
                            >
                                <Text style={Styles.saveButton}>Lưu</Text>
                            </TouchableOpacity>
                    )
                }
            >
                {
                    this.state.loading?
                        <DotIndicator count={3} size={10} color={Colors.PRIMARY}/>
                        :
                        <View style={{flex: 1}}>
                            <View style={Styles.field}>
                                <Text style={Styles.label}>Tên chủ tài khoản</Text>
                                <TextInput
                                    style={Styles.input}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    spellCheck={false}
                                    value={this.state.data.name}
                                    onChangeText={(text)=>{this.setState({
                                        data: {
                                            ...this.state.data,
                                            name: text
                                        }
                                    })}}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    placeholder={'Nhập tên chủ tải khoản...'}
                                />
                            </View>
                            <View style={Styles.field}>
                                <Text style={Styles.label}>Số tài khoản</Text>
                                <TextInput
                                    style={Styles.input}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    spellCheck={false}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    placeholder={'Nhập số tài khoản...'}
                                    value={this.state.data.account}
                                    onChangeText={(text)=>{this.setState({
                                        data: {
                                            ...this.state.data,
                                            account: text
                                        }
                                    })}}
                                />
                            </View>
                            <View style={Styles.field}>
                                <Text style={Styles.label}>Tên ngân hàng / chi nhánh</Text>
                                <TextInput
                                    style={Styles.input}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    spellCheck={false}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    placeholder={'Nhập tên ngân hàng/chi nhánh...'}
                                    value={this.state.data.bank_name}
                                    onChangeText={(text)=>{this.setState({
                                        data: {
                                            ...this.state.data,
                                            bank_name: text
                                        }
                                    })}}
                                />
                            </View>
                            <WAAlert show={this.state.alert} title={this.state.alertTitle} question={this.state.alertMessage}
                                     yes={()=>{
                                            this.setState({
                                                alert: false,
                                            }, ()=>{
                                                this.state.alertFunc();
                                            });
                                        }
                                     }
                                     no={false}
                                     titleFirst={true} yesTitle={'Đã hiểu'}/>
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
    }
)(MemberBankInfoScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 50,
        justifyContent: 'flex-start',
        backgroundColor: '#F1F1F2',
    },
    closeButton: {
        color: Colors.LIGHT
    },
    saveButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    headerContainer: {
        backgroundColor: Colors.DARK
    },
    field: {
        marginBottom: 20
    },
    label: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        marginBottom: 10
    },
    input: {
        height: 40,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        backgroundColor: Colors.LIGHT,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3
    }
});