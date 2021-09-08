import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClassStatusConst, RouterJumpConst} from '../../../share/const/application-system.const';
import {ApplicationService} from '../../../share/service/application.service';
import {detailsFmt} from '../../../share/util/tool.util';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {EnableOrDisableModel, StrategyListModel} from '../../../share/model/policy.control.model';
import {OperationButtonEnum} from '../../../share/enum/operation-button.enum';
import {StrategyStatusEnum} from '../../../share/enum/policy.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {InstructUtil} from '../../../share/util/instruct-util';
import {CurrencyEnum} from '../../../../../core-module/enum/operator-enable-disable.enum';
import {getStrategyStatus} from '../../../share/util/application.util';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LightPolicyEnum} from '../../../share/enum/auth.code.enum';

@Component({
  selector: 'app-lighting-details',
  templateUrl: './lighting-details.component.html',
  styleUrls: ['./lighting-details.component.scss']
})
export class LightingDetailsComponent implements OnInit {
  // 详情的操作按钮
  @Input() public isOperation: boolean = true;
  // 父组件传过来的值
  @Input() public stepsFirstParams: StrategyListModel = new StrategyListModel();
  // 策略id
  public strategyId: string;
  // 关照强度表格配置
  public strategyTableConfig: TableConfigModel;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 设备管理国际化
  public facilityLanguage: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 样式常量
  public classStatus = ClassStatusConst;
  // 存储策略详情的数据
  public strategyDetails = [];
  // 页面是否loading
  public isLoading: boolean = false;
  // 照明策略权限枚举
  public lightPolicyEnum = LightPolicyEnum;
  // 策略启用状态
  public strategyStatus: string;

  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    private $modalService: NzModalService,
    // 提示
    private $message: FiLinkModalService,
    // 接口服务
    public $applicationService: ApplicationService,
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    // 路由
    public $router: Router,
  ) {
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.initTableConfig();
    if (this.isOperation) {
      this.initDetails();
    } else {
      this.handNextSteps(this.stepsFirstParams);
    }
  }

  /**
   * 获取策略详情
   */
  public initDetails(): void {
    this.isLoading = true;
    this.$activatedRoute.params.subscribe(params => {
      this.strategyId = params.id;
      this.$applicationService.getLightingPolicyDetails(params.id).subscribe((result: ResultModel<StrategyListModel>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.stepsFirstParams = result.data;
          this.strategyStatus = result.data.strategyStatus as string;
          InstructUtil.instructLight(this.stepsFirstParams.instructLightList, this.languageTable);
          this.handNextSteps(result.data);
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    });
  }

  /**
   * 下一步
   * @ param data
   */
  public handNextSteps(data: StrategyListModel): void {
    this.stepsFirstParams = detailsFmt(data, this.$nzI18n);
    // 给时间段排序后再显
    this.stepsFirstParams.instructLightList.sort((a, b) => {
      const aTime = a.startTime || a.endTime;
      const bTime = b.startTime || b.endTime;
      return aTime - bTime;
    });
  }

  /**
   * 删除接口
   */
  public handleOk(): void {
    this.$applicationService.deleteStrategy([this.strategyId]).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.languageTable.strategyList.deleteMsg);
        this.$router.navigate([RouterJumpConst.lightingPolicyControl], {}).then();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 点击删除按钮
   */
  public onClickDelete(): void {
    this.$modalService.confirm({
      nzTitle: this.facilityLanguage.prompt,
      nzContent: `<span>${this.languageTable.strategyList.confirmDelete}?</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.handleOk();
      }
    });
  }

  /**
   * 操作按钮
   * @ param event 编辑，删除，启用，禁用
   */
  public handleOperation(event: OperationButtonEnum): void {
    if (event === OperationButtonEnum.delete) {
      this.onClickDelete();
    } else if (event === OperationButtonEnum.enable || event === OperationButtonEnum.disable) {
      const status = event === OperationButtonEnum.enable ? CurrencyEnum.enable : CurrencyEnum.disabled;
      const params = [{
        strategyType: StrategyStatusEnum.lighting,
        operation: status,
        strategyId: this.strategyId
      }];
      this.enableOrDisableStrategy(params, status);
    } else if (event === OperationButtonEnum.edit) {
      if (this.strategyStatus === '1') {
        // 策略当前状态为启用状态 不允许编辑
        this.$message.error(this.languageTable.strategyList.editInfo);
        return;
      }
      this.$router.navigate([RouterJumpConst.lightingPolicyControlEdit], {
        queryParams: {
          id: this.strategyId,
          strategyType: StrategyStatusEnum.lighting
        }
      }).then();
    }
  }

  /**
   * 启用禁用
   * @ param params
   */
  public enableOrDisableStrategy(params: EnableOrDisableModel[], status: string): void {
    this.isLoading = true;
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.stepsFirstParams.strategyStatus = getStrategyStatus(this.$nzI18n, status) as string;
        this.strategyStatus = status;
        this.$message.success(`${this.languageTable.contentList.successful}!`);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.strategyTableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '900px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        // 时段
        {
          title: this.languageTable.strategyList.timeInterval,
          key: 'timeInterval',
          width: 300
        },
        // 开关
        {
          title: this.languageTable.strategyList.switch,
          key: 'switches',
          width: 300
        },
        // 亮度
        {
          title: this.languageTable.strategyList.dimming,
          key: 'light',
          width: 300
        },
        // todo 暂不删除 // 其他事件源
        // {
        //   title: this.languageTable.strategyList.event,
        //   key: 'refObjectName',
        //   width: 300
        // },
        // 光照强度
        {
          title: this.languageTable.strategyList.lightIntensity,
          key: 'sensorList',
          width: 300
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
    };
  }
}
