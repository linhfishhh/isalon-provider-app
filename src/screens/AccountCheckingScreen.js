import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {loginWithOldToken} from '../redux/account/actions';

type Props = {};

class AccountCheckingScreen extends Component<Props> {

    componentDidMount() {
        this.props.loginWithOldToken();
    }

    componentDidUpdate() {
        if (this.props.account.startupRoute !== undefined) {
            this.props.navigation.replace(this.props.account.startupRoute);
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}
            >
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle={'light-content'}
                />
                {
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                        <Image style={{
                            width: Dimensions.get('window').width,
                            resizeMode: 'contain'
                        }}  source={require('../assets/images/ISALON-03.png')}/>
                    </View>
                }
            </View>
        )
    }
}

const Styles = StyleSheet.create({});

export default connect(
    state => {
        return {
            account: state.account
        }
    },
    {
        loginWithOldToken
    }
)(AccountCheckingScreen)