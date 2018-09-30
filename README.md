# rn-countdown

[![npm](https://img.shields.io/npm/v/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/dm/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/dt/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/l/rn-countdown.svg)](https://github.com/ljunb/rn-countdown/blob/master/LICENSE)

A countdown component for react-native APPs. You should use this component to request a verification code that supports custom styles for different status.

## Supported version
React Native version(s) | Supporting CodePush version(s)
----------------------- | ------------------------------ 
0.48.0+                 | v0.3.0+ (NetInfo change -> connectionChange for eventListener)
< 0.48.0                | v0.2.1

## Preview
![demo](https://github.com/ljunb/screenshots/blob/master/rn-countdown.gif)

## Install

Install with npm:
```
// >= 0.48.0
npm install rn-countdown --save

// < 0.48.0
npm install rn-countdown@0.2.1 --save 
```
or with yarn:
```
// >= 0.48.0
yarn add rn-countdown

// < 0.48.0
yarn add rn-countdown@0.2.1
```

## Usage

```javascript
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Button
} from 'react-native'
import Countdown, { CountdownStatus } from 'rn-countdown'

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
        const { hasText } = this.state
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
                            let title, containerStyle, titleStyle
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
```

## Props

Prop              | Type   | Optional | Default      | Description
----------------  | ------ | -------- | -----------  | -----------
style             | ViewPropTypes | Yes      | none  | custom container style
time              | number | Yes      | 30s          | timer seconds
activeOpacity     | number | Yes      | 0.75         | button active opacity 
children          | function | No      | none         | return any react element what you want, eg: `({ status: CountdownStatus, time: number }) => React.Element<any>` <br/> `status`:<br/> - `Idle`: the default status<br/> - `Counting`: the status of counting down<br/> - `Over`: countdown finish
onPress           | function | Yes | none | invoke when click the countdown
onNetworkFailed   | function | Yes | none | invoke when the network is failed, so the countdown timer will be invalid in this situation, maybe you will use it to show some message for users
onDidFinishCountdown| function | Yes | none | invoke when the countdown over


## Methods
Method            | Description
----------------  | -----------
startCountdown    | start countdown
stopCountdown     | stop countdown anytime you want, such as network failed or other situations
