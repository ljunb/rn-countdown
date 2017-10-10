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

  state = {
    hasText: false
  };
  phoneNumber = '';

  shouldStartCountdown = () => {
    if (this.phoneNumber) return true;

    alert('电话号码不能为空!');
    return false;
  };
  
  handleNetworkFailed = () => alert('network failed');

  handleStopCountdown = () => {
    this.countdown && this.countdown.stopCountdown();
  };

  handleChangeText = text => {
    this.phoneNumber = text;
    this.setState({hasText: !!this.phoneNumber})
  };

  render() {
    const style = this.state.hasText ? {backgroundColor: 'rgb(59, 197, 81)', borderWidth: 0} : {};
    const title = this.state.hasText ? {color: '#fff'} : {};

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
          <CountdownView
            ref={r => this.countdown = r}
            time={10}
            title="发送验证码"
            overTitle="重新发送"
            style={[styles.countdown, style]}
            titleStyle={[styles.countdownTitle, title]}
            countingTitleTemplate="发送中({time})"
            countingStyle={styles.countingdown}
            countingTitleStyle={styles.countingTitle}
            shouldStartCountdown={this.shouldStartCountdown}
            onNetworkFailed={this.handleNetworkFailed}
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
    borderRadius: 15,
  },
  countingdown: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth
  },
  countdownTitle: {color: '#ccc'},
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
shouldStartCountdown | function | Yes         | return true      | before start countdown, you can use this function to handle some business logic, return true to allow countdown, otherwise return false
onNetworkFailed   | function | Yes | none | invoke when the network is failed, so the countdown timer will be invalid in this situation, maybe you will use it to show some message for users


## Methods
Method            | Description
----------------  | -----------
startCountdown    | start countdown
stopCountdown     | stop countdown anytime you want, such as network failed or other situations
