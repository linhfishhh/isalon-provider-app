import React,  { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    StatusBar
} from 'react-native';

import {
    DotIndicator,
} from 'react-native-indicators';

import Styles from '../styles/GlobalStyles';
import PropTypes from 'prop-types';
import ColorStyles from "../styles/Colors";
type Props = {
    show: boolean,
    onRequestClose: Function,
    style: Object,
    statusBarStyle: Object
}
export default class WALoading extends Component<Props> {
    static defaultProps = {
        show: false,
        onRequestClose: () => {},
        style: undefined,
        statusBarStyle: 'light-content'
    };
    constructor(props) {
        super(props)
    };
    render() {
        if(this.props.show){
            return (
                <Modal
                    style={localStyles.modal}
                    transparent={true}
                    onRequestClose={this.props.onRequestClose}
                >
                    <StatusBar
                        backgroundColor = 'rgba(33,35,44, 0.95)'
                        barStyle={this.props.statusBarStyle}
                    />
                    <View style={[localStyles.container, this.props.style]} >
                        <DotIndicator size={15} count={3} color={ColorStyles.PRIMARY}/>
                    </View>
                </Modal>
            );
        }
        else{
            return null;
        }
    };
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(33,35,44, 0.95)',
    },
});
