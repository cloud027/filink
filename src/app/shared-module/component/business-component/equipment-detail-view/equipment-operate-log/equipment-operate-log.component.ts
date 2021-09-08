import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {ResultModel} from '../../../../model/result.model';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {OperateLogModel} from '../../../../../core-module/model/facility/operate-log.model';
import {LogOptResultEnum} from '../../../../../core-module/enum/facility/log-opt-result.enum';
import {PageSizeEnum} from '../../../../enum/page-size.enum';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';

/**
 * 操作日志组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-operate-log',
  templateUrl: './equipment-operate-log.component.html'
})
export class EquipmentOperateLogComponent implements OnInit {
  @Input()
  public equipmentId: string = '';
  // 操作结果
  @ViewChild('optResult') private optResult;
  // 日志国际化  系统设置的国际化没定义类型
  public language: any = {};
  // 操作日志数据集
  public dataSet: OperateLogModel[] = [];
  // 表格参数
  public tableConfig: TableConfigModel;
  // 操作结果枚举
  public optResultEnum = LogOptResultEnum;
  // 设备国际化
  public equipmentLanguage: FacilityLanguageInterface;
  // 列表分页实体 卡片列表只显示5条
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 首页词条国际化
  public indexLanguage: IndexLanguageInterface;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private  $message: FiLinkModalService,
    private $router: Router,
    private $equipmentDetail: FacilityForCommonService
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    // 初始化首页国际化
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    // 获取资产国际化
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.systemSetting);
    this.initTableConfig();
    this.refreshData();
  }

  /**
   *  跳转到更多操作日志
   */
  public onClickShowMoreOperateLog(): void {
    this.$router.navigate(['business/system/log'],
      {queryParams: {id: this.equipmentId}}).then();
  }

  /**
   * 刷新列表数据
   */
  private refreshData(): void {
    // 卡片列表只显示5条数据
    this.queryCondition.pageCondition.pageNum = 1;
    this.queryCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    const index = this.queryCondition.filterConditions.findIndex(
      item => item.filterField === 'optObjId');
    if (index < 0) {
      const filterTemp = new FilterCondition('optObjId', OperatorEnum.eq, this.equipmentId);
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat([filterTemp]);
    }
    this.tableConfig.isLoading = true;
    // 查询系统操作日志
    this.$equipmentDetail.findOperateLog(this.queryCondition).subscribe((result: ResultModel<OperateLogModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this.dataSet = result.data || [];
        this.pageBean.Total = result.totalCount;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   *  初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      topButtons: [],
      primaryKey: '03-5',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '900px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.equipmentLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        {
          title: this.language.optUserName,
          key: 'optUserName', width: 250,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}},
        },
        {
          title: this.language.optTime,
          key: 'optTime',
          width: 250,
          pipe: 'date',
        },
        {
          title: this.language.optResult,
          key: 'optResult',
          width: 250,
          type: 'render',
          renderTemplate: this.optResult,
        },
        {
          title: this.language.detailInfo,
          key: 'detailInfo',
          width: 250,
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      }
    };
  }
}
