/**
 * http title
 */
export enum HttpTitleEnum {
  httpServe = 'http-serve',
  httpClient = 'http-client',
  httpsServe = 'https-serve',
  httpsClient = 'https-client',
  webserviceServe = 'webservice-serve',
  webserviceClient = 'webservice-client',
}

/**
 * 日志名
 */
export enum LogNameEnum {
  // 安全日志
  findSecurityLog = 'findSecurityLog',
  // 系统日志
  findSystemLog = 'findSystemLog',
  // 操作日志
  findOperateLog = 'findOperateLog'
}

/**
 * 导出日志类型
 */
export enum ExportLogEnum {
  // 安全日志
  exportSecurityLogExport = 'exportSecurityLogExport',
  // 系统日志
  exportSysLogExport = 'exportSysLogExport',
  // 操作日志
  exportOperateLogExport = 'exportOperateLogExport'
}

/**
 * 处理不同参数设置的title
 */
export enum DealTitleEnum {
  // 平台显示设置
  platformDisplay = 'platform-display',
  // 显示设置
  show = 'show',
  // 消息设置
  msg = 'msg',
  // 邮箱设置
  email = 'email',
  // 短息设置
  note = 'note',
  // 推送设置
  push = 'push',
  // ftp设置
  ftp = 'ftp',
}

/**
 * 设置枚举
 */
export enum SystemParameterConfigEnum {
  msg = '7', // 消息设置
  email = '6', // 邮箱设置
  note = '5', // 短息设置
  push = '8', // 推送设置
  show = '9', // 显示设置
  ftp = '10', // ftp设置
  platformDisplay = '16', // 平台显示设置
  accountPresent = '0', // 账户安全策略
  passwordPresent = '1', // 密码安全策略
  httpServe = '2',    // http服务设置
  httpsServe = '3',  // https服务设置
  webserviceServe = '4', // web服务设置
  backupSetting = '17', // 备份服务设置
}


/**
 * 日志类型
 */
export enum LogTypeEnum {
  // 操作日志
  operate = 'operate',
  // 安全日志
  security = 'security',
  // 系统日志
  system = 'system'
}

/**
 * 操作结果
 */
export enum OptResultEnum {
  success = 'success',
  failure = 'failure'
}

/**
 * 危险级别
 */
export enum DangerLevelEnum {
  // 提示
  prompt = 1,
  // 一般
  general = 2,
  // 危险
  danger = 3
}

/**
 * 操作类型
 */
export enum OptTypeEnum {
  // 网管操作
  web = 'web',
  // PDA操作
  pda = 'pda'
}

/**
 * 页面类型编号
 */
export enum PageTypeEnum {
  // 告警
  alarm = 11,
  // 设施日志
  facilityLog = 12,
  // 系统日志
  systemLog = 13,
  // 巡检工单
  inspection = 14,
  // 销障工单
  clearBarrier = 15,
  // 安装工单
  installation = 18,
  // 告警确认工单
  alarmConfirm = 19,
  // 故障
  trouble = 20,
}


/**
 * 账号安全策略类型
 */
export enum AccessPolicyTypeEnum {
  account = 'account',
  password = 'password',
}

/**
 * 备份周期单位枚举
 */
export enum BackupCycleUnitEnum {
  // 小时
  hour = 'h',
  // 天
  day = 'd',
  // 星期
  week = 'w',
  // 月
  month = 'm'
}

/**
 * 备份位置枚举
 */
export enum BackupLocationEnum {
  // 备份到本地
  local = '1',
  // 备份到ftp服务器
  ftpServer = '2'
}

/**
 * 是否启用备份枚举
 */
export enum BackupEnableEnum {
  // 启用
  enable = '1',
  // 禁用
  disable = '0'
}

/**
 * 接入方式枚举
 */
export enum AccessModeEnum {
  api = 'API',
  sdk = 'SDK'
}

/**
 * 表单值key枚举
 */
export enum KeyEnum {
  // 启用
  enableDump = 'enableDump',
  // 触发条件
  triggerCondition = 'triggerCondition',
  // 转储操作
  dumpOperation = 'dumpOperation',
}

/**
 * 模板状态枚举
 */
export enum TemplateStatusEnum {
  // 启用
  enable = '1',
  // 禁用
  disable = '0',
}

/**
 * 模板状态枚举
 */
export enum IpEnum {
  // ipv4
  ipFour = 'ipv4',
  // ipv6
  ipSix = 'ipv6',
}

/**
 * 状态枚举
 */
export enum StatusEnum {
  // 启用
  enable = '1',
  // 禁用
  disable = '0',
}

/**
 * 邮件发送服务器枚举
 */
export enum EmailSendServerEnum {
  // 阿里云服务器
  alicloud = '1',
  // 邮箱服务器
  mailboxServer = '2'
}

/**
 * 短信发送服务器枚举
 */
export enum NoteSendServerEnum {
  // 阿里云服务器
  alicloud = '1',
  // 飞鸽传书
  flyingPigeon = '2'
}

/**
 * 推送服务器枚举
 */
export enum PushServerEnum {
  // 阿里云服务器
  alicloud = '1',
  // 个推
  personPush = '2'
}

/**
 * 选择长期未登录动作枚举
 */
export enum LoginActionEnum {
  // 禁用
  prohibit = 1,
  // 删除
  delete = 0
}

/**
 * 模板状态枚举
 */
export enum AlarmDumpEnum {
  // 启用
  enable = '1',
  // 不启用
  disable = '0',
}

/**
 * 模板状态枚举
 */
export enum TaskStatusEnum {
  // 告警
  alarm = 1,
  // 系统
  system = 2,
  // 成功
  success = 3,
  // 错误
  error = 4,
  // 销账
  inspection = 5,
  // 巡检
  clearBarrier = 6,
  // 未执行
  notPerformed = 8,
  // 安装工单
  install = 9,
  // 告警确认工单
  alarmOrder = 10,
  // 故障
  trouble = 11
}

/**
 * 邮件发送服务器类型枚举
 */
export enum EmailTypeEnum {
  pop3 = '1',
  smtp = '2'
}

/**
 * 输入框错误显示位置枚举
 */
export enum InputErrPositionEnum {
  // ipv6 startIp错误提示信息
  errIpv6StartIp = 0,
  // ipv6 endIp错误提示信息
  errIpv6EndIp = 1,
  // ipv4 startIp错误提示信息
  errIpv4StartIp = 2,
  // ipv4 endIp错误提示信息
  errIpv4EndIp = 3,
  // ipv4 mask错误提示信息
  errIpv4Mask = 4,
}

/**
 * 状态通用
 */
export enum StateEnum {
  // 启用
  enable = '1',
  // 不启用
  disable = '0',
}

export enum OperateResultEnum {
  // 成功
  success = '1',
  failure = '0',
}
