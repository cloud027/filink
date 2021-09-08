import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationFinalConst} from '../../../share/const/application-system.const';
import {FinalValueEnum} from '../../../../../core-module/enum/step-final-value.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicInformationComponent} from '../../../components/basic-information/basic-information.component';
import {ApplicationService} from '../../../share/service/application.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {changeStepsStyle} from '../../../share/util/tool.util';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {StrategyListModel} from '../../../share/model/policy.control.model';
import {InstructUtil} from '../../../share/util/instruct-util';
import {ExecStatusEnum} from '../../../share/enum/policy.enum';
import {CheckEquipmentParamModel} from '../../../../../core-module/model/application-system/check-equipment-param.model';

@Component({
  selector: 'app-lighting-add',
  templateUrl: './lighting-add.component.html',
  styleUrls: ['./lighting-add.component.scss']
})
export class LightingAddComponent implements OnInit, OnDestroy {
  // 获取基本信息组件的值
  @ViewChild('basicInfo') basicInfo: BasicInformationComponent;
  // 按钮组
  @ViewChild('buttonGroupComponent') buttonGroupComponent;
  // 详情操作按钮显隐
  @Input() isOperation: boolean = false;
  @Input() linkageType: boolean = false;
  // 标题
  public title: string;
  // 选中的步骤数
  public isActiveSteps = FinalValueEnum.STEPS_FIRST;
  // 策略id
  public strategyId: string;
  // 保存基本信息
  public stepsFirstParams: StrategyListModel = new StrategyListModel();
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 区分三个平台的常量
  public applicationFinal = ApplicationFinalConst;
  // 步骤条的值
  public setData = [];
  public nextButtonDisable: boolean = false;
  // 验证状态
  public validStatus = {
    first: false,
    second: false
  };
  // 提交loading
  public isSaveLoading = false;

  constructor(
    // 路由
    private $router: Router,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 提示
    private $message: FiLinkModalService,
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 接口服务
    private $applicationService: ApplicationService,
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
      { number: FinalValueEnum.STEPS_FIRST, activeClass: ' active', title: this.languageTable.basicInformation},
      { number: FinalValueEnum.STEPS_SECOND, activeClass: '', title: this.languageTable.strategyList.strategyDetails},
      { number: FinalValueEnum.STEPS_THIRD, activeClass: '', title: this.languageTable.finish}
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
  }

  public infoValid(valid, isActiveSteps): void {
    this.nextButtonDisable = !valid;
    // 记录第一步第二步的校验状态
    if (isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
      this.validStatus.first = valid;
    } else {
      this.validStatus.second = valid;
    }
  }

  /**
   * 获取策略详情
   */
  public initStrategyEdit(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.strategyId = queryParams.id;
        this.title = this.languageTable.strategyList.equipmentEdit;
        this.$applicationService.getLightingPolicyDetails(queryParams.id).subscribe((result: ResultModel<StrategyListModel>) => {
          this.stepsFirstParams = result.data;
          this.basicInfo.strategyStatus = result.data.strategyStatus === ExecStatusEnum.implement;
          if (result.code === ResultCodeEnum.success) {
            this.recordFmt(result.data);
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   * 处理数据的格式
   * @ param data
   */
  public recordFmt(data: StrategyListModel): void {
    InstructUtil.instructLight(data.instructLightList, this.languageTable);
  }


  /**
   * 取消操作
   */
  public handCancelSteps(): void {
    window.history.go(-1);
  }

  /**
   * 新增策略
   * @ param params
   */
  public lightPolicyAdd(params: StrategyListModel): void {
    this.$applicationService.lightingPolicyAdd(params).subscribe((result: ResultModel<string>) => {
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
   * 校验设备模式
   */
  private checkEquipmentMode(params: StrategyListModel): void {
    // 需调用设备模式校验接口
    const ids = [];
    params.strategyRefList.forEach(item => {
      if (item.refType === '1') {
        ids.push(item.refId);
      }
    });
    const data = new CheckEquipmentParamModel();
    data.equipmentIdList = ids;
    data.mode = (params.controlType === '1' || params.controlType === '01') ? '01' : '00';
    this.$applicationService.checkEquipmentOnAdd(data).subscribe((res: ResultModel<string>) => {
      if (res.code !== ResultCodeEnum.success) {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 编辑策略
   * @ param params
   */
  public lightPolicyEdit(params: StrategyListModel): void {
    this.$applicationService.modifyLightStrategy(params).subscribe((result: ResultModel<string>) => {
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
    if (this.strategyId) {
      this.stepsFirstParams.strategyId = this.strategyId;
      this.lightPolicyEdit(this.stepsFirstParams);
    } else {
      this.lightPolicyAdd(this.stepsFirstParams);
    }
    this.checkEquipmentMode(this.stepsFirstParams);
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
        this.stepsFirstParams.instructLightList.forEach(item => {
          if (item.switchLight === '1') {
            open++;
          } else if (item.switchLight === '0') {
            turnOff++;
          }
        });
        if (turnOff > open) {
          this.$message.warning(this.languageTable.strategyList.strategyTip);
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

  toggleButtonDisable() {
    if (this.isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
      this.nextButtonDisable = !this.validStatus.first;
    } else {
      this.nextButtonDisable = !this.validStatus.second;
    }
  }
}
