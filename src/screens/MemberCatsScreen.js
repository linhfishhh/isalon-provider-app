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


type Props = {};
class MemberCatsScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                // {
                //     name: 'Cắt tóc nam',
                //     count: 2,
                //     image: ImageSources.IMG_SERVICE_CAT_1,
                // },
            ],
            loading: true,
        }
    }

    _load = () => {
        this.setState({
            loading: true
        }, async()=>{
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(
                    'edit-salon/service-cats'
                );
                let items = rq.data;
                console.log(rq);
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
    };

    componentDidMount(){
        this._load();
    }

    _changeCount = (id, amount) => {
        this.setState({
            items: this.state.items.map((item)=>{
                if(id === item.id){
                    return {
                        ...item,
                        count: item.count + amount
                    };
                }
                return item;
            })
        });
    };

    _renderItem = ({item, index}) => {
        return (
            <View style={Styles.item}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate('edit_cat', {
                            id: item.id,
                            name: item.name,
                            changeCount: this._changeCount
                        });
                    }}
                    style={Styles.itemWrapper}>
                    <Image
                        style={Styles.itemImage}
                        source={{uri: item.image}}
                    />
                    <View style={Styles.itemInfo}>
                        <Text style={Styles.itemName}>{item.name}</Text>
                        <Text style={Styles.itemCount}>{item.count} dịch vụ</Text>
                    </View>
                    <Icon style={Styles.itemIcon} name={'keyboard-arrow-right'} />
                </TouchableOpacity>
            </View>
        )
    };
    _keyExtractor = (item, index) => {
        return 'item-'+index
    };
    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'QUẢN LÝ DỊCH VỤ'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
            >
                {
                    this.state.loading?
                        <DotIndicator size={10} color={Colors.PRIMARY} count={3}/>
                        :
                        <View style={{flex: 1}}>
                            <FlatList
                                style={Styles.items}
                                renderItem={this._renderItem}
                                keyExtractor={this._keyExtractor}
                                data={this.state.items}
                            />
                            <View style={Styles.note}>
                                <Icon style={Styles.noteIcon} name={'info'}/>
                                <Text style={Styles.noteText}>Chọn một danh mục dịch vụ để quản lý các dịch vụ</Text>
                            </View>
                        </View>
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
)(MemberCatsScreen);

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
    items: {
        flex: 1,
        backgroundColor: Colors.LIGHT,
        paddingLeft: 20
    },
    item: {
        borderTopColor: Colors.SILVER_LIGHT,
        borderTopWidth: 1
    },
    itemWrapper: {
      flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15
    },
    itemImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 10
    },
    itemInfo: {
        flex: 1
    },
    itemIcon: {
        color: Colors.SILVER_LIGHT,
        fontSize: 30,
    },
    itemName: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        marginBottom: 5
    },
    itemCount: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
    },
    note: {
        backgroundColor: Colors.SECONDARY,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    noteIcon: {
        fontSize: 20,
        color: Colors.LIGHT,
        marginRight: 10
    },
    noteText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        flex: 1,
        marginRight: 15
    }
});