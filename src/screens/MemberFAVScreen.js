import React, {Component, PureComponent} from 'react';
import {Alert, ImageBackground, StyleSheet, View, Text, ScrollView, StatusBar, TouchableOpacity, FlatList, Image} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import PageContainer from "../components/PageContainer";
import HomeSectionPageContainer from "../components/HomeSectionPageContainer";
import ImageSources from "../styles/ImageSources";
import WAStars from "../components/WAStars";
import Icon from 'react-native-vector-icons/FontAwesome';
import WAAlert from "../components/WAAlert";


export default class MemberFAVScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteAlert: false,
            editingSalon: false,
            editingGallery: false,
            salons: [
                {
                    id: 1,
                    name: 'Mister Barber Shop',
                    image: ImageSources.IMG_AVATAR_2,
                    address: 'Tầng 4 , số 300 Đê La Thành Nhỏ , Đống Đa, Hà Nội',
                    rating: 4.2,
                    ratingCount: 240
                },
                {
                    id: 2,
                    name: 'Mister Barber Shop',
                    image: ImageSources.IMG_AVATAR_2,
                    address: 'Tầng 4 , số 300 Đê La Thành Nhỏ , Đống Đa, Hà Nội',
                    rating: 4.5,
                    ratingCount: 240
                },
                {
                    id: 3,
                    name: 'Mister Barber Shop',
                    image: ImageSources.IMG_AVATAR_2,
                    address: 'Tầng 4 , số 300 Đê La Thành Nhỏ , Đống Đa, Hà Nội',
                    rating: 3.5,
                    ratingCount: 240
                },
                {
                    id: 4,
                    name: 'Mister Barber Shop',
                    image: ImageSources.IMG_AVATAR_2,
                    address: 'Tầng 4 , số 300 Đê La Thành Nhỏ , Đống Đa, Hà Nội',
                    rating: 2.5,
                    ratingCount: 240
                },
            ],
            galleries: [
                {
                    id: 1,
                    image: ImageSources.IMG_DEMO_GALLARY_1
                },
                {
                    id: 2,
                    image: ImageSources.IMG_DEMO_GALLARY_2
                },
                {
                    id: 3,
                    image: ImageSources.IMG_DEMO_GALLARY_2
                },
                {
                    id: 4,
                    image: ImageSources.IMG_DEMO_GALLARY_1
                },
            ],
        };
    }
    _renderItemSalon = ({item}) => {
        return <SalonItem
            navigation={this.props.route.navigation}
            onDelete={(item)=>{
            this.setState({
                deleteAlert: true
            })
        }}
          editing={this.state.editingSalon} data={item}/>
    };
    _renderItemGallery = ({item}) => {
        return <GalleryItem
            onDelete={(item)=>{
                this.setState({
                    deleteAlert: true
                })
            }}
            editing={this.state.editingGallery}
            data={item} />
    };
    _keyExtractorSalon = (item, index) => {
      return ''+item.id;
    };
    _keyExtractorGallery= (item, index) => {
        return ''+item.id;
    };
    render() {
        return (
            <HomeSectionPageContainer style={Styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle={'dark-content'}
                />
                <ScrollView>
                    <View style={[Styles.pageHeader]}>
                        <Text style={Styles.pageHeaderTitle}>Yêu thích</Text>
                        <Text style={Styles.pageHeaderDesc}>
                           Nơi lưu lại các salon và các tác phẩm{"\n"}bạn yêu thích
                        </Text>
                    </View>
                    <View style={Styles.listHeader}>
                        <View style={Styles.listHeaderLeft}>
                            <Text style={Styles.listHeaderText}>Salon</Text>
                        </View>
                        <View style={Styles.listHeaderRight}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        editingSalon: !this.state.editingSalon
                                    })
                                }}
                                hitSlop={{top: 20, bottom:20, right: 20, left: 20}}
                                >
                                <Text style={Styles.listHeaderButtonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.salons}
                        renderItem={this._renderItemSalon}
                        keyExtractor={this._keyExtractorSalon}
                        extraData={this.state}
                        style={Styles.items}
                    />
                    <View style={[Styles.listHeader, {borderBottomWidth: 0}]}>
                        <View style={Styles.listHeaderLeft}>
                            <Text style={Styles.listHeaderText}>Tác phẩm</Text>
                        </View>
                        <View style={Styles.listHeaderRight}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        editingGallery: !this.state.editingGallery
                                    })
                                }}
                                hitSlop={{top: 20, bottom:20, right: 20, left: 20}}
                            >
                                <Text style={Styles.listHeaderButtonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.galleries}
                        renderItem={this._renderItemGallery}
                        keyExtractor={this._keyExtractorGallery}
                        extraData={this.state}
                        style={[Styles.items, Styles.itemsGallery]}
                        numColumns={2}
                    />
                </ScrollView>
                <WAAlert
                    yes={()=>{this.setState({deleteAlert: false})}}
                    no={()=>{this.setState({deleteAlert: false})}}
                    title={'Xóa yêu thích'}
                    question={'Bạn muốn xóa yêu thích này khỏi danh sách yêu thích?'}
                    show={this.state.deleteAlert} />

            </HomeSectionPageContainer>
        );
    }
}

class GalleryItem extends PureComponent{
    render(){
        let item = this.props.data;
        return (
            <View style={Styles.gallery}>
            <TouchableOpacity>
                    <ImageBackground style={Styles.galleryCoverImage} source={item.image} />
            </TouchableOpacity>
                {
                    this.props.editing?
                        <TouchableOpacity
                            hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                            onPress={()=>{
                                this.props.onDelete(item);
                            }}
                            style={[Styles.salonButtonWrapper, Styles.salonButtonWrapperGallery]}>
                            <View style={[Styles.salonButton, Styles.salonButtonGallery]}>
                                <Icon style={Styles.salonButtonIcon} name={'minus'} />
                            </View>
                        </TouchableOpacity>
                        :undefined
                }
            </View>
        );
    }
}

class SalonItem extends PureComponent{
    render(){
        let item = this.props.data;
        return (
            <View style={Styles.salon}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate('home_salon')
                    }}
                    style={Styles.salonCover}>
                    <Image style={Styles.salonCoverImage} source={item.image} />
                </TouchableOpacity>
                <View style={Styles.salonInfo}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.navigate('home_salon')
                        }}
                        >
                        <Text style={Styles.salonName} numberOfLines={1} >{item.name}</Text>
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={Styles.salonAddress}>{item.address}</Text>
                    <View style={Styles.salonRating}>
                        <WAStars starInfo={item.ratingCount+' nhận xét & đánh giá'} rating={item.rating} />
                    </View>
                </View>
                {
                    this.props.editing?
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.onDelete(item);
                            }}
                            style={Styles.salonButtonWrapper}>
                            <View style={Styles.salonButton}>
                                <Icon style={Styles.salonButtonIcon} name={'minus'} />
                            </View>
                        </TouchableOpacity>
                    :undefined
                }
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        paddingRight: 0,
        paddingLeft: 30
    },
    pageHeaderTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10
    },
    pageHeaderDesc: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER,
        fontSize: 16
    },
    pageHeader: {

        marginTop: 30,
        marginBottom: 30,
        paddingRight: 30
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 30,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    listHeaderLeft: {
        flex: 1
    },
    listHeaderRight: {
        flex: 1,
        alignItems: 'flex-end'
    },
    listHeaderButtonText: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.PRIMARY,
        fontSize: 14,
    },
    listHeaderText: {
        fontSize: 25,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
        fontWeight: 'bold'
    },
    items: {
        marginBottom: 30
    },
    salon: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        paddingRight: 30
    },
    salonName: {
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK,
    },
    salonInfo: {
        flex: 1
    },
    salonAddress: {
        fontSize: 12,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
    },
    salonCover: {
        marginRight: 15
    },
    salonCoverImage: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    salonButtonWrapper: {
        justifyContent: 'center',
        paddingLeft: 15
    },
    salonButton: {
        height: 24,
        width: 24,
        borderColor: Colors.PRIMARY,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    salonButtonIcon: {
        color: Colors.PRIMARY,
    },
    itemsGallery: {
        paddingRight: 15
    },
    gallery:{
        flex: 1,
        marginRight: 15,
        marginTop: 15,
        position: 'relative'
    },
    galleryCoverImage: {
        flex: 1,
        height: 200,

    },
    salonButtonWrapperGallery: {
        position: 'absolute',
        right: -12,
        top: -12
    },
    salonButtonGallery: {
        backgroundColor: Colors.LIGHT
    }
});
