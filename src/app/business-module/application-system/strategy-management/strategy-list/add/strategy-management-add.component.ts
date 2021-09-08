import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationFinalConst} from '../../../share/const/application-system.const';
import {FinalValueEnum} from '../../../../../core-module/enum/step-final-value.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {ApplicationService} from '../../../share/service/application.service';
import {StrategyManagementDetailsComponent} from '../details/strategy-management-details.component';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {changeStepsStyle} from '../../../share/util/tool.util';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ProgramListModel, StrategyListModel} from '../../../share/model/policy.control.model';
import {ExecStatusEnum, StrategyStatusEnum} from '../../../share/enum/policy.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ContentListModel} from '../../../share/model/content.list.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {CameraTypeEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {CheckEquipmentParamModel} from '../../../../../core-module/model/application-system/check-equipment-param.model';
import {ConditionTypeEnum} from '../../../share/enum/condition-type.enum';
import {Observable} from 'rxjs';

/**
 * 策略列表的新增修改组件
 */
@Component({
  selector: 'app-strategy-management-add',
  templateUrl: './strategy-management-add.component.html',
  styleUrls: ['./strategy-management-add.component.scss']
})
export class StrategyManagementAddComponent implements OnInit, OnDestroy {
  // 操作基本信息页面的方法
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  // 操作策略详情页面的方法
  @ViewChild('strategyDetails') strategyDetails: StrategyManagementDetailsComponent;
  // 操作完成页面的方法
  @ViewChild('detailsInfo') detailsInfo;
  // 按钮组
  @ViewChild('buttonGroupComponent') buttonGroupComponent;
  // 标题
  public title: string;
  // 默认选中的步骤
  public isActiveSteps = FinalValueEnum.STEPS_FIRST;
  // 应用范围
  public isScope: boolean = true;
  // 策略类型枚举
  public strategyStatusEnum = StrategyStatusEnum;
  // 策略id
  public strategyId: string;
  // 存储基本信息的数据对象
  public stepsFirstParams: StrategyListModel = new StrategyListModel();
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 区分三个平台的常量
  public applicationFinal = ApplicationFinalConst;
  // 控制详情页面编辑，删除，开关等显隐
  public isOperation: boolean = false;
  // 步骤条数据
  public setData = [];
  // 下一步按钮是否禁用
  public nextButtonDisable: boolean = false;
  // 验证状态
  public validStatus = {
    first: false,
    second: false
  };
  // 提交loading
  public isSaveLoading = false;

  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $activatedRoute: ActivatedRoute,
    public $applicationService: ApplicationService,
  ) {
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.title = this.languageTable.strategyList.newStrategy;
    this.setData = [
      {number: FinalValueEnum.STEPS_FIRST, activeClass: ' active', title: this.languageTable.basicInformation},
      {number: FinalValueEnum.STEPS_SECOND, activeClass: '', title: this.languageTable.strategyList.strategyDetails},
      {number: FinalValueEnum.STEPS_THIRD, activeClass: '', title: this.languageTable.finish}
    ];
    changeStepsStyle(this.setData, this.isActiveSteps);
    this.nextButtonDisable = true;
    this.initStrategyEdit();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.basicInfo = null;
    this.strategyDetails = null;
    this.detailsInfo = null;
  }

  /**
   * 获取策略详情
   */
  public initStrategyEdit(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.title = this.languageTable.strategyList.equipmentEdit;
        this.strategyId = queryParams.id;
        let httpRequest: Observable<ResultModel<StrategyListModel>>;
        if (queryParams.strategyType === StrategyStatusEnum.linkage) {
          httpRequest = this.$applicationService.getLinkageDetails(queryParams.id);
        } else if (queryParams.strategyType === StrategyStatusEnum.lighting) {
          httpRequest = this.$applicationService.getLightingPolicyDetails(queryParams.id);
        } else if (queryParams.strategyType === StrategyStatusEnum.information) {
          httpRequest = this.$applicationService.getReleasePolicyDetails(queryParams.id);
        } else if (queryParams.strategyType === StrategyStatusEnum.broadcast) {
          httpRequest = this.$applicationService.getBroadcastPolicyDetails(queryParams.id);
        }
        httpRequest.subscribe((result: ResultModel<StrategyListModel>) => {
          if (result.code === ResultCodeEnum.success) {
            this.stepsFirstParams = result.data;
            this.basicInfo.strategyStatus = result.data.strategyStatus === ExecStatusEnum.implement;
            const ids = result.data.strategyRefList.map(item => item.refId);
            // 当为联动策略时才需要使用multiEquipmentData这个字段回显应用范围数据
            if (this.stepsFirstParams.strategyType === StrategyStatusEnum.linkage && ids && ids.length) {
              this.queryEquipmentDataList(ids);
            } else {
              this.stepsFirstParams.multiEquipmentData = [];
            }
            if (this.stepsFirstParams.linkageStrategyInfo && this.stepsFirstParams.linkageStrategyInfo.instructInfoBase
              && this.stepsFirstParams.linkageStrategyInfo.instructInfoBase.programId) {
              this.queryProgramInfo(this.stepsFirstParams.linkageStrategyInfo.instructInfoBase.programId);
            }
            if (this.stepsFirstParams.strategyProgRelationList && this.stepsFirstParams.strategyProgRelationList.length) {
              this.queryStrategyProgramInfo();
            }
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   * 信息发布策略根据节目id集合查询节目详情信息
   * @ param params
   */
  public queryStrategyProgramInfo(): void {
    const programIds = this.stepsFirstParams.strategyProgRelationList.map(item => item.programId);
    this.$applicationService.lookReleaseProgramIds(programIds).subscribe((result: ResultModel<ProgramListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.stepsFirstParams.strategyProgRelationList = this.stepsFirstParams.strategyProgRelationList.map(item => {
          const programName = result.data.find(it => it.programId === item.programId).programName;
          item.programName = programName || '';
          return item;
        });
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 取消操作
   */
  public handCancelSteps(): void {
    // 返回到上一步操作
    window.history.go(-1);
  }

  /**
   * 新增策略
   * @ param params
   */
  public linkageAdd(params: StrategyListModel): void {
    let httpRequest: Observable<ResultModel<string>>;
    if (params.strategyType === StrategyStatusEnum.linkage) {
      httpRequest = this.$applicationService.addLinkageStrategy(params);
    } else if (params.strategyType === StrategyStatusEnum.lighting) {
      httpRequest = this.$applicationService.lightingPolicyAdd(params);
    } else if (params.strategyType === StrategyStatusEnum.information) {
      httpRequest = this.$applicationService.releasePolicyAdd(params);
    } else if (params.strategyType === StrategyStatusEnum.broadcast) {
      httpRequest = this.$applicationService.broadcastPolicyAdd(params);
    }
    httpRequest.subscribe((result: ResultModel<string>) => {
      this.isSaveLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.handCancelSteps();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isSaveLoading = false;
    });
  }

  /**
   * 编辑策略
   * @ param params
   */
  public linkageEdit(params: StrategyListModel): void {
    let httpRequest: Observable<ResultModel<string>>;
    if (params.strategyType === StrategyStatusEnum.linkage) {
      httpRequest = this.$applicationService.modifyLinkageStrategy(params);
    } else if (params.strategyType === StrategyStatusEnum.lighting) {
      httpRequest = this.$applicationService.modifyLightStrategy(params);
    } else if (params.strategyType === StrategyStatusEnum.information) {
      httpRequest = this.$applicationService.modifyReleaseStrategy(params);
    } else if (params.strategyType === StrategyStatusEnum.broadcast) {
      httpRequest = this.$applicationService.modifyBroadcastStrategy(params);
    }
    httpRequest.subscribe((result: ResultModel<string>) => {
      this.isSaveLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.handCancelSteps();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isSaveLoading = false;
    });
  }

  /**
   * 数据提交
   */
  public handStepsSubmit(): void {
    this.isSaveLoading = true;
    // 提交时不需要 multiEquipmentData 字段
    // 当为联动策略时才需要使用multiEquipmentData这个字段回显应用范围数据
    if (this.stepsFirstParams.strategyType === StrategyStatusEnum.linkage &&
      this.stepsFirstParams.multiEquipmentData && this.stepsFirstParams.multiEquipmentData.length) {
      this.stepsFirstParams.strategyRefList = this.stepsFirstParams.multiEquipmentData.map(item => {
        return {
          refName: item.equipmentName,
          refEquipmentType: item.equipmentType,
          refType: ExecStatusEnum.implement,
          refId: item.equipmentId
        };
      });
      delete this.stepsFirstParams.multiEquipmentData;
    }
    if (this.stepsFirstParams.linkageStrategyInfo) {
      if (this.stepsFirstParams.linkageStrategyInfo.conditionType === ConditionTypeEnum.trigger) {
        // 封装设备id
        const groupEquipments = [], groupInstructs = [];
        this.stepsFirstParams.linkageStrategyInfo.actionBackup.forEach(item => {
          const equipmentIds = [];
          const equipmentTypesUniq = [];
          item.selectedEquipment.forEach(_item => {
            equipmentIds.push(_item.equipmentId);
            const index = equipmentTypesUniq.findIndex(uniqType => _item.equipmenttype === uniqType.equipmenttype);
            if (index === -1) {
              equipmentTypesUniq.push({
                equipmentType: _item.equipmentType,
                instruct: 'adjust_single_light',
                param: {light_brilliance_num: item.light}
              });
            }
          });
          groupEquipments.push(equipmentIds);
          groupInstructs.push(equipmentTypesUniq);
        });
        this.stepsFirstParams.linkageStrategyInfo.groupEquipments = JSON.stringify(groupEquipments);
        this.stepsFirstParams.linkageStrategyInfo.groupInstructs = JSON.stringify(groupInstructs);
        this.stepsFirstParams.linkageStrategyInfo.multipleConditions = JSON.stringify(this.stepsFirstParams.linkageStrategyInfo.triggerSelectedList);
        this.stepsFirstParams.linkageStrategyInfo.actionBackup = JSON.stringify(this.stepsFirstParams.linkageStrategyInfo.actionBackup);
      } else {
        this.stepsFirstParams.linkageStrategyInfo.groupEquipments = null;
        this.stepsFirstParams.linkageStrategyInfo.groupInstructs = null;
        this.stepsFirstParams.linkageStrategyInfo.multipleConditions = null;
        this.stepsFirstParams.linkageStrategyInfo.actionBackup = null;
      }
    }
    if (this.strategyId) {
      this.stepsFirstParams.strategyId = this.strategyId;
      this.linkageEdit(this.stepsFirstParams);
    } else {
      this.linkageAdd(this.stepsFirstParams);
    }
    this.checkEquipmentMode(this.stepsFirstParams);
  }

  public infoValid(valid: boolean, isActiveSteps: number): void {
    this.nextButtonDisable = !valid;
    // 记录第一步第二步的校验状态
    if (isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
      this.validStatus.first = valid;
    } else {
      this.validStatus.second = valid;
    }
  }

  /**
   * 改变步骤
   * param value
   */
  public changeSteps(value: number): void {
    // 下一步
    if (value > this.isActiveSteps) {
      // 判断上一步有值
      if (value - 1 > 0) {
        // 上一步为第一步
        if ((value - 1) === this.finalValueEnum.STEPS_FIRST) {
          if (!this.validStatus.first) {
            return;
          }
          // 上一步为第二步
        } else if ((value - 1) === this.finalValueEnum.STEPS_SECOND) {
          if (!this.validStatus.second) {
            return;
          }
        }
      }
    } else {
      // 后退不校验
    }
    if (value > this.finalValueEnum.STEPS_FIRST) {
      if (value > this.finalValueEnum.STEPS_SECOND) {
        let open = 0;
        let turnOff = 0;
        if (this.stepsFirstParams.instructLightList) {
          this.stepsFirstParams.instructLightList.forEach(item => {
            if (item.switchLight === '1') {
              open++;
            } else if (item.switchLight === '0') {
              turnOff++;
            }
          });
        }
        if (turnOff > open) {
          this.$message.warning(this.languageTable.securityWorkbench.tip);
          this.isActiveSteps = value - 1;
          this.buttonGroupComponent.isActiveSteps = this.isActiveSteps;
          this.toggleButtonDisable();
          return;
        }
        this.basicInfo.handNextSteps();
      } else {
        this.basicInfo.handNextSteps();
      }
    }
    this.isActiveSteps = value;
    changeStepsStyle(this.setData, this.isActiveSteps);
    this.toggleButtonDisable();
  }

  /**
   * 切换按钮的禁用状态
   */
  public toggleButtonDisable(): void {
    if (this.isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
      this.nextButtonDisable = !this.validStatus.first;
    } else {
      this.nextButtonDisable = !this.validStatus.second;
    }
  }

  /**
   * 根据设备id集合查询设备信息
   * param ids
   */
  public queryEquipmentDataList(ids: Array<string>): void {
    this.$applicationService.queryEquipmentDataList({equipmentIdList: ids}).subscribe((result) => {
      this.stepsFirstParams.multiEquipmentData = result.data;
      this.stepsFirstParams.multiEquipmentData.forEach(item => {
        // 设置状态样式
        const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
        // 获取设备类型的图标
        let iconClass;
        if (item.equipmentType === EquipmentTypeEnum.camera && item.equipmentModelType === CameraTypeEnum.bCamera) {
          // 摄像头球型
          iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
        } else {
          iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
        }
        item.iconClass = iconClass;
        item.statusIconClass = iconStyle.iconClass;
        item.statusColorClass = iconStyle.colorClass;
        item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
      });
    });
  }

  /**
   * 查询节目信息
   * param id
   */
  public queryProgramInfo(id: string): void {
    this.$applicationService.lookReleaseProgram(id).subscribe((result: ResultModel<ContentListModel>) => {
      this.stepsFirstParams.linkageStrategyInfo.instructInfoBase.programName = result.data.programName;
    });
  }

  /**
   * 校验设备模式
   */
  private checkEquipmentMode(data: StrategyListModel): void {
    // 需调用设备模式校验接口
    const equipmentIds = [];
    data.strategyRefList.forEach(item => {
      if (item.refType === '1') {
        equipmentIds.push(item.refId);
      }
    });
    const params = new CheckEquipmentParamModel();
    params.mode = (data.controlType === '1' || data.controlType === '01') ? '01' : '00';
    params.equipmentIdList = equipmentIds;
    this.$applicationService.checkEquipmentOnAdd(params).subscribe((result: ResultModel<string>) => {
      if (result.code !== ResultCodeEnum.success) {
        this.$message.error(result.msg);
      }
    });
  }
}
