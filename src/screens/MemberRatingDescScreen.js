import React, {Component} from "react";
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    RefreshControl,
    Dimensions,
    Modal, ImageBackground
} from "react-native";
import PageContainer from "../components/PageContainer";
import ImageSources from "../styles/ImageSources";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import WAButton from "../components/WAButton";
import AccessFormStyles from "../styles/AccessFormStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import WALoading from "../components/WALoading";
import NewUserFormStyles from "../styles/NewUserFormStyles";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import {getStatusBarHeight} from 'react-native-status-bar-height';
import WAAlert from "../components/WAAlert";
import CalendarStrip from "react-native-calendar-strip";
import {Path, Svg} from "react-native-svg";
import {DotIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import Utils from '../configs';
import numeral from 'numeral';

type Props = {
};
class MemberRatingDescScreen extends Component<Props> {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            url: this.props.navigation.getParam('url'),
            title: this.props.navigation.getParam('title'),
            amount: this.props.navigation.getParam('amount'),
            desc: ''
        }
    }

    _loadDesc = () => {
        this.setState({
            loading: true,
        }, async() => {
            try {
                let rq = await Utils.getAxios(this.props.account.token).get(this.state.url);
                this.setState({
                    loading: false,
                    desc: rq.data.desc
                });
            }
            catch (e) {
                this.setState({
                    loading: false
                });
                console.log(e.response);
            }
        })
    };

    componentDidMount(){
        this._loadDesc();
    }

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerTitle={this.state.title}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                navigationButtonStyle={{color: Colors.LIGHT}}
                headerTitleColor={Colors.LIGHT}

            >
                {
                    this.state.loading?
                        <DotIndicator size={10} color={Colors.PRIMARY} count={3} />
                        :
                        <ScrollView
                            style={Styles.content}
                        >
                            <Text style={Styles.title}>{this.state.title}</Text>
                            <Text style={Styles.bigTitle}>{this.state.amount}%</Text>
                            <Text style={Styles.contentText}>
                                {
                                    this.state.desc
                                }
                            </Text>
                        </ScrollView>
                }
            </PageContainer>
        );
    }
}

export default connect(
    state => {
        return {
            account: state.account
        }
    }
)(MemberRatingDescScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 30
    },
    title: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 15,
        color: Colors.SILVER_DARK,
        textAlign: 'center'
    },
    bigTitle: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 49,
        color: Colors.TEXT_DARK,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10
    },
    contentText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
        color: Colors.SILVER_DARK,
        textAlign: 'justify'
    }
});
