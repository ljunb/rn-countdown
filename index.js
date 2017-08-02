/*
 * A smart countdown component for react-native apps. You may use it to handle different status when request a verification code.
 * https://github.com/ljunb/react-native-countdown/
 * Released under the MIT license
 * Copyright (c) 2017 ljunb <cookiejlim@gmail.com>
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

/**
 * The status of countdown view.
 * None：default
 * Counting：counting down
 * End：countdown ends
 * */
const CountDownStatus = {
    None: 0,
    Counting: 1,
    End: 2
};

export default class Countdown extends Component {
    static propTypes = {
        title: React.PropTypes.string,
        totalSecond: React.PropTypes.number,
        shouldHandleBeforeStartCountdown: React.PropTypes.func
    };

    static defaultProps = {
        title: '获取短信验证码',
        totalSecond: 30,
        shouldHandleBeforeStartCountdown: () => true
    };

    constructor(props) {
        super(props);

        this.state = {
            second: props.totalSecond,
            status: CountDownStatus.None,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {totalSecond, title} = this.props;
        const {second, status} = this.state;
        const isNewComp = nextProps.title !== title || nextProps.totalSecond !== totalSecond;
        const isCounting = nextState.second !== second || nextState.status !== status;

        return isNewComp || isCounting;
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    /**
     * Call this function when you want to stop countdown manually.
     * */
    stopCountdown = () => {
        this.setState({
            status: CountDownStatus.End,
            second: this.props.totalSecond
        }, () => this.clearTimer());
    };

    handlePress = () => {
        const {shouldHandleBeforeStartCountdown} = this.props;
        const {status} = this.state;

        const canStartTimer = shouldHandleBeforeStartCountdown();
        if (status === CountDownStatus.Counting || !canStartTimer) return;

        this.setState({status: CountDownStatus.Counting}, () => this.startTimer());
    };

    startTimer = () => {
        const {totalSecond} = this.props;

        this.timer = setInterval(() => {
            let nextSecond = this.state.second - 1;
            if (nextSecond === 0) {
                this.clearTimer();
                this.setState({status: CountDownStatus.End, second: totalSecond});
                return;
            }
            this.setState({second: nextSecond});
        }, 1000);
    };

    clearTimer = () => {
        this.timer && clearInterval(this.timer);
    };

    render() {
        const {status, second} = this.state;
        const {title} = this.props;
        let promptTitle = title;
        if (status === CountDownStatus.Counting) {
            promptTitle = `${second}s后重新获取`;
        } else if (status === CountDownStatus.End) {
            promptTitle = `重新获取`;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.75}
                style={styles.container}
                onPress={this.handlePress}
            >
                <Text style={styles.title}>{promptTitle}</Text>
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