/**
 * 报表分析类型
 */
export enum ReportAnalysisTabEnum {
  // 电流报表
  electricCurrent = '0',
  // 电压报表
  voltage = '1',
  // 功率报表
  powerReport = '2',
  // 电能报表
  electricEnergy = '3',
  // 功率因数报表
  powerFactorReport = '4',
  // 用电量报表
  electricityConsumptionReport = '5',
  // 工作时长报表
  workingTimeReport = '6',
  // 亮灯率报表
  lightingRate = '7',
  // 节能率报表
  energySavingRateReport = '8',
}
export enum ReportAnalysisTypeEnum {
  // 电流报表
  electricCurrent = 'electric',
  // 电压报表
  voltage = 'voltage',
  // 功率报表
  power = 'power',
  // 电能报表
  electricEnergy = 'electricEnergy',
  // 功率因数报表
  powerFactor = 'powerFactor',
  // 用电量报表
  electricityConsumption = 'electricityConsumption',
  // 工作时长报表
  workingTime = 'workingTime',
  // 亮灯率报表
  lightingRate = 'lightingRate',
  // 节能率报表
  energySavingRate = 'energySavingRate',
}

/**
 * 设备类型
 */
export enum EquipmentTypeEnum {
  // 单灯控制器
  singleLightController = 'E002',
  // 集中控制器
  centralController = 'E003',
}

/**
 * 统计维度
 */
export enum StatisticalDimensionEnum {
  // 项目 未来可能会用项目
  // project = '1',
  // 区域
  area = '2',
  // 分组
  group = '3',
  // 设备
  equipment = '4'
}

/**
 * 统计时间类型
 */
export enum DateTypeEnum {
  // 按日
  day = 'day',
  // 按周
  week = 'week',
  // 按月
  month = 'month',
  // 按年
  year = 'year',
}

/**
 * 统计维度名称
 */
export enum StatisticalDimensionNameEnum {
  areaName = '2',
  groupName = '3',
  equipmentName = '4'
}
/**
 * 电流报表分析表格内容枚举
 */
export enum ElectricCurrentItemEnum {
  // 输入电流
  inputCurrent= 'inputCurrent',
  // 最小输入电流
  minInputCurrent = 'minInputCurrent',
  // 最大输入电流
  maxInputCurrent = 'maxInputCurrent',
  //  A相电流有效值(A)
  aEffectiveValueOfCurrent = 'AEffectiveValueOfCurrent',
  //  B相电流有效值(A)
  bEffectiveValueOfCurrent = 'BEffectiveValueOfCurrent',
  //  C相电流有效值(A)
  cEffectiveValueOfCurrent = 'CEffectiveValueOfCurrent',
  // 最小A相电流有效值
  minAEffectiveValueOfCurrent = 'minAEffectiveValueOfCurrent',
  //  最大A相电流有效值
  maxAEffectiveValueOfCurrent = 'maxAEffectiveValueOfCurrent',
  // 最小B相电流有效值
  minBEffectiveValueOfCurrent = 'minBEffectiveValueOfCurrent',
  // 最大B相电流有效值
  maxBEffectiveValueOfCurrent = 'maxBEffectiveValueOfCurrent',
  // 最小C相电流有效值
  minCEffectiveValueOfCurrent = 'minCEffectiveValueOfCurrent',
  // 最大C相电流有效值
  maxCEffectiveValueOfCurrent = 'maxCEffectiveValueOfCurrent',
}
/**
 * 电压报表分析表格内容枚举
 */
export enum VoltageItemEnum {
  // 输入电压
  inputVoltage = 'inputVoltage',
  // 最小输入电压
  minInputVoltage = 'minInputVoltage',
  // 最大输入电压
  maxInputVoltage = 'maxInputVoltage',
  //  A相电压有效值(V)
  aEffectiveValueOfVoltage = 'AEffectiveValueOfVoltage',
  // B相电压有效值(V)
  bEffectiveValueOfVoltage= 'BEffectiveValueOfVoltage',
  //  C相电压有效值(V)
  cEffectiveValueOfVoltage = 'CEffectiveValueOfVoltage',
  // AB线电压
  abEffectiveValueOfVoltage = 'ABEffectiveValueOfVoltage',
  // bc线电压
  bcEffectiveValueOfVoltage = 'BCEffectiveValueOfVoltage',
  // CA线电压
  caEffectiveValueOfVoltage = 'CAEffectiveValueOfVoltage',
  // 最小A相电压有效值
  minAEffectiveValueOfVoltage = 'minAEffectiveValueOfVoltage',
  // 最大A相电压有效值
  maxAEffectiveValueOfVoltage = 'maxAEffectiveValueOfVoltage',
  // 最小B相电压有效值
  minBEffectiveValueOfVoltage = 'minBEffectiveValueOfVoltage',
  // 最大B相电压有效值
  maxBEffectiveValueOfVoltage = 'maxBEffectiveValueOfVoltage',
  // 最小C相电压有效值
  minCEffectiveValueOfVoltage = 'minCEffectiveValueOfVoltage',
  // 最大C相电压有效值
  maxCEffectiveValueOfVoltage = 'maxCEffectiveValueOfVoltage',
  // 最小AB线电压
  minABEffectiveValueOfVoltage = 'minABEffectiveValueOfVoltage',
  // 最大AB线电压
  maxABEffectiveValueOfVoltage = 'maxABEffectiveValueOfVoltage',
  // 最小BC线电压
  minBCEffectiveValueOfVoltage = 'minBCEffectiveValueOfVoltage',
  // 最大BC线电压
  maxBCEffectiveValueOfVoltage = 'maxBCEffectiveValueOfVoltage',
  // 最小CA线电压
  minCAEffectiveValueOfVoltage = 'minCAEffectiveValueOfVoltage',
  // 最大CA线电压
  maxCAEffectiveValueOfVoltage = 'maxCAEffectiveValueOfVoltage'
}

/**
 * 功率报表分析表格内容枚举
 */
export  enum PowerItemEnum {
  // 功率
  power = 'power',
  // 最小功率
  minPower = 'minPower',
  // 最大功率
  maxPower = 'maxPower',
  // 瞬时总有功功率
  activePower = 'ActivePower',
  // 瞬时A相有功功率
  aActivePower = 'AActivePower',
  // 瞬时B相有功功率
  bActivePower = 'BActivePower',
  // 瞬时C相有功功率
  cActivePower = 'CActivePower',
  // 瞬时总无功功率
  reactivePower = 'ReactivePower',
  // 瞬时A相无功功率
  aReactivePower = 'AReactivePower',
  // 瞬时A相无功功率
  bReactivePower = 'BReactivePower',
  // 瞬时B相无功功率
  cReactivePower = 'CReactivePower',
  // 最小瞬时总有功功率
  minActivePower = 'minActivePower',
  // 最大瞬时总有功功率
  maxActivePower = 'maxActivePower',
  // 最小瞬时A相有相功率 (kw)
  minAActivePower = 'minAActivePower',
  // 最大瞬时A相有相功率(kw)
  maxAActivePower = 'maxAActivePower',
  // 最小瞬时B相有功功率
  minBActivePower = 'minBActivePower',
  // 最大瞬时B相有功功率
  maxBActivePower = 'maxBActivePower',
  // 最小瞬时C相有功功率
  minCActivePower = 'minCActivePower',
  // 最大瞬时C相有功功率
  maxCActivePower = 'maxCActivePower',
  // 最小瞬时总无功功率
  minReactivePower = 'minReactivePower',
  // 最大瞬时总无功功率
  maxReactivePower = 'maxReactivePower',
  // 最小瞬时A相无功功率
  minAReactivePower = 'minAReactivePower',
  // 最大瞬时A相无功功率
  maxAReactivePower = 'maxAReactivePower',
  // 最小瞬时B相无功功率
  minBReactivePower = 'minBReactivePower',
  // 最大瞬时B相无功功率
  maxBReactivePower = 'maxBReactivePower',
  // 最小瞬时C相无功功率
  minCReactivePower = 'minCReactivePower',
  // 最大瞬时C相无功功率
  maxCReactivePower = 'maxCReactivePower',
}
/**
 * 电能报表分析表格内容枚举
 */
export enum ElectricEnergyItemEnum {
  // 电能
  energy = 'energy',
  // 总相正向有功电能量
  activeElectricEnergy = 'ActiveElectricEnergy',
  // A相正向有功电能量
  aActiveElectricEnergy = 'AActiveElectricEnergy',
  // B相正向有功电能量
  bActiveElectricEnergy = 'BActiveElectricEnergy',
  // C相正向有功电能量
  CActiveElectricEnergy = 'CActiveElectricEnergy',
  // 总正向无功电能量
  reactiveEnergy = 'ReactiveEnergy',
  // A相正向无功电能量
  aReactiveEnergy = 'AReactiveEnergy',
  // B相正向无功电能量
  BReactiveEnergy = 'BReactiveEnergy',
  // C相正向无功电能量
  CReactiveEnergy = 'CReactiveEnergy',
}
/**
 * 功率因数报表分析表格内容枚举
 */
export enum PowerFactorItemEnum {
  // 瞬时总相功率因数
  powerFactor = 'PowerFactor',
  // 瞬时A相功率因数
  APowerFactor = 'APowerFactor',
  // 瞬时B相功率因数
  BPowerFactor = 'BPowerFactor',
  // 瞬时C相功率因数
  CPowerFactor = 'CPowerFactor',
  // 最小瞬时总相功率因数
  minPowerFactor = 'minPowerFactor',
  // 最大瞬时总相功率因数
  maxPowerFactor = 'maxPowerFactor',
  // 最小瞬时A相功率因数
  minAPowerFactor = 'minAPowerFactor',
  // 最大瞬时A相功率因数
  maxAPowerFactor = 'maxAPowerFactor',
  // 最小瞬时B相功率因数
  minBPowerFactor = 'minBPowerFactor',
  // 最大瞬时B相功率因数
  maxBPowerFactor = 'maxBPowerFactor',
  // 最小瞬时C相功率因数
  minCPowerFactor = 'minCPowerFactor',
  // 最大瞬时C相功率因数
  maxCPowerFactor = 'maxCPowerFactor',
}
/**
 * 用电量报表分析表格内容枚举
 */
export enum ElectricityConsumptionItemEnum {
  // 用电量
  electricityConsumption = 'electricityConsumption',
}
/**
 * 工作时长报表分析表格内容枚举
 */
export enum WorkingTimeItemEnum {
  // 工作时长 (s)
  workingTime = 'workingTime'
}
/**
 * 亮灯率报表分析表格内容枚举
 */
export enum LightingRateItemEnum {
  // 亮灯率
  lightingRateUnit = 'lightingRateUnit'
}
/**
 * 节能率报表分析表格内容枚举
 */
export enum EnergySavingRateItemEnum {
  // 节能率(%)
  energySavingRate = 'energySavingRate'
}
