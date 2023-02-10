import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity, ImageBackground
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import  Swiper from 'react-native-swiper';

type Props = {};
export default class IntroScreen extends Component<Props> {
    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle={'light-content'}
                />
                <Swiper style={Styles.swiper}
                        loop={false}
                        dotStyle={Styles.dotStyle}
                        dotColor={Colors.SILVER}
                        activeDotColor={Colors.LIGHT}
                        activeDotStyle={Styles.dotStyle}
                >
                    <ImageBackground
                        source={require('../assets/images/intro01.png')}
                        style={Styles.background}
                    >
                        <Text style={Styles.text}>
                            <Text style={Styles.textBold}>Kinh doanh</Text>{"\n"}
                            cùng ứng dụng iSalon
                        </Text>
                    </ImageBackground>
                    <ImageBackground
                        source={require('../assets/images/intro02.png')}
                        style={Styles.background}
                    >
                        <Text style={Styles.text}>
                            Quản lý{"\n"}
                            <Text style={Styles.textBold}>dễ dàng</Text>
                        </Text>
                    </ImageBackground>
                    <ImageBackground
                        source={require('../assets/images/intro03.png')}
                        style={Styles.background}
                    >
                        <Text style={Styles.text}>
                            Tiết kiệm{"\n"}
                            <Text style={Styles.textBold}>thời gian</Text>
                        </Text>
                        <WAButton onPress={()=>{this.props.navigation.replace('login')}} text={"Sử dụng ngay!"} style={Styles.button} />
                    </ImageBackground>
                </Swiper>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        flex: 1,
        backgroundColor: 'black'
    },
    swiper: {

    },
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dotStyle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        marginLeft: 7,
        marginRight: 7
    },
    text: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 28,
        color: Colors.LIGHT,
        textAlign: 'center'
    },
    textBold: {
        fontSize: 34,
        fontWeight: 'bold'
    },
    button: {
        width: '60%',
        marginTop: 30
    }
});