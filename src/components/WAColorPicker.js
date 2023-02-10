import React,  { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    StyleSheet, StatusBar, Modal, View
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/FontAwesome'
import GlobalStyles from "../styles/GlobalStyles";
import { TriangleColorPicker } from 'react-native-color-picker'
import {getStatusBarHeight} from "react-native-status-bar-height";
type Props = {
    show: boolean,
    title: string,
    onSelect: Function,
    onClose: Function,
    style: Object,
    color: string,
    onColorChange: Function
}
export default class WAColorPicker extends Component<Props> {
    static defaultProps = {
        show: false,
        title: 'Chọn màu',
        onSelect: ()=>{},
        style: undefined,
        onClose: ()=>{},
        color: 'green',
        onColorChange: ()=>{}
    };
    constructor(props) {
        super(props)
    };
    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={this.props.onClose}
                visible={this.props.show}
            >
                <StatusBar
                    translucent={true}
                    backgroundColor={Colors.DARK}
                    barStyle={'light-content'}
                />
                <View style={[Styles.container, this.props.style]}>
                    <View style={Styles.header}>
                        <View style={Styles.headerLeft}>
                            <TouchableOpacity
                                onPress={this.props.onClose}
                                hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                            >
                                <Icon style={Styles.closeButton}
                                      name={"close"}/>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.headerRight}/>
                    </View>
                    <Text style={Styles.title}>{this.props.title}</Text>
                    <View style={Styles.wrapper}>
                        <TriangleColorPicker
                            onColorSelected={(color) => {
                                this.props.onSelect(color);
                                this.props.onClose();
                            }}
                            onColorChange={this.props.onColorChange}
                            color={this.props.color}
                            style={{flex: 1}}
                        />
                    </View>
                    <Text style={Styles.note}>
                        Chọn màu từ vòng xoay ngoài cùng và chỉnh đậm nhạt từ tam giác bên trong. Nhấn vào thanh màu kết quả dưới vòng tròn để xác nhận chọn màu
                    </Text>
                </View>
            </Modal>
        );
    };
}

const Styles = StyleSheet.create({
    header: {
        height: 50 + getStatusBarHeight(),
        paddingTop: getStatusBarHeight(),
        flexDirection: 'row',
    },
    closeButton: {
        color: Colors.PRIMARY,
        fontSize: 30
    },
    headerTitle: {
        flex: 2,
        paddingTop: 15,
        textAlign: 'center'
    },
    headerLeft: {
        flex: 1,
        paddingLeft: 30,
        paddingTop: 15
    },
    headerRight: {
        flex: 1
    },
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    wrapper: {
        padding: 30,
        flex: 1
    },
    note: {
        backgroundColor: Colors.ERROR,
        color: Colors.LIGHT,
        padding: 15,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14
    },
    title: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 16,
        color: Colors.LIGHT,
        padding: 15,
        textAlign: 'center'
    }
});
