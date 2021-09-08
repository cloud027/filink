import {Component, OnInit, Input} from '@angular/core';
import {PageModel} from '../../../model/page.model';
import {TableConfigModel} from '../../../model/table-config.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {ResultModel} from '../../../model/result.model';
import {LanguageEnum} from '../../../enum/language.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {QueryConditionModel} from '../../../model/query-condition.model';
import {CommonUtil} from '../../../util/common-util';
import {SensorTypeEnum} from '../../../../business-module/facility/share/enum/equipment.enum';
import {PageSizeEnum} from '../../../enum/page-size.enum';

@Component({
  selector: 'app-equipment-sensor-list',
  templateUrl: './equipment-sensor-list.component.html',
  styleUrls: ['./equipment-sensor-list.component.scss']
})
export class EquipmentSensorListComponent implements OnInit {
  // 网关id
  @Input()
  public gatewayId: string;
  // 表格配置
  public tableConfig: TableConfigModel;
  // 分页对象
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 表格数据
  public dataSet: any[] = [];
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(private $facilityForCommonService: FacilityForCommonService, private $nzI18n: NzI18nService) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    this.queryCondition.bizCondition.gatewayId = this.gatewayId;
    this.queryCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.refreshData();
  }

  /**
   * 分页
   * param event
   */
  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  refreshData() {
    this.$facilityForCommonService.getSensorListByGatewayId(this.queryCondition).subscribe((result: ResultModel<any[]>) => {
      this.dataSet = result.data || [];
      this.pageBean.Total = result.totalCount;
      this.pageBean.pageSize = result.size;
      this.pageBean.pageIndex = result.pageNum;
      this.dataSet.forEach(item => {
        if (item.sensorType) {
          item.sensorType = CommonUtil.codeTranslate(SensorTypeEnum, this.$nzI18n, item.sensorType);
        }
      });
    });
  }

  /**
   * 初始化表格
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '500px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        { //  序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        // 传感器名称
        {
          title: this.language.name,
          key: 'sensorName',
          width: 100,
        },
        // 类型
        {
          title: this.language.type,
          key: 'sensorType',
          width: 200,
        },
        // 型号
        {
          title: this.language.equipmentModel,
          key: 'sensorModel',
          width: 200,
        },
        // 端口类型
        {
          title: this.language.portType,
          key: 'portType',
          width: 200,
        },
        // 端口号
        {
          title: this.language.portNo,
          key: 'port',
          width: 200,
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [],
    };
  }
}
