import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzI18nService, NzModalService } from 'ng-zorro-antd';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';
import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { QueryConditionModel } from '../../../../shared-module/model/query-condition.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { SessionUtil } from '../../../../shared-module/util/session-util';
import { EnergyApiService } from '../../share/service/energy/energy-api.service';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { EnergyTaskCollectionInfoModel } from '../../share/model/energy-task-collection-info.model';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {
  OperationButtonEnum,
  collectionTaskCycleEnum,
  SwitchPageToTableEnum,
  collectionTaskOpenCloseEnum,
  dataCollectionTaskStatusEnum,
} from '../../share/enum/energy-config.enum';
import { listFmt } from '../../share/utils/tool.util';
@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss'],
})
export class TaskInfoComponent implements OnInit {
  // 设施信息
  public facilityInfo = {
    deviceStatusColorClass: 'facility-normal-c',
    deviceStatusIconClass: 'fiLink-normal',
    deviceStatusZh: '',
  };
  pageLoading: boolean = false;
  strategyTableSet = [];
  // 详情数据
  energyTaskCollectionInfo: EnergyTaskCollectionInfoModel = new EnergyTaskCollectionInfoModel();
  OperationButtonEnum = OperationButtonEnum;
  // 数据采集周期
  collectionTaskCycleEnum = collectionTaskCycleEnum;
  // 判断哪个页面的枚举
  SwitchPageToTable = SwitchPageToTableEnum;
  // 是否启用 禁用 枚举
  collectionTaskOpenClose = collectionTaskOpenCloseEnum;
  // 执行状态的 枚举
  dataCollectionTaskStatus = dataCollectionTaskStatusEnum;

  // 区域id集合
  areaIds: Array<string> = [];
  // 分组id集合
  groupIds: Array<string> = [];
  // 设备id集合
  equipmentIds: Array<string> = [];
  // 表格配置
  strategyTableConfig: TableConfigModel;
  // 列表查询条件
  queryCondition: QueryConditionModel = new QueryConditionModel();
  language: EnergyLanguageInterface;
  // 通用的提示语句 国际化组件
  private commonLanguage: CommonLanguageInterface;
  // 国际化前缀枚举
  languageEnum = LanguageEnum;
  constructor(
    private $nzI18n: NzI18nService,
    private $modalService: NzModalService,
    private $energyApiService: EnergyApiService,
    private $active: ActivatedRoute,
    private router: Router,
    public $message: FiLinkModalService,
  ) {
    this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.queryEnergyDetailById();
  }
  // 获取数据
  queryEnergyDetailById() {
    this.$active.queryParams.subscribe((params) => {
      const { id } = params;
      this.pageLoading = true;
      this.$energyApiService
        .dataCollecttionTaskInfo_API({
          strategyId: id,
        })
        .subscribe(
          (result: ResultModel<any>) => {
            console.log(result, 'result');
            this.pageLoading = false;
            if (result.code === ResultCodeEnum.success) {
              this.energyTaskCollectionInfo = result.data;
              const strategyRefList = listFmt(result.data.strategyRefList);
              this.equipmentIds = strategyRefList.equipment.map((item) => item.refId);
              this.groupIds = strategyRefList.group.map((item) => item.refName);
              this.areaIds = strategyRefList.area.map((item) => item.refId);
            } else {
              this.$message.error(result.msg);
            }
          },
          () => (this.pageLoading = false),
        );
    });
  }
  // 删除操作
  public handleDelete(): void {
    this.$modalService.confirm({
      nzTitle: this.language.strategyInfo.deleteHandle,
      nzContent: `<span>${this.language.config.deleteConfim}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {},
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.pageLoading = true;
        this.$energyApiService
          .dataCollectionTaskDelete_API([this.energyTaskCollectionInfo.strategyId])
          .subscribe(
            (result: ResultModel<string>) => {
              this.pageLoading = false;
              if (result.code === ResultCodeEnum.success) {
                this.$message.success(this.commonLanguage.deleteSuccess);
                this.router.navigateByUrl('/business/energy/energy-collect');
              } else {
                this.$message.error(result.msg);
              }
            },
            () => {
              this.pageLoading = false;
            },
          );
      },
    });
  }
  // 编辑
  handleEdit() {
    this.router
      .navigate(['/business/energy/energy-collect/task-update'], {
        queryParams: { id: this.energyTaskCollectionInfo.strategyId },
      })
      .then();
  }
  /**
   * 启用禁用
   * @ param params
   */
  public enableOrDisableStrategy(status: string): void {
    console.log(status, 'status');
    const params = [
      {
        operation: null,
        strategyId: this.energyTaskCollectionInfo.strategyId,
        strategyType: '6',
      },
    ];
    if (status === OperationButtonEnum.enable) { params[0].operation = '1'; } else if (status === OperationButtonEnum.disable) { params[0].operation = '0'; }
    this.pageLoading = true;
    this.$energyApiService.enableOrDisableStrategy_API(params).subscribe(
      (result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(`${this.language.config.successful}!`);
          this.queryEnergyDetailById();
        } else {
          this.$message.error(result.msg);
        }
        this.pageLoading = false;
      },
      () => {
        this.pageLoading = false;
      },
    );
  }
  refreshData() {}

  // 判断是否有操作权限
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }
  // 点击巡检工单tab 事件
  // 1 采集设施  2 采集设备  3 采集回路
  public onClickTab(): void {
    // if (type === 1) {
    //     this.deviceTab.refreshData() // 查询
    // } else if (type === 2) {
    //     this.equipmentTab.refreshData() // 查询
    // } else if (type === 3) {
    //     this.loopTab.refreshData() // 查询
    // }
  }
}
