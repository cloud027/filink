import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';

/**
 * Created by xiaoconghu on 2019/6/17.
 * 智能标签相关配置
 */

// 设施形态
export const DeviceFormEnum = {
  /**
   * 光纤配线架
   */
  FIBER: 0,

  /**
   * 中间配线架
   */
  MID: 1,

  /**
   * 总配线架
   */
  TOTAL: 2
};

// 安装方式
export const InstallationModeEnum = {

  /**
   * 落地
   */
  LANDING: 0,

  /**
   * 架空
   */
  OVER_HEAD: 1,

  /**
   * 壁挂
   */
  WALL_MOUNT: 2,

  /**
   * 抱杆
   */
  POLE: 3
};

// 密封方式
export const SealModeEnum = {

  /**
   * 热缩
   */
  HEAT_SHRINK: 0,

  /**
   * 机械
   */
  MECHANICAL: 1
};

// 敷设方式
export const LayModeEnum = {

  /**
   * 人井
   */
  WELL: 0,

  /**
   * 管道
   */
  PIPELINE: 1,

  /**
   * 架空
   */
  OVER_HEAD: 2,

  /**
   * 直埋
   */
  DIRECTLY_BURIED: 3,

  /**
   * 壁挂
   */
  WALL_MOUNT: 4,

  /**
   * 托架
   */
  BRACKET: 5,

  /**
   * 手孔
   */
  HAND_HOLE: 6,

  /**
   * 人孔
   */
  MANHOLE: 7
};

// 规格说明
export const StandardEnum = {

  /**
   * 两进两出
   */
  TWICE: 0,

  /**
   * 三进三出
   */
  THREE_TIMES: 1,

  /**
   * 四进四出
   */
  FOUR_TIMES: 2
};

// 接续信息
export const FollowEnum = {

  /**
   * 直通
   */
  STRAIGHT_THROUGH: 0,

  /**
   * 分歧
   */
  SPLIT: 1
};

export const LabelStateEnum = {

  /**
   * 正常
   */
  NORMAL: 0,

  /**
   * 异常
   */
  ABNORMAL: 1
};
export const LabelTypeEnum = {

  /**
   * RFID
   */
  RFID: 0,

  /**
   * 二维码
   */
  QR_CODE: 1,
  /**
   * 无
   */
  NONE: 2
};
export const ApparatusTypeEnum = {

  /**
   * 帽式
   */
  CAP_TYPE: 0,

  /**
   * 卧式
   */
  HORIZONTAL: 1
};

// 智能标签更新类型
export enum UploadTypeEnum {
  /**
   * 新增
   */
  add,
  /**
   * 删除
   */
  remove,
  /**
   * 修改
   */
  update,
}

/**
 * 获取对应的常量工具类
 */
export class SmartLabelConfig {
  public static getDeviceFormEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(DeviceFormEnum, i18n, code);
  }

  public static getInstallationModeEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(InstallationModeEnum, i18n, code);
  }

  public static getSealModeEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(SealModeEnum, i18n, code);
  }

  public static getLayModeEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(LayModeEnum, i18n, code);
  }

  public static getStandardEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(StandardEnum, i18n, code);
  }

  public static getFollowEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(FollowEnum, i18n, code);
  }

  public static getLabelStateEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(LabelStateEnum, i18n, code);
  }

  public static getLabelTypeEnum(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(LabelTypeEnum, i18n, code);
  }

}
