/*
 * A smart countdown component for react-native apps.
 * You may use it to handle different status when request a verification code.
 * https://github.com/ljunb/rn-countdown/
 * Released under the MIT license
 * Copyright (c) 2017 ljunb <cookiejlim@gmail.com>
 */

import React, {PureComponent, PropTypes} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewPropTypes,
  AppState,
  NetInfo
} from 'react-native';

/**
 * The status of countdown view.
 * None：default
 * Counting：counting down
 * Over：countdown over
 * */
const CountdownStatus = {
  None: 0,
  Counting: 1,
  Over: 2
};

class Countdown extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    time: PropTypes.number,
    overTitle: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    countingStyle: ViewPropTypes.style,
    countingTitleTemplate: PropTypes.string,
    countingTitleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    shouldStartCountdown: PropTypes.func,
    onNetworkFailed: PropTypes.func
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
    this.recodTime = 0;
    this.state = {
      second: props.time,
      status: CountdownStatus.None,
      isConnected: true
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppState);
    NetInfo.isConnected.addEventListener('change', this.handleNetworkConnectivityChange);
  }

  componentWillUnmount() {
    this.clearTimer();
    AppState.removeEventListener('change', this.handleAppState);
    NetInfo.isConnected.removeEventListener('change', this.handleNetworkConnectivityChange);
  }

  handleNetworkConnectivityChange = isConnected => this.setState({isConnected});

  stopCountdown = () => {
    this.setState({
      status: CountdownStatus.Over,
      second: this.props.time
    }, this.clearTimer);
  };

  handleAppState = nextAppState => {
    if (nextAppState === 'inactive') {
      this.recodTime = new Date();
      this.clearTimer();
    } else if (nextAppState === 'active') {
      if (this.state.status !== CountdownStatus.Counting) return;
      this.turnsOnTimer();
    }
  };

  turnsOnTimer = () => {
    const now = new Date();
    const diff = Math.round((now - this.recodTime) / 1000);
    if (this.state.second - diff <= 0) {
      this.setState({status: CountdownStatus.Over, second: this.props.time});
    } else {
      this.setState({
        status: CountdownStatus.Counting,
        second: this.state.second - diff
      }, this.startTimer)
    }
  };

  handlePress = () => {
    if (this.isNetworkFailed() || !this.canStartTimer()) return;

    this.setState({status: CountdownStatus.Counting}, this.startTimer);
    this.shouldShowWarningInfo();
  };

  isNetworkFailed = () => {
    const {onNetworkFailed} = this.props;
    const {isConnected} = this.state;
    // network is failed
    if (!isConnected) {
      onNetworkFailed && onNetworkFailed();
    }
    return !isConnected;
  };

  canStartTimer = () => {
    const {shouldHandleBeforeCountdown, shouldStartCountdown} = this.props;

    let canStartTimer = shouldStartCountdown();
    if (shouldHandleBeforeCountdown !== undefined && typeof shouldHandleBeforeCountdown === 'function') {
      canStartTimer = shouldHandleBeforeCountdown();
      console.warn(`[rn-countdown] Warning: "shouldHandleBeforeCountdown" is deprecated, use "shouldStartCountdown" instead.`);
    }
    return canStartTimer;
  };

  shouldShowWarningInfo = () => {
    const {countingTitleTemplate} = this.props;
    const isCorrectFormat = countingTitleTemplate.includes('{time}');
    if (!isCorrectFormat) {
      console.warn("[rn-countdown] Warning: Failed prop format: Invalid prop `countingTitleTemplate` of format without substring `{time}`.");
    }
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
    const {
      title, style, overTitle, titleStyle,
      countingTitleTemplate, countingStyle, countingTitleStyle
    } = this.props;

    let promptTitle = title,
      containerStyle = [styles.container, style],
      textStyle = [styles.title, titleStyle];

    if (status === CountdownStatus.Counting) {
      promptTitle = countingTitleTemplate.replace('{time}', second);
      containerStyle.push(countingStyle);
      textStyle.push(countingTitleStyle);
    } else if (status === CountdownStatus.Over) {
      promptTitle = overTitle;
    }

    return (
      <TouchableOpacity
        disabled={status === CountdownStatus.Counting}
        activeOpacity={0.75}
        style={containerStyle}
        onPress={this.handlePress}
      >
        <Text style={textStyle}>{promptTitle}</Text>
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

export default Countdown;