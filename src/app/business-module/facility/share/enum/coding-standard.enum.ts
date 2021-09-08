/**
 * 编码标准枚举
 */
export enum CodingStandardEnum {
  // 启用
  enable = '1',
  // 禁用
  disable = '0'
}

/**
 * 编码范围枚举
 */
export enum CodingRangeEnum {
  // 全部
  all = '0',
  // 区域
  area = '1'
}

/**
 * 新增编辑编码标准前四级key值枚举
 */
export enum OptionalFieldEnum {
  // 一级
  firstLevel = 'firstLevel',
  // 二级
  secondLevel = 'secondLevel',
  // 三级
  thirdLevel = 'thirdLevel',
  // 四级
  fourthLevel = 'fourthLevel'
}

/**
 * 新增编辑编码标准前四级自定义key值枚举
 */
export enum OptionalFieldCustomizeEnum {
  // 一级
  firstLevelCustomize = 'firstLevelCustomize',
  // 二级
  secondLevelCustomize = 'secondLevelCustomize',
  // 三级
  thirdLevelCustomize = 'thirdLevelCustomize',
  // 四级
  fourthLevelCustomize = 'fourthLevelCustomize'
}

/**
 * 新增编辑编码标准资产录入年，资产录入年月，资产录入年月日枚举
 */
export enum AssetEntryDateRange {
  // 资产录入年
  AssetEntryYear = '4',
  // 资产录入年月
  AssetEntryYearAndMonth = '5',
  // 资产录入年月日
  AssetEntryYearMonthAndDay = '6'
}

