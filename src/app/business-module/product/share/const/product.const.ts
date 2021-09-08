/**
 * 最大端口数量
  */
export const MAX_PORT_NUM = 99;

/**
 * 设备专有字段key
 * appId 字段为选择了产品为非私有云显示
 */
export const EQUIPMENT_SP_COLUMN = ['dataCapacity', 'softwareVersion', 'hardwareVersion', 'portList', 'platformType', 'communicateType'];

/**
 * 北京时间需要在utc时间上加上8小时
 */
export const TIME_ZONE_BEIJING = 8 * 60 * 60 * 1000;

/**
 * 产品导出时需要后台做的特殊处理
 */
export const TRANSLATION_ITEM = ['typeCode', 'platformType', 'communicateType', 'unit', 'createTime', 'updateTime'];
