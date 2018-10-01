# rn-countdown

[![npm](https://img.shields.io/npm/v/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/dm/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/dt/rn-countdown.svg)](https://www.npmjs.com/package/rn-countdown)
[![npm](https://img.shields.io/npm/l/rn-countdown.svg)](https://github.com/ljunb/rn-countdown/blob/master/LICENSE)

适用于 React Native App 的一个倒计时组件，基于 `render-props` 方式实现，使用者可完全把重心放在 UI 定制上面，无须关注倒计时逻辑实现。

## 重要更新
由于组件进行了重构，之前版本的大部分 `props` 有重大变更，罗列如下：

* `overTitle`：倒计时结束文本（移除）
* `titleStyle`：文本样式（移除）
* `countingStyle`：倒计时中的容器样式（移除）
* `countingTitleTemplate`：文本模板（移除）
* `countingTitleStyle`：倒计时中的文本样式（移除）
* `timeFontStyle`：针对时间文本的样式（移除）
* `shouldStartCountdown`：是否允许开始倒计时回调（移除）
* `onCountdownOver`：重命名为 `onDidFinishCountdown`，触发机制保持与之前一致（更新）
* `onNetworkFailed`：网络出错情况下，点击触发的回调（保留）
* `style`：容器样式（保留）
* `time`：倒计时总时长（单位秒，保留）
* `activeOpacity`：点击时的透明度（新增）
* `children`：添加对 `children` 的一个类型检测，必须为 `function`（新增）
* `onPress`：点击组件的回调（新增，新版本组件将控制权交给了开发人员，通过实例方法按需开启，或是停止倒计时）

以下实例方法将继续保留：
* `startCountdown`：立即开始倒计时，如果网络错误，将触发 `onNetworkFailed` 回调，可按需进行弹框提示处理
* `stopCountdown`：立即停止倒计时，将触发 `onDidFinishCountdown` 回调，按需添加后续处理

## 支持的版本
React Native 版本 | 对应支持的组件版本
----------------------- | ------------------------------ 
0.48.0+                 | v0.3.0+ (NetInfo change -> connectionChange for eventListener)
< 0.48.0                | v0.2.1

## 预览
![demo](https://github.com/ljunb/screenshots/blob/master/rn-countdown.gif)

## 安装

通过 `npm` 安装:
```
// >= 0.48.0
npm install rn-countdown --save

// < 0.48.0
npm install rn-countdown@0.2.1 --save 
```
或者基于 `yarn` 安装:
```
// >= 0.48.0
yarn add rn-countdown

// < 0.48.0
yarn add rn-countdown@0.2.1
```

## 使用

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

## 参数说明

名称              | 类型   | 是否可选 | 默认值      | 描述
----------------  | ------ | -------- | -----------  | -----------
style             | ViewPropTypes | 是      | 无  | 自定义容器样式，这里应该关注于容器相对于其父组件、兄弟组件的样式，比如：`margin`、`padding` 等，真正业务上的 UI 定制，可在 `children` 中进行定制
time              | number | 是      | 30s          | 倒计时时长
activeOpacity     | number | 是      | 0.75         | 按钮交互时的透明度 
children          | function | 否      | 无         | 一个返回 `React` 元素的函数，该函数接受一个参数，其格式为: `({ status: CountdownStatus, time: number }) => React.Element<any>` <br/> `status`:<br/> - `Idle`: 默认状态<br/> - `Counting`: 正在倒计时<br/> - `Over`: 倒计时结束
onPress           | function | 是 | 无 | 点击组件时必会触发的回调
onNetworkFailed   | function | 是 | 无 | 网络出错情况下，点击组件的回调，按需添加弹窗处理
onDidFinishCountdown| function | 是 | 无 | 倒计时结束回调


## 方法
名称            | 描述
----------------  | -----------
startCountdown    | 立即开始倒计时，网络出错情况下，将触发 `onNetworkFailed` 回调
stopCountdown     | 立即停止倒计时，将触发 `onDidFinishCountdown` 回调

以上方法皆可通过 `ref` 进行引用触发，比如：`this.countdownRef && this.countdownRef.startCountdown()`。

## 运行示例
克隆之后，需要先开启 TypeScript 的编译监听：
```
// 根目录
$ npm install
$ npm start
```

然后进入到 `example` 目录，开启服务（当然也可以直接通过 Xcode 或是 Android Studio 运行）：
```
$ cd example
$ npm install
$ npm start
```
