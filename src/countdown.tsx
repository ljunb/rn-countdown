/*
 * A smart countdown component for react-native apps.
 * You may use it to handle different status when request a verification code.
 * https://github.com/ljunb/rn-countdown/
 * Released under the MIT license
 * Copyright (c) 2017 ljunb <cookiejlim@gmail.com>
 */

import * as React from 'react'
import { TouchableOpacity, NetInfo } from 'react-native'
import { CountdownProps, CountdownStatus, CountdownState } from './countdown.type'

export default class Countdown extends React.Component<CountdownProps, CountdownState> {
  static defaultProps = {
    time: 30,
    activeOpacity: 0.75
  }

  constructor(props: CountdownProps) {
    super(props)
    const now = new Date()
    this.targetTime = new Date(now.getTime() + props.time * 1000)
    this.state = {
      second: props.time * 1000,
      status: CountdownStatus.Idle,
      isConnected: true,
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleNetworkConnectivityChange)
  }

  componentWillUnmount() {
    this.clearTimer()
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleNetworkConnectivityChange)
  }

  handleNetworkConnectivityChange = (isConnected: boolean) => this.setState({ isConnected })

  startCountdown = () => {
    const { onNetworkFailed } = this.props
    const { status, isConnected } = this.state
    if (status === CountdownStatus.Counting) return

    if (isConnected) {
      this.setState({ status: CountdownStatus.Counting }, this.startTimer)
    } else {
      onNetworkFailed && onNetworkFailed()
    }
  }

  stopCountdown = () => {
    const { onDidFinishCountdown, time } = this.props
    onDidFinishCountdown && onDidFinishCountdown()

    this.setState({
      status: CountdownStatus.Over,
      second: time * 1000,
    }, this.clearTimer)
  }

  get isNetworkFailed() {
    const { onNetworkFailed } = this.props
    const { isConnected } = this.state
    // network is failed
    if (!isConnected) {
      onNetworkFailed && onNetworkFailed()
    }
    return !isConnected
  }

  handlePress = () => {
    if (this.isNetworkFailed) return
    this.setState({ status: CountdownStatus.Counting }, this.startTimer)
  }

  startTimer = () => {
    this.updateTargetTime()
    const { time, onDidFinishCountdown } = this.props

    // @ts-ignore
    this.timer = setInterval(() => {
      const tmpNow = new Date()
      // @ts-ignore
      const second: number = this.targetTime - tmpNow
      // countdown over
      // @ts-ignore
      if (parseInt(second / 1000) <= 0) {
        onDidFinishCountdown && onDidFinishCountdown()

        this.clearTimer()
        this.setState({ status: CountdownStatus.Over, second: time * 1000 })
        return
      }
      this.setState({ second })
    }, 1000)
  }

  clearTimer = () => this.timer && clearInterval(this.timer)

  updateTargetTime = () => {
    const { time } = this.props
    const currentTime = new Date()
    this.targetTime = new Date(currentTime.getTime() + (time + 1) * 1000)
  }

  render() {
    const { status, second } = this.state
    const { style, activeOpacity, children } = this.props
    const isCounting = status === CountdownStatus.Counting
    const content = children({ status, time: parseInt(second / 1000) })

    return (
      <TouchableOpacity
        disabled={isCounting}
        activeOpacity={activeOpacity}
        style={[style]}
        onPress={this.handlePress}
      >
        {content}
      </TouchableOpacity>
    )
  }
}
