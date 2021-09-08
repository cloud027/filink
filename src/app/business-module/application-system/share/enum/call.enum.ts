/**
 * 一键呼叫枚举
 */
// 一键呼叫设备呼叫操作类型
export enum CallOperateTypeEnum {
  STOP_LISTEN = '0', // 停止监听
  CALL = '1', // 呼叫
  LISTEN = '2', // 监听
  ACCEPT_CALL = '3', // 对讲
  STOP_CALL = '4', // 挂断
}

export enum CallStatusEnum {
    stateIdle = "0", // 空闲
    stateCall = "1", // 呼入
    stateListen = "2", // 监听
    stateBroadcast = "3", // 广播
    stateOnMeeting = "4", // 会议
    stateCalling = "5", // 正在对讲
    stateListening = "6", // 正在监听
    stateBroadcasting = "7", // 正在广播
    stateCalled = "8", // 呼出
    stateListened = "9", // 被监听
}
export enum CallTableEnum {
  primaryCallKey = '09-8-2-1-1',
  primaryListenKey = '09-8-2-1-2',
  primaryHangUpKey = '09-8-2-1-3',
  primaryDetail = '09-8-2-1-4'
}

