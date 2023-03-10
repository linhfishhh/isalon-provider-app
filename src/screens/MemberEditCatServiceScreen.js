import React, {Component} from 'react';
import {
    Dimensions,
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
import WAColorPicker from "../components/WAColorPicker";
import { toHsv, fromHsv } from 'react-native-color-picker'
import Slider from "react-native-slider";
import WALoading from "../components/WALoading";

type Props = {};
class MemberEditCatServiceScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.getParam('id'),
            editMode: this.props.navigation.getParam('id') !== null,
            cat_id: this.props.navigation.getParam('cat_id'),
            afterSave: this.props.navigation.getParam('afterSave'),
            loading: false,
            alert: false,
            alertMessage: '',
            processing: false,
            editing: false,
            colorPicker: false,
            colorPickerValue: toHsv('#f2f2f2'),
            textColorPicker: false,
            textColorPickerValue:  toHsv('#21232c'),
            logos: [],
            data: {
                name: '',
                color: '#f2f2f2',
                text_color: '#21232c',
                price: 100000,
                time_from: 30,
                time_to: 30,
                image: undefined,
                description: '',
                logos: []
            },
            coverPickerImage: undefined
        }
    }

    _load = () => {
        this.setState({
            loading: true
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/service/'+this.state.id
                );
                let data = rq.data;
                this.setState({
                    loading: false,
                    data: data,
                    colorPickerValue: data.color,
                    textColorPickerValue:  data.text_color
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
        if(this.state.editMode){
            this._load();
        }
        else{

        }
    }

    _getForm = () =>{
        let form = new FormData();
        for(let name in this.state.data){
            if(name !== 'image' && name !== 'logos' && name !== 'old_logos'){
                form.append(name, this.state.data[name]);
            }
        }
        if(this.state.coverPickerImage !== undefined){
            form.append('image', this.state.coverPickerImage);
        }
        this.state.data.logos.every((item, index) => {
            form.append('old_logos['+index+']', item.id);
            return item;
        });
        if(this.state.logos.length>0){
            this.state.logos.every((item, index) => {
                form.append('logos['+index+']', item);
                return item;
            });
        }
        return form;
    };

    _create = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let form = this._getForm();
                form.append('cat_id', this.state.cat_id);
                let rq = await Utils.getAxios(this.props.account.token
                    ,  {'Content-Type': 'multipart/form-data'}
                    ).post(
                    'edit-salon/service/create',
                    form
                );
                //console.log(rq);
                this.setState({
                    processing: false
                }, ()=>{
                    this.props.navigation.goBack();
                    this.state.afterSave();
                });
            }
            catch (e) {
                this.setState({
                    processing: false,
                    alert: true,
                    alertMessage: e.response.status === 422?Utils.getValidationMessage(e.response).replace(/???/g, ''):'C?? l???i x???y ra trong qu?? tr??nh l??u d??? li???u'
                });
                console.log(e.response);
            }
        })
    };

    _update = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let form = this._getForm();
                console.log(form);
                let rq = await Utils.getAxios(this.props.account.token
                    ,  {'Content-Type': 'multipart/form-data'}
                ).post(
                    'edit-salon/service/'+this.state.id+'/update',
                    form
                );

                this.setState({
                    processing: false
                }, ()=>{
                    this.props.navigation.goBack();
                    this.state.afterSave();
                });
            }
            catch (e) {
                console.log(e.response);
                this.setState({
                    processing: false,
                    alert: true,
                    alertMessage: e.response?e.response.status === 422?Utils.getValidationMessage(e.response).replace(/???/g, ''):'C?? l???i x???y ra trong qu?? tr??nh l??u d??? li???u':''
                });
                console.log(e.response);
            }
        })
    };

    _save = () => {
        if(this.state.editMode){
            console.log('update');
            this._update();
        }
        else{
            console.log('create');
            this._create();
        }
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={this.state.editMode?'S???A D???CH V???':'TH??M D???CH V???'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
                rightComponent={
                    (
                        !this.state.loading && !this.state.processing ?
                            <TouchableOpacity
                                hitSlop={Utils.defaultTouchSize}
                                onPress={()=>{
                                    this._save();
                                }}
                            >
                                <Text style={Styles.saveButton}>L??u</Text>
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
                            <View style={Styles.fieldSet}>
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
                                                coverPickerImage: {
                                                    uri: image.path,
                                                    type: image.mime,
                                                    name: image.filename?image.filename:image.path.substring(image.path.lastIndexOf('/')+1)
                                                }
                                            });
                                        });
                                    }}
                                    style={Styles.coverPicker}>
                                    <View
                                    >
                                        <ImageBackground
                                            source={
                                                this.state.coverPickerImage?
                                                    this.state.coverPickerImage
                                                    :
                                                    {
                                                        uri: this.state.data.image
                                                    }
                                            }
                                            style={Styles.coverPickerImage}
                                        />
                                    </View>
                                    <Text style={Styles.coverPickerNote}>???nh ?????i di???n c???a d???ch v???</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.fieldSet}>
                                <Text style={Styles.fieldLabel}>T??n d???ch v???:</Text>
                                <TextInput
                                    style={Styles.field}
                                    placeholder={'Nh???p t??n d???ch v???...'}
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
                                <Text style={Styles.fieldLabel}>Gi?? d???ch v???:</Text>
                                <TextInput
                                    style={Styles.field}
                                    placeholder={'Nh???p gi?? d???ch v???...'}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    spellCheck={false}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    value={this.state.data.price+''}
                                    onChangeText={(text)=>{this.setState({
                                        data: {
                                            ...this.state.data,
                                            price: text
                                        }
                                    })}}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <View style={Styles.fieldSet}>
                                <Text style={Styles.fieldLabel}>Th??i gian th???c hi???n t???i thi???u:</Text>
                                <View style={Styles.slider}>
                                    <Slider
                                        value={this.state.data.time_from}
                                        minimumValue={5}
                                        maximumValue={60*5}
                                        step={1}
                                        thumbTintColor={Colors.PRIMARY}
                                        minimumTrackTintColor={Colors.PRIMARY}
                                        style={Styles.sliderControl}
                                        onValueChange={value => this.setState({
                                            data: {
                                                ...this.state.data,
                                                time_from: value
                                            }
                                        })}
                                    />
                                    <Text style={Styles.sliderValue}>{this.state.data.time_from} ph??t</Text>
                                </View>
                            </View>
                            <View style={Styles.fieldSet}>
                                <Text style={Styles.fieldLabel}>Th??i gian th???c hi???n t???i ??a:</Text>
                                <View style={Styles.slider}>
                                    <Slider
                                        value={this.state.data.time_to}
                                        minimumValue={5}
                                        maximumValue={60*5}
                                        step={1}
                                        thumbTintColor={Colors.PRIMARY}
                                        minimumTrackTintColor={Colors.PRIMARY}
                                        style={Styles.sliderControl}
                                        onValueChange={value => this.setState({
                                            data: {
                                                ...this.state.data,
                                                time_to: value
                                            }
                                        })}
                                    />
                                    <Text style={Styles.sliderValue}>{this.state.data.time_to} ph??t</Text>
                                </View>
                            </View>
                            <View style={Styles.fieldSet}>
                                <Text style={Styles.fieldLabel}>M??u n???n t??n d???ch v???:</Text>
                                <TouchableOpacity
                                    onPress={()=>{this.setState({colorPicker: true})}}
                                    style={[Styles.colorPickerResult, {backgroundColor: this.state.data.color}]}/>
                            </View>
                            <View style={Styles.fieldSet}>
                                <Text style={Styles.fieldLabel}>M??u ch??? t??n d???ch v???:</Text>
                                <TouchableOpacity
                                    onPress={()=>{this.setState({textColorPicker: true})}}
                                    style={[Styles.colorPickerResult, {backgroundColor: this.state.data.text_color}]}/>
                            </View>
                            <View style={[Styles.fieldSet, Styles.fieldSetHtml]}>
                                <Text style={Styles.fieldLabel}>M?? t??? d???ch v???:</Text>
                                <TouchableOpacity
                                onPress={()=>{
                                    this.props.navigation.navigate('html_editor', {
                                        html: this.state.data.description,
                                        title: 'M?? T??? D???CH V???',
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
                                        <Text style={Styles.htmlEmptyText}>{this.state.data.description?'???? nh???p th??ng tin':'Ch??a c?? th??ng tin'}, nh???n v??o ????? th??m th??ng tin</Text>
                                    </View>
                            </TouchableOpacity>
                            </View>
                            <Text style={Styles.fieldLabel}>Th????ng hi???u s??? d???ng</Text>
                            <View style={[Styles.block, Styles.blockGallery]}>
                                <View style={Styles.addRow}>
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
                                                            logos: this.state.logos.concat(
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
                                    <Text style={[Styles.avatarLabel, Styles.galleryAddTitle]}>Th??m ???nh logo th????ng hi???u</Text>
                                </View>
                                <View style={Styles.gallery}>
                                    {
                                        this.state.data.logos.map((item, index) => {
                                            return (
                                                <View
                                                    key={'old-'+index}
                                                    style={[
                                                        Styles.logo,
                                                        index%2===0 && Styles.logoFirst
                                                    ]}
                                                >
                                                    <View style={Styles.logoImageWrapper}>
                                                        <Image style={Styles.logoImage} source={{uri: item.url}}/>
                                                    </View>
                                                    <TouchableOpacity
                                                        hitSlop={Utils.defaultTouchSize}
                                                        onPress={()=>{
                                                            this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    logos: this.state.data.logos.filter((iitem) => {
                                                                        return iitem.id !== item.id
                                                                    })
                                                                }
                                                            });
                                                        }}
                                                        style={Styles.logoRemove}>
                                                        <Icon style={Styles.logoRemoveIcon} name={'remove'}/>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    {
                                        this.state.logos.map((item, index) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={[
                                                        Styles.logo,
                                                        (this.state.data.logos.length + index)%2===0 && Styles.logoFirst
                                                    ]}
                                                >
                                                    <View style={Styles.logoImageWrapper}>
                                                        <Image style={Styles.logoImage} source={item}/>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={()=>{
                                                            this.setState({
                                                                logos: this.state.logos.filter((iitem, iindex)=>{
                                                                    return index !== iindex
                                                                })
                                                            });
                                                        }}
                                                        hitSlop={Utils.defaultTouchSize}
                                                        style={Styles.logoRemove}>
                                                        <Icon style={Styles.logoRemoveIcon} name={'remove'}/>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        </ScrollView>
                }
                <WAColorPicker color={this.state.colorPickerValue}
                               onColorChange={(color)=>{
                                   this.setState({
                                       colorPickerValue: color
                                   });
                               }}

                               onClose={()=>{this.setState({colorPicker: false})}} show={this.state.colorPicker} title={'Ch???n m??u n???n cho t??n d???ch v???'} onSelect={(color)=>{
                                this.setState({
                                    colorPicker: toHsv(color),
                                    data: {
                                        ...this.state.data,
                                        color: color,
                                    }
                                });
                }}/>
                <WAColorPicker color={this.state.textColorPickerValue}
                               onColorChange={(color)=>{
                                   this.setState({
                                       textColorPickerValue: color
                                   });
                               }}
                               onClose={()=>{this.setState({textColorPicker: false})}} show={this.state.textColorPicker} title={'Ch???n m??u ch??? cho t??n d???ch v???'} onSelect={(color)=>{
                        this.setState({
                            textColorPicker: toHsv(color),
                            data: {
                                ...this.state.data,
                                text_color: color,
                            }
                        });
                }}/>
                <WALoading show={this.state.processing}/>
                <WAAlert show={this.state.alert} yes={()=>{
                    this.setState({
                        alert: false
                    })
                }} no={false}
                         question={this.state.alertMessage}
                         titleFirst={true}
                         title={'L???i x???y ra'}
                         yesTitle={'???? hi???u'}
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
)(MemberEditCatServiceScreen);
const Styles = StyleSheet.create({
    htmlEmpty: {
        marginTop: 15,
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
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 50,
        marginBottom: 15
    },
    coverPickerNote: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    coverPicker: {
       flexDirection: 'row',
        alignItems: 'center',
    },
    coverPickerImage: {
        width: 80,
        height: 80,
        backgroundColor: Colors.SILVER_LIGHT,
        borderRadius: 40,
        marginRight: 15,
        overflow: 'hidden',
        resizeMode: 'contain'
    },
    slider: {
      flexDirection: 'row',
        alignItems: 'center'
    },
    sliderValue: {
      width: 70,
        textAlign: 'right',
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
    },
    sliderControl: {
      flex: 1,
        marginLeft: 5
    },
    colorPickerResult: {
      height: 42,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.SILVER
    },
    fieldSet: {
        marginTop: 15,
        marginBottom: 15
    },
    fieldSetHtml: {
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
    pageWrapper: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'flex-start',
    },
    closeButton: {
        color: Colors.LIGHT
    },
    saveButton: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
    },
    headerContainer: {
        backgroundColor: Colors.DARK
    },
    addRow: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 10
    },
    galleryAdd: {
        backgroundColor: Colors.SILVER_LIGHT,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    galleryAddTitle: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
    },
    blockGallery: {
        marginBottom: 30,
    },
    gallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    logo:{

        marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width/2 - 16 - 10,
        marginLeft: 10
    },
    logoImageWrapper: {
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        flex: 1,
        padding: 15
    },
    logoImage:{
        height: 80,
        resizeMode: 'contain',
    },
    logoFirst: {
        marginLeft: 0,
        marginRight: 10
    },
    logoRemove:{
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: Colors.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        right: 0,
        top: 0
    },
    logoRemoveIcon: {
        color: Colors.LIGHT
    }
});