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
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {NavigationEvents} from "react-navigation";
import {DotIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import Utils from '../configs';
import WAAlert from "../components/WAAlert";

type Props = {};
class MemberMapScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            location: {
                latitude: 21.028511,
                longitude: 105.804817,
            },
            address: '',
            loaded: false,
            loading: true,
            alert: false,
            alertMessage: '',
            processing: false,
            editing: false
        }
    }

    _search = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let location = this.state.location;
                let rs = await Utils.getAxios().get(
                    'https://maps.googleapis.com/maps/api/place/autocomplete/json?' +
                    'key='+Utils.googleMapApiKey +
                    '&language=vi' +
                    '&types=geocode' +
                    '&components=country:vn'+
                    '&input='+this.state.address
                );
                if(rs.data.status === "OK"){
                   if(rs.data.predictions){
                       if(rs.data.predictions.length>0){
                           let data = rs.data.predictions[0];
                           let place_id = data.place_id;
                           let rq = await Utils.getAxios().get(
                               'https://maps.googleapis.com/maps/api/place/details/json?' +
                               'key='+Utils.googleMapApiKey +
                               '&placeid='+place_id +
                               '&language=vi' +
                               '&fields=geometry/location'
                           );
                           if(rq.data.status === 'OK'){
                               let _location = rq.data.result.geometry.location;
                               location = {
                                   latitude: _location.lat,
                                   longitude: _location.lng,
                               };
                           }
                       }
                   }
                }
                this.setState({
                    processing: false,
                    location: location
                }, ()=>{
                    this.mapview.animateToCoordinate(this.state.location);
                });
            }
            catch (e) {
                this.setState({
                    processing: false
                });
                console.log(e.response);
            }
        });
    };

    _save = () => {
        this.setState({
            processing: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).post(
                    'edit-salon/map',
                    this.state.location
                );
                this.setState({
                    processing: false
                }, ()=>{
                    this.props.navigation.goBack();
                })
            }
            catch (e) {
                this.setState({
                    processing: false
                })
            }
        });
    };

    _load = () => {
        this.setState({
            loading: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/map'
                );
                let data = rq.data;
                console.log(data);
                this.setState({
                    loading: false,
                    location: data
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

    _setLocation = (e)=>{
        if(this.state.editing){
            this.search.blur();
            return;
        }
        this.setState({
            location: e.nativeEvent.coordinate
        }, ()=>{
            this.mapview.animateToCoordinate(this.state.location);
        })
    };

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'Bản đồ vị trí'}
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
                <NavigationEvents
                    onDidFocus={payload => {
                        this.setState({ loaded: true })
                    }}
                />
                {
                    this.state.loading?
                        <View style={{flex: 1, backgroundColor: Colors.LIGHT}}>
                            <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
                        </View>
                        :
                        <View style={{flex: 1}}>
                            {
                                this.state.loaded?
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        ref={(ref) => { this.mapview = ref; }}
                                        initialRegion={{
                                            latitude: this.state.location.latitude,
                                            longitude: this.state.location.longitude,
                                            latitudeDelta: 0.0122,
                                            longitudeDelta: 0.0121,
                                        }}
                                        style={Styles.map}
                                        onPoiClick={this._setLocation}
                                        onPress={this._setLocation}
                                    >
                                        <Marker
                                            coordinate={this.state.location}
                                        />
                                    </MapView>
                                    :<View style={Styles.loading} />
                            }
                            <View style={Styles.searchBox}>
                                <TextInput
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    spellCheck={false}
                                    style={Styles.searchBoxInput}
                                    placeholder={'Nhập địa chỉ để tìm nhanh địa điểm'}
                                    value={this.state.address}
                                    onChangeText={text=>this.setState({address:text})}
                                    onSubmitEditing={this._search}
                                    onFocus={()=>{this.setState({editing: true})}}
                                    onBlur={()=>{this.setState({editing: false})}}
                                    ref={ref=>this.search=ref}
                                />
                                <TouchableOpacity
                                    hitSlop={Utils.defaultTouchSize}
                                    onPress={this._search}
                                    style={Styles.searchButton}>
                                    <Icon style={Styles.searchButtonIcon} name={'search'} />
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.note}>
                                <Text style={Styles.noteTitle}>Thay đổi vị trí</Text>
                                <Text style={Styles.noteTitleContent}>Chạm để thay đổi vị trí đánh dấu trên bản đổ</Text>
                            </View>
                        </View>
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
)(MemberMapScreen);

const Styles = StyleSheet.create({
    pageWrapper:{
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
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
    map: {
        flex: 1
    },
    searchBox: {
        position: 'absolute',
        zIndex: 1,
        left: 15,
        right: 15,
        top: 15,
        backgroundColor: Colors.LIGHT,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.SILVER_LIGHT,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    searchBoxInput: {
        height: 40,
        backgroundColor: Colors.LIGHT,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1
    },
    searchButton: {
        height: 40,
        backgroundColor: Colors.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    searchButtonIcon: {
        color: Colors.LIGHT,
        fontSize: 20,
    },
    note: {
        padding: 15
    },
    noteTitle: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
    },
    noteTitleContent: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
    },
    loading: {
        flex: 1,
        backgroundColor: Colors.SILVER_LIGHT
    }
});