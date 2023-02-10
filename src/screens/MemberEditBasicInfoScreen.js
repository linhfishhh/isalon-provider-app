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
    Platform,
    KeyboardAvoidingView,
    Dimensions,
    ScrollView, RefreshControl, Modal, SectionList, ImageBackground
} from 'react-native';
import { WebView } from "react-native-webview";
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
import ImagePicker from 'react-native-image-crop-picker';
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';
import numeral from 'numeral';
import {updateInfo as updateAccountInfo} from "../redux/account/actions";

type Props = {};
class MemberEditBasicInfoScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            avatar: undefined,
            gallery: [],
            alert: false,
            alertMessage: '',
            loading: true,
            processing: false,
            data: {
                name: '',
                address: '',
                address_lv1: undefined,
                address_lv2: undefined,
                address_lv3: undefined,
                description: '',
                image: undefined,
                gallery: []
            },
            addressEditor: false
        }
    }

    _save = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let form = new FormData();
                form.append('name', this.state.data.name);
                form.append('address', this.state.data.address);
                form.append('address_lv1', this.state.data.address_lv1.id);
                form.append('address_lv2', this.state.data.address_lv2.id);
                form.append('address_lv3', this.state.data.address_lv3.id);
                form.append('description', this.state.data.description);

                if(this.state.avatar){
                    form.append('image', this.state.avatar);
                }
                this.state.data.gallery.every((item, index) => {
                    form.append('old_gallery['+index+']', item.id);
                    return item;
                });
                if(this.state.gallery){
                    this.state.gallery.every((item, index) => {
                        form.append('gallery['+index+']', item);
                        return item;
                    });
                }
                console.log(form);
                let rq = await Utils.getAxios(this.props.account.token
                    ,  {'Content-Type': 'multipart/form-data'}
                ).post(
                    'edit-salon/basic-info',
                    form
                );
                this.setState({
                    processing: false
                }, ()=>{
                    this.props.updateAccountInfo({
                        salon: {
                            ...this.props.account.salon,
                            name: rq.data.name,
                            avatar: rq.data.cover
                        }
                    });
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                this.setState({
                    processing: false,
                    alert: true,
                    alertMessage: e.response.status === 422?Utils.getValidationMessage(e.response).replace(/■/g, ''):'Có lỗi xảy ra trong quá trình lưu dữ liệu'
                });
                console.log(e.response);
            }
        })
    };

    _load = () =>{
        this.setState({
            loading: true
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/basic-info'
                );
                let data = rq.data;
                console.log(data);
                this.setState({
                    data: data,
                    loading: false
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
                console.log(e.response)
            }
        });
    };

    componentDidMount(){
        this._load();
    }

    _format_address = () => {
        let rs = '';
        if(this.state.data.address_lv1){
            rs = this.state.data.address_lv1.label + rs;
            if(this.state.data.address_lv2){
                rs = this.state.data.address_lv2.label + ', ' + rs;
            }
            if(this.state.data.address_lv3){
                rs = this.state.data.address_lv3.label + ', ' + rs;
            }
            if(this.state.data.address){
                rs = this.state.data.address + ', ' + rs;
            }
        }
        return rs;
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'Thông tin chung'}
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
                        <DotIndicator color={Colors.PRIMARY} size={10} count={3}/>
                        :
                        <ScrollView style={{flex: 1}}>
                                <View style={Styles.block}>
                                    <View style={Styles.fieldSet}>
                                        <Text style={Styles.fieldLabel}>Tên Salon:</Text>
                                        <TextInput
                                            style={Styles.field}
                                            placeholder={'Nhập tên salon...'}
                                            underlineColorAndroid={Colors.TRANSPARENT}
                                            spellCheck={false}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            value={this.state.data.name}
                                            onChangeText={(text)=>{this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    name: text
                                                }
                                            })}}
                                        />
                                    </View>
                                    <View style={Styles.fieldSet}>
                                        <Text style={Styles.fieldLabel}>Địa chỉ:</Text>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                this.props.navigation.navigate('address_editor', {
                                                    address_lv1: this.state.data.address_lv1,
                                                    address_lv2: this.state.data.address_lv2,
                                                    address_lv3: this.state.data.address_lv3,
                                                    address: this.state.data.address,
                                                    save: (address, lv1, lv2, lv3) => {
                                                        this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                address: address,
                                                                address_lv1: lv1,
                                                                address_lv2: lv2,
                                                                address_lv3: lv3
                                                            }
                                                        });
                                                    }
                                                });
                                            }}
                                            style={Styles.addressResult}>
                                            <Text
                                                numberOfLines={1}
                                                style={Styles.addressResultText}>
                                                {this._format_address()}
                                            </Text>
                                            <Icon style={Styles.addressResultIcon} name={'forward'}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/*<Text style={Styles.blockTitle}>GIỚI THIỆU SALON</Text>*/}
                                {/*<View style={Styles.block}>*/}
                                    {/*<View style={Styles.fieldSet}>*/}
                                        {/*<Text style={Styles.fieldLabel}>Thông tin salon:</Text>*/}
                                        {/*<TextInput*/}

                                            {/*style={Styles.fieldMul}*/}
                                            {/*placeholder={'Nhập thông tin giới thiệu về salon...'}*/}
                                            {/*underlineColorAndroid={Colors.TRANSPARENT}*/}
                                            {/*spellCheck={false}*/}
                                            {/*autoCapitalize={'none'}*/}
                                            {/*autoCorrect={false}*/}
                                            {/*multiline={true}*/}
                                        {/*/>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                                <Text style={Styles.blockTitle}>ẢNH ĐẠI DIỆN SALON</Text>
                                <View style={Styles.block}>
                                    <View style={Styles.row}>
                                        <View style={[Styles.avatarBlock]}>
                                            <View style={Styles.avatar}>
                                                <Image style={[Styles.avatarImage, Styles.avatarImageEditing]}
                                                       source={this.state.avatar?this.state.avatar:{uri: this.state.data.image}}/>
                                                <TouchableOpacity
                                                    onPress={()=>{
                                                        ImagePicker.openPicker({
                                                            width: 1024,
                                                            height: 768,
                                                            cropping: true,
                                                            mediaType: 'photo',
                                                            forceJpg: true
                                                        }).then(image => {
                                                            this.setState({
                                                                avatar: {
                                                                    uri: image.path,
                                                                    type: image.mime,
                                                                    name: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
                                                                },
                                                            });
                                                        });
                                                    }}
                                                    style={Styles.avatarOverlay} >
                                                    <Image style={Styles.avatarOverlayImage} source={ImageSources.IMG_AVATAR_OVERLAY} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text style={Styles.avatarLabel}>Cập nhật ảnh đại diện</Text>
                                    </View>
                                </View>
                                <Text style={Styles.blockTitle}>ẢNH GIỚI THIỆU SALON</Text>
                                <View style={[Styles.block, Styles.blockGallery]}>
                                    <View style={Styles.row}>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                ImagePicker.openPicker({
                                                    multiple: true,
                                                    mediaType: 'photo',
                                                    forceJpg: true
                                                }).then(async images => {
                                                    for(let index in images){
                                                        await ImagePicker.openCropper({
                                                            path: images[index].path,
                                                            width: 1024,
                                                            height: 768,
                                                            forceJpg: true
                                                        }).then(image => {
                                                            this.setState({
                                                                gallery: this.state.gallery.concat(
                                                                    {
                                                                        uri: image.path,
                                                                        type: image.mime,
                                                                        name: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
                                                                    }
                                                                ),
                                                            });
                                                        }).catch(e=>{});
                                                    }
                                                });
                                            }}
                                            style={Styles.galleryAdd}>
                                            <Svg
                                                width={40}
                                                height={40}
                                            >
                                                <Line x1="19.83" x2="19.83" y2="39.66" fill="none" stroke="#a6a8ab" />
                                                <Line x1="39.66" y1="19.83" y2="19.83" fill="none" stroke="#a6a8ab"/>
                                            </Svg>
                                        </TouchableOpacity>
                                        <Text style={[Styles.avatarLabel, Styles.galleryAddTitle]}>Thêm ảnh</Text>
                                    </View>
                                    <View style={Styles.gallery}>
                                        {
                                            this.state.data.gallery.map((item, index) => {
                                                return (
                                                    <View
                                                        key={'old-'+index}
                                                        style={[
                                                            Styles.image,
                                                            index%2===0 && Styles.imageFirst
                                                        ]}
                                                    >
                                                        <ImageBackground
                                                            style={Styles.imageBG}
                                                            source={{uri: item.image}}
                                                        >
                                                            <TouchableOpacity
                                                                hitSlop={Utils.defaultTouchSize}
                                                                onPress={()=>{
                                                                    this.setState({
                                                                        data: {
                                                                            ...this.state.data,
                                                                            gallery: this.state.data.gallery.filter((iitem) => {
                                                                                return iitem.id !== item.id
                                                                            })
                                                                        }
                                                                    });
                                                                }}
                                                                style={Styles.imageDelete}>
                                                                <Icon style={Styles.imageDeleteIcon} name={'remove'} />
                                                            </TouchableOpacity>
                                                        </ImageBackground>
                                                    </View>
                                                )
                                            })
                                        }
                                        {
                                            this.state.gallery.map((item, index) => {
                                                return (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            Styles.image,
                                                            (this.state.data.gallery.length + index)%2===0 && Styles.imageFirst
                                                        ]}
                                                    >
                                                        <ImageBackground
                                                            style={Styles.imageBG}
                                                            source={item}
                                                        >
                                                            <TouchableOpacity
                                                                hitSlop={Utils.defaultTouchSize}
                                                                onPress={()=>{
                                                                    this.setState({
                                                                        gallery: this.state.gallery.filter((iitem, iindex)=>{
                                                                            return index !== iindex
                                                                        })
                                                                    });
                                                                }}
                                                                style={Styles.imageDelete}>
                                                                <Icon style={Styles.imageDeleteIcon} name={'remove'} />
                                                            </TouchableOpacity>
                                                        </ImageBackground>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                                <Text style={Styles.blockTitle}>Thông tin về salon</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.props.navigation.navigate('html_editor', {
                                            html: this.state.data.description,
                                            title: 'MÔ TẢ SALON',
                                            save: (html)=>{
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        description: html
                                                    }
                                                }, ()=>{

                                                });
                                            }
                                        });
                                    }}
                                    style={Styles.htmlResultWrapper}>
                                    <View style={Styles.htmlEmpty}>
                                        <Icon style={Styles.htmlEmptyIcon} name={!this.state.data.description?'add-circle':'check-circle'}/>
                                        <Text style={Styles.htmlEmptyText}>{this.state.data.description?'Đã nhập thông tin':'Chưa có thông tin'}, nhấn vào để thêm thông tin</Text>
                                    </View>
                                </TouchableOpacity>
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
    },
    {
        updateAccountInfo
    }
)(MemberEditBasicInfoScreen);

const Styles = StyleSheet.create({
    htmlEmpty: {
        padding: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    htmlEmptyIcon: {
        fontSize: 40,
        marginRight: 15,
        color: Colors.SECONDARY
    },
    htmlEmptyText: {
        flex: 1,
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    htmlResultWrapper: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        backgroundColor: Colors.LIGHT
    },
    htmlResult: {
        width: Dimensions.get('window').width - 30
    },
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
    block: {
        backgroundColor: Colors.LIGHT,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SILVER_LIGHT,
    },
    fieldLabel: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        marginBottom: 10
    },
    addressResult: {
        height: 40,
        backgroundColor: Colors.SILVER_LIGHT,
        borderRadius: 2,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        flexDirection: 'row'
    },
    addressResultText: {
        lineHeight: 40,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        flex: 1
    },
    addressResultIcon: {
        height: 40,
        lineHeight: 40,
        fontSize: 20,
        marginLeft: 5,
        color: Colors.SILVER_DARK
    },
    field: {
        height: 40,
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        paddingLeft: 10,
        paddingRight: 10,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        borderRadius: 5
    },
    fieldMul: {
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        padding: 10,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        borderRadius: 5,
        height: 200,
        textAlignVertical: "top"
    },
    fieldSet: {
        marginBottom: 15
    },
    blockTitle: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        padding: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarBlock: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    avatar: {
        position: 'relative'
    },
    avatarImage: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 75
    },
    avatarImageEditing: {
        borderRadius: 0
    },
    avatarOverlay: {
        position: 'absolute',
    },
    avatarOverlayImage: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
    },
    avatarLabel: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        marginLeft: 15
    },
    galleryAdd: {
        flex: 1,
        backgroundColor: '#F1F1F2',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100
    },
    galleryAddTitle: {
        flex: 1,
    },
    blockGallery: {
        paddingTop: 30,
        paddingBottom: 30
    },
    gallery: {
      flexDirection: 'row',
      flexWrap: 'wrap',
        marginTop: 30
    },
    image: {
        height: 100,
        width: '50%',
        marginBottom: 20,
        paddingLeft: 10,
        position: 'relative'
    },
    imageFirst: {
      paddingRight: 10,
        paddingLeft: 0
    },
    imageBG: {
        flex: 1
    },
    imageDelete: {
        height: 20,
        width: 20,
        position: 'absolute',
        right: -10,
        top: -10,
        backgroundColor: Colors.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    imageDeleteIcon: {
        color: Colors.LIGHT,
        fontSize: 15
    }
});