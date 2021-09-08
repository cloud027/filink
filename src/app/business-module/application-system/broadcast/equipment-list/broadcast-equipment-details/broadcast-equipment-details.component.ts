import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../share/service/application.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {InstructConfig} from '../../../share/config/instruct.config';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {BroadcastTableEnum} from '../../../share/enum/auth.code.enum';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {DistributeModel} from '../../../share/model/distribute.model';
import {FilterValueConst} from '../../../share/const/filter.const';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {CallTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {EnergyApiService} from '../../../../energy/share/service/energy/energy-api.service';


@Component({
  selector: 'app-broadcast-equipment-details',
  templateUrl: './broadcast-equipment-details.component.html',
  styleUrls: ['./broadcast-equipment-details.component.scss']
})
export class BroadcastEquipmentDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('audioBroadcast') audioBroadcast;
  // 设备id
  public equipmentId: string = '';
  public sequenceId: string = '';
  public filePath: string = '';
  public equipmentModel: string = '';
  public equipmentName: string = '';
  public operationList = [];
  public sliderList = [];
  // 亮度值
  public lightValue: number = 0;
  // 是否显示
  public isShow: boolean = true;
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 节目名称
  public programName: string = '';
  // 应用系统详情显示
  public isShowApplication: boolean = true;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
// 批量选中的音量数据
  public volumeList: EquipmentListModel[] = [];
  public selectedEquipmentData = [];
  public equipmentList = [];
  // 录音设备集合
  public recordEquipmentList = [];
  public isVolume: boolean = false;
  public isOnline: boolean = false;
  public isInsert: boolean = false;
  public sourceId: string;
  public volumeValue: number = 0;
  public onlineVolumeValue: number = 0;
  public insertType: number = 0;
  public audioQueryCondition: QueryConditionModel = new QueryConditionModel();
  public audioPageBean: PageModel = new PageModel();
  // 广播状态
  public radioStatus: boolean = false;
  private isStop: boolean = false;
  private savePlanThrottle: boolean = false;
  private insertVolumeValue: number;

  constructor(
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 提示
    private $message: FiLinkModalService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 接口服务
    private $applicationService: ApplicationService,
    private $energyApiService: EnergyApiService
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  public ngOnInit(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      this.equipmentId = queryParams.equipmentId;
      this.equipmentModel = queryParams.equipmentModel;
      this.equipmentName = queryParams.equipmentName;
      this.sequenceId = queryParams.sequenceId;
    });
    this.getOperation();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.audioBroadcast = null;
  }

  /**
   * 设备操作按钮
   * @ param data
   */
  public handleEquipmentOperation(id: ControlInstructEnum, code?: string): void {
    if (code && !SessionUtil.checkHasRole(code)) {
      this.$message.warning('您暂无操作权限！');
      return;
    }
    const d = JSON.parse(sessionStorage.getItem('radioData'));
    switch (id) {
      // 现场广播
      case ControlInstructEnum.broadcastOnline:
        // 如果缓存有  说明已有广播
        if (d) {
          this.$message.warning('已有广播正在广播中！');
          return;
        }
        this.queryCallEquipmentList();
        this.isOnline = true;
        this.queryBroadcastVolumeById(this.sequenceId);
        break;
      // 插播
      case ControlInstructEnum.broadcastPlay:
        if (d) {
          this.$message.warning('已有广播正在广播中！');
          return;
        }
        this.selectedEquipmentData = [];
        this.selectedEquipmentData.push({equipmentId: this.equipmentId});
        this.isInsert = true;
        this.queryBroadcastVolumeById(this.sequenceId);
        break;
      // 保存音量
      case ControlInstructEnum.broadcastVolumeSave:
        this.isVolume = true;
        this.queryBroadcastVolumeById(this.sequenceId);
        break;

      default:
        if (d) {
          this.$message.warning('已有广播正在广播中！');
          return;
        }
        const params: DistributeModel = {
          commandId: id,
          equipmentIds: [this.equipmentId],
          param: {}
        };
        const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
        instructConfig.instructDistribute(params);
    }
  }

  /**
   * 开，关，上电，下电
   * @ param data
   */
  public handleOperationEvent(data): void {
    this.operationList = data;
  }

  /**
   * 亮度和音量回写
   * @ param data
   */
  public handleEquipmentDetails(data): void {
    if (data && data.volume) {
      this.audioBroadcast.volumeValue = data.volume;
      this.sliderDefault(data);
    }
  }

  /**
   * 滑块默认值赋值
   * @ param data
   */
  private sliderDefault(data): void {
    if (this.audioBroadcast.sliderList && this.audioBroadcast.sliderList.length) {
      this.audioBroadcast.sliderList.forEach(item => {
        if (item.id === ControlInstructEnum.setVolume) {
          item.value = data.volume;
        }
      });
    }
  }

  public queryCallEquipmentList() {
    this.audioQueryCondition.filterConditions = [
      {
        filterValue: FilterValueConst.callFilter,
        filterField: 'equipmentType',
        operator: 'in'
      },
      {
        filterValue: CallTypeEnum.microphone,
        filterField: 'equipmentModelType',
        operator: 'eq'
      }
    ];
    this.audioQueryCondition.pageCondition.pageSize = 10;
    this.audioQueryCondition.pageCondition.pageNum = 1;
    this.$applicationService.equipmentListByPage(this.audioQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, size, data} = res;
        this.recordEquipmentList = data || [];
        this.audioPageBean.Total = totalCount;
        this.audioPageBean.pageIndex = pageNum;
        this.audioPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }

    });
  }

  /**
   * 指令接口
   * @ param params
   */
  public instructDistribute(params: DistributeModel, type?: string): void {
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
        this.isVolume = false;
        this.volumeValue = 0;
        if (type === '0') {
          //开始现场广播
          this.isStop = true;
        } else {
          //停止现场广播
          this.isStop = false;
        }
        this.savePlanThrottle = false;
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 现场广播 开始、停止
   */
  public switchOnlineOperate(type) {
    // 校验是否选择录音设备
    if (this.sourceId) {
      const params = {
        commandId: ControlInstructEnum.broadcastOnline,
        equipmentIds: [this.equipmentId],
        param: {
          sourceId: this.sourceId, // 录音设备真实id  sequenceId
          isStop: type, //  0 - 开始   1 - 停止.
        }
      };
      if (type === '1') {
        params.commandId = ControlInstructEnum.broadcastOnlineStop;
      }
      if (this.savePlanThrottle) {
        return;
      }
      // 开启节流阀防止重复提交
      this.savePlanThrottle = true;
      this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          const volumeParams = {
            commandId: ControlInstructEnum.broadcastVolume,
            equipmentIds: [this.equipmentId],
            param: {
              volume: this.onlineVolumeValue
            }
          };
          this.instructDistribute(volumeParams, type);
          this.radioStatus = type !== '1';
          this.isStop = type !== '1';
          // 存储广播数据
          sessionStorage.setItem('radioData', JSON.stringify(params));
          if (type === '1') {
            sessionStorage.removeItem('radioData');
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      this.$message.warning(this.language.selectDevice);
    }
  }

  public handleSource(event) {
    this.sourceId = event;
  }

  /**
   * 改变音量滑块值的变化
   * @ param event
   */
  public handleVolumeSlider(event, type) {
    if (type === 0) {
      // 音量弹窗
      this.volumeValue = event;
    } else {
      // 插播
      this.onlineVolumeValue = event;
    }
  }

  public handleCloseOnline() {
    if (!this.sourceId) {
      this.isOnline = false;
    } else {
      this.isOnline = false;
      if (this.radioStatus) {
        this.$energyApiService.messageTopic.next({
          type: 1, // 广播类型  1：列表广播  2：分组广播
          radioId: this.sourceId,
          radioName: this.equipmentName,
        });
      }
    }
    this.sourceId = null;
    this.isStop = false;
  }

  /**
   * 音量调整
   */
  public confirmVolume(): void {
    const params: DistributeModel = {
      equipmentIds: [this.equipmentId],
      commandId: ControlInstructEnum.broadcastVolumeSave,
      param: {
        volume: this.volumeValue
      }
    };
    this.isVolume = false;
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        const volumeParams = {
          commandId: ControlInstructEnum.broadcastVolume,
          equipmentIds: [this.equipmentId],
          param: {
            volume: this.volumeValue
          }
        };
        this.instructDistribute(volumeParams);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  public getOperation() {
    this.operationList = [
      {
        'name': '现场广播',
        'getDataUrl': null,
        'submitUrl': null,
        'id': ControlInstructEnum.broadcastOnline,
        'code': BroadcastTableEnum.primaryOnline,
        'method': null,
        'type': 'button',
        'disable': false,
        'loading': false,
        'icon': 'fiLink-filink-xianchangguangbo-icon',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
      {
        'name': '插播',
        'getDataUrl': null,
        'submitUrl': null,
        'id': ControlInstructEnum.broadcastPlay,
        'code': BroadcastTableEnum.primaryInsertKey,
        'method': null,
        'type': 'button',
        'disable': false,
        'loading': false,
        'icon': 'fiLink-filink-chabo-icon',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
      {
        'name': '停止插播',
        'getDataUrl': null,
        'submitUrl': null,
        'id': ControlInstructEnum.broadcastStop,
        'code': BroadcastTableEnum.primaryShutKey,
        'method': null,
        'type': 'button',
        'disable': false,
        'loading': false,
        'icon': 'fiLink-suspend',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
      {
        'name': '音量',
        'getDataUrl': null,
        'submitUrl': null,
        'id': ControlInstructEnum.broadcastVolumeSave,
        'code': BroadcastTableEnum.primaryVolume,
        'method': null,
        'type': 'button',
        'disable': false,
        'loading': false,
        'icon': 'fiLink-filink-yinliang-icon1',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
    ];
  }

  handleCancel() {
    this.isVolume = false;
  }

  public queryBroadcastVolumeById(id) {
    this.$applicationService.queryBroadcastVolumeById({sequenceId: id}).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.volumeValue = Number(res.data);
        this.insertVolumeValue = Number(res.data);
        this.onlineVolumeValue = Number(res.data);
      } else {
        this.volumeValue = 0;
        this.insertVolumeValue = 0;
        this.onlineVolumeValue = 0;
        this.$message.error(res.msg);
      }
    });
  }
}
