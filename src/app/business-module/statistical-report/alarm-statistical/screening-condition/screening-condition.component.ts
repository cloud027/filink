import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TimeFormatEnum} from '../../../../shared-module/enum/time-format.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {CurrentPageTypeEnum} from '../../share/enum/current-page-type.enum';
import {PageTypeEnum} from '../../share/enum/page-type.enum';
import {AlarmNameListModel} from '../../../../core-module/model/alarm/alarm-name-list.model';
import {ScreenConditionModel} from '../../share/model/alarm/screen-condition.model';
import {DeviceTypeListModel} from '../../share/model/alarm/device-type-list.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';

@Component({
  selector: 'app-screening-condition',
  templateUrl: './screening-condition.component.html',
  styleUrls: ['./screening-condition.component.scss']
})
export class ScreeningConditionComponent implements OnInit, OnDestroy {
  @Input() bool = false;
  // 筛选条件中搜索的emit事件
  @Output() search = new EventEmitter<ScreenConditionModel>();
  // 勾选告警名称后生成表格用
  @Output() selectAlarmChange = new EventEmitter();
  // 设备是否多选
  @Input() equipmentIsRadio: boolean = false;
  // 设施选择ul数据
  public selectDeviceTypeList: DeviceTypeListModel[] = [];
  // 选择的设施类型
  public deviceTypeListValue: DeviceTypeListModel[] = [];
  // 国际化
  public language: AlarmLanguageInterface;
  // 时间控件的值
  public firstTimeModel: Date[] = [];
  // 选择的数据类型
  public deviceActive: DeviceTypeListModel;
  // 区域选择器显示控制
  public isVisible: boolean = false;
  // 区域树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域名称
  public areaName: string = '';
  // 告警名称
  public alarmName: string = '';
  // 告警名称弹窗显示
  public alarmNameSelectVisible: boolean = false;
  // 选择的告警名称数据集合
  public selectAlarmData = {
    // 选择的告警代码数组
    selectAlarmCodes: [],
    // 选择的告警id数组
    ids: [],
    // 选择的告警名称数组
    alarmNames: []
  };
  // 按告警名称选中的告警数据
  public selectAlarms: AlarmNameListModel[] = [];
  // 控制模板统计modal的显示吟唱
  public display = {
    templateTable: false
  };
  // 下拉框数据
  public selectInfo;
  // 是否第一次统计
  public hide: boolean = true;
  // 区域树数据
  public treeNodes: AreaModel[];
  /**
   *  sineDeviceType 不传或者false时 设施类型为多选
   *  传true时 为单选 在 区域告警比统计 页面时使用
   */
    // 页面类型判断
  public sineDeviceType: PageTypeEnum = PageTypeEnum.normal;
  public currentPageType: CurrentPageTypeEnum = CurrentPageTypeEnum.alarmType;
  public currentPageTypeEnum = CurrentPageTypeEnum;
  // 设施类型列表
  private deviceTypeList = [];
  // 点击统计后的时间控件的值
  private staTime: number[] = [];
  // 区域ids
  private areaIds: string[] = [];
  // 统计后的区域名称
  private staAreaName: string = '';
  // 是否显示加载
  private isLoading: boolean = false;
  private treeNodesOriList = [];

  constructor(public $nzI18n: NzI18nService,
              private $facilityForCommonService: FacilityForCommonService,
              public $message: FiLinkModalService) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  // 从父组件获取页面类型
  @Input() set currentPage(currentPage) {
    switch (currentPage) {
      case PageTypeEnum.areaAlarm :
        // 当在区域告警比统计时 所有设施类型
        this.sineDeviceType = PageTypeEnum.areaAlarm;
        this.deviceTypeList = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n) as any[];
        this.currentPageType = CurrentPageTypeEnum.areaRatio;
        break;
      case PageTypeEnum.alarmIncrement :
        this.sineDeviceType = PageTypeEnum.alarmIncrement;
        break;
      case PageTypeEnum.alarmDispose :
        this.sineDeviceType = PageTypeEnum.normal;
        this.currentPageType = CurrentPageTypeEnum.alarmHandle;
        break;
      default:
        this.sineDeviceType = PageTypeEnum.normal;
        this.currentPageType = currentPage;
    }
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.getAreaData().then();
    this.initTreeSelectorConfig();
    this.selectInfo = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    this.selectInfo.forEach(v => {
      v.value = v.code;
    });
  }

  /**
   * 判断统计按钮 是否禁用
   */
  public disabledResources(): string {
    if (this.firstTimeModel.length && this.areaName && this.deviceTypeListValue.length && !(this.currentPageType === CurrentPageTypeEnum.alarmName && !this.alarmName)) {
      return '';
    } else {
      return 'disabled';
    }
  }

  /**
   * 区域选择器选择结果
   */
  public selectDataChange(event) {
    let selectArr = [];
    const areaNameList = [];
    if (event.length > 0) {
      selectArr = event.map(item => {
        areaNameList.push(item.areaName);
        return item.areaId;
      });
      this.areaName = areaNameList.join();
    } else {
      this.areaName = '';
    }
    this.areaIds = selectArr;
    sessionStorage.setItem('areaId', JSON.stringify(this.areaIds));
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, selectArr);
    this.disabledResources();
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelect(): void {
    if (this.treeNodes && this.treeNodes.length) {
      this.treeSelectorConfig.treeNodes = this.treeNodes;
      this.isVisible = true;
    } else {
      this.getAreaData().then(() => {
        this.treeSelectorConfig.treeNodes = this.treeNodes;
        this.isVisible = true;
      });
    }

  }

  /**
   * 获取区域数据
   */
  public getAreaData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const data = result.data;
          // 递归设置区域的选择情况
          FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
          this.treeNodes = data;
          this.addName(this.treeNodes);
          this.areaListRecursive(this.treeNodes);
          resolve();
        } else {
          reject();
        }
      }, () => {
        reject();
      });
    });

  }

  /**
   * 扁平化区域数据
   * param list
   */
  areaListRecursive(list) {
    list.forEach(item => {
      this.treeNodesOriList.push(item);
      if (item.children) {
        this.areaListRecursive(item.children);
      }
    });
  }

  /**
   * 打开告警名称选择弹窗
   */
  public showAlarmNameSelect(): void {
    this.alarmNameSelectVisible = true;
  }

  /**
   * 选择告警名称
   * @param event 选择的告警数据
   */
  public onSelectAlarmName(event: AlarmNameListModel[]): void {
    const obj = {
      selectAlarmCodes: [],
      ids: [],
      alarmNames: []
    };
    event.forEach((item: AlarmNameListModel) => {
      obj['selectAlarmCodes'].push(item.alarmCode);
      obj['ids'].push(item.id);
      obj['alarmNames'].push(item.alarmName);
    });
    this.selectAlarmData = Object.assign(this.selectAlarmData, obj);
    this.selectAlarms = event;
    this.alarmName = this.selectAlarmData.alarmNames.toString();
  }

  /**
   *搜索时改变isLoading的值
   */
  onSearch(value: string): void {
    this.isLoading = true;
  }

  /**
   * 点击选择设施类型
   */
  public clickDeviceSelect(item: DeviceTypeListModel): void {
    this.deviceActive = item;
    this.emitData([item.value]);
  }

  /**
   * 统计
   */
  public resources(): void {
    let deviceIds;
    this.staAreaName = this.areaName;
    this.staTime = CommonUtil.deepClone([this.firstTimeModel[0].getTime(), this.firstTimeModel[1].getTime()]);
    if (this.sineDeviceType === PageTypeEnum.areaAlarm) {
      deviceIds = [this.deviceTypeListValue];
    } else if (this.sineDeviceType === PageTypeEnum.alarmIncrement) {
      deviceIds = this.deviceTypeListValue.map(item => item.value);
    } else {
      deviceIds = [this.deviceTypeListValue[0].value];
    }
    this.emitData(deviceIds);
    if (this.sineDeviceType === PageTypeEnum.normal) {
      // 筛选设施
      this.selectDeviceTypeList = [];
      this.deviceTypeListValue.forEach(value => {
        this.selectDeviceTypeList.push(value);
      });
      this.deviceActive = this.selectDeviceTypeList[0];
    }
    this.hide = false;
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  public disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    if (this.sineDeviceType === PageTypeEnum.alarmIncrement) {
      const time = this.getDateStr(-15);
      return differenceInCalendarDays(current, time) < 0 || differenceInCalendarDays(current, nowTime) > -1;
    } else {
      return differenceInCalendarDays(current, nowTime) > 0;
    }
  }

  /**
   * 模板查询
   * param event
   */
  public templateTable(event) {
    this.display.templateTable = false;
    if (!event || Object.keys(event).length === 0) {
      return;
    }
    event.condition.areaList.ids.forEach((item, index) => {
      if (this.treeNodesOriList.filter(_item => _item.areaId === item).length === 0) {
        event.condition.areaList.ids.splice(index, 1);
        event.condition.areaList.areaCode.splice(index, 1);
        event.condition.areaList.name = event.condition.areaList.name.split(',');
        event.condition.areaList.name.splice(index, 1);
        event.condition.areaList.name = event.condition.areaList.name.join();
      }
    });
    const roleDeviceTypeList = this.selectInfo.map(v => v.code);
    event.condition.deviceIds = event.condition.deviceIds.filter(item => roleDeviceTypeList.includes(item));
    if (event.condition.areaList.ids.length === 0 || event.condition.deviceIds.length === 0) {
      this.$message.error(this.language.templateNotUse);
      return;
    }
    sessionStorage.removeItem('areaId');
    this.areaName = event.condition.areaList.name;
    this.firstTimeModel = [new Date(event.condition.beginTime),
      new Date(event.condition.endTime)];
    if (this.sineDeviceType === PageTypeEnum.areaAlarm) {
      this.deviceTypeListValue = event.condition.deviceIds[0];
    } else {
      this.deviceTypeListValue = event.condition.deviceIds.map(item => {
        return {checked: true, label: CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item), value: item};
      });
    }
    if (this.bool) {
      this.alarmName = event.condition.alarmList.alarmNames.join(',');
      const ids = event.condition.alarmList.ids.map((item, index) => {
        return {
          id: item,
          alarmName: event.condition.alarmList.alarmNames[index],
          alarmCode: event.condition.alarmList.selectAlarmCodes[index],
          checked: true
        };
      });
      this.selectAlarms = ids;
      this.selectAlarmData = {
        selectAlarmCodes: event.condition.alarmList.selectAlarmCodes,
        // 选择的告警id数组
        ids: event.condition.alarmList.ids,
        // 选择的告警名称数组
        alarmNames: event.condition.alarmList.alarmNames
      };
    }
    this.reSetSelectTreeCodes(this.treeNodes);
    this.isCheckData(this.treeNodes, event.condition.areaList.ids);
    this.areaIds = event.condition.areaList.ids;
    sessionStorage.setItem('areaId', JSON.stringify(this.areaIds));
    this.resources();
  }

  /**
   * 重置清空区域选择数据
   * @param data 区域树数据
   */
  public reSetSelectTreeCodes(data) {
    data.forEach(item => {
      if (item.children) {
        this.reSetSelectTreeCodes(item.children);
      }
      item.checked = false;
    });
  }

  public nzOnOpenChange(event: boolean): void {
    if (!event) {
      this.firstTimeModel = this.firstTimeModel.slice();
    }
  }

  /**
   * 组件销毁
   */
  ngOnDestroy() {
    sessionStorage.removeItem('areaId');
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: false,
          idKey: 'areaId',
        },
        key: {
          name: 'areaName',
          children: 'children'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: this.language.selectArea,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaNames, key: 'areaName', width: 100,
        },
        {
          title: this.language.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  /**
   * 传值到每个组件
   */
  private emitData(deviceIds: string[]) {
    let beginTime;
    let endTime;
    // 将时间进行转换
    beginTime = CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.staTime[0]));
    endTime = CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.staTime[1]));
    const saveAreaId = JSON.parse(sessionStorage.getItem('areaId'));
    if (saveAreaId) {
      this.areaIds = saveAreaId;
    }
    const screeningCondition: ScreenConditionModel = {
      'bizCondition': {
        beginTime: +new Date(beginTime),
        endTime: +new Date(endTime),
        deviceIds: deviceIds,
        areaList: this.areaIds,
        alarmCodes: this.selectAlarmData.selectAlarmCodes,
        statisticsType: ''
      }
    };
    if (this.sineDeviceType === PageTypeEnum.alarmIncrement) {
      screeningCondition.bizCondition.areaList = this.areaIds;
    }
    this.selectAlarmChange.emit(this.selectAlarmData);
    this.search.emit(screeningCondition);

  }

  /**
   *  AddDayCount  为传入的时间 如-1 ，1
   */
  private getDateStr(AddDayCount: number) {
    const time = new Date();
    const times = time.setDate(time.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    return new Date(times);
  }

  /**
   * 递归循环 勾选数据
   */
  private isCheckData(data: AreaModel[], ids: string[]): void {
    ids.forEach(id => {
      data.forEach(item => {
        item.id = item.areaId;
        item.areaLevel = item.level;
        if (id === item.areaId) {
          item.checked = true;
        }
        if (item.children) {
          this.isCheckData(item.children, ids);
        }
      });
    });
  }

  /**
   * 添加区域树数据
   */
  private addName(data: AreaModel[]): void {
    data.forEach(item => {
      item.id = item.areaId;
      item.value = item.areaId;
      item.areaLevel = item.level;
      if (item.children) {
        this.addName(item.children);
      }
    });
  }


}
