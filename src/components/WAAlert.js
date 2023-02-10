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
type Props = {
    show: boolean,
    title: string,
    question: string,
    yes: Function,
    no: Function,
    titleFirst: boolean,
    questionStyle: Object,
    modalStyle: Object,
    titleStyle: Object,
    yesTitle: string,
    noTitle: string
}
export default class WAAlert extends Component<Props> {
    static defaultProps = {
        show: false,
        title: '',
        question: '',
        titleFirst: false,
        yes: () => {},
        yesTitle: 'Đồng ý',
        noTitle: 'Không',
        no: () => {},
        questionStyle: {},
        titleStyle: {},
        modalStyle: {}
    };
    constructor(props) {
        super(props)
    };
    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={()=>{this.props.no()}}
                visible={this.props.show}
            >
                <StatusBar
                    translucent={true}
                    backgroundColor={'rgba(0, 0, 0, 0.82)'}
                    barStyle={'light-content'}
                />
                <View  style={[Styles.modal, this.props.modalStyle]}>
                    <View style={Styles.modalInner}>
                        {
                            this.props.titleFirst?
                                (
                                    <View>
                                        <Text style={[Styles.modalTitle, this.props.titleStyle]}>{this.props.title}</Text>
                                        <Text style={[Styles.modalQuestion, this.props.questionStyle]}>{this.props.question}</Text>
                                    </View>
                                ):
                                (
                                    <View>
                                        <Text style={[Styles.modalQuestion, this.props.questionStyle]}>{this.props.question}</Text>
                                        <Text style={[Styles.modalTitle, this.props.titleStyle]}>{this.props.title}</Text>
                                    </View>
                                )
                        }
                        <View style={Styles.modalButtons}>
                            {this.props.no?
                                <TouchableOpacity onPress={()=>{this.props.no()}} style={Styles.modalButton}>
                                    <Text style={Styles.modalButtonText}>{this.props.noTitle}</Text>
                                </TouchableOpacity>
                                :undefined
                            }
                            {
                                this.props.yes?
                                    <TouchableOpacity
                                        onPress={()=>{this.props.yes()}}
                                        style={[Styles.modalButton, Styles.modalButtonAgree]}>
                                        <Text style={[Styles.modalButtonText, Styles.modalButtonAgreeText]}>{this.props.yesTitle}</Text>
                                    </TouchableOpacity>
                                    :undefined
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
}

const Styles = StyleSheet.create({
    modal:{
        backgroundColor: 'rgba(0,0,0,0.82)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 30
    },
    modalInner:{
        backgroundColor: Colors.LIGHT,
        marginRight: 30,
        marginLeft: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 50,
        paddingBottom: 50,
        borderRadius: 5,
        width: '100%'
    },
    modalQuestion:{
        color: Colors.TEXT_DARK,
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: GlobalStyles.FONT_NAME
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: GlobalStyles.FONT_NAME
    },
    modalButtons: {
        flexDirection: 'row'
    },
    modalButton: {
        borderColor: Colors.SILVER,
        borderWidth: 1,
        borderRadius: 20,
        flex: 1,
        marginRight: 5,
        marginLeft: 5
    },
    modalButtonText: {
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 14,
        fontFamily: GlobalStyles.FONT_NAME
    },
    modalButtonAgree: {
        backgroundColor: Colors.PRIMARY,
        borderWidth: 0
    },
    modalButtonAgreeText: {
        color: Colors.LIGHT,
        fontFamily: GlobalStyles.FONT_NAME
    }
});
