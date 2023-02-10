import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../styles/Colors";

export default class WAStars extends PureComponent<Props> {
    static defaultProps = {
        style: undefined,
        starStyle: undefined,
        starListStyle: undefined,
        starInfoStyle: undefined,
        starInfoTextStyle: undefined,
        starInfo: '',
        rating: 0.0,
        set: '',
        starImageStyle: undefined
    };
    constructor(props) {
        super(props)
    };
    render() {
        let $score = this.props.rating;
        $score = $score<0?0:$score;
        $score = $score>5?5:$score;
        let $stars = [

        ];
        let $round = Math.floor($score);
        let $remain = $score - $round;
        let $half = $remain >= 0.5 ? 1: 0;

        for (let $i = 1; $i<=$round; $i++) {
            //full
            if(this.props.set === ''){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starf.png')} />
                );
            }
            else if(this.props.set === '2'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starf2.png')} />
                );
            }
            else if(this.props.set === '3'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starf3.png')} />
                );
            }
        }
        if($half){
            //haft
            if(this.props.set === ''){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starh.png')} />
                );
            }
            else if(this.props.set === '2'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starh2.png')} />
                );
            }
            else if(this.props.set === '3'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/starh3.png')} />
                );
            }

        }
        let $missing = 5 - ($round + $half);
        for (let $i = 1; $i<=$missing; $i++) {
            //no
            if(this.props.set === ''){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/stare.png')} />
                );
            }
            else if(this.props.set === '2'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/stare2.png')} />
                );
            }
            else if(this.props.set === '3'){
                $stars.push(
                    <Image style={this.props.starImageStyle} source={require('../assets/images/stare3.png')} />
                );
            }
        }
        return (
            <View style={[Styles.container, this.props.style]}>
                <View style={[Styles.starListStyle, this.props.starListStyle]}>
                    {
                        $stars.map((item, index)=>{
                            return (
                                <View key={index} style={[Styles.starStyle, this.props.starStyle]}>
                                    {item}
                                </View>
                            )
                        })
                    }
                </View>
                <View style={[Styles.starInfoStyle, this.props.starInfoStyle]}>
                    <Text style={[Styles.starInfoTextStyle, this.props.starInfoTextStyle]}>
                        {this.props.starInfo}
                    </Text>
                </View>
            </View>
        );
    };
}



const Styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starListStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starStyle:{
        marginRight: 6
    },
    starInfoTextStyle: {
        fontFamily: GlobalStyles.FONT_NAME,
        color: Colors.SILVER_DARK,
        fontSize: 10,
    }
});
