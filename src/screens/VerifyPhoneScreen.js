import React, {Component} from 'react';
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from 'react-native-vector-icons/FontAwesome';
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";

type Props = {};
export default class VerifyPhoneScreen extends Component<Props> {
    defaultMessage = 'Hãy mở tin nhắc điện thoại và nhập 6 chữ được gửi trong tin nhắn';
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorMessage: this.defaultMessage,
            code: '',
            loading: false,
            editing: false
        }
    }
    validateForm() {
        let rs = true;
        this.setState({
            error: false,
            errorMessage: this.defaultMessage,
            loading: true,
        });
        setTimeout(() => {
            this.setState({loading: false});
            if(this.state.code.trim().length === 0){
                this.setState({
                    error: true,
                    errorMessage: 'Bạn chưa nhập mã xác nhận, nếu chưa nhận được vui lòng nhấn vào nút "Gửi xác minh lại"'
                });
                rs = false;
            }
            else{
                let action = this.props.navigation.getParam('action');
                if(this.props.navigation.getParam('action')){
                    action(this.props.navigation, this.props.navigation.goBack);
                }
            }
        }, 1000);
        return rs;
    }

    onSubmit = () => {
        this.refs.code.blur();
        this.validateForm();
    };
    onRetry = () => {
        this.refs.code.blur();
        this.setState({
            error: false,
            errorMessage: this.defaultMessage,
            loading: true,
        });
        setTimeout(() => {
            this.setState({loading: false});
            this.setState({
                errorMessage: this.defaultMessage,
            });
        }, 1000);
    };
    render() {
        return (
            <PageContainer
                darkTheme={true}
                contentWrapperStyle={[GlobalStyles.pageWrapper, NewUserFormStyles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
            >
                <Image  source={ImageSources.IMG_CHECK} style={Styles.headerImg}/>
                <Text style={[GlobalStyles.pageTitle, NewUserFormStyles.pageTitle, Styles.pageTitle]}>
                    Xác minh{"\n"}Tài khoản mới
                </Text>
                <Text style={Styles.msg}>Một tin nhắn đã gửi tới số</Text>
                <Text style={Styles.msgPhone}>0999999999</Text>
                <Text style={[Styles.msgNote, this.state.error && Styles.msgNoteError]}>{this.state.errorMessage}</Text>
                <View>
                    <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon, Styles.codeField]}>
                        <View style={GlobalStyles.textFieldIconWrapper}>
                            <Icon style={[GlobalStyles.textFieldIcon]} name={'lock'}/>
                        </View>
                        <TextInput
                            ref={'code'}
                            style={[GlobalStyles.textFieldInput]}
                            placeholder={'Mã xác nhận'}
                            placeholderTextColor={Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.PRIMARY}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            keyboardType={'numeric'}
                            returnKeyType={'done'}
                            returnKeyLabel={'Xong'}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            onChangeText={(text) => this.setState({code: text})}
                        />
                    </View>
                    <WAButton
                        text={"Xác minh"}
                        style={[Styles.button]}
                        iconLeft={false}
                        onPress={this.onSubmit}
                    />
                    <WAButton
                        text={"Gửi xác minh lại"}
                        style={[Styles.button, Styles.buttonRetry]}
                        textStyle={Styles.buttonRetryText}
                        iconLeft={false}
                        onPress={this.onRetry}
                    />
                </View>
                <WALoading show={this.state.loading}/>
            </PageContainer>
        )
    }
}

const Styles = StyleSheet.create({
    pageWrapper: {
        alignItems: 'center',
    },
    pageTitle: {
        marginBottom: 15
    },
    button: {
        marginTop: 15,
        marginBottom: 0,
    },
    headerImg: {
        marginBottom: 15
    },
    msg: {
        fontSize: 15,
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    },
    msgPhone: {
        fontSize: 15,
        color: Colors.PRIMARY,
        marginBottom: 5,
        fontFamily: GlobalStyles.FONT_NAME
    },
    msgNote: {
        fontSize: 15,
        color: Colors.SILVER,
        marginBottom: 15,
        fontFamily: GlobalStyles.FONT_NAME
    },
    msgNoteError: {
        color: Colors.ERROR,
        fontFamily: GlobalStyles.FONT_NAME
    },
    codeField: {
        marginBottom: 30
    },
    buttonRetry: {
        backgroundColor: Colors.LIGHT,
        borderColor: Colors.TEXT_DARK,
        borderWidth: 1,
    },
    buttonRetryText: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME
    }
});