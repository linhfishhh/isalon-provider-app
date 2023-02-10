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
import {G, Line, Path, Rect, Svg, Text as SText} from "react-native-svg";
import ImagePicker from 'react-native-image-crop-picker'
import WAAlert from "../components/WAAlert";
import ImageSources from "../styles/ImageSources";


type Props = {};
export default class MemberPaymentScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            items: [
            ],
        }
    }

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                navigationButtonStyle={Styles.closeButton}
                headerTitle={'THANH TOÁN'}
                headerTitleColor={Colors.LIGHT}
                headerContainerStyle={Styles.headerContainer}
                layoutPadding={15}
            >
                <ScrollView style={{flex: 1}}>
                    <Text style={Styles.blockTitle}>TẤT TOÁN</Text>
                    <View style={Styles.block}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('bank')
                            }}
                            style={Styles.addButton}>
                            <Svg
                                width={38}
                                height={19}
                            >
                                <Rect x="0.5" y="0.5" width="35.18" height="17.62" rx="2.21" ry="2.21" fill="none" stroke="#d0d2d3" stroke-miterlimit="10"/>
                                <SText transform="translate(4.06 12.96)" fontSize="10" fontFamily="SVN-ProductSans, SVN-Product Sans">1 2 3 4
                                </SText>
                            </Svg>
                            <Text style={Styles.addButtonText}>Thông tin ngân hàng</Text>
                            <Icon style={Styles.addButtonIcon} name={'keyboard-arrow-right'} />
                        </TouchableOpacity>
                    </View>
                    <Text style={Styles.blockTitle}>PHƯƠNG THỨC THANH TOÁN</Text>
                    <View style={Styles.block}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('payment_method')
                            }}
                            style={Styles.addButton}>
                            <Svg
                                width={36}
                                height={27}
                            >
                                <G>
                                    <Rect x="0.38" y="0.38" width="35.18" height="25.95" rx="2.21" ry="2.21" fill="none" stroke="#d0d2d3" stroke-miterlimit="10" stroke-width="0.75"/>
                                    <Rect y="5.25" width="35.94" height="3.87" fill="#26aaa5"/>
                                    <Rect x="25.77" y="17.17" width="5.79" height="4.08" rx="1.02" ry="1.02" fill="#d0d2d3"/>
                                </G>
                                <Path d="M18.9,19.21H5.43a.27.27,0,0,1-.27-.27V17.88a.27.27,0,0,1,.27-.27H18.9a.27.27,0,0,1,.27.27v1.06A.27.27,0,0,1,18.9,19.21Z" fill="#d0d2d3"/>
                                <Path d="M13.06,21.13H5.34A.17.17,0,0,1,5.16,21V20.5a.17.17,0,0,1,.17-.17h7.72a.17.17,0,0,1,.17.17V21A.17.17,0,0,1,13.06,21.13Z" fill="#d0d2d3"/>
                            </Svg>
                            <Text style={Styles.addButtonText}>Quản lý phương thức thanh toán</Text>
                            <Icon style={Styles.addButtonIcon} name={'keyboard-arrow-right'} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </PageContainer>
        )
    }
}
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
        position: 'relative',
    },
    logo: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderRadius: 5
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
    },
    itemName: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
        marginTop: 10
    }
});