import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {SliderCommon} from '../../../../core-module/model/slider-common';
import {SliderConfigModel} from '../../../../core-module/model/facility/slider-config.model';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../../facility/share/const/facility-common.const';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {PlanApiService} from '../../share/service/plan-api.service';
import {WisdomPointInfoModel} from '../../../../core-module/model/plan/wisdom-point-info.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {PointStatusEnum} from '../../../../core-module/enum/plan/point-status.enum';
import {PointStatusIconEnum} from '../../../../core-module/enum/plan/point-status-icon.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';

/**
 * ?????????????????????
 */
@Component({
  selector: 'app-plan-wisdom-list',
  templateUrl: './plan-wisdom-list.component.html',
  styleUrls: ['./plan-wisdom-list.component.scss']
})
export class PlanWisdomListComponent implements OnInit {
  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // ???????????????
  @ViewChild('pointStatusTemp') pointStatusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  public sliderConfig: Array<SliderCommon> = [];
  // ??????????????????
  public planWisdomList: WisdomPointInfoModel[] = [];
  // ????????????
  public tableConfig: TableConfigModel = new TableConfigModel();
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ????????????????????????
  public language: PlanProjectLanguageInterface;
  // ????????????????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  public pointStatusEnum = PointStatusEnum;

  constructor(public $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $router: Router,
              private $modalService: NzModalService,
              private $planApiService: PlanApiService) {
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.initTableConfig();
    this.refreshPlanWisdomList();
    this.sliderConfig = [
      {
        // ???????????????
        label: this.language.wisdomSum,
        iconClass: 'fiLink-work-order-all wisdom-sum',
        textClass: 'wisdom-sum',
        code: null, sum: 0
      },
      // ??????
      {
        label: this.language.toBeBuilt,
        iconClass: 'fiLink-processed to-be-built',
        textClass: 'to-be-built',
        code: PointStatusEnum.toBeBuilt, sum: 0
      },
      // ??????
      {
        label: this.language.underConstruction,
        iconClass: 'fiLink-processing under-construction',
        textClass: 'under-construction',
        code: PointStatusEnum.underConstruction, sum: 0
      },
      //   ??????
      {
        label: this.language.hasBeenBuilt,
        iconClass: 'fiLink-filink-yiwancheng-icon has-been-built',
        textClass: 'has-been-built',
        code: PointStatusEnum.hasBeenBuilt, sum: 0
      },
    ];
    this.querySliderCount();
  }

  /**
   * ????????????
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.refreshPlanWisdomList();
  }

  /**
   * ?????????????????????????????????
   * param event
   */
  public sliderChange(event: SliderConfigModel): void {
    if (event.code) {
      // ????????????????????????????????????
      this.tableComponent.searchDate = {};
      this.tableComponent.rangDateValue = {};
      this.tableComponent.tableService.resetFilterConditions(this.tableComponent.queryTerm);
      this.tableComponent.handleSetControlData('pointStatus', [event.code]);
      this.tableComponent.handleSearch();
    } else {
      this.tableComponent.handleRest();
    }
  }

  /**
   * ????????????
   * param event
   */
  public slideShowChange(event: SliderConfigModel): void {
    if (event) {
      this.tableConfig.outHeight = SHOW_SLIDER_HIGH_CONST;
    } else {
      this.tableConfig.outHeight = HIDDEN_SLIDER_HIGH_CONST;
    }
    this.tableComponent.calcTableHeight();
  }

  /**
   * ??????????????????
   */
  private refreshPlanWisdomList(): void {
    this.tableConfig.isLoading = true;
    this.$planApiService.selectPlanPointList(this.queryCondition).subscribe((result: ResultModel<WisdomPointInfoModel[]>) => {
      this.tableConfig.isLoading = false;
      this.planWisdomList = result.data || [];
      this.pageBean.pageIndex = result.pageNum;
      this.pageBean.Total = result.totalCount;
      this.pageBean.pageSize = result.size;
      this.planWisdomList.forEach(item => {
        item.statusIconClass = PointStatusIconEnum[item.pointStatus];
      });
    });
  }

  /**
   * ????????????
   * param ids
   */
  private deletePlanPoint(ids: string[]): void {
    this.tableConfig.isLoading = true;
    this.$planApiService.deletePlanPoint(ids).subscribe((result: ResultModel<string>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.deletePlanWisdomSuccess);
        // ??????????????????
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshPlanWisdomList();
        this.querySliderCount();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      primaryKey: '18-2',
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        { // ??????
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ???????????????
          title: this.language.wisdomName, key: 'pointName', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // ???????????????
          title: this.language.wisdomModel, key: 'pointModel', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // ???????????????
          title: this.language.status, key: 'pointStatus', width: 150,
          type: 'render',
          renderTemplate: this.pointStatusTemp,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(PointStatusEnum, this.$nzI18n, null, LanguageEnum.planProject) as SelectModel[],
            label: 'label',
            value: 'code'
          }
        },
        { // ????????????
          title: this.language.planId, key: 'planName', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.BelongsAreaName, key: 'areaName', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // ?????????
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      topButtons: [
        { // ????????????
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '18-2-2',
          canDisabled: true,
          needConfirm: false,
          handle: (data: WisdomPointInfoModel[]) => {
            if (data.some(item => item.pointStatus !== PointStatusEnum.toBeBuilt)) {
              this.$message.error(this.language.deleteWisdomMsg);
              return;
            }
            const ids = data.map(item => item.pointId);
            this.deleteConfirmation(ids);
          }
        },
      ],
      operation: [
        {
          text: this.commonLanguage.location, className: 'fiLink-location',
          permissionCode: '18-2-3',
          handle: (currentIndex: WisdomPointInfoModel) => {
            this.$router.navigate(['business/index'],
              {
                queryParams: {
                  id: currentIndex.pointId,
                  xPosition: currentIndex.xposition,
                  yPosition: currentIndex.yposition,
                  type: 'planViewList',
                  deviceType: DeviceTypeEnum.wisdom,
                  pointStatus: currentIndex.pointStatus,
                }
              }).then();
          }
        },
        { // ??????
          text: this.commonLanguage.edit, className: 'fiLink-edit',
          permissionCode: '18-2-1',
          handle: (data: WisdomPointInfoModel) => {
            if (data.pointStatus === PointStatusEnum.toBeBuilt) {
              this.$router.navigate(['business/plan-project/plan-wisdom-detail/update'], {queryParams: {id: data.pointId}}).then();
            } else {
              this.$message.error(this.language.editWisdomMsg);
            }
          },
        },
        { // ??????
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          permissionCode: '18-2-2',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: false,
          canDisabled: true,
          confirmTitle: this.language.deleteConfirmTitle,
          handle: (data: WisdomPointInfoModel) => {
            if (data.pointStatus === PointStatusEnum.toBeBuilt) {
              this.deleteConfirmation([data.pointId]);
            } else {
              this.$message.error(this.language.deleteWisdomMsg);
            }
          }
        },
      ],
      rightTopButtons: [],
      moreButtons: [],
      handleExport: (e: ListExportModel<WisdomPointInfoModel[]>) => {
        // ????????????????????????????????????
        const exportData = new ExportRequestModel(e.columnInfoList, e.excelType);
        const translationField = ['planFinishTime', 'createTime', 'pointStatus'];
        // ???????????????????????????????????????????????????
        exportData.columnInfoList.forEach(item => {
          if (translationField.includes(item.propertyName)) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        //  ?????????????????????
        if (e && !_.isEmpty(e.selectItem)) {
          const pointIds = e.selectItem.map(item => item.pointId);
          exportData.queryCondition.filterConditions = exportData.queryCondition.filterConditions.concat([new FilterCondition('pointId', OperatorEnum.in, pointIds)]);
        } else {
          exportData.queryCondition.filterConditions = e.queryTerm;
        }
        // ???????????????????????????
        this.$planApiService.exportPlanPointList(exportData).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.exportPlanWisdomListSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshPlanWisdomList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshPlanWisdomList();
      }
    };
  }

  /**
   * ??????????????????????????????
   */
  private querySliderCount(): void {
    this.$planApiService.pointCountByStatus().subscribe((result: ResultModel<any[]>) => {
      if (result.code === ResultCodeEnum.success) {
        let sum = 0;
        this.sliderConfig.forEach(item => {
          item.sum = 0;
          const temp = result.data.find(_item => _item.status === item.code);
          if (temp) {
            item.sum = temp.number;
          }
          sum += item.sum;
        });
        this.sliderConfig[0].sum = sum;
      }
    });
  }

  /**
   * ??????????????????
   */
  private deleteConfirmation(ids: string[]): void {
    // ???????????????????????????????????????????????????????????????????????????
    this.$modalService.confirm({
      nzTitle: this.language.deleteConfirmTitle,
      nzOkType: 'danger',
      nzContent: `<span>${this.language.deleteConfirmWisdomMsg}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.handelConfirmSecond(ids);
      }
    });
  }

  /**
   * ??????????????????
   */
  private handelConfirmSecond(ids: string[]): void {
    this.$modalService.confirm({
      nzTitle: this.language.deleteConfirmTitle,
      nzOkType: 'danger',
      nzContent: `<span>${this.language.deleteConfirmWisdomLeft}${ids.length}${this.language.deleteConfirmContentRight}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.deletePlanPoint(ids);
      }
    });
  }
}
