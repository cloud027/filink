import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { TableComponent } from '../../../../../shared-module/component/table/table.component';
import { MapComponent } from '../../../../../shared-module/component/map/map.component';
import { MapConfig } from '../../../../../shared-module/component/map/map.config';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import { AssetManagementLanguageInterface } from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import { FacilityLanguageInterface } from '../../../../../../assets/i18n/facility/facility.language.interface';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { LoopListModel } from '../../../../../core-module/model/loop/loop-list.model';
import { LoopMapDeviceDataModel } from '../../../../facility/share/model/loop-map-device-data.model';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { FilinkMapEnum } from '../../../../../shared-module/enum/filinkMap.enum';
import { LoopTypeEnum, LoopStatusEnum } from '../../../../../core-module/enum/loop/loop.enum';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { MIN_HEIGHT_CONST } from '../../../../facility/share/const/loop-const';
import { ApplicationInterface } from '../../../../../../assets/i18n/application/application.interface';

import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { ImportMissionService } from '../../../../../core-module/mission/import.mission.service';

import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { FacilityForCommonService } from '../../../../../core-module/api-service/facility/facility-for-common.service';

@Component({
  selector: 'app-collection-hl',
  templateUrl: './collection-hl.component.html',
  styleUrls: ['./collection-hl.component.scss'],
})
export class CollectionHlComponent implements OnInit, OnDestroy {
  // 回路状态
  @ViewChild('loopStatusRef') loopStatusRef: TemplateRef<HTMLDocument>;
  //  回路类型
  @ViewChild('loopTypeRef') loopTypeRef: TemplateRef<HTMLDocument>;
  // 地图
  @ViewChild('mainMap') mainMap: MapComponent;
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  /** 多选数据时的回显key数组 */
  @Input() public selectEquipments: any = [];
  /** 弹窗表格标题 */
  @Input() public title: string;
  /** 弹框显示状态 */
  @Input()
  set collectionHLVisible(params) {
    this._collectionHLVisible = params;
    this.collectionHLVisibleChange.emit(this._collectionHLVisible);
  }
  // 获取modal框显示状态
  get collectionHLVisible() {
    return this._collectionHLVisible;
  }
  /** 设备id */
  @Input() public selectEquipmentId;
  /** 过滤条件 */
  @Input() tranFilterConditions: FilterCondition[] = [];
  /** 显示隐藏变化 */
  @Output() public collectionHLVisibleChange = new EventEmitter<any>();
  /** 选中的值变化 */
  @Output() public selectDataChange = new EventEmitter<any>();
  /** 已选数据 */
  public _selectedData: any = [];
  // 显示隐藏
  public _collectionHLVisible = false;
  // 首页语言包
  public commonLanguage: CommonLanguageInterface;

  // 地图配置
  public mapConfig: MapConfig;
  // 地图区域设施数据
  public data: LoopMapDeviceDataModel[] = [];
  // 设施图标大小
  public iconSize: string;
  // 地图类型
  public mapType: FilinkMapEnum;
  // 地图是否显示移入移出按钮
  public isShowButton: boolean = false;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 列表数据
  public dataSet: LoopListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 是否隐藏列表部分
  public isShowTable: boolean = true;
  // 是否隐藏地图变小化按钮
  public isShowUpIcon: boolean = true;
  // 是否显示地图变大的按钮
  public isShowDownIcon: boolean = true;
  // 回路弹框是否展开
  public isVisible: boolean = false;
  // 回路弹框标题
  public loopModalTitle: string;
  // 区域中心点
  public centerPoint: string[];
  // 地图框选的设施id集合
  public deviceIds: string[] = [];
  // 地图移出回路列表要筛选传值
  public isMoveOut: boolean;
  // 回路地图请求参数标识
  public areaFacilityByLoop: boolean = false;
  // 鼠标拖拽默认起始位置
  public srcPositionY: number;
  // 拖拽最新高度隐藏
  public minHeight: number = MIN_HEIGHT_CONST;
  // 地图全屏最大高度
  public maxHeight: number;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 已选回路列表数据
  private loopSelectedData: LoopListModel[] = [];
  // 已选设施数据
  public selectFacility: boolean = true;

  // 回路状态枚举
  public loopStatusEnum = LoopStatusEnum;
  // 回路类型枚举
  public loopTypeEnum = LoopTypeEnum;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $refresh: ImportMissionService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {}

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this._selectedData = this.selectEquipments || [];
    // 列表初始化
    this.initTableConfig();
    // 刷新列表数据
    this.refreshData();
    console.log(111, 'ngOnInit');
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    console.log(111, 'ngOnDestroy');
    this.loopStatusRef = null;
    this.tableComponent = null;
    this.loopTypeRef = null;
    this.mainMap = null;
  }

  /**
   * 表格分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 单选设备
   */
  public onEquipmentChange(event: string, data): void {
    this.selectEquipmentId = event;
    this._selectedData = [data];
  }

  Confirm() {
    const data = this._selectedData;
    this.selectDataChange.emit(data);
    this.collectionHLVisible = false;
  }
  close() {}
  clearSelectData() {
    this.tableComponent.keepSelectedData.clear();
    this.tableComponent.checkStatus();
    this._selectedData = [];
    this.selectEquipments = [];
    this.selectEquipmentId = null;
    this.refreshData();
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: { x: '600px', y: '450px' },
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      keepSelected: true,
      selectedIdKey: 'loopId',
      topButtons: [],
      operation: [],
      columnConfig: [
        {
          type: 'select',
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 62,
        },
        {
          type: 'serial-number',
          title: this.language.serialNumber,
          width: 62,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // 回路名称
          title: this.language.loopName,
          key: 'loopName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
        },
        {
          // 回路编号
          title: this.assetLanguage.loopCode,
          key: 'loopCode',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 回路类型
          title: this.language.loopType,
          key: 'loopType',
          type: 'render',
          renderTemplate: this.loopTypeRef,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              LoopTypeEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 回路状态
          title: this.assetLanguage.loopStatus,
          key: 'loopStatus',
          type: 'render',
          renderTemplate: this.loopStatusRef,
          width: 120,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(
              LoopStatusEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 所属配电箱
          title: this.language.distributionBox,
          key: 'distributionBoxName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 控制对象
          title: this.language.controlledObject,
          key: 'centralizedControlName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 备注
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 操作
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 180,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      // 勾选事件
      handleSelect: (event) => {
        this._selectedData = event;
        this.selectEquipments = event;
      },
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 筛选
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }
  /**
   * 回路列表
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.handelFilterCondition();
    this.$facilityForCommonService.queryLoopList(this.queryCondition).subscribe(
      (result: ResultModel<LoopListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet = result.data || [];
          this.dataSet.forEach((item) => {
            // 如果没有控制对象就不显示拉闸和合闸
            item.isShowOperateIcon = !!item.centralizedControlId;
          });
        } else {
          this.$message.error(result.msg);
        }
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }

  /**
   * 处理过滤条件
   */
  private handelFilterCondition(): void {
    if (!_.isEmpty(this.tranFilterConditions)) {
      this.tranFilterConditions.forEach((item) => {
        const index = this.queryCondition.filterConditions.findIndex(
          (v) => v.filterField === item.filterField,
        );
        if (index < 0) {
          this.queryCondition.filterConditions.push(item);
        } else {
          this.queryCondition.filterConditions[index].filterValue = _.intersection(
            this.queryCondition.filterConditions[index].filterValue,
            item.filterValue,
          );
        }
      });
    }
  }
}
