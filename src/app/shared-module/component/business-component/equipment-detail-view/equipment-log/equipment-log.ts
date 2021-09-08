import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {TableConfigModel} from '../../../../model/table-config.model';
import {PageModel} from '../../../../model/page.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition, QueryConditionModel} from '../../../../model/query-condition.model';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {PageSizeEnum} from '../../../../enum/page-size.enum';
import {EquipmentLogModel} from '../../../../../core-module/model/equipment/equipment-log.model';
import {CommonUtil} from '../../../../util/common-util';
import {LogTypeEnum} from '../../../../../business-module/facility/share/enum/facility.enum';

/**
 *  设备日志详情组件
 *  created by PoHe
 */
@Component({
  selector: 'app-equipment-log-detail',
  templateUrl: './equipment-log.html'
})
export class EquipmentLogDetailComponent implements OnInit {

  // 入参设备id
  @Input()
  public equipmentId: string = '';
  // 设备日志列表数据
  public dataSet: EquipmentLogModel[] = [];
  // 表个参数
  public tableConfig: TableConfigModel;
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 列表分页实体
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive );
  //  查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * 构造器
   */
  constructor(
    private $facilityCommonService: FacilityForCommonService,
    private $router: Router,
    private $nzI18n: NzI18nService) {
  }

  /**
   * 初始化组件
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    this.refreshLogData();
  }

  /**
   * 刷新表格数据
   */
  private refreshLogData(): void {
    this.tableConfig.isLoading = true;
    const filterTemp = new FilterCondition('equipmentId', OperatorEnum.eq, this.equipmentId);
    this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat([filterTemp]);
    this.queryCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.queryCondition.pageCondition.pageNum = 1;
    this.$facilityCommonService.queryEquipmentLog(this.queryCondition).subscribe(
      (result: ResultModel<EquipmentLogModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.dataSet = result.data || [];
          this.dataSet.forEach(item => {
            if (item.logType) {
              item.logType = CommonUtil.codeTranslate(LogTypeEnum, this.$nzI18n, item.logType) as string;
            }
          });
          this.pageBean.Total = result.totalCount;
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
    this.pageBean.Total = this.dataSet.length;
  }

  /**
   * 查询更多的设备日志
   */
  public onClickShowMore(): void {
    this.$router.navigate(['business/facility/facility-log'],
      {queryParams: {equipmentId: this.equipmentId}}).then();
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      topButtons: [],
      primaryKey: '03-5',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '900px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        {
          title: this.language.equipmentLogName,
          key: 'logName',
          width: 300,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}},
        },
        {
          title: this.language.equipmentLogType,
          key: 'logType',
          width: 300,
        },
        {
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          width: 300,
        },
        {
          title: this.language.createTime,
          key: 'currentTime',
          pipe: 'date',
          width: 300,
        },
        {
          title: this.language.extraRemarks,
          key: 'remarks',
          width: 300,
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [],
      leftBottomButtons: [],
    };
  }
}
