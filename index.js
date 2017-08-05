/*
 * A smart countdown component for react-native apps. You may use it to handle different status when request a verification code.
 * https://github.com/ljunb/react-native-countdown/
 * Released under the MIT license
 * Copyright (c) 2017 ljunb <cookiejlim@gmail.com>
 */

import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewPropTypes
} from 'react-native';

/**
 * The status of countdown view.
 * None：default
 * Counting：counting down
 * Over：countdown ends
 * */
const CountdownStatus = {
    None: 0,
    Counting: 1,
    Over: 2
};

export default class Countdown extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        time: PropTypes.number,
        countingSuffixTitle: PropTypes.string,
        overTitle: PropTypes.string,
        titleStyle: PropTypes.object,
        shouldHandleBeforeCountdown: PropTypes.func
    };

    static defaultProps = {
        title: '获取短信验证码',
        time: 30,
        countingSuffixTitle: 's后重新获取',
        overTitle: '重新获取',
        shouldHandleBeforeCountdown: () => true
    };

    constructor(props) {
        super(props);
        this.state = {
            second: props.time,
            status: CountdownStatus.None
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {time, title, overTitle, countingSuffixTitle} = this.props;
        const {second, status} = this.state;

        const isNewComp = nextProps.title !== title || nextProps.time !== time || nextProps.overTitle !== overTitle || nextProps.countingSuffixTitle !== countingSuffixTitle;
        const isCounting = nextState.second !== second || nextState.status !== status;
        return isNewComp || isCounting;
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    stopCountdown = () => {
        this.setState({
            status: CountdownStatus.Over,
            second: this.props.time
        }, this.clearTimer);
    };

    handlePress = () => {
        const {shouldHandleBeforeCountdown} = this.props;
        const {status} = this.state;

        const canStartTimer = shouldHandleBeforeCountdown();
        if (status === CountdownStatus.Counting || !canStartTimer) return;
        this.setState({status: CountdownStatus.Counting}, this.startTimer);
    };

    startTimer = () => {
        const {time} = this.props;

        this.timer = setInterval(() => {
            let nextSecond = this.state.second - 1;
            if (nextSecond === 0) {
                this.clearTimer();
                this.setState({status: CountdownStatus.Over, second: time});
                return;
            }
            this.setState({second: nextSecond});
        }, 1000);
    };

    clearTimer = () => this.timer && clearInterval(this.timer);

    render() {
        const {status, second} = this.state;
        const {title, style, overTitle, countingSuffixTitle, titleStyle} = this.props;
        let promptTitle = title;
        if (status === CountdownStatus.Counting) {
            promptTitle = `${second}${countingSuffixTitle}`;
        } else if (status === CountdownStatus.Over) {
            promptTitle = overTitle;
        }

        return (
            <TouchableOpacity
                disabled={status === CountdownStatus.Counting}
                activeOpacity={0.75}
                style={[styles.container, style]}
                onPress={this.handlePress}
            >
                <Text style={[styles.title, titleStyle]}>{promptTitle}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ebebeb',
        borderRadius: 2,
        height: 30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 12,
        color: '#aaa',
    }
});