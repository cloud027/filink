import {DEVICE_SERVER, FILOCK_SERVER, LOCK_SERVER} from '../api-common.config';

export const LOCK_URL = {
  // 查询电子锁主控信息
  GET_LOCK_CONTROL_INFO: `${LOCK_SERVER}/control`,
  // 查询电子锁主控信息
  GET_LOCK_CONTROL_INFO_FOR_EQUIPMENT: `${LOCK_SERVER}/control/equipment`,
  // 查询电子锁信息
  GET_LOCK_INFO: `${LOCK_SERVER}/lock/getLock`,
  // 查询电子锁信息
  GET_LOCK_INFO_FOR_EQUIPMENT: `${LOCK_SERVER}/lock/getLock/equipment`,
  // 获取主控参数
  GET_PRAMS_CONFIG: `${LOCK_SERVER}/control/getPramsConfig`,
  // 设置主控配置
  SET_CONTROL: `${FILOCK_SERVER}/lock/setConfig`,
  // 设施开锁
  OPEN_LOCK: `${FILOCK_SERVER}/lock/openLock`,
  // 设备开锁（指令下发）
  instructDistribute: `${FILOCK_SERVER}/instruct/instructDistribute`,
  // 更新设施状态
  UPDATE_DEVICE_STATUS: `${FILOCK_SERVER}/lock/deploy`,
  // 查询单个设施一段时间内的开锁次数
  QUERY_UNLOCKING_TIMES_BY_DEVICE_ID: `${DEVICE_SERVER}/statistics/queryUnlockingTimesByDeviceId`,
  // 删除主控
  DELETE_LOCK_AND_CONTROL_BY_ID: `${LOCK_SERVER}/control/deleteLockAndControlById`
};
