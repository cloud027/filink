import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {EquipmentItemEnum} from '../enum/product.enum';
import {RuleUtil} from '../../../../shared-module/util/rule-util';

/**
 * 每一种设备类型字段都不一样
 */
export class ProductUtil {
  /**
   * 获取设备参数总方法
   */
  public static getEquipmentColumns(equipmentType: EquipmentTypeEnum, language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    let formItems = [];
    const fun = CommonUtil.enumMappingTransform(equipmentType, EquipmentTypeEnum, EquipmentItemEnum);
    if (fun) {
      formItems = ProductUtil[fun](language, $rule);
    }
    return formItems;
  }

  /**
   * 获取摄像头配置项
   */
  public static getCameraConfigColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 最大图像尺寸
        label: language.maxImageSize, key: 'maxImageSize', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 分辨率
        label: language.resolvingPower, key: 'resolvingPower', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 焦距
        label: language.focalDistance,
        key: 'focalDistance',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 红外照射距离
        label: language.infraredRadiationDistance,
        key: 'infraredRadiationDistance',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 通信接口
        label: language.communicationInterface,
        key: 'communicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      }
    ];
  }

  /**
   * 获取信息屏配置项
   */
  public static getScreenConfigColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 模组尺寸
        label: language.moduleSize, key: 'moduleSize', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 显示尺寸
        label: language.displaySize, key: 'displaySize', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 分辨率
        label: language.resolvingPower, key: 'resolvingPower', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 亮度
        label: language.brightness, key: 'brightness', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 通信接口
        label: language.communicationInterface,
        key: 'communicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      }
    ];
  }

  /**
   * 获取单灯控制器配置项
   */
  public static getSingleLampColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 供电电流
        label: language.supplyCurrent,
        key: 'supplyCurrent',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 输出电压
        label: language.outputVoltage,
        key: 'outputVoltage',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 输出电流
        label: language.outputCurrent,
        key: 'outputCurrent',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 最大负载功率
        label: language.maxLoadPower, key: 'maxLoadPower', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 通信接口
        label: language.communicationInterface,
        key: 'communicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      }
    ];
  }

  /**
   * 获取广播配置项
   */
  public static getBroadcastColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 灵敏度
        label: language.sensitivity, key: 'sensitivity', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 频率响应
        label: language.frequencyResponse, key: 'frequencyResponse', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 信噪比
        label: language.noiseRatio, key: 'noiseRatio', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 喇叭尺寸
        label: language.hornSize, key: 'hornSize', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 通信接口
        label: language.communicationInterface,
        key: 'communicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
    ];
  }

  /**
   * 获取网关配置项
   */
  public static getGatewayColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 无线协议
        label: language.wirelessProtocol, key: 'wirelessProtocol', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 应用接口
        label: language.applicationInterface,
        key: 'applicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
      { // CPU
        label: language.CPU, key: 'CPU', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // DDR3
        label: language.DDR3, key: 'DDR3', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 边缘计算
        label: language.edgeComputing, key: 'edgeComputing', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
    ];
  }

  /**
   * 获取无线ap配置项
   */
  public static getWirelessApColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 工作频段
        label: language.workingFrequency, key: 'workingFrequency', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 发射功率
        label: language.transmittingPower, key: 'transmittingPower', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 传输速率
        label: language.transmissionSpeed, key: 'transmissionSpeed', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 最大距离
        label: language.maxDistance, key: 'maxDistance', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 通信接口
        label: language.communicationInterface,
        key: 'communicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
    ];
  }

  /**
   * 获取环境监测配置项
   */
  public static getEnvironmentalMonitoringColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 通信接口
        label: language.communicationInterface,
        key: 'communicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
    ];
  }

  /**
   * 获取集中控制器配置项
   */
  public static getCentralizedControllerColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    return [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 防雷等级
        label: language.lightningProtectionLevel, key: 'lightningProtectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 单网容量
        label: language.singleNetworkCapacity,
        key: 'singleNetworkCapacity',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 通讯距离
        label: language.communicationDistance,
        key: 'communicationDistance',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 应用接口
        label: language.applicationInterface,
        key: 'applicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
      { // 通讯协议
        label: language.communicationProtocol,
        key: 'communicationProtocol',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
      { // 上行通讯
        label: language.upLinkCommunication, key: 'upLinkCommunication', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 下行通讯
        label: language.downLinkCommunication,
        key: 'downLinkCommunication',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
    ];
  }

  /**
   * 获取充电桩配置项
   */
  public static getChargingPileColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    const chargingPileColumns = [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 输出电压
        label: language.outputVoltage,
        key: 'outputVoltage',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 输出电流
        label: language.outputCurrent,
        key: 'outputCurrent',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
    ];
    return chargingPileColumns;
  }

  /**
   * 获取一键报警器配置项
   */
  public static getOneButtonAlarmColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    const oneButtonAlarmColumns = [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 供电电流
        label: language.supplyCurrent,
        key: 'supplyCurrent',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 通信制式
        label: language.communicationMode, key: 'communicationMode', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 通信接口
        label: language.communicationInterface,
        key: 'communicationInterface',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
    ];
    return oneButtonAlarmColumns;
  }

  /**
   * 获取微基站配置项
   */
  public static getMicroBaseStationColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    const microBaseStationColumns = [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 重量
        label: language.weight, key: 'weight', type: 'input', col: 24, require: false, rule: [$rule.positiveInteger()], customRules: [],
      },
      { // 防护等级
        label: language.protectionLevel, key: 'protectionLevel', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 覆盖距离
        label: language.coverageDistance,
        key: 'coverageDistance',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
    ];
    return microBaseStationColumns;
  }

  /**
   * 获取智能短路器配置项
   */
  public static getSmartCircuitBreakerColumn(language: ProductLanguageInterface, $rule: RuleUtil): FormItem[] {
    const smartCircuitBreakerColumns = [
      { // 供电电压
        label: language.supplyVoltage,
        key: 'supplyVoltage',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 供电电流
        label: language.supplyCurrent,
        key: 'supplyCurrent',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 功耗
        label: language.powerWaste,
        key: 'powerWaste',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, $rule.positiveInteger()],
        customRules: [],
      },
      { // 漏保电流
        label: language.leakageProtectionCurrent,
        key: 'leakageProtectionCurrent',
        type: 'input',
        col: 24,
        require: false,
        rule: [$rule.positiveInteger()],
        customRules: [],
      },
      { // 尺寸
        label: language.size, key: 'size', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 分段能力
        label: language.segmentationCapability,
        key: 'segmentationCapability',
        type: 'input',
        col: 24,
        require: false,
        rule: [],
        customRules: [],
      },
      { // 级数
        label: language.stagesNum, key: 'stagesNum', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 脱扣类型
        label: language.tripType, key: 'tripType', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
      { // 通信接口
        label: language.communicationMode, key: 'communicationInterface', type: 'input', col: 24, require: false, rule: [], customRules: [],
      },
    ];
    return smartCircuitBreakerColumns;
  }

  /**
   * 打印qunee图片工具
   */
  public static onPrint(graph, language: ProductLanguageInterface): boolean {
    // 画布打印缩放级别和范围内容
    const imageInfo = graph.exportImage(1, graph.bounds);
    if (!imageInfo || !imageInfo.data) {
      return false;
    }
    const bytes = window.atob(imageInfo.data.split(',')[1]);
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    const file = new Blob([ab], {type: 'image/png'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download =  `${language.exportImg}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
