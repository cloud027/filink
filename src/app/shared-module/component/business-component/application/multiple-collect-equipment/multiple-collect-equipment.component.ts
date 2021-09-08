import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageModel} from '../../../../model/page.model';
import {QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {FacilityListTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../enum/language.enum';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {ResultModel} from '../../../../model/result.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {ApplicationService} from '../../../../../business-module/application-system/share/service/application.service';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import * as _ from 'lodash';

/**
 * 批量添加关注页面
 */
@Component({
  selector: 'app-multiple-collect-equipment',
  templateUrl: './multiple-collect-equipment.component.html',
  styleUrls: ['./multiple-collect-equipment.component.scss']
})
export class MultipleCollectEquipmentComponent implements OnInit {
  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  get xcVisible() {
    return this._xcVisible;
  }
  // 设备或设施
  @Input() facilityOrEquipment: string = FacilityListTypeEnum.equipmentList;
  // 框选设备/设施数据数据
  @Input() public tableData;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  @Output() addAttentionChange = new EventEmitter<boolean>();
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 应用系统语言包
  public language: ApplicationInterface;
  // 设备设施表格数据
  public dataSet = [];
  // 设备列表分页
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 选中设备/设施
  public selectData;
  // 是否有选择列表数据
  public  isSelect: boolean = false;
  // 显示隐藏
  private _xcVisible: boolean = false;
  constructor(
    private $nzI18n: NzI18nService,
    private $facilityForCommonService: FacilityForCommonService,
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService,
  ) {
    // 首页语言包
    this.indexLanguage = $nzI18n.getLocaleData(LanguageEnum.index);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始化表格
    this.initTableConfig();
    // 初始化表格数据
    this.refreshData();
  }
  /**
   * 表格翻页查询
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 刷新设备/设施列表
   */
  public refreshData() {
    this.tableConfig.isLoading = true;
    let request;
    if (this.facilityOrEquipment === FacilityListTypeEnum.equipmentList) {
      this.queryCondition.filterConditions.push({
        filterField: 'equipmentId',
        filterValue: this.tableData.map(item => item.equipmentId),
        operator: 'in'
      });
      // 获取设备信息
      request = this.$facilityForCommonService.equipmentListByPage(this.queryCondition);
    } else {
      this.queryCondition.filterConditions.push({
        filterField: 'deviceId',
        filterValue: this.tableData,
        operator: 'in'
      });
      // 获取设施信息
      request = this.$facilityForCommonService.deviceListByPage(this.queryCondition);
    }
      request.subscribe((result: ResultModel<any>) => {
      this.dataSet =  result.data;
      this.pageBean.Total = result.totalCount;
      this.pageBean.pageIndex = result.pageNum;
      this.pageBean.pageSize = result.size;
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 确定添加关注
   */
  public handleOk() {
    if (this.facilityOrEquipment === FacilityListTypeEnum.equipmentList) {
      this.addCollectingEquipmentByIds();
    } else {
      this.addCollectingDeviceByIds();
    }
  }

  /**
   * 批量关注设备
   */
  public addCollectingEquipmentByIds() {
    this.tableConfig.isLoading = true;
    const attentionData = [];
    this.selectData.forEach((item) => {
      attentionData.push(item.equipmentId);
    });
    this.$applicationService.addCollectingEquipmentByIds(attentionData).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.$message.success(this.language.equipmentMap.collectSuccess);
        // 发射关注成功事件
        this.addAttentionChange.emit(true);
        this.handleCancel();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 批量关注设施
   */
  public addCollectingDeviceByIds() {
    const attentionData = [];
    this.selectData.forEach((item) => {
      attentionData.push(item.deviceId);
    });
    this.$applicationService.addCollectingDeviceByIds(attentionData).subscribe((res) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.language.equipmentMap.collectSuccess);
        // 发射关注成功事件
        this.addAttentionChange.emit(true);
        this.handleCancel();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
        this.tableConfig.isLoading = false;
      });
  }
  /**
   * 取消
   */
  public handleCancel() {
    this.xcVisible = false;
  }
  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      notShowPrint: true,
      keepSelected: true,
      selectedIdKey: this.facilityOrEquipment === FacilityListTypeEnum.facilitiesList ? 'deviceId' : 'equipmentId',
      showRowSelection: false,
      showSizeChanger: true,
      noIndex: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.indexLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 设施名称
          title: this.facilityOrEquipment === FacilityListTypeEnum.facilitiesList ? this.indexLanguage.searchDeviceName : this.indexLanguage.equipmentName,
          key: this.facilityOrEquipment === FacilityListTypeEnum.equipmentList ? 'equipmentName' : 'deviceName',
          width: 160,
          isShowSort: true,
        },
        { // 详细地址
          title: this.indexLanguage.address, key: 'address',
          width: 150, isShowSort: true,
        },
        { // 所属区域
          title: this.indexLanguage.area, key: 'areaName',
          width: 150, isShowSort: true,
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      sort: (event: SortCondition) => {
      },
      handleSelect: (event) => {
        this.selectData = event;
        this.isSelect = !_.isEmpty(this.selectData);
      }
    };
  }
}
