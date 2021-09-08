import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IndexTable} from '../../../util/index.table';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {LogModel} from '../../../shared/model/log-operating.model';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {IndexWorkOrderService} from '../../../../../core-module/api-service/index/index-work-order';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {MapCoverageService} from '../../../../../shared-module/service/index/map-coverage.service';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';
import {MapTypeEnum} from '../../../../../core-module/enum/index/index.enum';

/**
 * 设施日志组件
 */
@Component({
  selector: 'app-facility-log-table',
  templateUrl: './facility-log-table.component.html',
  styleUrls: ['./facility-log-table.component.scss']
})
export class FacilityLogTableComponent extends IndexTable implements OnInit, OnChanges {
  // 设施id
  @Input() facilityId: string;

  // 当前图层
  public indexType = this.$mapCoverageService.showCoverage;

  // 设备巡检查询条件
  public queryLogListCondition: QueryConditionModel = new QueryConditionModel();

  public constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $mapCoverageService: MapCoverageService,
    private $indexWorkOlder: IndexWorkOrderService
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.initTableConfig();
    this.getDeviceLogListByPage();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // 设施设备Id改变时刷新数据
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      this.getDeviceLogListByPage();
    }
  }

  /**
   * 获取设施日志数据
   */
  public getDeviceLogListByPage(): void {
    // 初始化查询条件
    this.initQueryConditions();
    this.tableConfig.isLoading = true;
    // 接口查询日志数据
    this.$indexWorkOlder.deviceLogListByPage(this.queryLogListCondition).subscribe((result: ResultModel<LogModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this._dataSet = result.data || [];
      } else {
        this.$message.error(result.msg);
      }
      this.tableConfig.isLoading = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 创建查询条件
   */
  public initQueryConditions(): void {
    this.queryLogListCondition.filterConditions = [];
    this.queryLogListCondition.pageCondition.pageNum = 1;
    this.queryLogListCondition.pageCondition.pageSize =  PageSizeEnum.sizeFive;
    if (this.facilityId) {
      const paramTemp = this.indexType === MapTypeEnum.facility ? 'deviceId' : 'equipmentId';
      this.queryLogListCondition.filterConditions.push(
        new FilterCondition(paramTemp, OperatorEnum.eq, this.facilityId));
    }
  }


  /**
   * 跳转至对应日志
   * param id
   */
  public goToFacilityLogById(id: string): void {
    this.$router.navigate([`/business/facility/facility-log`], {queryParams: {logId: id}}).then();
  }

  /**
   * 初始化表格配置
   */
  public initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '366px', y: '250px'},
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          // 日志名称
          title: this.indexLanguage.logName, key: 'logName', width: 86,
          searchable: false
        },
        {
          // 发生时间
          title: this.indexLanguage.happenTime, key: 'currentTime', width: 90, pipe: 'date',
          searchable: false,
        },
        {
          // 附加信息
          title: this.indexLanguage.extraInfo, key: 'remarks', width: 80,
          searchable: false,
        },
        {
          // 操作
          title: this.commonLanguage.operate, searchable: false,
          searchConfig: {type: 'operate'}, key: '', width: 70, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [
        {
          text: this.indexLanguage.viewLog,
          className: 'fiLink-log',
          handle: (currentIndex) => {
            this.goToFacilityLogById(currentIndex.logId);
          }
        },
      ]
    };
  }
}
