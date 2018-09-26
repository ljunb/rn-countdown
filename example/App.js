/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Countdown, { CountdownStatus } from './built/index'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export default class App extends Component {
    render() {

        return (
            <View style={styles.container}>
                <Countdown
                    time={10}
                    onNetworkFailed={() => alert('network error')}
                >
                    {({status, time}) => {
                        let title = '发送验证码';
                        if (status === CountdownStatus.Counting) {
                            title = `发送中(${time}s)`
                        } else if (status === CountdownStatus.Over) {
                            title = '重新获取'
                        }
                        return (
                            <View style={{
                                height: 40,
                                paddingHorizontal: 10,
                                borderRadius: 4,
                                borderColor: '#ececec',
                                borderWidth: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text>{title}</Text>
                            </View>
                        )
                    }}
                </Countdown>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
