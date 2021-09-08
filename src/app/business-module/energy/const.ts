/**
 * 应用系统里面的路由配置
 */
export const routerJump = {
    LIGHTING_POLICY_CONTROL: 'business/application/lighting/policy-control',
    LIGHTING_POLICY_CONTROL_ADD: 'business/application/lighting/policy-control/add',
    LIGHTING_POLICY_CONTROL_EDIT: 'business/application/lighting/policy-control/update',
    EQUIPMENT_DETAILS: '/business/application/lighting/equipment-list/policy-details',
    SECURITY_DETAILS: '/business/application/security/equipment-list/policy-details',
    GROUP_DETAILS: '/business/application/lighting/equipment-list/group-policy-details',
    RELEASE_DETAILS: '/business/application/release/equipment-list/policy-details',
    RELEASE_GROUP_DETAILS: '/business/application/release/equipment-list/group-policy-details',
    LOOP_DETAILS: '/business/application/lighting/equipment-list/loop-policy-details',
    LIGHTING_WORKBENCH: 'business/application/lighting/workbench',
    RELEASE_WORKBENCH: 'business/application/release/workbench',
    STRATEGY: '/business/application/strategy/list',
    STRATEGY_ADD: '/business/application/strategy/add',
    STRATEGY_EDIT: '/business/application/strategy/update',
    STRATEGY_DETAILS: '/business/application/strategy/policy-details',
    RELEASE_POLICY_CONTROL: 'business/application/release/policy-control',
    RELEASE_WORKBENCH_ADD: 'business/application/release/policy-control/add',
    RELEASE_WORKBENCH_DETAILS: 'business/application/release/policy-details',
    RELEASE_WORKBENCH_EDIT: 'business/application/release/policy-control/update',
    SECURITY_WORKBENCH: 'business/application/security/workbench',
    SECURITY_POLICY_CONTROL: 'business/application/security/policy-control',
    SECURITY_POLICY_CONTROL_ADD: 'business/application/security/policy-control/add',
    SECURITY_POLICY_CONTROL_DETAILS: 'business/application/security/policy-details',
    SECURITY_POLICY_CONTROL_EDIT: 'business/application/security/policy-control/update',
    LIGHTING_DETAILS: 'business/application/lighting/policy-details',
    FILE_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

/**
 * 步骤条切换样式
 */
export const classStatus = {
    STEPS_FINISH: 'finish',
    STEPS_ACTIVE: 'active',
    DETAILS_ACTIVE: 'details-active'
};

/**
 * 区分三个平台的常量
 */
export const applicationFinal = {
    LIGHTING: 'lighting',
    RELEASE: 'release',
    SECURITY: 'security',
    STRATEGY: 'strategy',
    DATE_TYPE: 'yyyy-MM-dd hh:mm:ss',
    DATE_TYPE_DAY: 'yyyy-MM-dd'
};

/**
 * 视频常量
 */
export const videoFormat = {
    '.mp4': '.mp4'
};

/**
 * 图片常量
 */
export const pictureFormat = {
    '.jpeg': '.jpeg',
    '.png': '.png',
    '.jpg': '.jpg'
};

/**
 * 计算文件大小常量
 */
export const calculationFileSize = {
    kb: 1024,
    mb: 1024 * 1024,
    week_time: 7 * 24 * 60 * 60 * 1000
};

/**
 * 策略列表
 */
export const strategyList = {
    lighting: '1',
    centralizedControl: '2',
    information: '3',
    broadcast: '4',
    linkage: '5'
};

export const execStatus = {
    free: '0',
    implement: '1'
};
/**
 * 控制类型
 */
export const controlType = {
    platform: '1',
    equipment: '2'
};
/**
 * 策略状态
 */
export const strategyStatus = {
    open: '1',
    close: '0'
};
/**
 * 设备状态统计
 */
export const equipmentStatus = {
    // 未配置
    unSet: '1',
    // 正常在线
    online: '2',
    // 告警
    alarm: '3',
    // 故障
    break: '4',
    // 下线
    offline: '5',
    // 失联
    outOfContact: '6',
    // 已拆除
    dismantled: '7'
};
/**
 * 设备状态统计
 */
export const alarmLevelStatus = {
    // 通信告警
    signal: 'alarmType1',
    // 通信告警
    businessQuality: 'alarmType2',
    // 环境告警
    environmentalScience: 'alarmType3',
    // 电力告警
    power: 'alarmType4',
    // 安全告警
    security: 'alarmType5',
    // 设备告警
    equipment: 'alarmType6'
};

/**
 * 开启/关闭
 */
export const SwitchAction = {
    open: 'open',
    close: 'close',
    light: 'light'
};

/**
 * 上电/下电
 */
export const Electric = {
    up: 'up',
    down: 'down'
};

/**
 * 告警分类数量统计
 */
export const AlarmLevelStatistics = {
    // 紧急
    urgent: 'alarmLevel1',
    // 主要
    main: 'alarmLevel2',
    // 次要
    secondary: 'alarmLevel3',
    // 提示
    tips: 'alarmLevel4'
};

/**
 * 步骤条数据集合
 */
export const setData = [
    {
        number: 1,
        activeClass: ' active',
        title: '基本信息'
    },
    {
        number: 2,
        activeClass: '',
        title: '策略详情'
    },
    {
        number: 3,
        activeClass: '',
        title: '完成'
    }
];

/**
 * 返回结果的code码
 */
export const ResultCode = {
    Z4003: 'Z4003',
    success: '00000'
};

/**
 * 数字常量 0-20  删除
 */
export const num = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20
};

/**
 * type常量 用于一些新增 更新 操作
 */
export const type = {
    add: 'add',
    update: 'update'
};

/**
 * 节目状态
 */
export const programStatus = {
    toBeReviewed: '0',
    reviewed: '1',
    auditFailed: '2',
    disabled: '3'
};

/**
 * 工单状态
 */
export const workOrderState = {
    assigning: '0',
    assigned: '1',
    underReview: '2',
    completed: '3',
    chargeback: '4',
    cancelled: '5'
};

/**
 * 统计图枚举
 */
export const statisticalChart = {
    workOrderIncrement: '工单增量',
    duration: '设备播放时长',
    programsLaunched: '设备节目投放数量'
};
