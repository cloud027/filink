import {Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';

/**
 * 设备仓列表
 */
@Component({
  selector: 'app-equipment-warehouse-list',
  templateUrl: './equipment-warehouse-list.component.html',
  styleUrls: ['./equipment-warehouse-list.component.scss']
})
export class EquipmentWarehouseListComponent implements OnInit {
  // 设备类型
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施id
  @Input() deviceId;
  // 点击设备仓列表列事件
  @Output() public viewEquipmentInfoEmit = new EventEmitter<any>();
  // 设施国际化
  public facilityLanguage: FacilityLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 设备仓列表数据源
  public equipmentDataSet = [];
  // 设备仓列表表格配置
  public equipmentTableConfig;
  // 设备仓列表分页
  public equipmentListPageBean: PageModel = new PageModel();
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设备状态
  public equipmentStatus;
  // 设备类型
  public equipmentType;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;


  constructor(
    private $nzI18n: NzI18nService,
    private $facilityForCommonService: FacilityForCommonService,
    private $message: FiLinkModalService,
  ) {
  }

  public ngOnInit(): void {
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.equipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    this.equipmentStatus = this.equipmentStatus.filter(item => item.code !== EquipmentStatusEnum.dismantled);
    this.equipmentType = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    if (this.equipmentType) {
      this.equipmentType = this.equipmentType.filter(item => item.code !== EquipmentTypeEnum.baseStation && item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
    // 初始化设备仓列表表格
    this.initTable();
    this.queryEquipmentListInfo();
  }

  /**
   * 分页
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    // 加载数据
    this.refreshData();
  }

  /**
   * 初始化表格配置
   */
  public initTable(): void {
    this.equipmentTableConfig = {
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '800px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      showImport: false,
      notShowPrint: true,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        { // 名称
          title: this.facilityLanguage.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        { // 类型
          title: this.facilityLanguage.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          configurable: false,
          width: 160,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.equipmentType,
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.facilityLanguage.status,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.equipmentStatus,
            label: 'label',
            value: 'code'
          }
        },
        { // 详细地址
          title: this.facilityLanguage.address, key: 'address',
          configurable: false,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 80,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      leftBottomButtons: [],
      rightTopButtons: [],
      showPagination: true,
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      rowClick: (event) => {
        this.showEquipmentInfo(event);
      },
      // 过滤查询数据
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      },
    };
  }

  /**
   * 展示设备具体信息
   */
  public showEquipmentInfo(event): void {
    // 发射展示设施上设备仓设备信息事件
    this.viewEquipmentInfoEmit.emit(event);
  }
  /**
   * 刷新列表
   */
  public refreshData() {
    this.queryEquipmentListInfo();
  }
  /**
   * 查询设备仓列表
   */
  public queryEquipmentListInfo(): void {
    const arr = [
      {
        'filterValue': true,
        'filterField': 'noMountPosition',
        'operator': 'eq'
      },
      {
        'filterValue': [this.deviceId],
        'filterField': 'deviceId',
        'operator': 'in'
      }];
    this.queryCondition.filterConditions.push(...arr);
    this.$facilityForCommonService.equipmentListByPage(this.queryCondition).subscribe((res) => {
      this.equipmentTableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.equipmentDataSet = res.data || [];
        this.equipmentListPageBean.Total = res.totalCount;
        this.equipmentListPageBean.pageIndex = res.pageNum;
        this.equipmentListPageBean.pageSize = res.size;
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
