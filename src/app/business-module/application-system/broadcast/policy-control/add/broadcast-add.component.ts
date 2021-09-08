import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationFinalConst, SET_DATA} from '../../../share/const/application-system.const';
import {FinalValueEnum} from '../../../../../core-module/enum/step-final-value.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../share/service/application.service';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {BroadcastStrategyComponent} from '../broadcast-strategy/broadcast-strategy.component';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {changeStepsStyle} from '../../../share/util/tool.util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ProgramListModel, StrategyListModel} from '../../../share/model/policy.control.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ExecStatusEnum} from '../../../share/enum/policy.enum';

@Component({
  selector: 'app-broadcast-add',
  templateUrl: './broadcast-add.component.html',
  styleUrls: ['./broadcast-add.component.scss']
})
export class BroadcastAddComponent implements OnInit, OnDestroy {
  // 获取基本信息
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  // 获取策略详情信息
  @ViewChild('strategyDetails') strategyDetails: BroadcastStrategyComponent;
  // 获取完成页面
  @ViewChild('detailsInfo') detailsInfo;
  @Input() linkageType: boolean = false;
  // 标题
  public title: string;
  // 默认选中的步骤
  public isActiveSteps: number = FinalValueEnum.STEPS_FIRST;
  // 区分三个平台的常量
  public applicationFinal = ApplicationFinalConst;
  // 传给子组件的值
  public middleData: StrategyListModel;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 步骤条的步骤常量值
  public finalValueEnum = FinalValueEnum;
  // 策略id
  public strategyId: string = '';
  // 节目集合
  public programList: ProgramListModel[];
  // 控制操作按钮的显隐
  public isOperation: boolean = false;
  // 步骤条的值
  public setData = SET_DATA;
  // 保存基本信息
  public stepsFirstParams: StrategyListModel = new StrategyListModel();
  public nextButtonDisable: boolean = true;
  // 验证状态
  public validStatus = {
    first: false,
    second: false
  };
  // 提交loading
  public isSaveLoading = false;

  constructor(
    // 路由
    public $router: Router,
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 错误提示框
    private $message: FiLinkModalService,
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 接口服务
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
    changeStepsStyle(this.setData, this.isActiveSteps);
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
   * 控制按钮显隐
   */
  public showHiddenNextSteps(index: number): boolean {
    const strategyPlayPeriodRefList = this.strategyDetails.strategyPlayPeriodRefList;
    const strategyProgRelationList = this.strategyDetails.strategyProgRelationList;
    if (index === this.finalValueEnum.STEPS_FIRST) {
      return !this.basicInfo.isDisabled;
    } else if (index === this.finalValueEnum.STEPS_SECOND) {
      return !(strategyPlayPeriodRefList.length && strategyProgRelationList.length);
    } else {
      return !(this.basicInfo.isDisabled && strategyPlayPeriodRefList.length && strategyProgRelationList.length);
    }
  }

  /**
   * 上一步操作
   * @ param value
   */
  public handPrevSteps(value: number): void {
    this.isActiveSteps = value - 1;
    changeStepsStyle(this.setData, this.isActiveSteps);
  }

  /**
   * 下一步操作
   * @ param value
   */
  public handNextSteps(value: number): void {
    if (value === this.finalValueEnum.STEPS_FIRST) {
      this.basicInfo.handNextSteps();
    } else if (value === this.finalValueEnum.STEPS_SECOND) {
      // this.instructInfoProgram();
    }
    this.isActiveSteps = value + 1;
    changeStepsStyle(this.setData, this.isActiveSteps);
  }

  /**
   * 保存策略详情数据
   */
  public instructInfoProgram(): void {
    const instructBroadcast = this.strategyDetails.instructBroadcast;
    const strategyPlayPeriodRefList = this.strategyDetails.strategyPlayPeriodRefList;
    const strategyProgRelationList = this.strategyDetails.strategyProgRelationList;
    const ids = strategyProgRelationList.map(item => item.programId);
    // this.lookReleaseProgramIds(ids, null);
    this.middleData = Object.assign({},
      this.basicInfo.stepsFirstParams,
      {instructBroadcast},
      {strategyPlayPeriodRefList},
      {strategyProgRelationList});
    this.detailsInfo.handNextSteps(this.middleData);
  }

  /**
   * 数据提交
   */
  public handStepsSubmit(): void {
    this.isSaveLoading = true;
    if (this.strategyId) {
      this.stepsFirstParams.strategyId = this.strategyId;
      this.modifyBroadcastStrategy(this.stepsFirstParams);
    } else {
      this.broadcastPolicyAdd(this.stepsFirstParams);
    }
  }

  /**
   * 取消操作
   */
  public handCancelSteps(): void {
    window.history.go(-1);
  }

  /**
   * 点击步骤条切换
   * @ param value
   */
  public handChangeSteps(value: number): void {
    this.isActiveSteps = value;
    if (value === this.finalValueEnum.STEPS_THIRD) {
      this.basicInfo.handNextSteps();
    }
    changeStepsStyle(this.setData, this.isActiveSteps);
  }

  infoValid(valid, isActiveSteps) {
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
    if (value > this.finalValueEnum.STEPS_SECOND) {
      // 没有策略名字说明数据没有合过来
      this.basicInfo.handNextSteps();
    }
    this.isActiveSteps = value;
    changeStepsStyle(this.setData, this.isActiveSteps);
    this.toggleButtonDisable();
  }

  toggleButtonDisable() {
    if (this.isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
      this.nextButtonDisable = !this.validStatus.first;
    } else {
      this.nextButtonDisable = !this.validStatus.second;
    }
  }

  /**
   * 获取策略详情
   */
  private initStrategyEdit(): void {
    // 设置初始默认亮度为百分之80
    // 设置初始默认音量为百分之30
    this.stepsFirstParams.instructBroadcast.volume = '15';
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.title = this.languageTable.strategyList.equipmentEdit;
        this.strategyId = queryParams.id;
        this.$applicationService.getBroadcastPolicyDetails(queryParams.id).subscribe((result: ResultModel<StrategyListModel>) => {
          if (result.code === ResultCodeEnum.success) {
            this.stepsFirstParams = result.data;
            this.basicInfo.strategyStatus = result.data.strategyStatus === ExecStatusEnum.implement;
            if (this.stepsFirstParams.strategyProgRelationList && this.stepsFirstParams.strategyProgRelationList.length) {
              this.queryStrategyProgramInfo();
            }
          } else {
            this.$message.error(result.msg);
          }
        }, () => {

        });
      }
    });
  }

  /**
   * 根据节目id集合查询
   * @ param params
   */
  private queryStrategyProgramInfo(): void {
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
   * 更新子组件的值
   * @ param data
   */
  private resultFmt(data: StrategyListModel, list: ProgramListModel[]): void {
    this.strategyDetails.instructBroadcast = data.instructBroadcast;
    this.middleData = data;
    this.basicInfo.strategyRefList = data.strategyRefList;
    this.basicInfo.selectUnitName = data.strategyRefList.map(item => item.refName).join(';');
    this.strategyDetails.strategyPlayPeriodRefList = data.strategyPlayPeriodRefList;
    data.strategyProgRelationList.forEach((item, index) => {
      item.programName = list[index].programName;
    });
    this.strategyDetails.strategyProgRelationList = data.strategyProgRelationList;
    this.strategyDetails.selectedProgram.name = data.strategyProgRelationList.map(item => item.programName).join(';');
    this.basicInfo.dateRange = [
      CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(data.effectivePeriodStart)),
      CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(data.effectivePeriodEnd))
    ];
    if (data.execTime) {
      data.execTime = new Date(data.execTime);
    }
    this.basicInfo.formStatus.resetData(data);
  }

  /**
   * 新增策略
   * @ param params
   */
  private broadcastPolicyAdd(params: StrategyListModel): void {
    this.$applicationService.broadcastPolicyAdd(params).subscribe((result: ResultModel<string>) => {
      this.isSaveLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.handCancelSteps();
      } else {
        this.isSaveLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.isSaveLoading = false;
    });
  }

  /**
   * 编辑信息发布
   * @ param params
   */
  private modifyBroadcastStrategy(params: StrategyListModel): void {
    this.$applicationService.modifyBroadcastStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.handCancelSteps();
      } else {
        this.isSaveLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.isSaveLoading = false;
    });
  }
}
