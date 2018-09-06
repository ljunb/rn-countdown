/*
 * A smart countdown component for react-native apps.
 * You may use it to handle different status when request a verification code.
 * https://github.com/ljunb/rn-countdown/
 * Released under the MIT license
 * Copyright (c) 2017 ljunb <cookiejlim@gmail.com>
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewPropTypes,
  NetInfo,
} from 'react-native';
import PropTypes from 'prop-types';

/**
 * The status of countdown view.
 * None：default
 * Counting：counting down
 * Over：countdown over
 * */
const CountdownStatus = {
  Idle: 'Idle',
  Counting: 'Counting',
  Over: 'Over',
};

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
    borderRadius: 2,
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    color: '#aaa',
  },
});
const now = new Date();
export default class Countdown extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    time: PropTypes.number,
    overTitle: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    countingStyle: ViewPropTypes.style,
    countingTitleTemplate: PropTypes.string,
    countingTitleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    timeFontStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    shouldStartCountdown: PropTypes.func,
    onNetworkFailed: PropTypes.func,
    onCountdownOver: PropTypes.func,
  };

  static defaultProps = {
    title: '获取短信验证码',
    time: 30,
    overTitle: '重新获取',
    countingTitleTemplate: '{time}s后重新获取',
    shouldStartCountdown: () => {},
  };

  constructor(props) {
    super(props);
    this.targetTime = new Date(now.getTime() + props.time * 1000);

    this.state = {
      second: props.time * 1000,
      status: CountdownStatus.Idle,
      isConnected: true,
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleNetworkConnectivityChange);
  }

  componentWillUnmount() {
    this.clearTimer();
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleNetworkConnectivityChange);
  }

  handleNetworkConnectivityChange = isConnected => this.setState({ isConnected });

  startCountdown = () => {
    const { onNetworkFailed } = this.props;
    const { status, isConnected } = this.state;
    if (status === CountdownStatus.Counting) return;

    if (isConnected) {
      this.setState({ status: CountdownStatus.Counting}, this.startTimer);
    } else {
      onNetworkFailed && onNetworkFailed();
    }
  };

  stopCountdown = () => {
    const { onCountdownOver, time } = this.props;
    onCountdownOver && onCountdownOver();

    this.setState({
      status: CountdownStatus.Over,
      second: time * 1000,
    }, this.clearTimer);
  };

  handlePress = () => {
    if (this.isNetworkFailed() || !this.canStartTimer()) return;

    this.setState({ status: CountdownStatus.Counting }, this.startTimer);
    this.shouldShowWarningInfo();
  };

  isNetworkFailed = () => {
    const { onNetworkFailed } = this.props;
    const { isConnected } = this.state;
    // network is failed
    if (!isConnected) {
      onNetworkFailed && onNetworkFailed();
    }
    return !isConnected;
  };

  canStartTimer = () => {
    const { shouldStartCountdown } = this.props;
    return shouldStartCountdown();
  };

  shouldShowWarningInfo = () => {
    const { countingTitleTemplate } = this.props;
    const isCorrectFormat = countingTitleTemplate.includes('{time}');
    if (!isCorrectFormat) {
      console.warn("[rn-countdown] Warning: Failed prop format: Invalid prop `countingTitleTemplate` of format without substring `{time}`.");
    }
  };

  startTimer = () => {
    this.updateTargetTime();
    const { time, onCountdownOver } = this.props;

    this.timer = setInterval(() => {
      const tmpNow = new Date();
      const second = this.targetTime - tmpNow;
      // countdown over
      if (parseInt(second / 1000) <= 0) {
        onCountdownOver && onCountdownOver();

        this.clearTimer();
        this.setState({ status: CountdownStatus.Over, second: time * 1000 });
        return;
      }
      this.setState({ second });
    }, 1000);
  };

  clearTimer = () => this.timer && clearInterval(this.timer);

  updateTargetTime = () => {
    const { time } = this.props;
    const currentTime = new Date();
    this.targetTime = new Date(currentTime.getTime() + (time + 1) * 1000);
  };

  getCountingComponent = () => {
    const { second } = this.state;
    const {
      countingTitleTemplate, titleStyle, countingTitleStyle, timeFontStyle,
    } = this.props;

    const countdownSecond = parseInt(second / 1000);
    const templateIndex = countingTitleTemplate.indexOf('{time}');
    const titleLength = countingTitleTemplate.length;
    const baseStyle = [styles.title, titleStyle, countingTitleStyle];
    const timeComponent = <Text style={timeFontStyle}>{countdownSecond}</Text>;

    if (countingTitleTemplate === '{time}') {
      return <Text style={[baseStyle, timeFontStyle]}>{countdownSecond}</Text>;
    } else if (templateIndex === 0 && titleLength > 6) {
      const restText = countingTitleTemplate.split('}')[1];
      return (
        <Text style={baseStyle}>
          {timeComponent}
          {restText}
        </Text>
      );
    } else if (templateIndex === titleLength - 6) {
      const restText = countingTitleTemplate.split('{')[0];
      return (
        <Text style={baseStyle}>
          {restText}
          {timeComponent}
        </Text>
      );
    }

    return (
      <Text style={[styles.title, titleStyle, countingTitleStyle]}>
        {countingTitleTemplate.split('{time}')[0]}
        {timeComponent}
        {countingTitleTemplate.split('{time}')[1]}
      </Text>
    );
  };

  render() {
    const { status } = this.state;
    const {
      title, style, overTitle, titleStyle, countingStyle
    } = this.props;

    const isCounting = status === CountdownStatus.Counting;
    const containerStyle = [styles.container, style];
    if (isCounting) containerStyle.push(countingStyle);

    return (
      <TouchableOpacity
        disabled={isCounting}
        activeOpacity={0.75}
        style={containerStyle}
        onPress={this.handlePress}
      >
        {isCounting && this.getCountingComponent()}
        {!isCounting &&
        <Text style={[styles.title, titleStyle]}>
          {status === CountdownStatus.Idle ? title : overTitle}
        </Text>
        }
      </TouchableOpacity>
    );
  }
}