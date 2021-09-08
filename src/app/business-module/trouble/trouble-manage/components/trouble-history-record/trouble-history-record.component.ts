import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {NzI18nService} from 'ng-zorro-antd';
import {TroubleService} from '../../../share/service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {FaultLanguageInterface} from '../../../../../../assets/i18n/fault/fault-language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {TroubleModel} from '../../../../../core-module/model/trouble/trouble.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {TroubleCommonUtil} from '../../../share/util/trouble-common-util';

/**
 * 历史流程记录列表
 */
@Component({
  selector: 'app-trouble-history-record',
  templateUrl: './trouble-history-record.component.html',
})
export class TroubleHistoryRecordComponent implements OnInit, OnDestroy {
  @Input() troubleId: string;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 流程记录列表配置
  public troubleRecordTableConfig: TableConfigModel;
  // 流程记录分页
  public troubleRecordPageBean: PageModel = new PageModel();
  // 历史流程记录
  public troubleRecord: TroubleModel[] = [];
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  constructor(
    private $nzI18n: NzI18nService,
    private $troubleService: TroubleService,
    private $message: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.queryCondition.pageCondition.pageSize = this.troubleRecordPageBean.pageSize;
    this.queryCondition.pageCondition.pageNum = this.troubleRecordPageBean.pageIndex;
    // 初始化表格
    this.initTableConfig();
    // 获取数据
    this.refreshData();
  }
  public ngOnDestroy(): void {
    this.troubleRecordTableConfig = null;
  }

  /**
   * 历史流程翻页处理
   * param event
   */
  public troubleRecordPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 获取故障历史流程记录
   */
  private refreshData(): void {
    this.troubleRecordTableConfig.isLoading = true;
    this.queryCondition.pageCondition.pageSize = 5;
    this.queryCondition.bizCondition = {troubleId: this.troubleId};
    this.$troubleService.queryTroubleProcesslistHistoryPage(this.queryCondition).subscribe((res: ResultModel<TroubleModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.troubleRecordPageBean = TroubleCommonUtil.getTroublePageInfo(res);
        this.troubleRecordTableConfig.isLoading = false;
        this.troubleRecord = res.data || [];
        this.troubleRecord.forEach(item => {
          item.nodeName = item.nodeName.replace(/\s/g, '');
        });
      }
    }, (res) => {
      this.$message.error(res.msg);
    });
  }

  /**
   * 初始化列表配置
   */
  private initTableConfig(): void {
    this.troubleRecordTableConfig = {
      isDraggable: true,
      isLoading: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      simplePage: true,
      scroll: {x: '600px', y: '600px'},
      columnConfig: [
        {title: this.language.name, key: 'nodeName', isShowSort: true, width: 300},
        {
          title: this.language.operator, key: 'optUserName', isShowSort: true, width: 100
        },
        {
          title: this.language.time, key: 'optTime', isShowSort: true, pipe: 'date', width: 300,
        },
        {
          title: this.language.troubleRemark, key: 'optRemark', width: 1000,
        },
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
    };
  }
}
