# rn-countdown

[![npm](https://img.shields.io/npm/v/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/dm/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/l/rn-countdown.svg)](https://github.com/ljunb/rn-countdown/blob/master/LICENSE)

A countdown component for react-native APPs. When the AppState changes to `inactive`, the timer is cleared and the new timer is turned on when the state changes back to `active`. You should use this component to request a verification code that supports custom styles for different status.

## Preview
![demo](https://github.com/ljunb/screenshots/blob/master/rn-countdown.gif)

## Install

Install with npm:
```
npm install rn-countdown --save
```
or with yarn:
```
yarn add rn-countdown
```

## Usage

```js
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Button,
    TextInput,
    Text,
    Dimensions
} from 'react-native';
import CountdownView from 'rn-countdown';

export default class RNCountdownDemo extends Component {

    phoneNumber = '';

    shouldHandleBeforeCountdown = () => {
        if (this.phoneNumber) return true;

        alert('电话号码不能为空!');
        return false;
    };

    handleStopCountdown = () => {
        this.countdown && this.countdown.stopCountdown();
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.phoneCell}>
                    <View style={styles.phoneInfo}>
                        <Text>账号:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="请输入手机号码"
                            underlineColorAndroid="transparent"
                            onChangeText={text => this.phoneNumber = text}
                        />
                    </View>
                    <CountdownView
                        ref={r => this.countdown = r}
                        time={10}
                        title="发送验证码"
                        overTitle="重新发送"
                        style={styles.countdown}
                        titleStyle={styles.countdownTitle}
                        countingTitleTemplate="发送中({time})"
                        countingStyle={styles.countingdown}
                        countingTitleStyle={styles.countingTitle}
                        shouldHandleBeforeCountdown={this.shouldHandleBeforeCountdown}
                    />
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
        backgroundColor: 'rgb(59, 197, 81)',
        borderRadius: 15,
        borderWidth: 0
    },
    countingdown: {
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth
    },
    countdownTitle: {color: '#fff'},
    countingTitle: {color: '#ccc'}
});
```

## Props

Prop              | Type   | Optional | Default      | Description
----------------  | ------ | -------- | -----------  | -----------
style             | ViewPropTypes | Yes      | none  | custom container style
title             | string | Yes      | 获取短信验证码  | initial title 
time              | number | Yes      | 30s          | timer seconds
overTitle         | string | Yes      | 重新获取       | the title when countdown over
titleStyle        | object | Yes      |     none         | font style of countdown title
countingStyle     | ViewPropTypes | Yes      | none | custom style when counting down
countingTitleTemplate | string | Yes | {time}s后重新获取 | counting down title, must conform to the format that contain `{time}`
countingTitleStyle | object | Yes | none | custom title style when counting down
shouldHandleBeforeCountdown | function | Yes         | return true      | before start countdown, you can use this function to handle some business logic, return true to allow countdown, otherwise return false

## Methods
Method            | Description
----------------  | -----------
stopCountdown     | stop countdown anytime you want, such as network failed or other situations
