import React, {Component} from "react";
import {FlatList, ImageBackground, StyleSheet, Text, View} from "react-native";
import PageContainer from "../components/PageContainer";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";
import {connect} from 'react-redux';
import Utils from '../configs';
import {DotIndicator} from 'react-native-indicators';

type Props = {
};
class MemberBadgeScreen extends Component<Props> {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [
            ]
        }
    }
    _renderItem = ({item}) => {
        return (
            <View style={Styles.item}>
                <ImageBackground
                    source={item.cover?{uri: item.cover}:undefined}
                    style={Styles.coverWrapper}>
                </ImageBackground>
                {
                    item.number>0?
                        <Text style={Styles.itemNumber}>{item.number}</Text>:undefined
                }
                <Text style={Styles.itenTitle}>{item.title}</Text>
            </View>
        )
    };
    _keyExtractor = ({item}, index) => {
        return 'review-'+index;
    };

    _load = () => {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    let rq = await Utils.getAxios(this.props.account.token).get(
                        'rating-screen/badges'
                    );
                    console.log(rq.data);
                    this.setState({
                        loading: false,
                        items: rq.data
                    });
                }
                catch (e) {
                    this.setState({
                        loading: false
                    });
                    console.log(e.response);
                }
            }
        );
    };

    componentDidMount(){
      this._load();
    }

    render() {
        return (
            <PageContainer
                darkTheme={false}
                contentWrapperStyle={[Styles.pageWrapper]}
                navigation={this.props.navigation}
                backgroundColor={Colors.LIGHT}
                layoutPadding={20}
                headerContainerStyle={{backgroundColor: Colors.DARK}}
                navigationButtonStyle={{color: Colors.LIGHT}}
                headerTitle={'Lời khen của khách'}
                headerTitleColor={Colors.LIGHT}


            >
                {
                    this.state.loading?
                        <DotIndicator color={Colors.PRIMARY} size={10} count={3}/>
                        :
                        <FlatList
                            style={Styles.list}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                            data={this.state.items}
                            numColumns={3}
                        />

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
)(MemberBadgeScreen);

const Styles = StyleSheet.create({
    pageWrapper: {
        flex: 1,

    },
    list: {
        paddingTop: 50
    },
    item: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
        width: 70,
    },
    coverWrapper: {
        width: 70,
        height: 70,
        backgroundColor: Colors.SILVER_LIGHT,
        borderRadius: 35,
        marginBottom: 5,
        overflow: 'hidden'
    },
    itenTitle: {
        width: 80,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.TEXT_DARK
    },
    itemNumber: {
        position: 'absolute',
        right: 30,
        top: 0,
        fontSize: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.LIGHT,
        fontWeight: 'bold',
        backgroundColor: Colors.DARK,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        lineHeight: 20,
        overflow: 'hidden'
    }
});
