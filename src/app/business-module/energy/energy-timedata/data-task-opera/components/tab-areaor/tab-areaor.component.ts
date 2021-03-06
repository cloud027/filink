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
  // ??????????????????
  @ViewChild('areaLevelTemp') areaLevelTemp: TemplateRef<any>;
  @ViewChild('tableTemp') tableTemp;
  // ?????????????????? ?????????????????? ??????
  @Input() switchPageToTable: SwitchPageToTableEnum = SwitchPageToTableEnum.insert;
  // ?????? ??????????????????????????? ??????ids??????
  @Input() filterIds: Array<string> = [];
  // ?????????????????? ????????????????????????
  @Input() isVisible: boolean = false;
  // ???????????????
  @Input() selectedData: any[] = [];
  @Output() tableDeleteItem = new EventEmitter<any>();
  @Output() editPageChangeData = new EventEmitter<any>();
  dataSet = [];
  pageBean: PageModel = new PageModel(5, 1);
  tableConfig: TableConfigModel;
  // ???????????? ????????????
  bottomTablePage = {
    pageIndex: 1,
    pageSize: 5,
  };

    // ????????????????????????
    @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // ???????????????????????????
  public selectUnitName: string = '';
  // ????????????
  private filterValue: FilterCondition;
  // ??????????????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ????????????
  public treeNodes: DepartmentUnitModel[] = [];
  // ?????????
  public treeSetting = {};
    // ?????????????????????????????????
    public unitIsVisible: boolean = false;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;

  // ???????????????
  public selectedOption;
  // ??????????????????
  private queryConditions = { bizCondition: { level: '' } };
  // ????????????
  public areaLevelEnum = AreaLevelEnum;

  // ?????? ?????????????????????
  EditInfoqueryConditions ={bizCondition: {areaIds: []}}
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ???????????????
  public language: EnergyLanguageInterface;
  // ???????????????
  public Faclanguage: FacilityLanguageInterface;
  constructor(
    // ???????????????
    public $nzI18n: NzI18nService,
    // ??????
    private $message: FiLinkModalService,
    private $facilityForCommonService: FacilityForCommonService,
    private $energyApiService: EnergyApiService,
    private $userService: UserForCommonService,
  ) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.energy);
    // ?????????
    this.Faclanguage = this.$nzI18n.getLocaleData('facility');
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    // ???????????????????????????
    this.initTreeSelectorConfig();
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    if (this.isVisible) {
      this.initTableConfig();
      this.refreshData();
    } else {
      //  ????????????
      if (this.switchPageToTable === SwitchPageToTableEnum.edit) {
        this.EditInfoqueryConditions.bizCondition.areaIds = this.filterIds;
        /** ???????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
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
  // ?????????????????? ??????
  columnConfigSelect() {
    let columnConfigSelect = {};
    // ?????????????????????
    if (this.switchPageToTable === SwitchPageToTableEnum.details) {
      columnConfigSelect = {
        type: '',
        width: 0,
        hidden: true,
      };
    }
    // ????????? ????????????????????????
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
        // ????????????
        {
          title: this.language.doneComponent.areaName,
          key: 'areaName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // ????????????
        {
          title: this.language.doneComponent.region,
          key: 'parentName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // ????????????
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
        // ????????????
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
        // ????????????
        // {
        //   title: this.language.doneComponent.responsibleUnit,
        //   key: 'accountabilityUnitName',
        //   width: 200,
        //   searchable: true,
        //   searchConfig: { type: 'input' },
        // },
        // ????????????
        {
            title: this.language.doneComponent.responsibleUnit,
            key: 'accountabilityUnitName',
            searchKey: 'accountabilityUnit',
            searchable: true,
            searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
          },
        // ??????
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
      // ??????
      sort: (event: SortCondition) => {
        this.queryConditions.bizCondition['sortField'] = event.sortField;
        this.queryConditions.bizCondition['sortRule'] = event.sortRule;
        this.EditInfoqueryConditions.bizCondition['sortField'] = event.sortField;
        this.EditInfoqueryConditions.bizCondition['sortRule'] = event.sortRule;
        this.EditInfoqueryConditions.bizCondition.areaIds= this.filterIds;
        this.refreshData();
      },
      // ??????
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
            // ???????????? ???????????????????????? [??????????????????]?????????,??????[]
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
  // ????????????
  tableClearSelected() {
    this.tableTemp.keepSelectedData.clear();
    this.tableTemp.updateSelectedData();
    this.tableTemp.checkStatus();
  }
  /**
   * ??????????????????????????????
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
        // ??????
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        // ????????????
        {
          title: this.language.doneComponent.areaName,
          key: 'areaName',
          width: 150,
          searchConfig: { type: 'input' },
        },
        // ????????????
        {
          title: this.language.doneComponent.region,
          key: 'parentName',
          width: 150,
          searchConfig: { type: 'input' },
        },
        // ????????????
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
        // ????????????
        {
          title: this.language.doneComponent.detailedAddress,
          key: 'address',
          width: 200,
          minWidth: 90,
          searchConfig: {
            type: 'input',
          },
        },
        // ????????????
        {
          title: this.language.doneComponent.responsibleUnit,
          key: 'accountabilityUnitName',
          width: 200,
          searchConfig: { type: 'input' },
        },
        // ??????
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
          // ??????
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
  // ?????????????????????
  getDataChecked() {
    return (this.tableTemp && this.tableTemp.getDataChecked()) || [];
  }


  /**
   * ???????????????????????????
   */
   public showModal(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    if (!this.filterValue['filterValue']) {
      this.filterValue['filterValue'] = [];
    }
    // ???????????????????????????????????????
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
   * ????????????????????????
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
   * ??????????????????????????????
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
