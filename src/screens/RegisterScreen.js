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

type Props = {};
export default class RegisterScreen
    extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            pageTitle: 'Đăng ký',
            errorMessage: '',
            username: '',
            password: '',
            loading: false,
            editing: false
        }
    }
    validateForm() {
        let rs = true;
        this.setState({
            error: false,
            pageTitle: 'Đăng ký',
            errorMessage: '',
            loading: true,
        });
        setTimeout(() => {
            this.setState({loading: false});
            if (this.state.username.trim().length === 0 || this.state.password.trim().length === 0) {
                this.setState({
                    error: true,
                    errorMessage: 'Vui lòng nhập đầy đủ thông tin đăng ký',
                    pageTitle: 'Thiếu thông tin'
                });
                rs = false;
            }
            else{
                this.props.navigation.replace('verify_phone', {
                    action: (navigation) => {
                        navigation.replace('new_user_step_one');
                    }
                });
                rs = true;
            }
        }, 1000);
        return rs;
    }

    onSubmit = () => {
        this.refs.username.blur();
        this.refs.password.blur();
        this.validateForm();
    };
    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[GlobalStyles.pageWrapper, AccessFormStyles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={this.state.error?Colors.ERROR:Colors.DARK}
            >
                <Text key={1} style={[GlobalStyles.pageTitle, AccessFormStyles.pageTitle, Styles.pageTitle]}>
                    {this.state.pageTitle}
                </Text>
                <Text key={2} style={[AccessFormStyles.error]}>
                    {
                        this.state.error?
                            'Hãy thử lại hoặc nhấp vào quên mật khẩu để đặt lại mật khẩu !':
                            ''
                    }
                </Text>
                <View style={AccessFormStyles.form}>
                    <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon,
                        this.state.error && AccessFormStyles.textFieldError]}>
                        <View style={GlobalStyles.textFieldIconWrapper}>
                            <Icon style={[GlobalStyles.textFieldIcon,
                                this.state.error && AccessFormStyles.textFieldIconError]} name={'user'}/>
                        </View>
                        <TextInput
                            ref={'username'}
                            style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                            placeholder={'Số điện thoại'}
                            placeholderTextColor={this.state.error?Colors.LIGHT:Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.LIGHT}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            keyboardType={'numeric'}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            onChangeText={(text) => this.setState({username: text})}
                        />
                    </View>
                    <View style={[GlobalStyles.textField, GlobalStyles.textFieldHasIcon,
                        this.state.error && AccessFormStyles.textFieldError]}>
                        <View style={GlobalStyles.textFieldIconWrapper}>
                            <Icon style={[GlobalStyles.textFieldIcon,
                                this.state.error && AccessFormStyles.textFieldIconError]} name={'lock'}/>
                        </View>
                        <TextInput
                            ref={'password'}
                            style={[GlobalStyles.textFieldInput, AccessFormStyles.textFieldInput]}
                            placeholder={'Mật khẩu đăng nhập'}
                            placeholderTextColor={this.state.error?Colors.LIGHT:Colors.SILVER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            selectionColor={Colors.LIGHT}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            spellCheck={false}
                            secureTextEntry={true}
                            onFocus={()=>{this.setState({editing: true})}}
                            onBlur={()=>{this.setState({editing: false})}}
                            onChangeText={(text) => this.setState({password: text})}
                        />
                    </View>
                    <WAButton
                        text={"Đăng ký"}
                        style={[Styles.button, Styles.buttonLogin, this.state.error && AccessFormStyles.buttonError]}
                        textStyle={this.state.error && AccessFormStyles.buttonErrorText}
                        onPress={this.onSubmit}
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
        fontFamily: GlobalStyles.FONT_NAME
    },
    button: {
        marginTop: 50,
        marginBottom: 0,
    },
});
