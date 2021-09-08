import {en_US, NzI18nService, zh_CN} from 'ng-zorro-antd';
import _zh_CN from '../../../assets/i18n/zh_CN';
import _en_US from '../../../assets/i18n/en_US';
import {TimeType} from '../enum/date-format-string.enum';
import {differenceInCalendarDays, parse, startOfWeek, startOfYear} from 'date-fns';
import * as enDateLocale from 'date-fns/locale/en';
import * as cnDateLocale from 'date-fns/locale/zh_cn';
import {
  DeployNameEnum,
  DeployRankNameEnum,
  DeployRankStatusEnum,
  DeployStatusClassNameEnum,
  DeployStatusColourEnum,
  DeployStatusEnum,
  DeviceStatusEnum,
  DismantleDeviceStatusEnum,
  DeviceStatusIconEnum,
  DeviceStatusNameEnum,
  DeviceStatusNameRankEnum,
  DeviceTypeEnum,
  DeviceTypeIconEnum,
  facilityStatusColourEnum,
  facilityStatusColourRankEnum,
  DeviceDetailStatusEnum
} from '../../core-module/enum/facility/facility.enum';
import {EquipmentListModel} from '../../core-module/model/equipment/equipment-list.model';
import {AreaColorEnum, AreaRankEnum} from '../../core-module/enum/index/index.enum';
import {
  CameraTypeEnum,
  EquipmentStatusEnum,
  EquipmentStatusIconEnum,
  equipmentStatusNameEnum,
  equipmentStatusRankNameEnum,
  EquipmentTypeEnum,
  EquipmentTypeIconEnum,
  equipmentTypeNameEnum,
  equipmentTypeRankNameEnum
} from '../../core-module/enum/equipment/equipment.enum';
import {AreaEnum} from '../../core-module/enum/area/area.enum';
import {AlarmTypeEnum, AlarmTypeRankEnum} from '../../core-module/enum/alarm/alarm-type.enum';
import {CallTypeEnum} from '../../core-module/enum/product/product.enum';
import {OperatorEnum} from '../enum/operator.enum';
import {TableSortConfig} from '../enum/table-style-config.enum';
import * as lodash from 'lodash';
import {QueryConditionModel} from '../model/query-condition.model';
import {PageModel} from '../model/page.model';

/**
 * Created by xiaoconghu on 2018/11/20.
 * 工具类
 */
export class CommonUtil {
  /**
   * 获取uuid
   * param {number} len
   * returns {string}
   */
  public static getUUid(len: number = 36) {
    const uuid = [];
    const str = '0123456789abcdef';
    for (let i = 0; i < len; i++) {
      uuid[i] = str.substr(Math.floor(Math.random() * 0x10), 1);
    }
    if (len === 36) {
      uuid[14] = '4';
      uuid[19] = str.substr((uuid[19] & 0x3 | 0x8), 1);
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    }
    return uuid.join('').replace(/-/g, '');
  }

  /**
   * 切换语言包
   * param localId
   * returns {any}
   */
  public static toggleNZi18n(_localId?) {
    const localId = _localId || window.localStorage.getItem('localId') || 'zh_CN';
    let language;
    let dateLanguage = cnDateLocale;
    switch (localId) {
      case 'zh_CN':
        language = Object.assign(zh_CN, _zh_CN);
        dateLanguage = cnDateLocale;
        if (_localId) {
          window.localStorage.setItem('localId', 'zh_CN');
        }
        break;
      case 'en_US':
        language = Object.assign(en_US, _en_US);
        dateLanguage = enDateLocale;

        if (_localId) {
          window.localStorage.setItem('localId', 'en_US');
        }
        break;
      default:
        language = Object.assign(zh_CN, _zh_CN);
        break;
    }
    return {language, dateLanguage};
  }

  /**
   * 时间格式化
   * param fmt
   * param date
   * returns {any}
   */
  public static dateFmt(fmt, date) {
    const o = {
      'M+': date.getMonth() + 1,                 // 月份
      'd+': date.getDate(),                    // 日
      'h+': date.getHours(),                   // 小时
      'm+': date.getMinutes(),                 // 分
      's+': date.getSeconds(),                 // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {

        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  }

  /**
   * 获取utc时间戳
   * param {Date} date
   * returns {number}
   */
  public static getUTCTime(date: Date): number {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const d = date.getUTCDate();
    const h = date.getUTCHours();
    const M = date.getUTCMinutes();
    const s = date.getUTCSeconds();
    return Date.UTC(y, m, d, h, M, s);
  }

  /**
   * 时间转时间戳
   * param date
   * returns {any}
   */
  public static getTimeStamp(date) {
    if (date instanceof Date) {
      return date.getTime();
    } else {
      return null;
    }
  }

  /**
   * 对象深拷贝
   * param obj   拷贝对象
   * returns {any[] | {}}   返回拷贝对象
   */
  public static deepClone(obj): any {
    const objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = this.deepClone(obj[key]);
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
    return objClone;
  }


  /**
   * 数组深拷贝方法
   */
  public static deepCopy(obj): any {
    // 只拷贝对象
    if (typeof obj !== 'object') {
      return;
    }
    // 根据obj的类型判断是新建一个数组还是一个对象
    const newObj = obj instanceof Array ? [] : {};
    for (const key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] = typeof obj[key] === 'object' && obj[key] !== null ? this.deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj;
  }

  /**
   * 获取设施图标地址
   * param {string} size   设施图标大小  如：16-20
   * param {string} type   设施类型  如：16-20
   * param {string} status 设施状态  如：1   不传为选中状态的图标
   * returns {string}
   */
  public static getFacilityIconUrl(size: string, type: string, status: string = '0') {
    if (type) {
      const facilityName = this.enumMappingTransform(type, DeviceTypeEnum, DeviceTypeIconEnum);
      const facilityStatus = this.enumMappingTransform(status, DeviceStatusNameEnum, DeviceStatusNameRankEnum);
      // const iconName = `icon_${FACILITY_TYPE_NAME[type]}_${FACILITY_STATUS_NAME[status]}.png`;
      const iconName = `icon_${facilityName}_${facilityStatus}.png`;
      return `assets/facility-icon/${size}/${iconName}`;
    } else {
      return `assets/facility-icon/18-24/icon_img_broken.png`;
    }
  }

  /**
   * 获取设施建设状态图标地址
   * param {string} size   设施图标大小  如：16-20
   * param {string} type   设施类型  如：16-20
   * param {string} status 设施状态  如：1   不传为选中状态的图标
   * returns {string}
   */
  public static getFacilityPointIconUrl(size: string, type: string, status: string = 'selected') {
    if (type) {
      const facilityName = this.enumMappingTransform(type, DeviceTypeEnum, DeviceTypeIconEnum);
      const iconName = `icon_${facilityName}_${status}.png`;
      return `assets/facility-icon/${size}/${iconName}`;
    } else {
      return `assets/facility-icon/18-24/icon_img_broken.png`;
    }
  }

  /**
   * 获取设备图标地址
   * param {string} size   设施图标大小  如：16-20
   * param {string} type   设施类型  如：16-20
   * param {string} status 设施状态  如：1   不传为选中状态的图标
   * returns {string}
   */
  public static getEquipmentTypeIconUrl(size: string, type: string, status: string = '0', equipmentList?) {
    if (type) {
      let iconName = '';
      const equipmentStatus = this.enumMappingTransform(status, equipmentStatusNameEnum, equipmentStatusRankNameEnum);
      const equipmentName = this.enumMappingTransform(type, equipmentTypeNameEnum, equipmentTypeRankNameEnum);
      if (equipmentList && type === 'E005') {
        // 枪型摄像头
        const gCamera = equipmentList.every(item => item.modelType === CameraTypeEnum.gCamera);
        // 球机摄像头
        const bCamera = equipmentList.every(item => item.modelType === CameraTypeEnum.bCamera);

        if (gCamera) {
          // 枪型摄像头图标
          iconName = `icon_camera_${equipmentStatus}.png`;
        }
        if (bCamera) {
          // 球机摄像头图标
          iconName = `icon_ptzcamera_${equipmentStatus}.png`;
        }
        if (!gCamera && !bCamera) {
          //  混合摄像头
          iconName = `icon_gunballcamera_${equipmentStatus}.png`;
        }
      } else {
        iconName = `icon_${equipmentName}_${equipmentStatus}.png`;
      }
      return `assets/facility-icon/${size}/${iconName}`;
    } else {
      return `assets/facility-icon/18-24/icon_img_broken.png`;
    }
  }


  /**
   * 获取设施图标样式
   * param {string} type
   * returns {string}
   */
  public static getFacilityIconClassName(type: string) {
    const deviceType = this.enumMappingTransform(type, DeviceTypeEnum, DeviceTypeIconEnum);
    const classStr = deviceType || 'all-facility';
    return `iconfont facility-icon fiLink-${classStr} ${classStr}-color`;
  }

  /**
   * 获取设施图标
   */
  public static getFacilityIConClass(type): string {
    const deviceType = this.enumMappingTransform(type, DeviceTypeEnum, DeviceTypeIconEnum);
    const classStr = deviceType || 'all-facility';
    return `iconfont facility-icon fiLink-${classStr} ${classStr}-color`;
  }

  /**
   * 获取设备图标样式
   * param {string} type
   * returns {string}
   */
  public static getEquipmentIconClassName(type: string) {
    const equipmentType = this.enumMappingTransform(type, EquipmentTypeEnum, EquipmentTypeIconEnum);
    const facilityType = equipmentType || 'all-facility';
    return `iconfont facility-icon fiLink-${facilityType} ${facilityType}-color`;
  }

  /**
   * 获取设备状态图标和颜色
   */
  public static getEquipmentStatusIconClass(status: EquipmentStatusEnum | DeviceStatusEnum, type?: string) {
    const equipmentStyle = this.enumMappingTransform(status, EquipmentStatusEnum, EquipmentStatusIconEnum);
    return {
      iconClass: type ? `fiLink-${equipmentStyle}` : `fiLink-${equipmentStyle}-x`,
      colorClass: `equipment-${equipmentStyle}-color`,
      bgColor: `equipment-${equipmentStyle}-bg`
    };
  }

  /**
   * 获取设施状态图标和颜色  已拆除
   */
  public static getDismantleDeviceStatusIconClass(status: DeviceStatusEnum | EquipmentStatusEnum) {
    const deviceStyle = this.enumMappingTransform(status, DismantleDeviceStatusEnum, DeviceStatusIconEnum);
    return {
      iconClass: `fiLink-${deviceStyle}`,
      colorClass: `facility-${deviceStyle}-c`
    };
  }

    /**
   * 获取设施状态图标和颜色
   */
     public static getDeviceStatusIconClass(status: DeviceStatusEnum | EquipmentStatusEnum) {
        const deviceStyle = this.enumMappingTransform(status, DeviceStatusEnum, DeviceStatusIconEnum);
        return {
          iconClass: `fiLink-${deviceStyle}`,
          colorClass: `facility-${deviceStyle}-c`
        };
      }

       /**
   * 获取设施状态图标和颜色  已拆除
   */
     public static getDeviceAllStatusIconClass(status: DeviceStatusEnum | EquipmentStatusEnum) {
        const deviceStyle = this.enumMappingTransform(status, DeviceDetailStatusEnum, DeviceStatusIconEnum);
        return {
          iconClass: `fiLink-${deviceStyle}`,
          colorClass: `facility-${deviceStyle}-c`
        };
      }

  /**
   * 获取设施状态图标className
   */
  public static getDeployStatusIconClass(status: DeployStatusEnum): string {
    return this.enumMappingTransform(status, DeployStatusEnum, DeployStatusClassNameEnum);
  }

  /**
   * 获取设备类型的图标样式需要分清是枪极还是球机
   */
  public static getEquipmentTypeIcon(data: EquipmentListModel): string {
    // 设置设备类型的图标
    let iconClass = '';
    let equipmentType, equipmentModelType;
    // 设备列表相关接口使用
    if (data.equipmentType) {
      equipmentType = data.equipmentType;
      if (data.equipmentModelType) {
        equipmentModelType = data.equipmentModelType;
      }
      if (data.modelType) {
        equipmentModelType = data.modelType;
      }
    }
    // 产品列表相关接口使用
    if (data.typeCode) {
      equipmentType = data.typeCode;
      if (data.pattern) {
        equipmentModelType = data.pattern;
      }
    }
    if (equipmentType === EquipmentTypeEnum.camera && equipmentModelType === CameraTypeEnum.bCamera) {
      // 摄像头球型
      iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
    } else if (equipmentType === EquipmentTypeEnum.oneTouchCalling && equipmentModelType === CallTypeEnum.microphone) {
      // 话筒
      iconClass = `iconfont facility-icon fiLink-filink-huatong-icon alarm-fast-color`;
    } else {
      iconClass = CommonUtil.getEquipmentIconClassName(equipmentType);
    }
    return iconClass;
  }

  /**
   * 获取设备文字颜色
   */
  public static getEquipmentTextColor(type: string) {
    const equipmentType = this.enumMappingTransform(type, EquipmentTypeEnum, EquipmentTypeIconEnum);
    const fontColor = equipmentType || 'all-facility';
    return `${fontColor}-color`;
  }

  /**
   * 获取区域级别颜色
   */
  public static getAreaColor(type: string) {
    const areaColor = this.enumMappingTransform(type, AreaRankEnum, AreaColorEnum);
    return areaColor;
  }

  /**
   * 获取设施建设状态名称
   */
  public static getDeviceDeployName(type: string) {
    const areaName = this.enumMappingTransform(type, DeployRankNameEnum, DeployNameEnum);
    return areaName;
  }

  /**
   * 获取设施建设状态颜色
   */

  public static getDeviceDeployColor(type: string) {
    const areaColor = this.enumMappingTransform(type, DeployRankStatusEnum, DeployStatusColourEnum);
    return areaColor;
  }

  /**
   * 获取设施建设备状态颜色
   */
  public static getFacilityColor(type: string) {
    const areaColor = this.enumMappingTransform(type, facilityStatusColourRankEnum, facilityStatusColourEnum);
    return areaColor;
  }

  /**
   * 获取设施建设备状态颜色
   */
  public static getAreaLevelName(type: string) {
    const areaName = this.enumMappingTransform(type, AreaRankEnum, AreaEnum);
    return areaName;
  }

  /**A
   * 获取告警类别
   */
  public static getlarmType(type: string) {
    const areaName = this.enumMappingTransform(type, AlarmTypeEnum, AlarmTypeRankEnum);
    return areaName;
  }


  /**
   * 将枚举值target转化为相对应的枚举targetEnum的key值
   * 当transformEnum有值时，则转化为与之映射的另一个枚举（transformEnum）所对应的枚举值
   * param target     待转化的值
   * param targetEnum 需要转化的值所在的枚举
   * param transformEnum 待转化的枚举所映射的另一个枚举
   */
  public static enumMappingTransform(target, targetEnum, transformEnum?) {
    const targetKeys = Object.keys(targetEnum).filter(item => Number.isNaN(Number(item)));
    if (transformEnum) {
      // const transformKeys = Object.keys(transformEnum).filter(item => Number.isNaN(Number(item)));
      const enumMap = new Map();
      targetKeys.forEach(targetKey => {
        const transFormValue = transformEnum[targetKey] || '';
        enumMap.set(targetEnum[targetKey], transFormValue);
      });
      return enumMap.get(target);
    }
    return targetKeys.find(item => targetEnum[item] === target);
  }

  /**
   * 获取设施文字演示
   * param {string} type
   * returns {string}
   */
  public static getFacilityTextColor(type: string) {
    const deviceType = this.enumMappingTransform(type, DeviceTypeEnum, DeviceTypeIconEnum);
    const facilityType = deviceType || 'all-facility';
    return `${facilityType}-color`;
  }

  /**
   * 判断用户是否有页面访问权限
   * param url
   */
  public static hasRole(roleList: Array<any>, url: string): boolean {
    if (roleList.length > 0) {
      const list = roleList.filter(item => url.startsWith(item));
      return list.length > 0;
    } else {
      return false;
    }
  }

  /**
   * 根据url查询指定的菜单信息
   * param menuList
   * param url
   */
  public static findMenuInfo(menuList, url) {
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].menuHref === url) {
        return menuList[i];
      } else if (menuList[i].children && menuList[i].children.length > 0) {
        this.findMenuInfo(menuList[i].children, url);
      }
    }
  }

  /**
   * 比较ip大小
   * param ipBegin
   * param ipEnd
   */
  public static compareIP(ipBegin: string, ipEnd: string) {
    let temp1;
    let temp2;
    if (ipBegin.includes('.')) {
      temp1 = ipBegin.split('.');
      temp2 = ipEnd.split('.');
      for (let i = 0; i < temp2.length; i++) {
        if (parseInt(temp2[i], 0) > parseInt(temp1[i], 0)) {
          return true;
        } else if (parseInt(temp2[i], 0) < parseInt(temp1[i], 0)) {
          return false;
        }
      }
      return true;
    } else {
      temp1 = ipBegin.split(':');
      temp2 = ipEnd.split(':');
      for (let i = 0; i < temp2.length; i++) {
        if (temp2[i].padStart(4, '0') > temp1[i].padStart(4, '0')) {
          return true;
        } else if (temp2[i].padStart(4, '0') < temp1[i].padStart(4, '0')) {
          return false;
        }
      }
      return true;
    }
  }

  /**
   * 返回几天前日期
   * param day
   */
  public static funDate(day: number) {
    const date1 = this.getCurrentTime();
    const time1 = date1.getFullYear() + '/' + (date1.getMonth() + 1) + '/' + date1.getDate();
    const date2 = new Date(time1);
    date2.setDate(date1.getDate() + day);
    return date2.getFullYear() + '/' + (date2.getMonth() + 1) + '/' + date2.getDate();
  }

  /**
   * web端导出html文件公共方法
   * param name 导出的文件名
   */
  public static exportHtml(name) {
    // 取html内容
    const test = document.getElementsByTagName('html')[0].outerHTML;
    const urlObject = window.URL || window['webkitURL'] || window;
    const export_blob = new Blob([test]);
    // 动态创建a标签
    const a = document.createElement('a');
    document.body.appendChild(a);
    // url地址为命名空间http://www.w3.org/1999/xhtml 或 http://www.w3.org/2000/
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link['href'] = urlObject.createObjectURL(export_blob);
    save_link['download'] = name;
    // 创建事件对象
    const ev = document.createEvent('MouseEvents');
    ev.initMouseEvent(
      'click',
      true, false, window, 0, 0, 0, 0, 0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    save_link.dispatchEvent(ev);
    document.body.removeChild(a);
  }

  /**
   * 将图标转成base64位格式
   * param url
   * param callback
   */
  public static getUrlBase64(url, callback) {
    let canvas = document.createElement('canvas');   // 创建canvas DOM元素
    const ctx = canvas.getContext('2d');
    const img = new Image;
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
      canvas.height = img.height; // 指定画板的高度,自定义
      canvas.width = img.width; // 指定画板的宽度，自定义
      ctx.drawImage(img, 0, 0, img.width, img.height); // 参数可自定义
      const dataURL = canvas.toDataURL('image/');
      callback.call(this, dataURL); // 回掉函数获取Base64编码
      canvas = null;
    };
  }

  /**
   *
   * param alarmBeginTime  传递过来的首次发生时间
   *       alarmCleanTime 告警清除时间
   * param language 对象 里面有 月 天 时
   */
  // 转化告警持续时间 (当前告警 历史告警使用)
  public static setAlarmContinousTime(alarmBeginTime, alarmCleanTime, language) {
    // 当有清除时间时 使用清除时间减去 首次发生时间
    let alarmContinousTimeHour: number;
    if (alarmCleanTime) {
      alarmContinousTimeHour = alarmCleanTime - alarmBeginTime;
    } else {
      alarmContinousTimeHour = (+new Date()) - alarmBeginTime;
    }

    if (alarmContinousTimeHour < 0) {
      return '';
    }
    const time = Math.ceil(alarmContinousTimeHour / 1000 / 60 / 60);
    let name: string;
    if (time === 0) {
      name = '1' + language.hour;
    } else if (time >= 8760) {
      // 年
      name = Math.floor(time / 8760) + language.year + Math.ceil(time % 8760 / 720) + language.month;
    } else if (time >= 720) {
      // 月
      name = Math.floor(time / 720) + language.month + Math.ceil(time % 720 / 24) + language.day;
    } else if (24 <= time) {
      // 天
      name = Math.floor(time / 24) + language.day + Math.ceil(time % 24) + language.hour;
    } else {
      // 时
      name = Math.ceil(time) + language.hour;
    }
    return name;
  }

  /**
   * 获取当前地区时区
   */
  public static getTimeone() {
    // 时区默认为本地时区
    let displaySettings = {
      timeType: 'local'
    };
    if (localStorage.getItem('displaySettings') && localStorage.getItem('displaySettings') !== 'undefined') {
      displaySettings = JSON.parse(localStorage.getItem('displaySettings'));
      if (displaySettings.timeType === TimeType.UTC) {
        return 'GMT+00:00';
      } else {
        const times = new Date();
        const arr = (times.toString()).split(' ');
        return arr[5];
      }
    } else {
      return 'GMT+00:00';
    }
  }

  /**
   * 列表查询时间 传入时间戳
   * param dateTime
   */
  public static tableQueryTime(dateTime) {
    // 时区默认为本地时区
    let displaySettings = {
      timeType: TimeType.LOCAL
    };
    if (localStorage.getItem('platformDisplaySettings') && localStorage.getItem('platformDisplaySettings') !== 'undefined') {
      displaySettings = JSON.parse(localStorage.getItem('platformDisplaySettings'));
      // 当时间设置为utc的时候还原时间
      if (displaySettings.timeType === TimeType.UTC) {
        return dateTime - new Date().getTimezoneOffset() * 60 * 1000;
      } else {
        return dateTime;
      }
    } else {
      return dateTime;
    }
  }

  /**
   * 表单要发送给后台的时间防止后期修改多写一个方法
   * param dataTime
   */
  public static sendBackEndTime(dataTime) {
    return this.tableQueryTime(dataTime);
  }

  /**
   * 后台时间转换回显 传入时间戳
   * param dateTime
   */
  public static convertTime(dateTime) {
    // 时区默认为本地时区
    let displaySettings = {
      timeType: TimeType.LOCAL
    };
    if (localStorage.getItem('platformDisplaySettings') && localStorage.getItem('platformDisplaySettings') !== 'undefined') {
      displaySettings = JSON.parse(localStorage.getItem('platformDisplaySettings'));
      // 当时间设置为utc的时候还原时间
      if (displaySettings.timeType === TimeType.UTC) {
        return dateTime + new Date().getTimezoneOffset() * 60 * 1000;
      } else {
        return dateTime;
      }
    } else {
      return dateTime;
    }
  }

  /**
   * 获取当前时间
   */
  public static getCurrentTime() {
    const currentTime = this.convertTime(new Date().getTime());
    return new Date(currentTime);
  }

  /**
   * 获取秒数  （毫秒数转秒数）
   * param timestamps
   * returns {number}
   */
  public static getSeconds(timestamps) {
    const num = Number(timestamps) / 1000;
    return Math.round(num);
  }

  /**
   * 去前后空格
   */
  public static trim(str) {
    let str2;
    if (str === null) {
      str2 = null;
    } else {
      str2 = str.toString().replace(/(^\s*)|(\s*$)/g, '');
    }
    return str2;
  }

  /**
   * 枚举翻译
   * param codeEnum 枚举
   * param {NzI18nService} i18n
   * param {any} code 枚举值
   * param {string} prefix 国际化前坠 因设施为早期模板代码不易改动默认值为设施国际化前坠
   * returns {any} 返回 string 或者 {label:string,code:any}[]
   */
  public static codeTranslate(codeEnum, i18n: NzI18nService, code = null, prefix = 'facility.config')
    : string | { label: string, code: any }[] {
    // 因为翻译不需要、过滤枚举中数字key
    const keys = Object.keys(codeEnum).filter(item => Number.isNaN(Number(item)));
    if (code !== null) {
      for (const i of keys) {
        if (codeEnum[i] === code) {
          return i18n.translate(`${prefix}.${i}`);
        }
      }
    } else {
      return keys.map(key => ({label: i18n.translate(`${prefix}.${key}`), code: codeEnum[key]}));
    }
  }

  /**
   * 弧度转角度
   * param rad
   * returns {number}
   */
  public static rad2degr(rad) {
    return rad * 180 / Math.PI;
  }

  /**
   *
   * param degr
   * returns {number}
   */
  public static degr2rad(degr) {
    return degr * Math.PI / 180;
  }

  /**
   * @param latLngInDeg array of arrays with latitude and longtitude
   *   pairs in degrees. e.g. [[latitude1, longtitude1], [latitude2
   *   [longtitude2] ...]
   *
   * @return array with the center latitude longtitude pairs in
   *   degrees.
   */
  public static getLatLngCenter(latLngMap: Map<string, any>) {
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;
    latLngMap.forEach(item => {
      const lat = this.degr2rad(item.data.lat);
      const lng = this.degr2rad(item.data.lng);
      // sum of cartesian coordinates
      sumX += Math.cos(lat) * Math.cos(lng);
      sumY += Math.cos(lat) * Math.sin(lng);
      sumZ += Math.sin(lat);
    });
    const avgX = sumX / latLngMap.size;
    const avgY = sumY / latLngMap.size;
    const avgZ = sumZ / latLngMap.size;
    // convert average x, y, z coordinate to latitude and longtitude
    const _lng = Math.atan2(avgY, avgX);
    const hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    const _lat = Math.atan2(avgZ, hyp);

    return ([this.rad2degr(_lat), this.rad2degr(_lng)]);
  }

  /**
   * 判断时间是否超过2038
   * param current
   * returns {boolean}
   */
  public static checkTimeOver(current) {
    return differenceInCalendarDays(current, new Date('2037/12/31')) > 0;
  }

  /**
   * 获取设备图标白色
   */
  public static getEquipmentTypeIconClass(data) {
    const facilityType = CommonUtil.getEquipmentTypeIcon(data) || 'all-facility';
    return `icon-fiLink-5 iconfont fiLink-${facilityType.slice(0, facilityType.lastIndexOf(' '))}`;
  }

  /**
   * 获取当前日期所在的是第几周（以星期天为一周的第一天）
   * param date
   */
  public static getWeek(date: Date): number {
    const MILLISECONDS_IN_WEEK = 604800000;
    const dates = parse(date);
    const diff = startOfWeek(dates).getTime() - startOfYear(dates).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
  }

  /**
   * 前端搜索、过滤 、分页逻辑
   * param allData
   * param queryCondition
   * param pageBean
   * returns any[] 返回处理后的数据
   */
  public static frontEndQuery(allData: any[], queryCondition: QueryConditionModel, pageBean: PageModel): any[] {
    // 搜索逻辑
    let searchData = [];
    if (queryCondition && queryCondition.filterConditions && queryCondition.filterConditions.length) {
      searchData = allData.filter(item => {
        return queryCondition.filterConditions.every(_item => {
          if (_item.operator === OperatorEnum.like) {
            return item[_item.filterField].includes(_item.filterValue);
          } else if (_item.operator === OperatorEnum.in) {
            return _item.filterValue.includes(item[_item.filterField]);
          }
        });
      });
    } else {
      searchData = allData;
    }
    pageBean.Total = searchData.length;
    // 排序逻辑
    let sortDataSet = [];
    if (queryCondition && queryCondition.sortCondition && queryCondition.sortCondition.sortRule) {
      sortDataSet = lodash.sortBy(searchData, queryCondition.sortCondition.sortField);
      if (queryCondition.sortCondition.sortRule === TableSortConfig.DESC) {
        sortDataSet.reverse();
      }
    } else {
      sortDataSet = searchData;
    }
    return sortDataSet.slice(pageBean.pageSize * (pageBean.pageIndex - 1),
      pageBean.pageIndex * pageBean.pageSize);
  }
}
