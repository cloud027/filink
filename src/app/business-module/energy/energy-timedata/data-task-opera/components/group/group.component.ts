import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PageModel } from '../../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../../shared-module/model/table-config.model';
import { NzI18nService, NzMessageService } from 'ng-zorro-antd';
import _ from 'lodash';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../../shared-module/model/query-condition.model';
import { EnergyLanguageInterface } from '../../../../../../../assets/i18n/energy/energy.language.interface';
import { ResultModel } from '../../../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../../../shared-module/enum/result-code.enum';
import { ApplicationInterface } from '../../../../../../../assets/i18n/application/application.interface';
import { LanguageEnum } from '../../../../../../shared-module/enum/language.enum';
import { OperatorEnum } from '../../../../../../shared-module/enum/operator.enum';
import { GroupListModel } from '../../../../../application-system/share/model/equipment.model';
import { CommonLanguageInterface } from '../../../../../../../assets/i18n/common/common.language.interface';
import { EnergyApiService } from '../../../../share/service/energy/energy-api.service';
import { FacilityLanguageInterface } from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {
  SwitchPageToTableEnum,
  ApplicationScopeTableEnum,
} from '../../../../share/enum/energy-config.enum';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  // 判断是否是从 哪个页面进入 组件
  @Input() switchPageToTable: SwitchPageToTableEnum = SwitchPageToTableEnum.insert;
  // 编辑 详情页面需要传递的 过滤ids字段
  @Input() filterIds: Array<string> = [];
  @Input() isVisible: boolean = false;
  @Input() selectedData: any = [];
  @Output() tableDeleteItem = new EventEmitter<any>();
  @Output() editPageChangeData = new EventEmitter<any>();

  @ViewChild('tableTemp') tableTemp;
  dataSet = [];
  pageBeanGroup: PageModel = new PageModel(5, 1);
  // 底部表格 前端分页
  bottomTablePage = {
    pageIndex: 1,
    pageSize: 5,
  };
  tableConfigGroup: TableConfigModel;
  // 分组详情
  public showGroupViewDetail: boolean = false;
  public currentGroup: GroupListModel;
  // 分组列表分页
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  // 编辑 详情的查询条件
  EditInfoqueryConditions = [];

  public language: EnergyLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  public equipmentLanguage: FacilityLanguageInterface;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: NzMessageService,
    private $energyApiService: EnergyApiService,
  ) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    console.log(this.switchPageToTable, 'this.switchPageToTable');
    if (this.isVisible) {
      this.initTableConfig();
      this.refreshData();
    } else {
      //  编辑页面
      if (this.switchPageToTable === SwitchPageToTableEnum.edit) {
        const filterData = new FilterCondition('groupNames', OperatorEnum.in, this.filterIds);
        this.queryCondition.filterConditions.push(filterData);
        /** 如果新增的时候没有选择数据，当编辑的时候，弹出框中选中了 区域之后，页面底部的区域列表就会刷新出现，会重新调用该组件，触发事件，防止事件触发的时候再次调用请求 */
        if (this.selectedData.length > 0) { return this.init_tableList(this.selectedData); }
        this.initTableConfig();
        this.refreshData();
      } else if (this.switchPageToTable === SwitchPageToTableEnum.details) {
        const filterData = new FilterCondition('groupNames', OperatorEnum.in, this.filterIds);
        this.queryCondition.filterConditions.push(filterData);
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
  // 弹出框的 分组表格
  initTableConfig() {
    this.tableConfigGroup = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: this.isVisible || this.switchPageToTable === SwitchPageToTableEnum.details,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      noAutoHeight: true,
      keepSelected: true,
      selectedIdKey: 'groupId',
      columnConfig: [
        this.columnConfigSelect(),
        // 序号
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        // 分组名称
        {
          title: this.languageTable.equipmentTable.groupName,
          key: 'groupName',
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        // 备注
        {
          title: this.languageTable.equipmentTable.remark,
          key: 'remark',
          width: 300,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // 操作
        {
          title: this.language.operate,
          searchConfig: { type: 'operate' },
          searchable: true,
          key: '',
          width: 100,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [
        // 分组详情
        {
          permissionCode: '03-9-3',
          text: this.equipmentLanguage.groupDetail,
          className: 'fiLink-view-detail',
          handle: (data: GroupListModel) => {
            this.currentGroup = data;
            this.showGroupViewDetail = true;
          },
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }
  public pageGroupChange(event: PageModel): void {
    // if (this.isVisible) {
    //   this.queryCondition.pageCondition.pageNum = event.pageIndex;
    //   this.queryCondition.pageCondition.pageSize = event.pageSize;
    //   this.refreshData();
    // } else {
    //   this.bottomTablePage.pageIndex = event.pageIndex;
    //   this.bottomTablePage.pageSize = event.pageSize;
    //   this.bottomTableRefresh();
    // }
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
    if (!this.isVisible) { 
        this.bottomTablePage.pageIndex = event.pageIndex;
        this.bottomTablePage.pageSize = event.pageSize;
        this.bottomTableRefresh();
    }
  }
  refreshData() {
    this.tableConfigGroup.isLoading = true;
    const flag = this.queryCondition.filterConditions.some(
      (item) => item.filterField === 'equipmentType',
    );
    if (!flag) {
      const filterData = new FilterCondition('equipmentType', OperatorEnum.in, ['E002', 'E003']);
      this.queryCondition.filterConditions.push(filterData);
    }
    this.$energyApiService.queryEquipmentGroupInfoList_API(this.queryCondition).subscribe(
      (result: ResultModel<any>) => {
        this.tableConfigGroup.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          const { data, totalCount, pageNum, size } = result;
          this.dataSet = data || [];
          this.pageBeanGroup.Total = totalCount;
          this.pageBeanGroup.pageIndex = pageNum;
          this.pageBeanGroup.pageSize = size;
          // 编辑页面
          if (this.switchPageToTable === SwitchPageToTableEnum.edit) {
            this.editPageChangeData.emit({
              data: result.data,
              type: ApplicationScopeTableEnum.group,
            });
          }
        } else {
          this.$message.error(result.msg);
        }
      },
      () => {
        this.tableConfigGroup.isLoading = false;
      },
    );
  }

  // 清空数据
  tableClearSelected() {
    this.tableTemp.keepSelectedData.clear();
    this.tableTemp.updateSelectedData();
    this.tableTemp.checkStatus();
  }
  // 重新获取数据
  init_tableList(params) {
    this.tableConfigGroup = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      keepSelected: true,
      scroll: { x: '900px', y: '200px' },
      noIndex: true,
      notShowPrint: true,
      noAutoHeight: true,
      columnConfig: [
        // 序号
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        // 分组名称
        {
          title: this.languageTable.equipmentTable.groupName,
          key: 'groupName',
          width: 300,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        // 备注
        {
          title: this.languageTable.equipmentTable.remark,
          key: 'remark',
          width: 300,
          searchConfig: { type: 'input' },
        },
        // 操作
        {
          title: this.language.operate,
          searchConfig: { type: 'operate' },
          key: '',
          width: 80,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: true,
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
            const getIndex = deepData.findIndex((item) => item.groupId === data.groupId);
            deepData.splice(getIndex, 1);
            this.selectedData = deepData;
            this.pageBeanGroup.Total--;
            this.tableDeleteItem.emit({ data: deepData, type: 'group' });
            this.bottomTableRefresh();
          },
        },
      ],
    };
    this.dataSet = params;
  }
  bottomTableRefresh() {
    const pageIndex = this.bottomTablePage.pageIndex;
    const pageSize = this.bottomTablePage.pageSize;
    const pageStart = (pageIndex - 1) * pageSize;
    const pageEnd = pageIndex * pageSize;
    this.dataSet = this.selectedData.slice(pageStart, pageEnd);
  }
  getDataChecked() {
    return (this.tableTemp && this.tableTemp.getDataChecked()) || [];
  }
}
