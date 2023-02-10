import React, {Component, PureComponent} from 'react';
import Colors from "../styles/Colors";
import ImageSources from "../styles/ImageSources";
import {
    StatusBar,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    Platform, ImageBackground,
    Dimensions
} from 'react-native';
import {BallIndicator} from "react-native-indicators";
import GlobalStyles from "../styles/GlobalStyles";
import WAStars from "./WAStars";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';



type Props = {
    style: PropTypes.object,
    data: PropTypes.object
};

export default class WAReviewAlt extends PureComponent<Props> {
    static defaultProps = {
        style: {},
        data: {}
    };

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render(){
        let item = this.props.data;
        return (
            <View style={[Styles.container, this.props.style]}>
                <View style={Styles.line1}>
                    <Text style={Styles.title}>"{item.title}"</Text>
                    <Text style={Styles.name}>{item.name}</Text>
                </View>
                <View style={Styles.line2}>
                    <WAStars style={Styles.stars} set={'3'} rating={item.rating} />
                    <Text style={Styles.date}>{item.date}</Text>
                </View>
                <Text style={Styles.content}>{item.content}</Text>
                {
                    item.images.length>0?
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.showLightBox( item.images.map((slide) => {
                                    return {
                                        url: slide.image,
                                        freeHeight: true
                                    }
                                }));
                            }}
                            style={Styles.images}>
                            {
                                item.images.map((image, iIndex) => {
                                    return (
                                        <ImageBackground style={[Styles.image, item.images.length === 1?Styles.image1:item.images.length===2?Styles.image2:Styles.image3]} key={'review-image'+iIndex}
                                                         source={{uri: image.thumb}}
                                        />
                                    );
                                })
                            }
                        </TouchableOpacity>
                        :undefined
                }
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    images: {
        flexDirection: 'row',
        marginTop: 15
    },
    image: {
        flex: 1,
        height: 65,
        backgroundColor: Colors.SILVER_LIGHT,
        marginRight: 10
    },
    image1: {
        height: 180,
    },
    image2: {
        height: 100
    },
    container: {
        backgroundColor: '#F2F2F2',
        marginBottom: 20,
        padding: 15,
        borderRadius: 10
    },
    line1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    line2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    title: {
        flex: 1,
        marginRight: 15,
        color: Colors.PRIMARY,
        fontFamily: GlobalStyles.FONT_NAME,
        fontWeight: 'bold',
        fontSize: 15,
    },
    name: {
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 13,
    },
    stars: {
        flex: 1
    },
    date: {
        color: Colors.SILVER_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 12,
    },
    content: {
        textAlign: 'justify',
        color: Colors.TEXT_DARK,
        fontFamily: GlobalStyles.FONT_NAME,
        fontSize: 14,
    }
});