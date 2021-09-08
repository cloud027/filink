import {Component, OnInit} from '@angular/core';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {PartsMgtApiService} from '../../share/service/parts/parts-api.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {PartsTypeEnum} from '../../share/enum/facility.enum';
import {PartsInfoListModel} from '../../share/model/parts-info-list.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ExportPartsModel} from '../../share/model/export-parts.model';

/**
 * 配件管理列表组件
 */
@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.scss']
})
export class PartsListComponent implements OnInit {
  // 列表数据
  public dataSet: PartsInfoListModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $modal: NzModalService,
              private $partsService: PartsMgtApiService,
              private $dateHelper: DateHelperService,
              private $router: Router) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 分页回调
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化列表配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      primaryKey: '03-4-1',
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '900px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: false, style: {left: '0px'}}, width: 62},
        //  {type: 'serial-number', width: 62, title: this.language.serialNumber},
        {
          title: this.language.partName, key: 'partName', width: 124,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.language.partType, key: 'partType', width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(PartsTypeEnum, this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        {
          title: this.language.department, key: 'department', width: 100,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.depositary, key: 'trustee', width: 120,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.time, key: 'ctime', width: 280,
          configurable: true,
          searchable: true,
          isShowSort: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'},
        },
        {
          title: this.language.remarks, key: 'remark', width: 180,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 120, fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          iconClassName: 'fiLink-add-no-circle',
          text: this.language.addParts,
          handle: () => {
            this.addParts();
          },
          permissionCode: '03-4-1-1'
        },
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-4-1-3',
          needConfirm: true,
          canDisabled: true,
          handle: (data: PartsInfoListModel[]) => {
            const ids = data.map(item => item.partId);
            this.handelDeleteParts(ids);
          }
        }
      ],
      operation: [
        {
          text: this.language.update,
          className: 'fiLink-edit',
          permissionCode: '03-4-1-2',
          handle: (currentIndex: PartsInfoListModel) => {
            this.navigateToDetail('business/facility/parts-detail/update', {queryParams: {partId: currentIndex.partId}});
          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-4-1-3',
          handle: (currentIndex: PartsInfoListModel) => {
            const ids = [currentIndex.partId];
            this.handelDeleteParts(ids);
          }
        },
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event: ListExportModel<PartsInfoListModel[]>) => {
        // 处理参数
        const body = new ExportPartsModel(new QueryConditionModel(), event.columnInfoList, event.excelType);
        body.columnInfoList.forEach(item => {
          if (item.propertyName === 'partType' || item.propertyName === 'ctime') {
            item.isTranslation = 1;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          const ids = event.selectItem.map(item => item.partId);
          const filter = new FilterCondition('partId', OperatorEnum.in, ids);
          body.queryCondition.filterConditions.push(filter);
        } else {
          // 处理查询条件
          body.queryCondition.filterConditions = event.queryTerm;
        }

        this.partExport(body);
      }
    };
  }

  /**
   * 刷新数据
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$partsService.partsListByPage(this.queryCondition).subscribe((result: ResultModel<PartsInfoListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          if (item.partType) {
            item.partType = CommonUtil.codeTranslate(PartsTypeEnum, this.$nzI18n, item.partType) as string;
          }
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 点击新增配件
   */
  public addParts(): void {
    this.navigateToDetail(`business/facility/parts-detail/add`);
  }


  /**
   * 跳转到详情
   * param url
   */
  public navigateToDetail(url, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   *导出文件
   */
  public partExport(event: ExportPartsModel): void {
    this.$partsService.partsExport(event).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 删除配件
   */
  private handelDeleteParts(ids: string[]): void {
    this.$partsService.deletePartsDyIds(ids).subscribe(
      (result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(result.msg);
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }
}
