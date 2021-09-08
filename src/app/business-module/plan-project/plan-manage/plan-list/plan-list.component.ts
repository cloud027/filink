import {Component, OnInit} from '@angular/core';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {Router} from '@angular/router';
import {PlanApiService} from '../../share/service/plan-api.service';
import {PlanInfoModel} from '../../../../core-module/model/plan/plan-info.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import * as _ from 'lodash';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {ScheduleForCommonUtil} from '../../../../core-module/business-util/schedule/schedule-for-common.util';

/**
 * 规划列表
 */
@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {
  // 规划列表数据
  public planList: any[] = [];
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 规划和项目语言包
  public language: PlanProjectLanguageInterface;
  // 公共国际化语言包
  public commonLanguage: CommonLanguageInterface;
  // 查询参数对象集
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 定位flag
  private locationFlag: boolean = false;

  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $message: FiLinkModalService,
              private $modalService: NzModalService,
              private $planApiService: PlanApiService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.initTableConfig();
    this.refreshPlanList();
  }

  /**
   * 分页回调
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.refreshPlanList();
  }

  /**
   * 刷新规划列表
   */
  private refreshPlanList(): void {
    this.tableConfig.isLoading = true;
    this.$planApiService.selectPlanList(this.queryCondition).subscribe((result: ResultModel<PlanInfoModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.planList = result.data || [];
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageSize = result.size;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 删除确认弹框
   */
  private deleteConfirmation(ids: string[], count: number): void {
    this.$modalService.confirm({
      nzTitle: this.language.deleteConfirmTitle,
      nzOkType: 'danger',
      nzContent: `<span>${this.language.deleteConfirmContentLeft}${count}${this.language.deleteConfirmContentRight}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.deletePlanByIds(ids);
      }
    });
  }

  /**
   * 单个或批量删除规划
   */
  private deletePlanByIds(ids: string[]): void {
    this.tableConfig.isLoading = true;
    this.$planApiService.deletePlan(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.deletePlanSuccess);
        // 删除跳第一页
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshPlanList();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化列表参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      primaryKey: '18-1-0',
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        { // 选择
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 规划名称
          title: this.language.planName, key: 'planName', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 规划编号
          title: this.language.planCode, key: 'planCode', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 规划模型
          title: this.language.scaleNumber, key: 'scaleNumber', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 已建设数量
          title: this.language.alreadyBuiltNumber, key: 'alreadyBuiltNumber', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 建设中数量
          title: this.language.beingBuiltNumber, key: 'beingBuiltNumber', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 规划区域
          title: this.language.areaName, key: 'areaName', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 规划录入日期
          title: this.language.createTime, key: 'createTime', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'dateRang', notShowTime: true},
          pipe: 'date',
          pipeParam: DateFormatStringEnum.date
        },
        { // 预计完成时间
          title: this.language.planFinishTime, key: 'planFinishTime', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'dateRang', notShowTime: true},
          pipe: 'date',
          pipeParam: DateFormatStringEnum.date
        },
        { // 操作列
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      topButtons: [
        { // 新增
          text: this.commonLanguage.add,
          needConfirm: false,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '18-1-1',
          handle: () => {
            this.$router.navigateByUrl(`business/plan-project/plan-detail/add`).then();
          },
          disabled: !SessionUtil.checkHasDeviceType('D002'),
          canDisabled: !SessionUtil.checkHasDeviceType('D002')
        },
        { // 批量删除
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '18-1-3',
          canDisabled: true,
          needConfirm: false,
          handle: (data: PlanInfoModel[]) => {
            const ids = [];
            let count = 0;
            data.forEach(item => {
              ids.push(item.planId);
              count += (item.scaleNumber - item.alreadyBuiltNumber - item.beingBuiltNumber);
            });
            this.deleteConfirmation(ids, count);
          }
        },
      ],
      operation: [
        { // 定位
          text: this.commonLanguage.location, className: 'fiLink-location',
          permissionCode: '18-1-4',
          handle: (currentIndex: PlanInfoModel) => {
            if (this.locationFlag) {
              return;
            }
            this.$planApiService.selectPlanPointCenter([currentIndex.planId]).subscribe((result: ResultModel<any>) => {
              this.locationFlag = false;
              if (result.code === ResultCodeEnum.success) {
                this.$router.navigate(['business/index'],
                  {
                    queryParams: {
                      id: currentIndex.planId,
                      type: 'planView',
                      xPosition: result.data.xposition,
                      yPosition: result.data.yposition,
                    }
                  }).then();
              }
            });
          }
        },
        { // 编辑
          text: this.commonLanguage.edit, className: 'fiLink-edit', permissionCode: '18-1-2', handle: (data: PlanInfoModel) => {
            this.$router.navigate([`business/plan-project/plan-detail/update`], {queryParams: {id: data.planId}}).then();
          },
        },
        { // 编辑规划点位
          text: this.language.editPlanPoint,
          className: 'fiLink-coordinate-edit-icon',
          permissionCode: '18-1-5',
          handle: (data: PlanInfoModel) => {
            this.$router.navigate([`business/plan-project/plan-point-detail/update`],
              {queryParams: {id: data.planId, planName: data.planName}}).then();
          },
        },
        { // 删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          permissionCode: '18-1-3',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: false,
          canDisabled: true,
          handle: (data: PlanInfoModel) => {
            const count = data.scaleNumber - data.alreadyBuiltNumber - data.beingBuiltNumber;
            this.deleteConfirmation([data.planId], count);
          }
        },
      ],
      handleExport: (e: ListExportModel<PlanInfoModel[]>) => {
        // 获取导出的数据和文件格式
        const exportData = new ExportRequestModel(e.columnInfoList, e.excelType);
        const translationField = ['planFinishTime', 'createTime', 'pointStatus'];
        // 遍历字段设置后台需要特殊处理的标示
        exportData.columnInfoList.forEach(item => {
          if (translationField.includes(item.propertyName)) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        //  处理选中的数据
        if (e && !_.isEmpty(e.selectItem)) {
          const planIds = e.selectItem.map(item => item.planId);
          exportData.queryCondition.filterConditions = exportData.queryCondition.filterConditions.concat([new FilterCondition('planId', OperatorEnum.in, planIds)]);
        } else {
          exportData.queryCondition.filterConditions = e.queryTerm;
        }
        // 调用后台的服务接口
        this.$planApiService.exportPlanList(exportData).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.exportPlanSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshPlanList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 对选择的规划录入日期和预计完成时间数据做处理
        ScheduleForCommonUtil.handleRangeTimeFormat(event, ['createTime', 'planFinishTime']);
        this.refreshPlanList();
      }
    };
  }
}
