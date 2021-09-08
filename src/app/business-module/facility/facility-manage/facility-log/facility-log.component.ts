import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {FacilityApiService} from '../../share/service/facility/facility-api.service';
import {FacilityLog} from '../../../../core-module/model/facility/facility-log';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {LogTypeEnum} from '../../share/enum/facility.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';

/**
 * 设施日志列表组件
 */
@Component({
  selector: 'app-facility-log',
  templateUrl: './facility-log.component.html',
  styleUrls: ['./facility-log.component.scss']
})
export class FacilityLogComponent implements OnInit {
  // 设施名称模板
  @ViewChild('deviceName') public deviceName: TemplateRef<HTMLDocument>;
  // 设施编号模板
  @ViewChild('deviceCode') public deviceCode: TemplateRef<HTMLDocument>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') public deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 列表数据
  public dataSet: FacilityLog[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设施id
  public deviceId: string;
  // 日志id
  public logId: string;
  // 设施类型枚举
  public deviceType = DeviceTypeEnum;

  constructor(private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $dateHelper: DateHelperService,
              private $router: Router,
              private $message: FiLinkModalService,
              private $facilityApiService: FacilityApiService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    if (this.$active.snapshot.queryParams.id) {
      this.deviceId = this.$active.snapshot.queryParams.id;
      const filter = new FilterCondition('deviceId', OperatorEnum.eq, this.$active.snapshot.queryParams.id);
      this.queryCondition.filterConditions = [filter];
    }
    if (this.$active.snapshot.queryParams.equipmentId) {
      this.logId = this.$active.snapshot.queryParams.equipmentId;
      const filter = new FilterCondition('equipmentId', OperatorEnum.eq, this.$active.snapshot.queryParams.equipmentId);
      this.queryCondition.filterConditions = [filter];
    }
    this.refreshData();
  }

  /**
   * 表格翻页事件
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 跳转到详情页
   * param data
   */
  public navigateToDetail(data: FacilityLog) {
    this.$router.navigate(['business/facility/facility-detail-view'],
      {queryParams: {id: data.deviceId, deviceType: data.deviceType}}).then();
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      primaryKey: '03-5',
      isDraggable: true,
      showSearchSwitch: true,
      isLoading: true,
      scroll: {x: '1000px', y: '340px'},
      showSizeChanger: true,
      showSearchExport: true,
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: this.language.deviceLogName,
          isShowSort: true,
          key: 'logName', width: 100,
          searchable: true,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.deviceLogType, key: 'logType', width: 100, searchable: true,
          isShowSort: true,
          configurable: true,
          hidden: true,
          searchConfig: {type: 'select', selectInfo: CommonUtil.codeTranslate(LogTypeEnum, this.$nzI18n), label: 'label', value: 'code'}
        },
        {
          title: this.language.deviceType_a, key: 'deviceType', width: 150,
          configurable: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          minWidth: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        {
          title: this.language.deviceCode_a, key: 'deviceCode', width: 150,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.deviceCode,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.affiliatedDevice, key: 'deviceName', width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.deviceName,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.equipmentName, key: 'nodeObject', width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.parentId, key: 'areaName', width: 100,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.createTime, key: 'currentTime',
          configurable: true,
          minWidth: 180,
          width: 180,
          searchable: true,
          isShowSort: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'},
        },
        {
          title: this.language.extraRemarks, key: 'remarks', configurable: true,
          width: 100,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: {
            type: 'operate',
          }, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: Array<FilterCondition>) => {
        this.logId = null;
        this.deviceId = null;
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event: ListExportModel<FacilityLog[]>) => {
        // 处理参数
        const body = {
          queryCondition: new QueryConditionModel(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        body.columnInfoList.forEach(item => {
          if (['deviceType', 'logType', 'currentTime'].includes(item.propertyName)) {
            item.isTranslation = 1;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          const ids = event.selectItem.map(item => item.logId);
          const filter = new FilterCondition('logId');
          filter.filterValue = ids;
          filter.operator = OperatorEnum.in;
          body.queryCondition.filterConditions.push(filter);
        } else {
          // 处理查询条件
          body.queryCondition.filterConditions = event.queryTerm;
          if (this.deviceId) {
            const filter = new FilterCondition('deviceId', OperatorEnum.eq, this.deviceId);
            body.queryCondition.filterConditions.push(filter);
          }
          if (this.logId) {
            const filter = new FilterCondition('logId', OperatorEnum.eq, this.logId);
            body.queryCondition.filterConditions.push(filter);
          }
        }
        this.$facilityApiService.exportLogList(body).subscribe((res: ResultModel<string>) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityApiService.queryDeviceLogListByPage(this.queryCondition).subscribe((result: ResultModel<FacilityLog[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          if (item.deviceType) {
            item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
          }
          if (item.logType) {
            item.logType = CommonUtil.codeTranslate(LogTypeEnum, this.$nzI18n, item.logType) as string;
          }
        });
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
}
