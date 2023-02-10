import React, {Component} from 'react';
import {
    FlatList,
    Image, ImageBackground,
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
import {Line, Path, Svg} from "react-native-svg";
import ImagePicker from 'react-native-image-crop-picker'
import ImageSources from "../styles/ImageSources";
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';
import numeral from 'numeral';
import WALoading from "../components/WALoading";


type Props = {};
class MemberEditSaleDetailScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            alertMessage: '',
            processing: false,
            editing: false,
            data: this.props.navigation.getParam('data'),
            afterSave: this.props.navigation.getParam('afterSave'),
            amount: 10000+'',
            percent: 1+'',
            type: 1
        }
    }

    _save = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/sales/'+this.state.data.id+'/create',
                    {
                        amount: this.state.amount,
                        percent: this.state.percent,
                        type:  this.state.type,
                    }
                );
                this.setState({
                    processing: false
                }, ()=>{
                    this.props.navigation.navigate('edit_sale');
                    this.state.afterSave();
                });
            }
            catch (e) {
                this.setState({
                    processing: false,
                    alert: true,
                    alertMessage: e.response.status === 422?Utils.getValidationMessage(e.response).replace(/■/g, ''):'Có lỗi xảy ra trong quá trình xử lý dữ liệu'
                });
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
                headerTitle={'KHUYẾM MÃI'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
                rightComponent={
                    (
                        <TouchableOpacity
                            hitSlop={Utils.defaultTouchSize}
                            onPress={()=>{
                                this._save();
                            }}
                        >
                            <Text style={Styles.saveButton}>Lưu</Text>
                        </TouchableOpacity>
                    )
                }
            >
            <View style={Styles.currentPriceWrapper}>
                <Text style={Styles.currentPriceTitle}>
                    {this.state.data.name}
                </Text>
                <Text style={Styles.currentPrice}>
                    {numeral(this.state.data.price_from).format('0,000')} VND
                    {
                        this.state.data.price_to !== this.state.data.price_from?
                          ' - '+numeral(this.state.data.price_to).format('0,000')+ 'VND'
                          :''
                    }
                </Text>
            </View>
                <View style={Styles.fieldSet}>
                    <View style={Styles.options}>
                        <TouchableOpacity style={Styles.option}
                            onPress={()=>{
                                this.setState({
                                    type: 1
                                })
                            }}
                        >
                            <Icon style={Styles.optionIcon} name={this.state.type === 1 ? 'radio-button-checked':'radio-button-unchecked'} />
                            <Text style={Styles.optionText}>Giảm theo số tiền</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={()=>{
                              this.setState({
                                  type: 2
                              })
                          }}
                          style={Styles.option}>
                            <Icon style={Styles.optionIcon} name={this.state.type === 2 ? 'radio-button-checked':'radio-button-unchecked'} />
                            <Text style={Styles.optionText}>Giảm theo phần trăm</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.type === 1?
                          <TextInput
                            style={Styles.field}
                            placeholder={'Nhập số tiền giảm'}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            spellCheck={false}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.amount+''}
                            onChangeText={
                                (text)=>{
                                    if(text < 0){
                                        text = 0
                                    }
                                    this.setState({
                                        amount: text * 1
                                    })
                                }
                            }
                            keyboardType={'numeric'}
                          />
                          :undefined
                    }
                    {
                        this.state.type === 2 ?
                          <TextInput
                            style={Styles.field}
                            placeholder={'Nhập % giảm'}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            spellCheck={false}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.percent+''}
                            onChangeText={
                                (text)=>{
                                    if(text > 100){
                                        text = 100;
                                    }
                                    if(text < 0){
                                        text = 0
                                    }
                                    this.setState({
                                        percent: text * 1
                                    })
                                }
                            }
                            keyboardType={'numeric'}
                          />
                          :undefined
                    }
                </View>
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
}
export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberEditSaleDetailScreen);
const Styles = StyleSheet.create({
    fieldSet: {
        padding: 15
    },
    options: {
      flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    optionIcon: {
        marginRight: 5,
        fontSize: 28,
        color: Colors.PRIMARY
    },
    optionText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.TEXT_DARK
    },
    fieldLabel: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        marginBottom: 10,
        textAlign: 'center'
    },
    field: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        paddingLeft: 10,
        paddingRight: 10,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 20,
        borderRadius: 5,
        textAlign: 'center',
        marginBottom: 15
    },
    currentPrice: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
        fontWeight: 'bold'
    },
    currentPriceWrapper: {
      alignItems: 'center',
        padding: 30,
        backgroundColor: Colors.SILVER_LIGHT
    },
    currentPriceTitle: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    pageWrapper: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
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
    block: {
        backgroundColor: Colors.LIGHT,
        padding: 20,
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
    },
    blockTitle: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        padding: 20
    },
    empty: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    emptyIcon: {
        fontSize: 40,
        color: Colors.SECONDARY
    },
    emptyText: {
        flex: 1,
        marginLeft: 10,
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    addButtonText: {
        flex: 1,
        marginLeft: 15,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    addButtonIcon: {
        color: Colors.SILVER,
        fontSize: 25,
    },
    items: {
        flex: 1,
        //marginTop: 15
    },
    itemImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 15
    },
    item: {
        backgroundColor: Colors.LIGHT,
        paddingLeft: 20
    },
    itemWrapper: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 20,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemName: {
        flex: 1,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    itemIcon: {
        color: Colors.PRIMARY,
        fontSize: 25,
    },
    itemPrice: {
        marginRight: 5,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
        fontWeight: 'bold'
    }
});