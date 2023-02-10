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
    ScrollView, RefreshControl, Modal, SectionList, ImageBackground
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
import ImagePicker from 'react-native-image-crop-picker';
import WAAlert from "../components/WAAlert";
import Utils from '../configs';
import {connect} from 'react-redux';



type Props = {};
class MemberEditShowcaseDetailScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            id:  this.props.navigation.getParam('data')?this.props.navigation.getParam('data')['id']:null,
            name: this.props.navigation.getParam('data')?this.props.navigation.getParam('data')['name']:'',
            gallery: this.props.navigation.getParam('data')?this.props.navigation.getParam('data')['items']:[],
            newItems: [],
            editMode: this.props.navigation.getParam('data')!==null,
            alert: false,
            alertMessage: '',
            processing: false,
            afterSave: this.props.navigation.getParam('afterSave')
        }
    }

    _add = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let form = new FormData();
                form.append('name', this.state.name);
                for (let index in this.state.newItems){
                    let image = this.state.newItems[index];
                    form.append('image['+index+']', {
                        uri: image.uri,
                        type: image.mime,
                        name: image.filename
                    });
                }
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/showcases/create',
                    form
                );
                //console.log(rq);
                this.setState({
                    processing: false
                }, ()=>{
                    this.state.afterSave();
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                this.setState({
                    processing: false,
                    alert: true,
                    alertMessage: e.response.status === 422?Utils.getValidationMessage(e.response).replace(/■ /g, ''):'Có lỗi xảy ra trong quá trình xử lý dữ liệu'
                });
                console.log(e.response)
            }
        });
    };

    _save = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let form = new FormData();
                form.append('name', this.state.name);
                for (let index in this.state.newItems){
                    let image = this.state.newItems[index];
                    form.append('image['+index+']', {
                        uri: image.uri,
                        type: image.mime,
                        name: image.filename
                    });
                }
                for (let index in this.state.gallery){
                    let item = this.state.gallery[index];
                    form.append('old_item['+index+']', item.id);
                }
                //console.log(form);
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/showcases/'+this.state.id+'/update',
                    form
                );
                //console.log(rq);
                this.setState({
                    processing: false
                }, ()=>{
                    this.state.afterSave();
                    this.props.navigation.goBack();
                });
            }
            catch (e) {
                this.setState({
                    processing: false,
                    alert: true,
                    alertMessage: e.response.status === 422?Utils.getValidationMessage(e.response).replace(/■ /g, ''):e.response.status===400?e.response.data.message:'Có lỗi xảy ra trong quá trình xử lý dữ liệu'
                });
                console.log(e.response)
            }
        });
    };

    _deleteOld = (id)=>{
        this.setState({
            gallery: this.state.gallery.filter((item) => {
                return item.id !== id;
            })
        });
    };

    _deleteNew = (index) => {
        this.setState({
            newItems: this.state.newItems.filter((item, iIndex) => {
                return iIndex !== index;
            })
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
                headerTitle={this.state.editMode?'Sửa album':'Thêm album'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
                rightComponent={
                    (
                        <TouchableOpacity
                            hitSlop={Utils.defaultTouchSize}
                            onPress={()=>{
                                if(this.state.editMode){
                                    this._save();
                                }
                                else{
                                    this._add();
                                }
                            }}
                        >
                            <Text style={Styles.saveButton}>Lưu</Text>
                        </TouchableOpacity>
                    )
                }
            >
                <ScrollView style={{flex: 1}}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios'?'padding':undefined}
                    >
                        <View style={Styles.block}>
                            <View style={Styles.fieldSet}>
                                <Text style={Styles.fieldLabel}>Tên album:</Text>
                                <TextInput
                                    style={Styles.field}
                                    placeholder={'Nhập tên album...'}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    spellCheck={false}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    value={this.state.name}
                                    onChangeText={(text)=>{this.setState({name: text})}}
                                />
                            </View>
                        </View>
                        <Text style={Styles.blockTitle}>DANH SÁCH ẢNH</Text>
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
                                                        newItems: this.state.newItems.concat(
                                                            {
                                                                uri: image.path, width: image.width, height: image.height, mime: image.mime,
                                                                filename: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
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
                                    this.state.gallery.map((item, index) => {
                                        return (
                                            <View
                                                key={'old-item-'+index}
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
                                                            this._deleteOld(item.id);
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
                                    this.state.newItems.map((item, index) => {
                                        return (
                                            <View
                                                key={'new-item-'+index}
                                                style={[
                                                    Styles.image,
                                                    (this.state.gallery.length + index)%2===0 && Styles.imageFirst
                                                ]}
                                            >
                                                <ImageBackground
                                                    style={Styles.imageBG}
                                                    source={item}
                                                >
                                                    <TouchableOpacity
                                                        hitSlop={Utils.defaultTouchSize}
                                                        onPress={()=>{
                                                            this._deleteNew(index);
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
                    </KeyboardAvoidingView>
                </ScrollView>
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
)(MemberEditShowcaseDetailScreen);

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