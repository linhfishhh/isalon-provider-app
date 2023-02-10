import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";

type Props = {};
export default class WelcomeScreen extends Component<Props> {
    render() {
        return (
            <PageContainer
                backgroundImage={ImageSources.BG_WELCOME}
                darkTheme={false}
                overlayColor={'rgba(0,0,0,0.5)'}
                contentWrapperStyle={GlobalStyles.pageWrapper}
            >
                <Image style={Styles.logo} source={ImageSources.LOGO_01} />
                <Text style={Styles.title}>
                    Chào mừng{"\n"}
                    đến với iSalon Manager{"\n"}
                </Text>
                <Text style={Styles.titleSmall}>
                    Ứng dụng quản lý{"\n"}
                    booking salon
                </Text>
                <WAButton onPress={()=>{this.props.navigation.replace('intro')}} text={"Khám phá ngay!"} />
            </PageContainer>
        )
    }
}

const Styles = StyleSheet.create({
    logo:{
        height: 100,
        width: 200,
        resizeMode: 'contain',
        marginBottom: 30
    },
    title: {
        color: Colors.LIGHT,
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: GlobalStyles.FONT_NAME
    },
    titleSmall: {
        fontSize: 25,
        fontWeight: 'normal',
        color: Colors.LIGHT,
        marginBottom: 50,
        fontFamily: GlobalStyles.FONT_NAME
    }
});