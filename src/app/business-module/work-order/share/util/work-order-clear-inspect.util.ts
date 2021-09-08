import {CommonUtil} from '../../../../shared-module/util/common-util';
import {WorkOrderBusinessCommonUtil} from './work-order-business-common.util';
import {NzI18nService} from 'ng-zorro-antd';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {WorkOrderStatisticalModel} from '../model/clear-barrier-model/work-order-statistical.model';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderChartColor, WorkOrderEquipmentChartColor} from '../const/work-order-chart-color';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {ChartTypeEnum} from '../enum/clear-barrier-work-order.enum';

/**
 * 获取设施设备等信息
 */
export class WorkOrderClearInspectUtil {
  /**
   * 去重
   */
  public static DeDuplicationUtil: boolean;
  /**
   * 多个设备及设备图标
   */
  public static handleMultiEquipment(code: string, language: NzI18nService) {
    const data = {
      names: [],
      equipList: []
    };
    const arr = code.split(',');
    for (let k = 0; k < arr.length; k++) {
      const name = WorkOrderBusinessCommonUtil.equipTypeNames(language, arr[k]);
      if (name && name.length > 0) {
        data.equipList.push({
          iconClass: CommonUtil.getEquipmentIconClassName(arr[k]),
          name: name
        });
        data.names.push(name);
      }
    }
    return data;
  }

  /**
   * 用户选择
   */
  public static selectUser(list: UserRoleModel[], that): void {
    that.checkUserObject = {
      userIds: list.map(v => v.id) || [],
      userName: list.map(v => v.userName).join(',') || '',
    };
    that.userFilterValue.filterValue = that.checkUserObject.userIds.length > 0 ? that.checkUserObject.userIds : null;
    that.userFilterValue.filterName = that.checkUserObject.userName;
  }

  /**
   * 卡片统计列表展示
   */
  public static initStatisticsList(that, dataList: WorkOrderStatisticalModel[], toDayTotal: number): void {
    const cardConfig = [];
    let totalCount = 0;
    dataList.forEach(item => {
      totalCount += item.orderCount;
      cardConfig.push({
        label: that.workOrderLanguage[item.status],
        sum: item.orderCount,
        iconClass: WorkOrderStatusUtil.getWorkOrderIconClassName(item.status),
        textClass: `statistics-${item.status}-color`,
        code: item.status
      });
    });
    cardConfig.unshift({
      label: that.workOrderLanguage.all,
      sum: totalCount,
      iconClass: 'iconfont fiLink-work-order-all statistics-all-color',
      textClass: 'statistics-all-color',
      code: 'all'
    });
    cardConfig.push({
      label: that.workOrderLanguage.addWorkOrderToday,
      sum: toDayTotal,
      iconClass: 'iconfont fiLink-add-arrow statistics-add-color',
      textClass: 'statistics-add-color',
      code: null
    });
    that.sliderConfig = cardConfig;
  }
  /**
   * 卡片无数据统计默认样式
   */
  public static defaultCardList() {
    const names = ['To be assigned', 'Pending', 'Processing', 'Transferred', 'Canceled'];
    const status = ['assigned', 'pending', 'processing', 'turnProcess', 'singleBack'];
    for (const key in WorkOrderStatusEnum) {
      if (WorkOrderStatusEnum[key]) {
        names.push(WorkOrderStatusEnum[key]);
      }
    }
    const list = [];
    for (let i = 0; i < status.length; i++) {
      list.push({
        orderCount: 0,
        status: status[i],
        statusName: names[i],
        orderPercent: 0.0
      });
    }
    return list;
  }

  /**
   * 设施类型统计图
   */
  public static orderDeviceChart(that, language: NzI18nService, dataList: WorkOrderStatisticalModel[]): void {
    const name = [], data = [];
    const list = FacilityForCommonUtil.getRoleFacility(language);
    if (!list || list.length === 0) {
      that.deviceTypeStatisticsChartType = ChartTypeEnum.text;
      return;
    }
    const result = [];
    // 遍历数据并判断是否有设施权限
    if (dataList && dataList.length) {
      const types = list.map(v => v.code);
      dataList.forEach(v => {
        if (types.includes(v.deviceType)) {
          result.push(v);
        }
      });
      WorkOrderClearInspectUtil.DeDuplicationUtil = true;
    } else {
      list.forEach(v => {
        result.push({deviceType: v.code.toString(), count: 0});
      });
    }
    result.forEach(item => {
      data.push({
        value: item.count,
        itemStyle: {color: WorkOrderChartColor[WorkOrderBusinessCommonUtil.getEnumKey(item.deviceType, DeviceTypeEnum)]}
      });
      name.push(WorkOrderBusinessCommonUtil.deviceTypeNames(language, item.deviceType));
    });
    that.barChartOption = ChartUtil.setWorkBarChartOption(data, name);
  }
  /**
   * 设备类型统计图
   */
  public static orderEquipmentChart(that, language: NzI18nService, dataList: WorkOrderStatisticalModel[], flag?: boolean): void {
    const name = [], data = [];
    let typeList = FacilityForCommonUtil.getRoleEquipmentType(language);
    if (flag) {
      typeList = FacilityForCommonUtil.getRoleEquipmentType(language).filter(v => v.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
    if (!typeList || typeList.length === 0) {
      that.equipmentTypeChartType = ChartTypeEnum.text;
      return;
    }
    const result: WorkOrderStatisticalModel[] = [];
    if (dataList && dataList.length) {
      const types = typeList.map(v => v.code);
      dataList.forEach(v => {
        if (types.includes(v.equipmentType)) {
          result.push(v);
        }
      });
    } else {
      typeList.forEach(v => {
        result.push({equipmentType: v.code.toString(), count: 0});
      });
    }
    result.forEach(item => {
      data.push({
        value: item.count,
        itemStyle: {color: WorkOrderEquipmentChartColor[WorkOrderBusinessCommonUtil.getEnumKey(item.equipmentType, EquipmentTypeEnum)]}
      });
      name.push(WorkOrderBusinessCommonUtil.equipTypeNames(language, item.equipmentType));
    });
    that.barChartOption = ChartUtil.setWorkBarChartOption(data, name);
  }

  /**
   * 环形统计图
   */
  public static initCircleChart(circleList, that): void {
    let completedCount: number = 0;
    let singleBackCount: number = 0;
    let totalCount: number = 100;
    if (circleList && circleList.length > 0) {
      // 遍历数据
      circleList.forEach(item => {
        if (item.orderStatus === WorkOrderStatusEnum.completed) {
          completedCount = item.percentage;
        } else if (item.orderStatus === WorkOrderStatusEnum.singleBack) {
          singleBackCount = item.percentage;
        }
      });
      totalCount = circleList.reduce((a, b) => a.percentage + b.percentage);
    }
    setTimeout(() => {
      WorkOrderClearInspectUtil.getPercent('canvas_completed', '#3279f0', completedCount, totalCount, that);
      WorkOrderClearInspectUtil.getPercent('canvas_singleBack', '#f39705', singleBackCount, totalCount, that);
      that.completedPercent = `${completedCount}.00%`;
      that.singleBackPercent = `${singleBackCount}.00%`;
    }, 10);
  }
  /**
   * 计算环的角度，绘制环形图
   */
  public static getPercent(id: string, color: string, num: number, total: number, that): void {
    const endingAngle = (-0.5 + (num / total) * 2) * Math.PI;
    // 画环
    try {
      const cvs = document.getElementById(id);
      const mains = cvs['getContext']('2d');
      const ctX = that.canvasLength / 2;
      const ctY = that.canvasLength / 2;
      const startingAngle = -0.5 * Math.PI;
      mains.beginPath();
      mains.strokeStyle = '#eff0f4';
      mains.lineWidth = 8;
      // 创建变量,保存圆弧的各方面信息
      const radiusNum = that.canvasLength / 2 - mains.lineWidth / 2;
      // 画完整的环
      mains.arc(ctX, ctY, radiusNum, 0, 2 * Math.PI);
      mains.stroke();
      mains.beginPath();
      // 画部分的环
      mains.strokeStyle = color;
      mains.arc(ctX, ctY, radiusNum, startingAngle, endingAngle);
      mains.stroke();
    } catch (e) {}
  }
}
