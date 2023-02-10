import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";

type Props = {};
export default class AccessScreen extends Component<Props> {
    render() {
        return (
            <PageContainer
                backgroundImage={ImageSources.BG_ACCESS}
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, Styles.pageWrapper]}
            >
                <WAButton
                    text={"Đăng nhập"}
                    style={[Styles.button, Styles.buttonFacebook]}
                    textStyle={Styles.buttonFacebookText}
                />
                <WAButton
                    text={"Đăng ký tài khoản"}
                    style={[Styles.button, Styles.buttonLogin]}
                    onPress={()=>{this.props.navigation.push('register')}}
                />
                <Text style={Styles.tosText}>Click đăng ký nghĩa là bạn đồng ý với</Text>
                <TouchableOpacity style={Styles.tosLink} onPress={()=>{this.props.navigation.navigate('tos')}}>
                    <Text style={Styles.tosLinkText}>Các quy định sử dụng và chính sách bảo mật</Text>
                </TouchableOpacity>
            </PageContainer>
        )
    }
}

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center'
    },
    button: {
        marginTop: 15,
        marginBottom: 15
    },
    buttonFacebook: {
        backgroundColor: Colors.LIGHT
    },
    buttonFacebookText: {
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME
    },
    buttonFacebookIcon: {
        color: Colors.PRIMARY,
    },
    buttonLogin: {
        backgroundColor: Colors.GRAY,
    },
    link: {
        marginTop: 15,
        marginBottom: 15
    },
    linkText: {
        color: Colors.LIGHT,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    tosText: {
        marginTop: 50,
        fontSize: 14,
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME
    },
    tosLink: {

    },
    tosLinkText:{
        fontSize: 14,
        color: Colors.LIGHT,
        textDecorationLine: 'underline',
        fontFamily: GlobalStyles.FONT_NAME
    }
});