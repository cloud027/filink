import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AreaApiService} from '../../share/service/area/area-api.service';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {MapSelectorConfigModel} from '../../../../shared-module/model/map-selector-config.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {AreaLevelEnum} from '../../../../core-module/enum/area/area.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';

/**
 * 区域列表组件
 */
@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss']
})
export class AreaListComponent implements OnInit {
  // 区域级别模板
  @ViewChild('areaLevelTemp') areaLevelTemp: TemplateRef<any>;
  // 左上角选择级别模板
  @ViewChild('topCustomButton') topCustomButton: TemplateRef<any>;
  // 责任单位选择模板
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 列表数据
  public dataSet: AreaModel[] = [];
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryConditions = {bizCondition: {level: ''}};
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 树的数据
  public treeNodes: DepartmentUnitModel[] = [];
  // 树配置
  public treeSetting = {};
  // 地图选择器配置
  public mapSelectorConfig: MapSelectorConfigModel;
  // 已选级别
  public selectedValue = 0;
  // 区域级别
  public areaLevelEnum = AreaLevelEnum;
  // 语言国际化类型
  public languageEnum = LanguageEnum;
  // 级别选择项
  public selectedOption;
  // 责任单位选择器隐藏显示
  public isVisible: boolean = false;
  // 已选择责任单位名称
  public selectUnitName: string = '';
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  //  判断是否为英文环境
  public isEn: boolean = false;
  // 过滤的值
  private filterValue: FilterCondition;

  constructor(private $message: FiLinkModalService, private $router: Router,
              private $modalService: NzModalService,
              private $userService: UserForCommonService,
              private $areaApiService: AreaApiService,
              private $facilityCommonService: FacilityForCommonService,
              public $nzI18n: NzI18nService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.isEn = JSON.parse(localStorage.getItem('localLanguage')) === 'EN';
    // 初始化table配置
    this.initTableConfig();
    // 初始化树选择器配置
    this.initTreeSelectorConfig();
    // 属性列表数据
    this.refreshData();
    // 区域选择下拉选项国际化
    this.selectedOption = [
      {label: `${this.language.open}${this.language.areaLevelOne}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.areaLevelTwo}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.areaLevelThree}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.areaLevelFour}${this.language.openArea}`},
      {label: `${this.language.open}${this.language.areaLevelFive}${this.language.openArea}`},
    ];
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
      this.isVisible = true;
    } else {
      this.$userService.queryTotalDept().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.treeNodes = result.data || [];
          if (this.filterValue.filterValue.length) {
            FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, this.filterValue['filterValue']);
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.isVisible = true;
        } else {
          this.$message.error(result.msg);
        }
      });
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
      title: `${this.language.selectUnit}`,
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      width: '1000px',
      height: '300px',
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.language.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.language.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }


  /**
   * 刷新区域数据
   */
  private refreshData(): void {
    this.selectedValue = 0;
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.areaListByPage(this.queryConditions).subscribe((result: ResultModel<AreaModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.dataSet = result.data || [];
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '03-2',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1000px', y: '400px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        {
          type: 'expend', width: 30, expendDataKey: 'children',
        },
        {
          type: 'select',
          width: 62
        },
        {
          key: 'serialNumber', width: 62, title: this.language.serialNumber,
        },
        {
          title: this.language.areaName, key: 'areaName', width: 124,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.parentId, key: 'parentName', width: 124,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.level, key: 'level', width: 100,
          configurable: true,
          type: 'render',
          searchable: true,
          searchConfig: {
            type: 'select', selectInfo: CommonUtil.codeTranslate(AreaLevelEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label', value: 'code'
          },
          renderTemplate: this.areaLevelTemp,
        },
        {
          title: this.language.provinceName, key: 'provinceName', width: 100,
          configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.cityName, key: 'cityName', width: 100, configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.districtName, key: 'districtName', width: 100, configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.address, key: 'address', width: 100, configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.accountabilityUnit, key: 'accountabilityUnitName', configurable: true,
          searchKey: 'accountabilityUnit',
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
        },
        {
          title: this.language.remarks, key: 'remarks', configurable: true, width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'object',
      topButtons: [
        {
          text: this.language.addArea,
          iconClassName: 'fiLink-add-no-circle',
          handle: () => {
            this.addArea();
          },
          permissionCode: '03-2-2'
        },
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          canDisabled: true,
          needConfirm: true,
          handle: (data: AreaModel[]) => {
            const ids = data.map(item => item.areaId);
            this.$areaApiService.deleteAreaByIds(ids).subscribe((result: ResultModel<string>) => {
              if (result.code === ResultCodeEnum.success) {
                this.$message.success(this.language.deleteAreaSuccess);
                this.refreshData();
              } else {
                this.$message.error(result.msg);
              }
            });
          },
          permissionCode: '03-2-4'
        },
      ],
      operation: [
        {
          text: this.language.setDevice, className: 'fiLink-facility-m', handle: (event: AreaModel) => {
            this.navigateToDetail('business/facility/set-area-device', {queryParams: {id: event.areaId}});
          },
          permissionCode: '03-2-6',
        },
        {
          text: this.language.update,
          permissionCode: '03-2-3',
          className: 'fiLink-edit',
          handle: (currentIndex: AreaModel) => {
            this.navigateToDetail('business/facility/area-detail/update', {queryParams: {id: currentIndex.areaId}});
          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          permissionCode: '03-2-4',
          className: 'fiLink-delete red-icon',
          handle: (currentIndex: AreaModel) => {
            this.$areaApiService.deleteAreaByIds([currentIndex.areaId]).subscribe((result: ResultModel<string>) => {
              if (result.code === ResultCodeEnum.success) {
                this.refreshData();
                this.$message.success(this.language.deleteAreaSuccess);
              } else {
                this.$message.error(result.msg);
              }
            });
          }
        },
      ],
      topCustomButton: this.topCustomButton,
      sort: (event: SortCondition) => {
        this.queryConditions.bizCondition['sortField'] = event.sortField;
        this.queryConditions.bizCondition['sortRule'] = event.sortRule;
        this.refreshData();
      },
      // 暂时没办法给类型，因为后台根据条件查询是放在了bizCondition
      handleSearch: (event) => {
        this.queryConditions.bizCondition = event;
        // 没有值的时候重置已选数据
        if (!event.accountabilityUnit) {
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes || [], []);
        }
        this.refreshData();
      },
      expandHandle: () => {
        this.selectedValue = null;
      },
      handleExport: (event: ListExportModel<AreaModel[]>) => {
        // 处理参数
        const body = {
          queryCondition: new QueryConditionModel(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        body.columnInfoList.forEach(item => {
          if (item.propertyName === 'level') {
            item.isTranslation = 1;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          body.queryCondition.bizCondition['areaIds'] = event.selectItem.map(item => item.areaId);
        } else {
          // 处理查询条件
          body.queryCondition.bizCondition = event.queryTerm;

        }
        this.$areaApiService.exportAreaList(body).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * 点击新增区域
   */
  private addArea(): void {
    this.$router.navigate(['business/facility/area-detail/add']).then();
  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }
}
