import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { PageModel } from '../../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../../shared-module/model/table-config.model';
import _ from 'lodash';
import { SortCondition, FilterCondition } from '../../../../../../shared-module/model/query-condition.model';
import { EnergyLanguageInterface } from '../../../../../../../assets/i18n/energy/energy.language.interface';
import { NzI18nService } from 'ng-zorro-antd';
import { ResultModel } from '../../../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../../../shared-module/enum/result-code.enum';
import { FiLinkModalService } from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import { LanguageEnum } from '../../../../../../shared-module/enum/language.enum';
import { AreaModel } from '../../../../../../core-module/model/facility/area.model';
import { FacilityLanguageInterface } from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {
  SwitchPageToTableEnum,
  ApplicationScopeTableEnum,
} from '../../../../share/enum/energy-config.enum';
import { EnergyApiService } from '../../../../share/service/energy/energy-api.service';

import { AreaLevelEnum } from '../../../../../../core-module/enum/area/area.enum';
import { CommonUtil } from '../../../../../../shared-module/util/common-util';

import {DepartmentUnitModel} from '../../../../../../core-module/model/work-order/department-unit.model';
import { FacilityForCommonService } from '../../../../../../core-module/api-service/facility';
import {TreeSelectorConfigModel} from '../../../../../../shared-module/model/tree-selector-config.model';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {UserForCommonService} from '../../../../../../core-module/api-service/user';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';


@Component({
  selector: 'app-tab-areaor',
  templateUrl: './tab-areaor.component.html',
  styleUrls: ['./tab-areaor.component.scss'],
})
export class TabAreaorComponent implements OnInit {
  // 区域级别模板
  @ViewChild('areaLevelTemp') areaLevelTemp: TemplateRef<any>;
  @ViewChild('tableTemp') tableTemp;
  // 判断是否是从 哪个页面进入 组件
  @Input() switchPageToTable: SwitchPageToTableEnum = SwitchPageToTableEnum.insert;
  // 编辑 详情页面需要传递的 过滤ids字段
  @Input() filterIds: Array<string> = [];
  // 判断是否是从 弹出框进入的页面
  @Input() isVisible: boolean = false;
  // 选中的数据
  @Input() selectedData: any[] = [];
  @Output() tableDeleteItem = new EventEmitter<any>();
  @Output() editPageChangeData = new EventEmitter<any>();
  dataSet = [];
  pageBean: PageModel = new PageModel(5, 1);
  tableConfig: TableConfigModel;
  // 底部表格 前端分页
  bottomTablePage = {
    pageIndex: 1,
    pageSize: 5,
  };

    // 责任单位选择模板
    @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 已选择责任单位名称
  public selectUnitName: string = '';
  // 过滤的值
  private filterValue: FilterCondition;
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 树的数据
  public treeNodes: DepartmentUnitModel[] = [];
  // 树配置
  public treeSetting = {};
    // 责任单位选择器隐藏显示
    public unitIsVisible: boolean = false;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;

  // 级别选择项
  public selectedOption;
  // 区域列表分页
  private queryConditions = { bizCondition: { level: '' } };
  // 区域级别
  public areaLevelEnum = AreaLevelEnum;

  // 编辑 详情的查询条件
  EditInfoqueryConditions ={bizCondition: {areaIds: []}}
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 表格多语言
  public language: EnergyLanguageInterface;
  // 设施语言包
  public Faclanguage: FacilityLanguageInterface;
  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 提示
    private $message: FiLinkModalService,
    private $facilityForCommonService: FacilityForCommonService,
    private $energyApiService: EnergyApiService,
    private $userService: UserForCommonService,
  ) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.energy);
    // 国际化
    this.Faclanguage = this.$nzI18n.getLocaleData('facility');
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始化树选择器配置
    this.initTreeSelectorConfig();
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    if (this.isVisible) {
      this.initTableConfig();
      this.refreshData();
    } else {
      //  编辑页面
      if (this.switchPageToTable === SwitchPageToTableEnum.edit) {
        this.EditInfoqueryConditions.bizCondition.areaIds = this.filterIds;
        /** 如果新增的时候没有选择数据，当编辑的时候，弹出框中选中了 区域之后，页面底部的区域列表就会刷新出现，会重新调用该组件，触发事件，防止事件触发的时候再次调用请求 */
        if (this.selectedData.length > 0) { return this.init_tableList(this.selectedData); }
        this.initTableConfig();
        this.refreshData();
      } else if (this.switchPageToTable === SwitchPageToTableEnum.details) {
        this.EditInfoqueryConditions.bizCondition.areaIds = this.filterIds;
        this.initTableConfig();
        this.refreshData();
      } else { this.init_tableList(this.selectedData); }
    }
  }
  // 表格的选择框 配置
  columnConfigSelect() {
    let columnConfigSelect = {};
    // 说明是详情页面
    if (this.switchPageToTable === SwitchPageToTableEnum.details) {
      columnConfigSelect = {
        type: '',
        width: 0,
        hidden: true,
      };
    }
    // 说明是 弹框中的数据展示
    if (this.isVisible) {
      columnConfigSelect = {
        type: 'select',
        width: 60,
      };
    }
    return columnConfigSelect;
  }
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: this.isVisible || this.switchPageToTable === SwitchPageToTableEnum.details,
      showSizeChanger: false,
      scroll: { x: '900px', y: '200px' },
      noIndex: true,
      notShowPrint: true,
      selectedIdKey: 'areaId',
      noAutoHeight: true,
      columnConfig: [
        {
          type: 'expend',
          width: 30,
          expendDataKey: 'children',
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        this.columnConfigSelect(),
        {
          key: 'serialNumber',
          width: 62,
          title: this.language.serialNumber,
        },
        // 区域名称
        {
          title: this.language.doneComponent.areaName,
          key: 'areaName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // 所属区域
        {
          title: this.language.doneComponent.region,
          key: 'parentName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // 区域级别
        {
          title: this.language.doneComponent.regionalLevel,
          key: 'level',
          type: 'render',
          width: 150,
          minWidth: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(
              AreaLevelEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
          renderTemplate: this.areaLevelTemp,
        },
        // 详细地址
        {
          title: this.language.doneComponent.detailedAddress,
          key: 'address',
          width: 200,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'input',
          },
        },
        // 责任单位
        // {
        //   title: this.language.doneComponent.responsibleUnit,
        //   key: 'accountabilityUnitName',
        //   width: 200,
        //   searchable: true,
        //   searchConfig: { type: 'input' },
        // },
        // 责任单位
        {
            title: this.language.doneComponent.responsibleUnit,
            key: 'accountabilityUnitName',
            searchKey: 'accountabilityUnit',
            searchable: true,
            searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
          },
        // 备注
        {
          title: this.language.remarks,
          key: 'remarks',
          searchable: true,
          width: 150,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 80,
          fixedStyle: { fixedRight: false, style: { right: '0px' } },
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      searchReturnType: 'object',
      // 排序
      sort: (event: SortCondition) => {
        this.queryConditions.bizCondition['sortField'] = event.sortField;
        this.queryConditions.bizCondition['sortRule'] = event.sortRule;
        this.EditInfoqueryConditions.bizCondition['sortField'] = event.sortField;
        this.EditInfoqueryConditions.bizCondition['sortRule'] = event.sortRule;
        this.EditInfoqueryConditions.bizCondition.areaIds= this.filterIds;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event) => {
        this.queryConditions.bizCondition = event;
        this.EditInfoqueryConditions.bizCondition = event;
        if (this.switchPageToTable !== SwitchPageToTableEnum.insert) {
          this.queryConditions['areaIds'] = this.filterIds;
          this.EditInfoqueryConditions.bizCondition.areaIds= this.filterIds;
        }
        if (!event.length) {
            this.selectUnitName = ''
        }
        this.refreshData();
      },
    };
  }
  refreshData() {
    this.tableConfig.isLoading = true;
    if (this.switchPageToTable !== SwitchPageToTableEnum.insert) {
      this.$energyApiService.areaDataCollectListByPage(this.EditInfoqueryConditions).subscribe(
        (result: any) => {
          this.tableConfig.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            const data: any[] = result.data;
            this.dataSet = data || [];
            // 用来处理 区域的责任单位为 [测试责任单位]的字段,去除[]
            this.dataSet.forEach((item) => {
              const reg = /^\[(.*)\]$/g;
              if (item.accountabilityUnitName && reg.test(item.accountabilityUnitName)) {
                item.accountabilityUnitName = item.accountabilityUnitName.replace(/[\[\]]/g, '');
              }
            });
            this.editPageChangeData.emit({
              data,
              type: ApplicationScopeTableEnum.area,
            });
          } else {
            this.$message.error(result.msg);
          }
        },
        () => {
          this.tableConfig.isLoading = false;
        },
      );
    } else if (this.switchPageToTable === SwitchPageToTableEnum.insert) {
      this.$facilityForCommonService.areaListByPage(this.queryConditions).subscribe(
        (result: ResultModel<AreaModel[]>) => {
          this.tableConfig.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            const { data } = result;
            this.dataSet = data || [];
          } else {
            this.$message.error(result.msg);
          }
        },
        () => {
          this.tableConfig.isLoading = false;
        },
      );
    }
  }
  // 清空数据
  tableClearSelected() {
    this.tableTemp.keepSelectedData.clear();
    this.tableTemp.updateSelectedData();
    this.tableTemp.checkStatus();
  }
  /**
   * 重新获取底部区域数据
   */
  init_tableList(params) {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: { x: '900px', y: '200px' },
      noIndex: true,
      notShowPrint: true,
      selectedIdKey: 'areaId',
      noAutoHeight: true,
      columnConfig: [
        // 序号
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        // 区域名称
        {
          title: this.language.doneComponent.areaName,
          key: 'areaName',
          width: 150,
          searchConfig: { type: 'input' },
        },
        // 所属区域
        {
          title: this.language.doneComponent.region,
          key: 'parentName',
          width: 150,
          searchConfig: { type: 'input' },
        },
        // 区域级别
        {
          title: this.language.doneComponent.regionalLevel,
          key: 'level',
          type: 'render',
          width: 150,
          minWidth: 150,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(
              AreaLevelEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
          renderTemplate: this.areaLevelTemp,
        },
        // 详细地址
        {
          title: this.language.doneComponent.detailedAddress,
          key: 'address',
          width: 200,
          minWidth: 90,
          searchConfig: {
            type: 'input',
          },
        },
        // 责任单位
        {
          title: this.language.doneComponent.responsibleUnit,
          key: 'accountabilityUnitName',
          width: 200,
          searchConfig: { type: 'input' },
        },
        // 备注
        {
          title: this.language.remarks,
          key: 'remarks',
          width: 150,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.operate,
          searchConfig: { type: 'operate' },
          key: '',
          width: 80,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          // 删除
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-1-4',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: false,
          confirmContent: this.language.config.deleteConfim,
          handle: (data) => {
            const deepData = _.cloneDeep(this.selectedData);
            const getIndex = deepData.findIndex((item) => item.areaId === data.areaId);
            deepData.splice(getIndex, 1);
            this.selectedData = deepData;
            this.tableDeleteItem.emit({ data: deepData, type: 'area' });
            this.bottomTableRefresh();
          },
        },
      ],
    };
    this.dataSet = [];
    setTimeout(() => {
      this.dataSet = params;
    });
  }
  bottomTableRefresh() {
    this.dataSet = this.selectedData;
  }
  // 获取选中的数据
  getDataChecked() {
    return (this.tableTemp && this.tableTemp.getDataChecked()) || [];
  }


  /**
   * 打开责任单位选择器
   */
   public showModal(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    if (!this.filterValue['filterValue']) {
      this.filterValue['filterValue'] = [];
    }
    // 当责任单位数据不为空的时候
    if (!_.isEmpty(this.treeNodes)) {
      this.treeSelectorConfig.treeNodes = this.treeNodes;
      if (this.filterValue.filterValue.length) {
        FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, this.filterValue['filterValue']);
      }
      this.unitIsVisible = true;
    } else {
      this.$userService.queryTotalDept().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.treeNodes = result.data || [];
          if (this.filterValue.filterValue.length) {
            FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, this.filterValue['filterValue']);
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.unitIsVisible = true;
        } else {
          this.$message.error(result.msg);
        }
      });
    }
  }

    /**
   * 责任单位选择结果
   * param event
   */
     public selectDataChange(event: DepartmentUnitModel[]): void {
        let selectArr = [];
        this.selectUnitName = '';
        if (event.length > 0) {
          selectArr = event.map(item => {
            this.selectUnitName += `${item.deptName},`;
            return item.id;
          });
        }
        this.filterValue.filterName = event.map(item => item.deptName).join(',');
        this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
        if (selectArr.length === 0) {
          this.filterValue['filterValue'] = null;
        } else {
          this.filterValue['filterValue'] = selectArr;
        }
      }
        /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSetting = {
      check: {
        enable: true,
        chkboxType: {'Y': '', 'N': ''},
        chkStyle: 'checkbox',
      },
      data: {
        simpleData: {
          enable: true,
          pIdKey: 'deptFatherId',
          idKey: 'id',
          rootPid: null
        },
        key: {
          children: 'childDepartmentList',
          name: 'deptName'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.doneComponent.responsibleUnit}`,
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      width: '1000px',
      height: '300px',
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.Faclanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.Faclanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.Faclanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }
}
