/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Button
} from 'react-native'
import Countdown, { CountdownStatus } from './built/index'

export default class App extends Component {

    state = {
        hasText: false
    };
    phoneNumber = ''

    handleClickCountdown = () => {
        if (!this.phoneNumber) {
            alert('电话号码不能为空!')
            return
        }
        this.countdown && this.countdown.startCountdown()
    };

    handleNetworkFailed = () => alert('network failed')

    handleStopCountdown = () => this.countdown && this.countdown.stopCountdown()

    handleChangeText = text => {
        this.phoneNumber = text;
        this.setState({ hasText: !!this.phoneNumber })
    }

    handleCountdownOver = () => alert('over')

    render() {
        const { hasText } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.phoneCell}>
                    <View style={styles.phoneInfo}>
                        <Text>账号:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="请输入手机号码"
                            underlineColorAndroid="transparent"
                            onChangeText={this.handleChangeText}
                        />
                    </View>
                    <Countdown
                        ref={r => this.countdown = r}
                        time={10}
                        onPress={this.handleClickCountdown}
                        onNetworkFailed={this.handleNetworkFailed}
                        onDidFinishCountdown={this.handleCountdownOver}
                    >
                        {({ status, time }) => {
                            let title, containerStyle, titleStyle;
                            switch (status) {
                                case CountdownStatus.Idle:
                                    title = '发送验证码'
                                    containerStyle = [
                                        styles.countdown,
                                        hasText && { backgroundColor: 'rgb(59, 197, 81)', borderWidth: 0 }
                                    ]
                                    titleStyle = [
                                        styles.countdownTitle,
                                        hasText && { color: '#fff' }
                                    ]
                                    break
                                case CountdownStatus.Counting:
                                    title = `发送中(${time})`
                                    containerStyle = styles.countdown
                                    titleStyle = styles.countdownTitle
                                    break
                                case CountdownStatus.Over:
                                    title = '重新发送'
                                    containerStyle = [
                                        styles.countdown,
                                        hasText && { backgroundColor: 'rgb(59, 197, 81)', borderWidth: 0 }
                                    ]
                                    titleStyle = [
                                        styles.countdownTitle,
                                        hasText && { color: '#fff' }
                                    ]
                                    break
                            }
                            return (
                                <View style={containerStyle}>
                                    <Text style={titleStyle}>{title}</Text>
                                </View>
                            )
                        }}
                    </Countdown>
                </View>
                <Button title="停止" onPress={this.handleStopCountdown}/>
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
    phoneCell: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ebebeb',
        width: Dimensions.get('window').width,
        backgroundColor: '#fff'
    },
    phoneInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 30,
        width: Dimensions.get('window').width * 0.4,
        marginLeft: 10,
        padding: 0,
        fontSize: 14
    },
    countdown: {
        borderRadius: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ebebeb',
        height: 30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownTitle: {
        color: '#ccc',
        fontSize: 12
    },
})
