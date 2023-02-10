import React,  { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    StyleSheet, View
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from "../styles/Colors";
import Icon from 'react-native-vector-icons/MaterialIcons'
import GlobalStyles from "../styles/GlobalStyles";

type Props = {
    titleClick: PropTypes.func;
    title: PropTypes.string;
    number: PropTypes.number,
};
export default class WAPanel extends Component<Props> {
    static defaultProps = {
        title: 'Tiêu đề'
    };
    constructor(props) {
        super(props)
    };
    render() {
       return (
           <View style={[Styles.container, this.props.style]}>
               <TouchableOpacity
                   style={Styles.title}
                onPress={this.props.titleClick}
               >
                  <View style={Styles.titleTextWrapper}>
                      <Text style={Styles.titleText}>{this.props.title}
                      </Text>
                      {
                          this.props.number?
                              <Text style={Styles.titleNumber}>{this.props.number}</Text>:undefined
                      }
                  </View>
                   <Icon style={Styles.titleIcon} name={'keyboard-arrow-right'} />
               </TouchableOpacity>
               {this.props.children}
           </View>
       )
    };
}

const Styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LIGHT,
        borderRadius: 5,
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#fbfbfb',
        shadowOffset:{  width: 0,  height: 15,  },
        shadowColor: 'black',
        shadowOpacity: 0.025,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    titleTextWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleText: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 18,
        color: Colors.SILVER_DARK,
    },
    titleIcon: {
        color: Colors.SILVER_DARK,
        fontSize: 25
    },
    titleNumber: {
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 10,
        color: Colors.LIGHT,
        backgroundColor: Colors.PRIMARY,
        lineHeight: 16,
        width: 16,
        textAlign: 'center',
        marginLeft: 5,
        borderRadius: 8,
        overflow: 'hidden'
    }
});
