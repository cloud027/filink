import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {TableComponent} from '../../../table/table.component';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {CommonUtil} from '../../../../util/common-util';
import {LoopStatusEnum, LoopTypeEnum} from '../../../../../core-module/enum/loop/loop.enum';
import {LoopListModel} from '../../../../../core-module/model/loop/loop-list.model';
import {GroupStepModel} from '../../../../../core-module/model/facility/group-step.model';
import {FinalValueEnum} from '../../../../../core-module/enum/step-final-value.enum';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {SetStringSortUtil} from '../../../../util/string-sort-util';

/**
 * 移入回路回路列表弹框
 */
@Component({
  selector: 'app-loop-list-selector',
  templateUrl: './loop-list-selector.component.html',
  styleUrls: ['./loop-list-selector.component.scss']
})
export class LoopListSelectorComponent implements OnInit, OnDestroy {
  // 弹框是否开启
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }
  // 弹框标题
  @Input() title: string;
  // 框选设施数据
  @Input() public tableData = [] ;
  // 弹框点击确定是否关闭
  @Input() isOkChange: boolean = true;
  // 过滤条件
  @Input() public filterConditions: FilterCondition[] = [];
  // 弹框是否开启触发事件
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选择列表数据
  @Output() selectListDataChange = new EventEmitter<LoopListModel[]>();
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 回路类型模版
  @ViewChild('loopTypeTemplate') loopTypeTemplate: TemplateRef<HTMLDocument>;
  // 回路状态枚举
  @ViewChild('loopStatusTemplate') loopStatusTemplate: TemplateRef<HTMLDocument>;
  // 设施类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表数据
  public dataSet: LoopListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表分页实体
  public pageDeviceBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
// 列表配置
  public tableDeviceConfig: TableConfigModel;
  // 选中数据
  public selectListData: LoopListModel[] = [];
  // 是否有勾选数据
  public isSelect: boolean = false;
  // 弹框是否开启
  public isXcVisible: boolean = false;
  // 回路类型枚举
  public loopTypeEnum = LoopTypeEnum;
  // 回路状态枚举
  public loopStatusEnum = LoopStatusEnum;
  // 翻译语言类型枚举
  public languageEnum = LanguageEnum;
  // 步骤条的值
  public stepData: GroupStepModel[];
  // 选中的步骤数
  public isActiveSteps: number = FinalValueEnum.STEPS_FIRST;
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 框选数据
  public tableDataSet = [];
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 下一步是否可用
  public isNext: boolean = false;

  // 弹框是否开启
  get xcVisible() {
    return this.isXcVisible;
  }

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始化框选设施列表
    this.initDeviceTableConfig();
    // 回路表格初始化
    this.initTableConfig();
    // 初始化状态
    this.stepData =
      [
        { stepNumber: 1, activeClass: ' active', title: this.indexLanguage.selectFacility},
        { stepNumber: 2, activeClass: '', title: this.title}
      ];
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
  }

  /**
   * 表格分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryLoopList();
  }

  /**
   * 设施表格分页
   */
  public pageDeviceChange(event: PageModel): void {
    this.pageDeviceBean.pageIndex = event.pageIndex;
    this.pageDeviceBean.pageSize = event.pageSize;
    this.tableDataSet = this.tableData.slice(this.pageDeviceBean.pageSize * (this.pageDeviceBean.pageIndex - 1),
      this.pageDeviceBean.pageIndex * this.pageDeviceBean.pageSize);
  }

  /**
   * 确定
   */
  public handleOk(): void {
    this.selectListDataChange.emit(this.selectListData);
    if (this.isOkChange) {
      this.xcVisible = false;
    }
  }

  /**
   * 点击步骤
   */
  public backSteps(item): void {
    if (this.isActiveSteps > 1 && item.number === 1) {
      this.handlePrev();
    }
  }

  /**
   * 上一步
   */
  public handlePrev(): void {
    this.isActiveSteps--;
    this.stepData[0].activeClass = ' active';
    this.stepData[1].activeClass = '';
  }

  /**
   * 下一步
   */
  public handleNext(): void {
    this.isActiveSteps++;
    this.stepData[0].activeClass = ' finish';
    this.stepData[1].activeClass = 'active';
    // 刷新列表
    this.queryLoopList();
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      noAutoHeight: true,
      showSearchSwitch: true,
      isLoading: true,
      notShowPrint: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '400px'},
      showSearchExport: false,
      noIndex: false,
      keepSelected: true,
      selectedIdKey: 'loopId',
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 回路名称
          title: this.language.loopName,
          key: 'loopName',
          configurable: false,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 回路编号
          title: this.assetLanguage.loopCode,
          key: 'loopCode',
          configurable: false,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 回路类型
          title: this.language.loopType,
          key: 'loopType',
          configurable: false,
          width: 150,
          type: 'render',
          renderTemplate: this.loopTypeTemplate,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // 回路状态
          title: this.assetLanguage.loopStatus,
          key: 'loopStatus',
          width: 150,
          type: 'render',
          renderTemplate: this.loopStatusTemplate,
          searchable: true,
          configurable: false,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(LoopStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // 所属配电箱
          title: this.language.distributionBox,
          key: 'distributionBoxName',
          width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 控制对象
          title: this.language.controlledObject,
          key: 'centralizedControlName',
          width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryLoopList();
      },
      // 筛选
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryLoopList();
      },
      // 选中数据获取
      handleSelect: (event: LoopListModel[]) => {
        this.selectListData = event;
        this.isSelect = !_.isEmpty(this.selectListData);
      },
    };
  }

  /**
   * 设备表格配置初始化
   */
  private initDeviceTableConfig(): void {
    // 设施表单配置
    this.tableDeviceConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      notShowPrint: true,
      keepSelected: true,
      selectedIdKey: 'deviceId',
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
          title: this.indexLanguage.searchDeviceName,
          key: 'deviceName',
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
      sort: (e) => {
        this.tableDataSet  = CommonUtil.deepClone(this.tableDataSet.sort(SetStringSortUtil.compare(e.sortField, e.sortRule)));
      },
      handleSelect: (event) => {
        if (event && event.length > 0) {
          this.isNext = true;
        } else {
          this.isNext = false;
        }
      }
    };
    // 数据源
    this.pageDeviceBean.Total = this.tableData.length;
    // 初始化数据
    this.tableDataSet = this.tableData.slice(this.pageDeviceBean.pageSize * (this.pageDeviceBean.pageIndex - 1),
      this.pageDeviceBean.pageIndex * this.pageDeviceBean.pageSize);
  }

  /**
   * 刷新回路列表
   */
  private queryLoopList(): void {
    this.tableConfig.isLoading = true;
    // 为了避免排序的时候遍历
    if (this.queryCondition.filterConditions[0] !== this.filterConditions[0]) {
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat(this.filterConditions);
    }
    let request;
    if (!_.isEmpty(this.filterConditions)) {
      request = this.$facilityForCommonService.loopListByPageByDeviceIds(this.queryCondition);
    } else {
      request = this.$facilityForCommonService.queryLoopList(this.queryCondition);
    }
    request.subscribe((result: ResultModel<LoopListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });

  }
}
