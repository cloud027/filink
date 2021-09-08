import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DateHelperService, NzI18nService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {LockService} from '../../../../core-module/api-service/lock';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NativeWebsocketImplService} from '../../../../core-module/websocket/native-websocket-impl.service';
import {FacilityMissionService} from '../../../../core-module/mission/facility.mission.service';
import {DeviceStatisticalService} from '../../../../core-module/api-service/statistical/device-statistical';
import {CommonUtil} from '../../../util/common-util';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageModel} from '../../../model/page.model';
import {TableConfigModel} from '../../../model/table-config.model';
import {DeviceChartUntil} from '../../../util/device-chart-until';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {DeployStatusEnum, DeviceStatusEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {HostTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';
import {LockStatusEnum} from '../../../../core-module/enum/facility/Intelligent-lock/lock-status.enum';
import {ModuleTypeNameEnum} from '../../../../core-module/enum/facility/Intelligent-lock/module-type-name.enum';
import {ModuleTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/module-type.enum';
import {SourceTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/source-type.enum';
import {SolarCellEnum} from '../../../../core-module/enum/facility/Intelligent-lock/solar-cell.enum';
import {OperatorEnum} from '../../../../core-module/enum/facility/Intelligent-lock/operator.enum';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {LockModel} from '../../../../core-module/model/facility/lock.model';
import {LanguageEnum} from '../../../enum/language.enum';
import {ActiveStatusEnum} from '../../../../core-module/enum/facility/Intelligent-lock/active-status.enum';
import {TimerSelectorService} from '../../../service/time-selector/timer-selector.service';
import {WellCoverEnum} from '../../../../core-module/enum/facility/Intelligent-lock/well-cover.enum';
import {CommonInstructModel} from '../../../../core-module/model/application-system/common-instruct.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {Observable} from 'rxjs';
import {DateFormatStringEnum} from '../../../enum/date-format-string.enum';
import {QuerySensorRequestModel} from '../../../../core-module/model/facility/query-sensor-request.model';
import {ControlModel} from '../../../../core-module/model/facility/control.model';

/**
 * 设施详情智能门禁组件
 */
@Component({
  selector: 'app-intelligent-entrance-guard',
  templateUrl: './intelligent-entrance-guard.component.html',
  styleUrls: ['./intelligent-entrance-guard.component.scss'],
  providers: [TimerSelectorService]
})
export class IntelligentEntranceGuardComponent implements OnInit, OnDestroy {
  @ViewChild('controlInfoTemp') controlInfoTemp: TemplateRef<{}>;
  // 设施id
  @Input() public deviceId: string;
  // 设备id
  @Input() public equipmentId: string;
  // 设施类型
  @Input() public deviceType: string;
  // 序列号
  @Input() public serialNum: string;
  // 是否为设备详情
  @Input() isEquipment: boolean = false;
  // 开锁日期选择范围
  public dateRange: Date[];
  // 门禁阈值日期选择范围
  public deviceSensorDateRange: Date[];
  // 所有已被选择
  public allChecked: boolean = false;
  // 半选状态
  public indeterminate = false;
  // 选择状态
  public checked: boolean = false;
  // 开锁次数统计eCharts配置
  public option = {};
  // 传感器阈值统计eCharts配置
  public deviceSensorOption = {};
  // 电子锁信息
  public lockInfo: LockModel[] = [];
  // 已选择主控
  public selectedControl: number = 0;
  // 已选主控信息
  public lockControlInfo: any = {equipmentModelType: '', actualValue: {}, hostName: ''};
  // 所有主控信息
  public lockControlInfoAll = [];
  // 设施信息
  public deviceInfo = {
    deviceStatusLabel: '',
    deployStatusLabel: '',
    deviceStatusBgColor: '',
    deployStatusIconClass: ''
  };
  // 当前是日志
  public currentTime: string | number;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 传感器阈值类型
  public sensorType = 'temperature';
  // 开锁次数
  public openCount: number = 0;
  // 没有开锁内容
  public noOpenCount: boolean;
  // 没有传感器阀值信息
  public noSensorData: boolean;
  // 开锁次数加载中
  public openCountLoading = false;
  // 传感器阀值加载中
  public sensorLoading = false;
  // 设施类型code
  public deviceTypeCode = DeviceTypeEnum;
  // 主控类型code
  public hostTypeCode = HostTypeEnum;
  // 锁状态
  public lockStatus = LockStatusEnum;
  // 通信模式code
  public moduleTypeCode = ModuleTypeEnum;
  // 通信模式值
  public moduleTypeValue = ModuleTypeNameEnum;
  // 激活状态
  public activeStatus = ActiveStatusEnum;
  // 分页实体
  public pageBean: PageModel = new PageModel();
  // 主空删除table配置
  public controlInfoConfig: TableConfigModel;
  // 设施传感器值
  private deviceSensorValue: any = {};
  // 轮询实例
  private lockTimer: number;
  // 主控轮询实例
  private controlLoopTimer: number;

  constructor(private $lockService: LockService,
              private $nzI18n: NzI18nService,
              private $facilityApiService: FacilityForCommonService,
              private $dateHelper: DateHelperService,
              private $wsService: NativeWebsocketImplService,
              private $nzNotificationService: NzNotificationService,
              private $refresh: FacilityMissionService,
              private $deviceStatisticalService: DeviceStatisticalService,
              private $timerSelectorService: TimerSelectorService,
              private $modal: NzModalService,
              private $modalService: FiLinkModalService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    const weekDate = this.$timerSelectorService.getWeekRange();
    this.deviceSensorDateRange = [new Date(weekDate[0]), new Date(weekDate[1])];
    this.dateRange = [new Date(weekDate[0]), new Date(weekDate[1])];
    // 获取锁信息
    this.getLockInfo();
    // 获取主控信息
    this.getLockControlInfo();
    // 获取传感器阈值
    this.getSensorTypeData();
    // 开锁消息的监听
    this.$refresh.refreshChangeHook.subscribe((event: boolean) => {
      if (event) {
        this.getLockInfo(true);
      }
    });
    const start = CommonUtil.dateFmt(DateFormatStringEnum.dateNumber, this.timeConvert(this.deviceSensorDateRange[0]));
    const end = CommonUtil.dateFmt(DateFormatStringEnum.dateNumber, this.timeConvert(this.deviceSensorDateRange[1]));
    this.queryUnlockingTimesByDeviceId(start, end);
    // 删除主控table配置
    this.controlInfoConfig = {
      noIndex: true,
      columnConfig: [
        {type: 'serial-number', width: 62, title: this.language.serialNumber},
        {title: this.language.hostName, key: 'equipmentName', width: 100},
        {title: this.language.operate, key: '', width: 80},
      ],
      operation: [
        {
          text: this.language.deleteHandle,
          permissionCode: '03-8-7',
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (currentIndex) => {
            // 删除主控改成删除设备接口
            this.$facilityApiService.deleteEquipmentByIds([currentIndex.equipmentId]).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                this.$modalService.success(this.language.deleteControlSuccess);
                location.reload();
              } else {
                this.$modalService.error(result.msg);
              }
            });
          }
        },
      ],
    };
  }

  /**
   * 电子锁统计时间框值变化
   * param event
   */
  public onChange(event: boolean): void {
    if (!event) {
      this.openCountLoading = true;
      const start = CommonUtil.dateFmt(DateFormatStringEnum.dateNumber, this.timeConvert(this.deviceSensorDateRange[0]));
      const end = CommonUtil.dateFmt(DateFormatStringEnum.dateNumber, this.timeConvert(this.deviceSensorDateRange[1]));
      this.queryUnlockingTimesByDeviceId(start, end);
    }
  }

  /**
   * 传感器统计时间框值变化
   * param event
   */
  public sensorDateChange(event: boolean): void {
    if (!event) {
      this.sensorLoading = true;
      this.getSensorTypeData();
    }
  }

  public ngOnDestroy(): void {
    if (this.lockTimer) {
      window.clearInterval(this.lockTimer);
    }
    if (this.controlLoopTimer) {
      window.clearInterval(this.controlLoopTimer);
    }
  }

  /**
   * 获取电子锁信息
   * param {boolean} noFirst 不是第一次请求防止正在勾选设施开锁进行了刷新
   */
  public getLockInfo(noFirst = false): void {
    let response: Observable<ResultModel<LockModel[]>>;
    if (this.isEquipment) {
      response = this.$lockService.getLockInfoForEquipment(this.equipmentId);
    } else {
      response = this.$lockService.getLockInfo(this.deviceId);
    }
    response.subscribe((result: ResultModel<LockModel[]>) => {
      if (result.data && result.data.length) {
        if (noFirst) {
          result.data.forEach((item: any, index) => {
            if (this.deviceType === DeviceTypeEnum.well) {
              this.setWellData(item);
            } else {
              this.lockInfo[index].lockStatus = item.lockStatus;
              this.lockInfo[index].doorStatus = item.doorStatus;
            }
          });
        } else {
          // 当为设施类型为人井内外盖合并为一条数据
          if (this.deviceType === DeviceTypeEnum.well) {
            this.lockInfo = [new LockModel()];
            result.data.forEach(item => {
              this.setWellData(item);
            });
          } else {
            this.lockInfo = result.data || [];
          }
        }
      }
    });
  }

  /**
   * 刷新
   */
  public refreshLock(): void {
    this.allChecked = false;
    this.indeterminate = false;
    this.getLockInfo();
  }

  /**
   * 开锁
   */
  public openLock(): void {
    if (this.lockControlInfo.equipmentModelType === HostTypeEnum.PassiveLock) {
      this.$modalService.info(this.language.unOpenLock);
      return;
    }
    let response: Observable<ResultModel<string>>;
    // 设备开锁
    if (this.isEquipment) {
      const body = new CommonInstructModel();
      body.commandId = ControlInstructEnum.unLock;
      body.equipmentIds = [this.equipmentId];
      body.param = {
        params: this.lockInfo.filter(item => item.checked).map(item => {
          return {slotNum: item.doorNum};
        })
      };
      response = this.$lockService.instructDistribute(body);
    } else {
      // 设施开锁
      const body = {deviceId: this.deviceId, doorNumList: this.lockInfo.filter(item => item.checked).map(item => item.doorNum)};
      response = this.$lockService.openLock(body);
    }
    if (this.lockTimer) {
      window.clearInterval(this.lockTimer);
    }
    response.subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$modalService.success(this.language.commandIssuedSuccessfully);
        this.lockInfo.forEach(item => {
          item.checked = false;
        });
        this.allChecked = false;
        this.indeterminate = false;
        this.lockTimer = window.setInterval(() => {
          this.getLockInfo(true);
        }, 20000);
      } else {
        this.$modalService.error(result.msg);
      }
    });
  }

  /**
   * 获取主控信息
   */
  public getLockControlInfo(): void {
    let response: Observable<ResultModel<any>>;
    if (this.isEquipment) {
      response = this.$lockService.getLockControlInfoForEquipment(this.equipmentId);
    } else {
      response = this.$lockService.getLockControlInfo(this.deviceId);
    }
    response.subscribe((result: ResultModel<ControlModel[]>) => {
      this.lockControlInfoAll = result.data;
      if (result.data && result.data[0]) {
        this.lockControlInfo = this.lockControlInfoAll[0];
        this.convertDeviceInfo(this.lockControlInfo);
        // 获取传感器阈值
        if (result.data[0].actualValue) {
          this.lockControlInfo.actualValue = JSON.parse(this.lockControlInfo.actualValue);
          this.convertActualValue(this.lockControlInfo.actualValue);

          const currentTime = new Date(this.lockControlInfo.currentTime);
          const simFailureTime = currentTime.setFullYear(currentTime.getFullYear() + this.lockControlInfo.simPackage);
          this.lockControlInfo.simFailureTime = simFailureTime;
        }
      }
      // 查询最近一条设施日志的时间
      this.$facilityApiService.deviceLogTime(this.deviceId).subscribe((_result: ResultModel<any>) => {
        if (_result.code === ResultCodeEnum.success) {
          this.currentTime = _result.data.recentLogTime;
        } else {
          this.currentTime = null;
        }
        // 开启定时器轮询
        if (!this.controlLoopTimer) {
          this.controlLoopTimer = window.setInterval(() => {
            this.getLockControlInfo();
          }, 60000);
        }
      });
    });
  }

  /**
   * 全选
   * param event
   */
  public checkAll(event): void {
    this.indeterminate = false;
    this.lockInfo.forEach(item => {
      item.checked = event;
    });
  }

  // 点击锁
  public checkItem(): void {
    this.checkStatus();
  }

  // 改变勾选状态
  public checkStatus(): void {
    const allChecked = this.lockInfo.every(value => value.checked === true);
    const allUnChecked = this.lockInfo.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  /**
   * 主控改变
   * param event 主控的索引
   */
  public controlChange(event): void {

    this.lockControlInfo = this.lockControlInfoAll[event];
    this.convertDeviceInfo(this.lockControlInfo);
    if (this.lockControlInfo.actualValue && typeof this.lockControlInfo.actualValue === 'string') {
      this.lockControlInfo.actualValue = JSON.parse(this.lockControlInfo.actualValue);
      this.convertActualValue(this.lockControlInfo.actualValue);
    }

  }

  /**
   * 转换数据
   * deviceStatus
   * deployStatus
   * param data
   */
  public convertDeviceInfo(data: ControlModel): void {
    if (data.deviceStatus && data.deployStatus) {
      this.deviceInfo.deviceStatusLabel = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, data.deviceStatus) as string;
      this.deviceInfo.deployStatusLabel = CommonUtil.codeTranslate(DeployStatusEnum, this.$nzI18n, data.deployStatus, LanguageEnum.facility) as string;
      this.deviceInfo.deviceStatusBgColor = CommonUtil.getDeviceStatusIconClass(data.deviceStatus).colorClass.replace('-c', '-bg');
      this.deviceInfo.deployStatusIconClass = CommonUtil.getDeployStatusIconClass(data.deployStatus);
    }
    //  转化供电方式 太阳能
    if (data.sourceType) {
      data['_sourceType'] = CommonUtil.codeTranslate(SourceTypeEnum, this.$nzI18n, data.sourceType);
    }
    if (data.solarCell) {
      data['_solarCell'] = CommonUtil.codeTranslate(SolarCellEnum, this.$nzI18n, data.solarCell);
    }
  }

  /**
   * 转换电子锁内部ActualValue
   * param data {any}
   */
  public convertActualValue(data: any): void {
    //  转换运营商
    if (data.operator && data.operator.data) {
      data.operator['value'] = CommonUtil.codeTranslate(OperatorEnum, this.$nzI18n, data.operator.data);
    }
    // 转换电量 当供电方式为适配器的时候电量保持100%
    if (this.lockControlInfo.sourceType === SourceTypeEnum.adapter) {
      data.electricity.data = 100;
    }
  }

  /**
   * 点击现在传感器类型
   * param event
   */
  public selectItem(event: string): void {
    this.sensorType = event;
    this.deviceSensorOption = DeviceChartUntil.setLineTimeChartOption(this.setLineChart(this.deviceSensorValue, this.sensorType));
  }

  /**
   * 获取传感器数据
   */
  public getSensorTypeData(): void {
    const statisticalData: QuerySensorRequestModel = new QuerySensorRequestModel();
    statisticalData.startTime = this.dateRange[0].getTime();
    statisticalData.endTime = this.dateRange[1].getTime();
    let response: Observable<Object>;
    if (this.isEquipment) {
      statisticalData.equipmentId = this.equipmentId;
      response = this.$deviceStatisticalService.queryEquipmentSensor(statisticalData);
    } else {
      statisticalData.deviceId = this.deviceId;
      response = this.$deviceStatisticalService.queryDeviceSensor(statisticalData);
    }
    response.subscribe((result: ResultModel<any>) => {
      this.sensorLoading = false;
      this.deviceSensorValue = result.data;
      this.deviceSensorOption = DeviceChartUntil.setLineTimeChartOption(this.setLineChart(result.data, this.sensorType));
    });
  }

  /**
   * 查询开锁次数
   * param start
   * param end
   */
  public queryUnlockingTimesByDeviceId(start, end): void {
    const body = {deviceId: this.deviceId, startDate: start, endDate: end};
    this.$lockService.queryUnlockingTimesByDeviceId(body).subscribe((result: ResultModel<any[]>) => {
      this.openCountLoading = false;
      const data = result.data || [];
      const date = [];
      const arr = [];
      this.openCount = 0;
      data.forEach((item: any) => {
        arr.push([CommonUtil.dateFmt(DateFormatStringEnum.date, this.$dateHelper.parseDate(item.statisticsDate)), item.unlockingCount]);
        this.openCount += Number(item.unlockingCount);
      });
      this.noOpenCount = arr.length === 0;
      this.option = DeviceChartUntil.setUnlockingChartOption(date, arr);
    });
  }

  /**
   * 转换line数据
   * param _data
   * param event
   * returns {any[]}
   */
  public setLineChart(_data, event): Array<{ name: string, value: Array<any> }> {
    const data = [];
    Object.keys(_data).forEach(key => {
      const dataObj: { name: string, value: Array<any> } = {name: '', value: []};
      const dataItem = [];
      let chartData = [];
      _data[key].forEach(_item => {
        chartData.push(CommonUtil.dateFmt(DateFormatStringEnum.dateTime, new Date(_item.currentTime)));
        chartData.push(Number(_item[event]));
        dataItem.push(chartData);
        dataObj.name = key;
        dataObj.value = dataItem;
        chartData = [];
      });
      data.push(dataObj);

    });
    this.noSensorData = data.length === 0;
    return data;
  }

  /**
   * 时间转换
   * param time
   */
  public timeConvert(time: Date): Date {
    return new Date(CommonUtil.sendBackEndTime(time.getTime()));
  }

  public deleteControl(): void {
    const modal = this.$modal.create({
      nzTitle: this.language.viewHost,
      nzContent: this.controlInfoTemp,
      nzOkText: this.language.handleCancel,
      nzCancelText: this.language.handleOk,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: [
        {
          label: this.language.handleCancel,
          type: 'danger',
          onClick: () => {
            modal.destroy();
          }
        },
      ]
    });
  }

  /**
   * 设置井盖的值
   * param item
   */
  private setWellData(item: LockModel): void {
    // 外盖
    if (item.doorNum === WellCoverEnum.outCover) {
      this.lockInfo[0].outCoverStatus = item.doorStatus;
    } else {
      this.lockInfo[0].innerCoverStatus = item.doorStatus;
      this.lockInfo[0].lockStatus = item.lockStatus;
      this.lockInfo[0].doorNum = item.doorNum;
    }
  }
}
