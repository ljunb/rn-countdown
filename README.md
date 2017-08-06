# rn-countdown

[![npm](https://img.shields.io/npm/v/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/dm/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/l/rn-countdown.svg)](https://github.com/ljunb/rn-countdown/blob/master/LICENSE)

A smart countdown component for react-native apps. You may use it to handle different status when request a verification code.

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
    AppRegistry,
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
                        overTitle="重置"
                        countingSuffixTitle="s"
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
    }
});
```

## Props

Prop              | Type   | Optional | Default      | Description
----------------  | ------ | -------- | -----------  | -----------
title             | string | Yes      | 获取短信验证码  | 
time              | number | Yes      | 30s          | 
countingSuffixTitle | string | Yes    | s后重新获取    | the suffix title when counting down
overTitle         | string | Yes      | 重新获取       | the title when countdown over
titleStyle        | object | Yes      |              | font style of countdown title
shouldHandleBeforeCountdown | function | Yes         | return true      | before start countdown, you can use this function to handle some business logic, return true to allow countdown, otherwise return false

## Methods
Method            | Description
----------------  | -----------
stopCountdown     | stop countdown anytime you want, such as network failed or other situations
