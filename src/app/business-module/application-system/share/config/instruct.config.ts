import {DistributeModel} from '../model/distribute.model';
import {ApplicationFinalConst, SwitchActionConst} from '../const/application-system.const';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ApplicationService} from '../service/application.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {EnableOrDisableModel} from '../model/policy.control.model';
import {ExecStatusEnum, PolicyEnum, StrategyStatusEnum} from '../enum/policy.enum';
import {OperationButtonEnum} from '../enum/operation-button.enum';
import {Router} from '@angular/router';
import {FilterCondition} from '../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterValueConst} from '../const/filter.const';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';

export class InstructConfig {
  // 设备列表多语言
  public languageTable: ApplicationInterface;

  constructor(
    // 接口服务
    private $applicationService: ApplicationService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 提示
    private $message: FiLinkModalService,
  ) {
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 操作类型
   * @ param data
   * @ param groupId
   */
  public static equipmentOperation(data: { type: string, convenientVal?: number }): DistributeModel {
    const params: DistributeModel = {
      commandId: ControlInstructEnum.turnOn,
      param: {}
    };
    switch (data.type) {
      case SwitchActionConst.open:
        params.commandId = ControlInstructEnum.turnOn;
        break;
      case SwitchActionConst.close:
        params.commandId = ControlInstructEnum.turnOff;
        break;
      case SwitchActionConst.light:
        params.commandId = ControlInstructEnum.dimming;
        params.param.lightnessNum = data.convenientVal;
        break;
      default:
        break;
    }
    return params;
  }

  /**
   * 默认查询条件
   */
  public static defaultQuery($router, queryCondition, type?: string) {
    const url = $router.url;
    const flag = queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.equipmentType);
    if (flag) {
      return;
    }
    let equipmentTypes;
    if (url.includes(ApplicationFinalConst.lighting) || type === '1') {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.lightingFilter);
    } else if (url.includes(ApplicationFinalConst.release) || type === '3') {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.informationFilter);
    } else if (url.includes(ApplicationFinalConst.broadcast) || type === '4') {
      // type待确认
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.broadcastFilter);
    } else if (url.includes(ApplicationFinalConst.call)) {
      // type待确认
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.callFilter);
    } else {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.securityFilter);
    }
    queryCondition.filterConditions.push(equipmentTypes);
  }

  /**
   * 分组指令
   * @ param params
   */
  public groupControl(params: DistributeModel): void {
    this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 回路指令
   * @ param params
   */
  public instructDistribute(params: DistributeModel): void {
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 启用禁用
   * @ param params
   */
  public enableOrDisableStrategy(params: EnableOrDisableModel[]): void {
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.successful}!`);
      }
    });
  }

  /**
   * 操作按钮
   * @ param event 编辑，删除，启用，禁用
   */
  public handleOperation(event: OperationButtonEnum,
                         strategyType: StrategyStatusEnum,
                         $router: Router,
                         path: string,
                         strategyId: string): void {
    const params = {
      strategyType: strategyType,
      operation: ExecStatusEnum.free,
      strategyId: strategyId
    };
    switch (event) {
      // 编辑
      case OperationButtonEnum.edit:
        $router.navigate([path], {
          queryParams: {
            id: strategyId,
            strategyType: params.strategyType
          }
        }).then();
        break;
      // 禁用
      case OperationButtonEnum.disable:
        params.operation = ExecStatusEnum.free;
        this.enableOrDisableStrategy([params]);
        break;
      // 启用
      case OperationButtonEnum.enable:
        params.operation = ExecStatusEnum.implement;
        this.enableOrDisableStrategy([params]);
        break;
      default:
        break;
    }
  }
}
