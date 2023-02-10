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
import {Line, Svg} from "react-native-svg";
import ImagePicker from 'react-native-image-crop-picker'
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';
import WALoading from "../components/WALoading";


type Props = {};
class MemberEditStylistScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            editingItem: {
                name: '',
                image: undefined
            },
            alert: false,
            alertMessage: '',
            loading: true,
            processing: false
        }
    }

    componentDidMount(){
        this.setState({
            loading: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/stylists'
                );
                let items = rq.data;
                console.log(items);
                this.setState({
                    loading: false,
                    items: items
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
                console.log(e.response);
            }
        });
    }

    _save = () => {
        if (this.state.editingItem.name.trim().length === 0
            || this.state.editingItem.image === undefined
        ) {
            this.setState({
                alert: true,
                alertMessage: 'Vui lòng chọn ảnh và nhập tên cho stylist'
            });
            return false;
        }
        this.setState({
            processing: true
        }, async() => {
            let items = this.state.items;
            try {
                let form = new FormData();
                form.append('name', this.state.editingItem.name);
                form.append('image', this.state.editingItem.image);
                //items.push(this.state.editingItem);
                let rq = await Utils.getAxios(this.props.account.token,  {'Content-Type': 'multipart/form-data'}).post(
                    'edit-salon/stylists/create',
                    form
                );
                let data = rq.data;
                console.log(data);
                this.setState({
                    items: items.concat(data),
                    editingItem: {
                        name: '',
                        image: undefined
                    },
                    processing: false
                });
            }
            catch (e) {
                this.setState({
                    editingItem: {
                        name: '',
                        image: undefined
                    },
                    processing: false,
                    alert: true,
                    alertMessage: e.response.status === 422?Utils.getValidationMessage(e.response):'Có lỗi xảy ra trong quá trình lưu dữ liệu'
                });
                console.log(e.response);

            }
        });
    };

    _delete = (id) => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/stylists/'+id+'/remove'
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

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'Quản lý stylist'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
            >
                {
                    this.state.loading?
                        <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                            <DotIndicator color={Colors.PRIMARY} size={10} count={3} />
                        </View>
                        :
                        <ScrollView style={{flex: 1}}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
                            >
                                <Text style={Styles.blockTitle}>DANH SÁCH STYLIST</Text>
                                <View style={Styles.block}>
                                    <View style={Styles.stylists}>
                                        {
                                            this.state.items.length === 0 ?
                                                <View style={Styles.empty}>
                                                    <Icon style={Styles.emptyIcon} name={'supervisor-account'}/>
                                                    <Text style={Styles.emptyText}>
                                                        Chưa có stylist nào, vui lòng thêm stylist bên dưới
                                                    </Text>
                                                </View>
                                                : this.state.items.map((item, index) => {
                                                    return (
                                                        <View key={index} style={Styles.stylist}>
                                                            <Image
                                                                style={Styles.stylistAvatar}
                                                                source={{uri: item.image}}
                                                            />
                                                            <Text style={Styles.stylistName}>{item.name}</Text>
                                                            <TouchableOpacity
                                                                hitSlop={Utils.defaultTouchSize}
                                                                style={Styles.stylistRemove}
                                                                onPress={()=>{this._delete(item.id)}}
                                                            >
                                                                <Icon
                                                                    style={Styles.stylistRemoveIcon}
                                                                    name={'remove'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })
                                        }
                                    </View>
                                </View>
                                <Text style={Styles.blockTitle}>THÊM STYLIST</Text>
                                <View style={Styles.block}>
                                    <View style={Styles.addItem}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                ImagePicker.openPicker({
                                                    width: 400,
                                                    height: 400,
                                                    cropping: true,
                                                    mediaType: 'photo',
                                                    forceJpg: true
                                                }).then(image => {
                                                    this.setState({
                                                        editingItem: {
                                                            ...this.state.editingItem,
                                                            image: {
                                                                uri: image.path,
                                                                type: image.mime,
                                                                name: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
                                                            }
                                                        },
                                                    });
                                                });
                                            }}
                                            style={Styles.addItemButton}>
                                            {
                                                this.state.editingItem.image ?
                                                    <Image style={Styles.editingAvatar}
                                                           source={this.state.editingItem.image}
                                                    />
                                                    :
                                                    <View
                                                        style={Styles.addItemIcon}
                                                    >
                                                        <Svg
                                                            height={24}
                                                            width={24}
                                                        >
                                                            <Line x1="11.9" x2="11.9" y2="23.81" fill="none" stroke="#fff"/>
                                                            <Line x1="23.81" y1="11.9" y2="11.9" fill="none" stroke="#fff"/>
                                                        </Svg>
                                                    </View>
                                            }
                                        </TouchableOpacity>
                                        <TextInput
                                            style={Styles.stylistNameField}
                                            placeholder={'Tên stylist...'}
                                            underlineColorAndroid={Colors.TRANSPARENT}
                                            spellCheck={false}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            value={this.state.editingItem.name}
                                            onChangeText={Text => {
                                                this.setState({
                                                    editingItem: {
                                                        ...this.state.editingItem,
                                                        name: Text
                                                    }
                                                })
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                               this._save();
                                            }}
                                            style={[
                                                Styles.add
                                            ]}>
                                            <Text style={Styles.addText}>THÊM</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
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
    state=> {
        return {
            account: state.account
        }
    }
)(MemberEditStylistScreen);

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
        alignItems: 'center'
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
    addItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    addItemButton: {
        width: 60,
        height: 60,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 30
    },
    addItemIcon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    stylistNameField: {
        height: 40,
        borderColor: Colors.SILVER_LIGHT,
        borderWidth: 1,
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 3,
        overflow: 'hidden',
        paddingLeft: 10,
        paddingRight: 10
    },
    add: {
        backgroundColor: Colors.SECONDARY,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3
    },
    addText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    editingAvatar: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
        borderRadius: 30
    },
    stylist: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 12
    },
    stylistAvatar: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
        borderRadius: 30,
        marginRight: 15
    },
    stylistName: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        flex: 1,

    },
    stylistRemove: {
        height: 20,
        width: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.PRIMARY
    },
    stylistRemoveIcon: {
        color: Colors.LIGHT
    }

});