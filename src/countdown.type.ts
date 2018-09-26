
interface RenderProps {
  status: CountdownStatus,
  time: number
}

export interface CountdownProps {
  style: object | number,
  activeOpacity: number,
  time: number,
  children: (props: RenderProps) => any
  onDidFinishCountdown: () => void,
  onNetworkFailed: () => void
}

export interface CountdownState {
  second?: number,
  status?: CountdownStatus,
  isConnected?: boolean,
}

export enum CountdownStatus {
  Idle,
  Counting,
  Over
}
