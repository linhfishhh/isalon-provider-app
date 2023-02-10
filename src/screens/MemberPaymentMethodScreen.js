import React, {Component} from 'react';
import {
    FlatList,
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
class MemberPaymentMethodScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: [

            ],
            selected: [
            ]
        }
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={[Styles.itemWrapper]}>
                <TouchableOpacity
                    onPress={()=>{
                        let newState = this.state.selected;
                        let pos = newState.indexOf(item.id);
                        if (pos> -1){
                            newState = newState.filter((item, index)=>{
                                return pos !== index;
                            });
                        }
                        else{
                            newState.push(item.id)
                        }
                        this.setState({
                            selected: newState
                        })
                    }}
                    style={[Styles.item, index===0 && Styles.itemFirst]}>
                    <Icon style={Styles.itemCheck} name={
                        this.state.selected.indexOf(item.id) === -1?
                            'check-box-outline-blank':
                            'check-box'
                    } />
                    <Text style={Styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    };
    _keyExtractor = (item, index) => {
        return 'mehthod-'+index;
    };

    _load = () => {
        this.setState({
            loading: true
        }, async ()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/payment-supports'
                );
                console.log(rq.data);
                this.setState({
                    loading: false,
                    items: rq.data.all,
                    selected: rq.data.active
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
        if(this.state.loading){
            return;
        }
        this.setState({
            loading: true
        }, async ()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/payment-supports',
                    {
                        methods: this.state.selected
                    }
                );
                console.log(rq.data);
                this.setState({
                    loading: false,
                }, ()=>{
                    this.props.navigation.goBack();
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
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'PHƯƠNG THỨC'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
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
                        <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                            <DotIndicator color={Colors.PRIMARY} size={10} count={3}/>
                        </View>
                        :
                        <FlatList

                            style={Styles.list}
                            renderItem={this._renderItem}
                            data={this.state.items}
                            keyExtractor={this._keyExtractor}
                            ListHeaderComponent={
                                <Text style={Styles.blockTitle}>CÁC PHƯƠNG THỨC HỖ TRỢ</Text>
                            }
                        />
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
)(MemberPaymentMethodScreen);
const Styles = StyleSheet.create({
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
    list: {
        flex: 1
    },
    itemWrapper: {
        backgroundColor: Colors.LIGHT,
        paddingLeft: 20
    },
    item: {
        paddingTop: 20,
        paddingBottom: 20,
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemCheck: {
        marginRight: 10,
        fontSize: 20,
        color: Colors.SECONDARY,
    },
    itemTitle: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    }
});