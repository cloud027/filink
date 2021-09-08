/**
 * 产品可用设备类型
 */
import {EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';

export const PRODUCT_EQUIPMENT_TYPE_CONST = [
  EquipmentTypeEnum.gateway,
  EquipmentTypeEnum.singleLightController,
  EquipmentTypeEnum.centralController,
  EquipmentTypeEnum.informationScreen,
  EquipmentTypeEnum.camera,
  EquipmentTypeEnum.broadcast,
  EquipmentTypeEnum.wirelessAp,
  EquipmentTypeEnum.chargingPile,
  EquipmentTypeEnum.oneButtonAlarm,
  EquipmentTypeEnum.baseStation,
  EquipmentTypeEnum.intelligentEntranceGuardLock,
  EquipmentTypeEnum.weatherInstrument,
  EquipmentTypeEnum.oneTouchCalling];
/**
 * 产品可用设施类型
 */
export const PRODUCT_DEVICE_TYPE_CONST = [DeviceTypeEnum.opticalBox, DeviceTypeEnum.wisdom,
  DeviceTypeEnum.distributionPanel, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet];
