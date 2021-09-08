import {AfterViewInit, Component,  Input, OnChanges, OnDestroy, OnInit,  SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {FacilityService} from '../../../../core-module/api-service';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {LockService} from '../../../../core-module/api-service/lock';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapService} from '../../../../core-module/api-service';
import {FacilityName} from '../../util/facility-name';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {LockTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/lock-type.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LockModel} from '../../../../core-module/model/facility/lock.model';
import {ControlModel} from '../../../../core-module/model/facility/control.model';
import {MapTypeEnum} from '../../../../core-module/enum/index/index.enum';
import {Observable} from 'rxjs';
import {CommonInstructModel} from '../../../../core-module/model/application-system/common-instruct.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ModuleTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/module-type.enum';
import {ModuleTypeNameEnum} from '../../../../core-module/enum/facility/Intelligent-lock/module-type-name.enum';
import {DoorInfoModel} from '../../shared/model/door-info.model';
import {HostTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';

/**
 * 设施详情组件
 */
@Component({
  selector: 'lock-detail-panel',
  templateUrl: './lock-detail-panel.component.html',
  styleUrls: ['./lock-detail-panel.component.scss']
})
export class LockDetailPanelComponent extends FacilityName implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  // 设施id
  @Input() facilityId: string;
  // 分层类型
  @Input() indexType: string;
  // 锁类型
  public lockType = LockTypeEnum;
  // 设施类型
  public dvType = DeviceTypeEnum;
  // 主控信息列表
  public monitorInfoList = [];
  // 门锁信息列表
  public doorAndLockList = [];
  // 版本号
  public serialNum: string;
  // 心跳时间
  public heartbeatTime: string;
  // 是否显示下拉框   有主控信息时显示下拉框
  public isShowSelect = false;
  // 主控信息
  public controlInfoObj: DoorInfoModel[] = [];
  // 主控列表
  public controlOption: { value: string, label: string }[] = [];
  // 选中的主控id
  public selectedControlId: string;
  // 主控类型
  public hostType = '1';
  // 供电方式
  public sourceType: string;
  // 设备详情
  public isEquipment: boolean = false;
  // 国际化
  public language: FacilityLanguageInterface;
  // 轮询
  public timer: any;
  // 主控枚举
  public hostTypeEnum = HostTypeEnum;

  constructor(public $nzI18n: NzI18nService,
              private $facilityService: FacilityService,
              private $lockService: LockService,
              private $router: Router,
              private $mapService: MapService,
              private $smartService: SmartService,
              private $modal: NzModalService,
              private $message: FiLinkModalService,
              private $dateHelper: DateHelperService,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 判断是设施还是设备详情
    this.isEquipment = this.indexType === MapTypeEnum.equipment;
    // 页面初始化
    this.getAllData(this);
  }

  ngAfterViewInit() {
    const that = this;
    this.timer = setInterval(function () {
      that.getAllData(that);
    }, 300000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      // 当设施id发生变化的时候，关闭定时器
      if (this.timer) {
        clearInterval(this.timer);
      }
      // 如果设施id为空
      if (!this.facilityId) {
        return;
      }
      this.getAllData(this);
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * 获取主控信息
   * param id
   */
  getLockControlInfo(id: string) {
    let response: Observable<ResultModel<ControlModel[]>>;
    if (this.isEquipment) {
      response = this.$lockService.getLockControlInfoForEquipment(id);
    } else {
      response = this.$lockService.getLockControlInfo(id);
    }
    response.subscribe((result: ResultModel<Array<ControlModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data) {
          if (result.data.length === 0) {
            return;
          } else {
            this.hostType = result.data[0].equipmentModelType;
            this.sourceType = result.data[0].sourceType;
            this.controlOption = [];
            result.data.forEach(item => {
              const arr = [];
              let data;
              if (item.actualValue) {
                data = JSON.parse(item.actualValue);
              } else {
                data = {};
              }
              Object.keys(data).forEach(key => {
                const info = this.setMonitorInfo(key, data[key]);
                if (info) {
                  arr.push(info);
                }
              });
              this.controlInfoObj[item.equipmentId] = arr;
              this.controlOption.push({
                value: item.equipmentId,
                label: item.equipmentName
              });
            });
            if (this.controlOption[0]) {
              this.selectedControlId = this.controlOption[0]['value'];
            }
            this.monitorInfoList = this.controlInfoObj[this.selectedControlId];
            this.isShowSelect = true;
          }
        } else {
          this.isShowSelect = false;
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 切换主控显示
   */
  changeControl() {
    this.monitorInfoList = this.controlInfoObj[this.selectedControlId];
  }

  /**
   * 获取锁信息
   * param id
   */
  getLockInfo(id: string) {
    let response: Observable<ResultModel<LockModel[]>>;
    if (this.isEquipment) {
      response = this.$lockService.getLockInfoForEquipment(id);
    } else {
      response = this.$lockService.getLockInfo(id);
    }
    response.subscribe((result: ResultModel<Array<LockModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const that = this;
        this.doorAndLockList = result.data.map(item => {
          item.lockStatusClassName = item.lockStatus === that.lockType.unusual ? 'icon-lock-opening' :
            item.lockStatus === that.lockType.normal ? 'icon-lock-normal' : 'icon-lock-invalid';
          item.doorStatusClassName = item.doorStatus === that.lockType.unusual ? 'icon-door-opening' : 'icon-door-normal';
          return item;
        });
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
    });
  }

  /**
   * 设置获取到的主控信息
   * param key
   * param info
   * returns {{key: any; text: string; value: string; iconClass: string}}
   */
  setMonitorInfo(key, info) {

    const value = info.data || '';
    const className = info.alarmFlag === '2' ? 'icon-tilt' : 'icon-fiLink';
    if (key === 'moduleType') {  // 通信模式
      const downloadLanguage = this.$nzI18n.getLocaleData(LanguageEnum.download);
      const moduleValue = CommonUtil.enumMappingTransform(value, ModuleTypeEnum, ModuleTypeNameEnum) + downloadLanguage.module;
      return {
        key: key,
        text: this.indexLanguage.communicationModel,
        value: moduleValue,
        iconClass: 'iconfont icon-communication-model fiLink-communication-model'
      };
    } else if (key === 'lean') {  //  倾斜
      return {
        key: key,
        text: this.indexLanguage.tilt,
        value: value + '°',
        iconClass: `iconfont fiLink-tilt ${className}`
      };
    } else if (key === 'temperature') {  // 温度
      return {
        key: key,
        text: this.indexLanguage.temperature,
        value: value + '℃',
        iconClass: `iconfont fiLink-temperature ${className}`
      };
    } else if (key === 'humidity') {  // 湿度
      return {
        key: key,
        text: this.indexLanguage.humidity,
        value: value + '%',
        iconClass: `iconfont fiLink-humidity ${className}`
      };
    } else if (key === 'electricity') {  // 电量
      // 供电方式为适配器，默认为100%
      const elect = this.sourceType === '0' ? 100 : value;
      return {
        key: key,
        text: this.indexLanguage.electricQuantity,
        value: elect + '%',
        iconClass: this.getElectricQuantityIconClass(elect)
      };
    } else if (key === 'leach') {  // 水浸  (无值)
      return {
        key: key,
        text: this.indexLanguage.waterImmersion,
        value: '',  // value,
        iconClass: `iconfont fiLink-water-immersion ${className}`
      };
    } else if (key === 'wirelessModuleSignal') {  // 信号强度
      return {
        key: key,
        text: this.indexLanguage.signalIntensity,
        value: value + 'dB',
        iconClass: this.getSignalIntensityIconClass(value)
      };
    } else if (key === 'solarPanel') {  // 太阳能板
      return {
        key: key,
        text: this.indexLanguage.solarPanel,
        value: value,
        iconClass: 'icon-discharge'
      };
    }
  }

  /**
   * 获取不同信号强度对应的图标
   * param value
   * returns {string}
   */
  getSignalIntensityIconClass(value) {
    const _value = parseInt(value, 10);
    if (_value === 0) {
      return 'icon-signal-intensity-0';
    } else if (_value > 0 && _value <= 20) {
      return 'icon-signal-intensity-20';
    } else if (_value > 20 && _value <= 40) {
      return 'icon-signal-intensity-40';
    } else if (_value > 40 && _value <= 60) {
      return 'icon-signal-intensity-60';
    } else if (_value > 60 && _value <= 80) {
      return 'icon-signal-intensity-80';
    } else if (_value > 80 && _value <= 100) {
      return 'icon-signal-intensity-100';
    } else {
      return 'icon-signal-intensity';
    }
  }

  /**
   * 获取不同电量对应的图标
   * param value
   * returns {string}
   */
  getElectricQuantityIconClass(value) {
    const _value = parseInt(value, 10);
    if (_value === 0) {
      return 'icon-electric-quantity-0';
    } else if (_value > 0 && _value <= 20) {
      return 'icon-electric-quantity-20';
    } else if (_value > 20 && _value <= 40) {
      return 'icon-electric-quantity-40';
    } else if (_value > 40 && _value <= 60) {
      return 'icon-electric-quantity-60';
    } else if (_value > 60 && _value <= 80) {
      return 'icon-electric-quantity-80';
    } else if (_value > 80 && _value <= 100) {
      return 'icon-electric-quantity-100';
    } else {
      return 'icon-electric-quantity';
    }
  }

  /**
   * 点击锁
   * param item
   */
  clickLock(item) {
    // 0 无效  1异常  2正常
    if (item.lockStatus === this.lockType.normal) {
      // 人井、光交箱、室外柜可远程开锁
      this.openPrompt(item);
    }
  }

  /**
   * 打开开锁询问框
   * param item
   */
  openPrompt(item) {
    this.$modal.create({
      nzTitle: this.indexLanguage.openLockTitle,
      nzContent: this.indexLanguage.openLockContent,
      nzOnOk: () => {
        this.openLock(item);
      }
    });
  }

  /**
   * 开锁
   * param item
   */
  openLock(item) {
    let response: Observable<ResultModel<string>>;
    // 设备开锁
    if (this.isEquipment) {
      const body = new CommonInstructModel();
      body.commandId = ControlInstructEnum.unLock;
      body.equipmentIds = [this.facilityId];
      body.param = {
        params: [{slotNum: item.doorNum}],
      };
      response = this.$lockService.instructDistribute(body);
    } else {
      // 设施开锁
      const body = {deviceId: this.facilityId, doorNumList: [item.doorNum]};
      response = this.$lockService.openLock(body);
    }
    response.subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.commandIssuedSuccessfully);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获取心跳时间
   */
  getHeartbeatTime() {
    let response;
    if (this.isEquipment) {
      response = this.$facilityService.queryEquipmentHeartbeatTime(this.facilityId);
    } else {
      response = this.$facilityService.queryHeartbeatTime(this.facilityId);
    }
    response.subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.recentLogTime) {
          this.heartbeatTime = this.$dateHelper.format(new Date(result.data.recentLogTime), DateFormatStringEnum.DATE_FORMAT_STRING);
        } else {
          this.heartbeatTime = 'NA';
        }
      }
    });
  }


  /**
   *
   * 轮询设施详情
   */
  private getAllData(that) {
    // 如果设施id为空
    if (!that.facilityId) {
      // 当设施id发生变化的时候，关闭定时器
      if (that.timer) {
        clearInterval(that.timer);
      }
      return;
    }
    // 根据智能标签是否显示有电子锁和主控信息
    that.getLockInfo(this.facilityId);
    that.getLockControlInfo(this.facilityId);
    that.getHeartbeatTime();
  }
}
