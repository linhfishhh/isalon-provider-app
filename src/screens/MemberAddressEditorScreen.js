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
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {DotIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import Utils from '../configs';
import WALocation from "../components/WALocation";
import {clearLocationData, loadLv1 as loadLocationLv1, setLv1, setLv2, setLv3} from "../redux/location/actions";
import WAAlert from "../components/WAAlert";

type Props = {};
class MemberAddressEditorScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            address: this.props.navigation.getParam('address') || '',
            address_lv1: this.props.navigation.getParam('address_lv1') || 0,
            address_lv2: this.props.navigation.getParam('address_lv2') || 0,
            address_lv3: this.props.navigation.getParam('address_lv3') || 0,
            loading: true,
            alert: false,
            alertMessage: '',
            save: this.props.navigation.getParam('save')
        }
    }

    _load = () => {
        this.setState({
            loading: true,
        }, () =>{
            try {
                this.props.loadLocationLv1(()=>{
                    if(this.state.address_lv1){
                        this.props.setLv1(this.state.address_lv1.id, ()=>{
                            if(this.state.address_lv2){
                                this.props.setLv2(this.state.address_lv2.id, ()=>{
                                    if(this.state.address_lv3){
                                        this.props.setLv3(this.state.address_lv3.id, ()=>{
                                            this.setState({
                                                loading: false
                                            });
                                        });
                                    }
                                    else{
                                        this.setState({
                                            loading: false
                                        });
                                    }
                                });
                            }
                            else{
                                this.setState({
                                    loading: false
                                });
                            }
                        });
                    }
                    else{
                        this.setState({
                            loading: false
                        });
                    }
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
                console.log(e+'');
            }
        });
    };

    componentDidMount(){
        this.props.clearLocationData();
        this._load();
    }
    _save = () => {
        this.address.blur();
        let address = this.state.address.trim();
        let lv1 = {
            id: this.props.location.lv1Value,
            label: this.props.location.lv1Title
        };
        let lv2 = {
            id: this.props.location.lv2Value,
            label: this.props.location.lv2Title
        };
        let lv3 = {
            id: this.props.location.lv3Value,
            label: this.props.location.lv3Title
        };
        if(address.length===0 || !lv1.id || !lv2.id || !lv3.id){
            this.setState({
                alert: true,
                alertMessage: 'Vui lòng nhập đầu đủ các thông tin địa chỉ'
            });
            return false;
        }
        this.state.save(address, lv1, lv2,  lv3);
        this.props.navigation.goBack();
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.XAM}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'ĐỊA CHỈ'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={30}
                rightComponent={
                    (
                        !this.state.loading?
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
                        <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
                        :
                        <View style={{flex: 1}}>
                            <View style={Styles.fieldSet}>
                                <Text style={Styles.fieldLabel}>Địa chỉ:</Text>
                                <TextInput
                                    ref={ref=>this.address=ref}
                                    style={Styles.field}
                                    placeholder={'Số nhà, ngỏ, hẻm, đường'}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    spellCheck={false}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    value={this.state.address}
                                    onChangeText={(text)=>{this.setState({
                                        address: text
                                    })}}
                                />
                            </View>
                            <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                                <View style={NewUserFormStyles.selectPickerLabel}>
                                    <Text style={NewUserFormStyles.selectPickerLabelText}>Tỉnh/Thành phố</Text>
                                </View>
                                <View style={NewUserFormStyles.selectPickerField}>
                                    <WALocation level={1} placeholder={'Chọn tỉnh/thành phố'}/>
                                </View>
                            </View>
                            <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                                <View style={NewUserFormStyles.selectPickerLabel}>
                                    <Text style={NewUserFormStyles.selectPickerLabelText}>Quận/huyện</Text>
                                </View>
                                <View style={NewUserFormStyles.selectPickerField}>
                                    <WALocation placeholder={'Chọn quận/huyện'} level={2} />
                                </View>
                            </View>
                            <View style={[NewUserFormStyles.selectPickerWrapper, Styles.selectPickerWrapper]}>
                                <View style={NewUserFormStyles.selectPickerLabel}>
                                    <Text style={NewUserFormStyles.selectPickerLabelText}>Phường/xã</Text>
                                </View>
                                <View style={NewUserFormStyles.selectPickerField}>
                                    <WALocation placeholder={'Chọn phường/xã'} level={3} />
                                </View>
                            </View>
                        </View>
                }
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
}
export default connect(
    state => {
        return {
            account: state.account,
            location: state.location
        }
    },
    {
        loadLocationLv1,
        clearLocationData,
        setLv1,
        setLv2,
        setLv3
    }
)(MemberAddressEditorScreen);

const Styles = StyleSheet.create({
    saveButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    field: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        paddingLeft: 10,
        paddingRight: 10,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        borderRadius: 5
    },
    fieldSet: {
        marginBottom: 15
    },
    fieldLabel: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        marginBottom: 10
    },
    pageWrapper:{
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        backgroundColor: Colors.LIGHT
    },
    closeButton: {
        color: Colors.LIGHT
    },
    headerContainer: {
        backgroundColor: Colors.DARK
    },
    selectPickerWrapper: {
        marginBottom: 15
    },
});