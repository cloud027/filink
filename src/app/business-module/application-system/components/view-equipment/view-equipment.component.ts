import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableColumnConfig} from '../../share/config/table-column.config';
import {QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {TableSortConfig} from '../../../../shared-module/enum/table-style-config.enum';
import * as _ from 'lodash';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';

@Component({
  selector: 'app-view-equipment',
  templateUrl: './view-equipment.component.html',
  styleUrls: ['./view-equipment.component.scss']
})
export class ViewEquipmentComponent implements OnInit, OnChanges {
  // 设备类型
  @ViewChild('equipmentTypeTemp')
  public equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  @Input()
  inputDataSet: any[] = [];
  // 是否显示删除按钮
  @Input()
  isShowDelete: boolean = false;
  @Output() deleteEquipment = new EventEmitter<any>();
  // 选中的设备表格配置
  public multiEquipmentTable: TableConfigModel;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  public equipmentLanguage: FacilityLanguageInterface;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  public equipmentTypeEnum = EquipmentTypeEnum;
  public languageEnum = LanguageEnum;
  public dataSet: any[] = [];
  // 选择器分页
  public pageBean: PageModel = new PageModel();
  // 表格查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(public $nzI18n: NzI18nService) {
  }

  ngOnInit() {
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initMultiEquipment();
    this.refreshPageData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputDataSet) {
      this.refreshPageData();
    }
  }

  /**
   * 刷新数据
   */
  refreshPageData() {
    this.pageBean.Total = this.inputDataSet.length;
    let sortDataSet = [];
    if (this.queryCondition.sortCondition && this.queryCondition.sortCondition.sortRule) {
      sortDataSet = _.sortBy(this.inputDataSet, this.queryCondition.sortCondition.sortField);
      if (this.queryCondition.sortCondition.sortRule === TableSortConfig.DESC) {
        sortDataSet.reverse();
      }
    } else {
      sortDataSet = this.inputDataSet;
    }
    this.dataSet = sortDataSet.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1),
      this.pageBean.pageIndex * this.pageBean.pageSize);
  }

  /**
   * 左边表格数据变化
   * param event
   */
  pageChange(event) {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.refreshPageData();
  }

  /**
   * 选中设备列表
   */
  public initMultiEquipment(): void {
    this.multiEquipmentTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        ...TableColumnConfig.getEquipmentConfig(
          this.equipmentLanguage,
          this.$nzI18n, this.equipmentTypeTemp, this.equipmentStatusFilterTemp, null, null, true),
      ],
      topButtons: [],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshPageData();
      },
    };
    // 删除设施
    if (this.isShowDelete) {
      this.multiEquipmentTable.operation = [
        {
          text: this.equipmentLanguage.deleteHandle,
          className: 'fiLink-delete red-icon',
          iconClassName: 'fiLink-delete',
          handle: (currentIndex: EquipmentListModel) => {
            const index = this.inputDataSet.findIndex(item => item.equipmentId === currentIndex.equipmentId);
            if (index > -1) {
              this.inputDataSet.splice(index, 1);
              this.refreshPageData();
              this.deleteEquipment.emit(this.inputDataSet);
            }
          }
        }
      ];
      this.multiEquipmentTable.columnConfig.push( // 操作
        {
          title: this.equipmentLanguage.operate,
          searchConfig: {type: 'operate'},
          key: '',
          width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        });
    }
  }
}
