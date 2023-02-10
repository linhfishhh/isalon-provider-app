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
import {Line, Path, Svg} from "react-native-svg";
import ImagePicker from 'react-native-image-crop-picker'
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';
import WALoading from "../components/WALoading";


type Props = {};
class MemberEditBrandScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            alert: false,
            alertMessage: '',
            loading: true,
            processing: false
        }
    }

    _load = () => {
        this.setState({
            loading: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/brands'
                );
                console.log(rq.data);
                this.setState({
                    loading: false,
                    items: rq.data
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

    _add = (items) => {
        this.setState({
            processing: true
        }, async()=>{
            let newItems = this.state.items;
            try {
                let form = new FormData();
                for(let index in items){
                    form.append('logo['+index+']', items[index]);
                }
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/brands/create',
                    form
                );
                console.log(rq.data);
                this.setState({
                    processing: false,
                    items: newItems.concat(rq.data)
                });
            }
            catch (e) {
                this.setState({
                    processing: false
                });
                console.log(e.response)
            }
        });
    };

    _delete = (id) => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/brands/'+id+'/remove'
                );
                console.log(rq.data);
                this.setState({
                    processing: false,
                    items: this.state.items.filter((item) => {
                        return item.id !== id
                    })
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
                headerTitle={'Quản lý logo'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
            >
                {
                    this.state.loading?
                        <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                            <DotIndicator size={10} color={Colors.PRIMARY} count={3}/>
                        </View>
                        :
                        <ScrollView style={{flex: 1}}>
                            <Text style={Styles.blockTitle}>THÊM THƯƠNG HIỆU</Text>
                            <View style={Styles.block}>
                                <TouchableOpacity
                                    onPress={() => {
                                        ImagePicker.openPicker({
                                            multiple: true,
                                            mediaType: 'photo',
                                            forceJpg: true
                                        }).then(async images => {
                                            let ls = [];
                                            for(let index in images){
                                                await ImagePicker.openCropper({
                                                    path: images[index].path,
                                                    width: 400,
                                                    height: 400,
                                                    forceJpg: true
                                                }).then(image => {
                                                    ls.push({
                                                        uri: image.path,
                                                        type: image.mime,
                                                        name: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
                                                    });
                                                }).catch(e=>{});
                                            }
                                            this._add(ls);
                                        });
                                    }}
                                    style={Styles.addButton}>
                                    <Svg
                                        width={28}
                                        height={22}
                                    >
                                        <Path d="M24.28,21.69H3.17A3.18,3.18,0,0,1,0,18.52V5.65A3.18,3.18,0,0,1,3.17,2.48H7.48l.38-1.27A1.56,1.56,0,0,1,9.39,0h8.66A1.6,1.6,0,0,1,19.6,1.21v0L20,2.48h4.33a3.18,3.18,0,0,1,3.17,3.17V18.52a3.18,3.18,0,0,1-3.17,3.17ZM3.17,3.54A2.12,2.12,0,0,0,1.06,5.65V18.52a2.12,2.12,0,0,0,2.12,2.12H24.28a2.12,2.12,0,0,0,2.11-2.12V5.65a2.12,2.12,0,0,0-2.11-2.11H19.15l-.58-2.06a.53.53,0,0,0-.52-.41H9.39a.52.52,0,0,0-.52.41L8.27,3.54Zm10.55,15a6.71,6.71,0,1,1,6.71-6.71,6.72,6.72,0,0,1-6.71,6.71Zm0-12.36a5.65,5.65,0,1,0,5.65,5.65,5.66,5.66,0,0,0-5.65-5.65ZM23.6,5.5a1,1,0,1,0,1,1,1,1,0,0,0-1-1Zm0,0" fill="#16a6ae"/>
                                    </Svg>
                                    <Text style={Styles.addButtonText}>Chọn logo thương hiệu</Text>
                                    <Icon style={Styles.addButtonIcon} name={'keyboard-arrow-right'} />
                                </TouchableOpacity>
                            </View>
                            <Text style={Styles.blockTitle}>DANH SÁCH THƯƠNG HIỆU</Text>
                            <View style={Styles.block}>
                                <View style={Styles.items}>
                                    {
                                        this.state.items.length === 0 ?
                                            <View style={Styles.empty}>
                                                <Icon style={Styles.emptyIcon} name={'star'}/>
                                                <Text style={Styles.emptyText}>
                                                    Chưa có thương hiệu nào, thêm thương hiệu bằng cách nhấn nút "chọn logo thương hiệu" bên trên.
                                                </Text>
                                            </View>
                                            :
                                            this.state.items.map((item, index) => {
                                                return (
                                                    <View key={index} style={Styles.item}>
                                                        <Image
                                                            source={{uri: item.logo}}
                                                            style={Styles.logo}
                                                        />
                                                        <TouchableOpacity
                                                            hitSlop={Utils.defaultTouchSize}
                                                            onPress={()=>{this._delete(item.id)}}
                                                            style={Styles.remove}
                                                        >
                                                            <Icon
                                                                style={Styles.removeIcon}
                                                                name={'remove'} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                    }
                                </View>
                            </View>
                        </ScrollView>
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
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberEditBrandScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
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
      flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
        marginBottom: 15
    },
    item: {
        width: '50%',
        padding: 10,
        position: 'relative'
    },
    logo: {
        width: '100%',
        height: 100,
        resizeMode: 'cover'
    },
    remove: {
        position: 'absolute',
        right: 0,
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10
    },
    removeIcon: {
        color: Colors.LIGHT,
        fontSize: 20
    }
});