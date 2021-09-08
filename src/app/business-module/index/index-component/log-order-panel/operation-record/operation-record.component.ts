import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {MapService} from '../../../../../core-module/api-service/index/map/index';
import {IndexTable} from '../../../util/index.table';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {OperationRecordsModel} from '../../../shared/model/log-operating.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ResultItemEnum} from '../../../shared/enum/index-enum';
import {FilterCondition} from '../../../../../shared-module/model/query-condition.model';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';

/**
 * 操作日志
 */
@Component({
  selector: 'app-operation-record',
  templateUrl: './operation-record.component.html',
  styleUrls: ['./operation-record.component.scss']
})
export class OperationRecordComponent extends IndexTable implements OnInit, OnChanges {
  // 设施id
  @Input() facilityId: string;

  public constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $mapService: MapService,
    private $message: FiLinkModalService) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.initTableConfig();
    this.getFindOperateLog();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // 当设施设备ID改变是刷新数据
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      this.getFindOperateLog();
    }
  }

  /**
   * 获取操作日志
   */
  public getFindOperateLog(): void {
    this.tableConfig.isLoading = true;
    // 初始化查询参数
    this.initQueryConditions();
    // 接口查询操作记录数据
    this.$mapService.findOperateLog(this.queryCondition).subscribe((result: ResultModel<OperationRecordsModel[]>) => {
      // 一期接口返回值等于0
      if (result.code === 0) {
        this._dataSet = result.data.map(item => {
          if (item.optResult === ResultItemEnum.success) {
            item.optResult = this.indexLanguage.success;
          } else {
            item.optResult = this.indexLanguage.failure;
          }
          return item;
        });
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
    // 查询参数
    this.queryCondition.filterConditions = [];
    this.queryCondition.pageCondition.pageNum = 1;
    this.queryCondition.pageCondition.pageSize =  PageSizeEnum.sizeFive;
    this.queryCondition.filterConditions.push(
      new FilterCondition('optObjId', OperatorEnum.eq, this.facilityId));
  }

  /*
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
          title: this.indexLanguage.operationPerson, key: 'optUserName', width: 90,
          searchable: false
        },
        {
          title: this.indexLanguage.operationTime, key: 'optTime', width: 120, pipe: 'date',
          searchable: false,
        },
        {
          title: this.indexLanguage.operationResult, key: 'optResult', width: 70,
          searchable: false,
        },
        {
          title: this.indexLanguage.detailInfo, key: 'detailInfo', width: 100,
          searchable: false,
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

