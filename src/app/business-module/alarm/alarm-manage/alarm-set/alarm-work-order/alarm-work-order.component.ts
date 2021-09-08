import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {AlarmService} from '../../../share/service/alarm.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../shared-module/model/alarm-selector-config.model';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {UserForCommonService} from '../../../../../core-module/api-service/user/user-for-common.service';
import {AlarmEnableStatusEnum, AlarmTriggerTypeEnum, AlarmWorkOrderTypeEnum} from '../../../share/enum/alarm.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {AlarmOrderModel} from '../../../share/model/alarm-order.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {AreaModel} from '../../../../../core-module/model/facility/area.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';

/**
 * 告警设置-告警转工单
 */
@Component({
  selector: 'app-alarm-work-order',
  templateUrl: './alarm-work-order.component.html',
  styleUrls: ['./alarm-work-order.component.scss']
})

export class AlarmWorkOrderComponent implements OnInit {
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // 期待完工时长
  @ViewChild('expectTimeTemp') expectTimeTemp: TemplateRef<any>;
  // 设施类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 区域
  @ViewChild('areaSelector') private areaSelectorTemp;
  // 告警名称
  @ViewChild('alarmName') private alarmName;
  // 筛选部门
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // 表格数据源
  public dataSet: AlarmOrderModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 工单国际化
  public inspectionLanguage: InspectionLanguageInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 责任单位下拉树是否展示
  public responsibleUnitIsVisible: boolean = false;
  // 已选择责任单位名称
  public selectUnitName: string;
  // 责任单位树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  private filterValue: FilterCondition;
  // 过滤条件
  public filterEvent: AlarmOrderModel;
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel;
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 登录有权限设施类型
  private deviceRoleTypes: SelectModel[];
  // 默认查询设施类型
  private defaultFilterCondition: string[] = [];
  // 是否禁启用
  public isStatus = AlarmEnableStatusEnum;
  // 国际化
  public languageEnum = LanguageEnum;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 责任单位数据
  private treeNodes: DepartmentUnitModel[] = [];
  // 区域
  private areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 责任单位
  private unitList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 责任单位配置
  private unitConfig: AlarmSelectorConfigModel;
  // 启用，禁用数据
  private checkDisableEnableData: AlarmOrderModel[] = [];
  // 勾选的告警名称
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              private $dateHelper: DateHelperService,
              private $userService: UserForCommonService,
              private modalService: NzModalService) {
  }
  public ngOnInit(): void {
    // 国际化语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 设施权限
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 设置默认过滤条件
    this.getDefaultFilterCondition();
    // 初始化表格
    this.initTableConfig();
    this.refreshData();
    // 区域
    this.initAreaConfig();
    // 责任单位
    this.initUnitConfig();
    // 告警名称
    this.initAlarmName();
    // 初始化责任单位下拉树
    this.initTreeSelectorConfig();
  }

  /**
   *  启用和禁用 的开关
   *  param data
   */
  public clickSwitch(data: AlarmOrderModel) {
    if (data && data.id) {
      let statusValue;
      this.dataSet = this.dataSet.map(item => {
        if (data.id === item.id) {
          item.status = data.status === AlarmEnableStatusEnum.enable ? AlarmEnableStatusEnum.disable : AlarmEnableStatusEnum.enable;
          this.switchStatusRole(item);
          statusValue = item.status;
          return item;
        } else {
          return item;
        }
      });
      this.$alarmService.updateWorkStatus(statusValue, [data.id])
        .subscribe((res: ResultModel<string>) => {
         if (res.code === 0) {
           this.$message.success(this.language.editAlarmTurnOrderEnableStatus);
         } else {
           this.$message.error( res.msg);
         }
        });
    }
  }
  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterCondition): void {
    if (this.treeNodes.length === 0) {
      this.queryAllDeptList().then((bool) => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue.filterValue) {
            this.filterValue.filterValue = [];
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
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
   * 部门筛选选择结果
   */
  public departmentSelectDataChange(event: DepartmentUnitModel[]): void {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue.filterValue = null;
    } else {
      this.filterValue.filterValue = selectArr;
      this.filterValue.filterName = this.selectUnitName;
    }
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, selectArr);
  }

  /**
   * 查询所有的单位
   */
  private queryAllDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.treeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
   * 删除模板
   * param ids
   */
  private delTemplate(ids: string[]): void {
    this.$alarmService.deleteAlarmWork(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData(this.filterEvent);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   * 获取告警列表信息
   */
  private refreshData(filterEvent?: AlarmOrderModel): void {
    this.tableConfig.isLoading = true;
    let resultData = new AlarmOrderModel();
    if (filterEvent) {
      if (!filterEvent.hasOwnProperty('deviceTypeId')) {
        filterEvent.deviceTypeId = this.defaultFilterCondition;
      }
      resultData = filterEvent;
    } else {
      resultData.deviceTypeId = this.defaultFilterCondition;
    }
    const data = {'bizCondition': resultData};
    this.queryCondition.bizCondition = {
      ...data.bizCondition,
      'sortProperties': this.queryCondition.sortCondition.sortField,
      'sort': this.queryCondition.sortCondition.sortRule
    };
    this.$alarmService.queryAlarmWorkOrder(this.queryCondition).subscribe((res: ResultModel<AlarmOrderModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const areaIds = [];
        this.tableConfig.isLoading = false;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.dataSet = res.data.map(item => {
          // 工单类型
          item.orderTypeName = AlarmUtil.translateOrderType(this.$nzI18n, item.orderType) as string;
          // 触发条件
          item.triggerTypeName = AlarmUtil.translateTriggerType(this.$nzI18n, item.triggerType) as string;
          // 切换启用禁用权限
          this.switchStatusRole(item);
          // 告警名称
          if (item.alarmOrderRuleNames && item.alarmOrderRuleNames.length) {
            item.alarmName = item.alarmOrderRuleNames.join();
          }

          item.alarmOrderRuleArea.forEach(areaId => {
            if (areaIds.indexOf(areaId) === -1) {
              areaIds.push(areaId);
            }
          });
          item.alarmOrderRuleAreaName = [];
          // 设施类型
          if (item.alarmOrderRuleDeviceTypeList && item.alarmOrderRuleDeviceTypeList[0]
            && item.alarmOrderRuleDeviceTypeList[0].deviceTypeId) {
            const resultDeviceData = AlarmUtil.setDeviceTypeList(item.alarmOrderRuleDeviceTypeList, this.$nzI18n);
            item.deviceTypeArr = resultDeviceData.resultInfo;
            item.deviceTypeNames = resultDeviceData.resultNames.join(',');
          }
          // 设备类型
          if (item.alarmOrderRuleEquipmentTypeList && item.alarmOrderRuleEquipmentTypeList[0]
            && item.alarmOrderRuleEquipmentTypeList[0].equipmentTypeId) {
            const resultDeviceData = AlarmUtil.setEquipmentTypeList(item.alarmOrderRuleEquipmentTypeList, 'equipmentTypeId', this.$nzI18n);
            item.equipmentTypeArr = resultDeviceData.resultInfo;
            item.equipmentTypeNames = resultDeviceData.resultNames.join(',');
          }
          // 区域
          if (item.alarmOrderRuleAreaName && item.alarmOrderRuleAreaName.length) {
            item.areaName = item.alarmOrderRuleAreaName.join(',');
          }
          return item;
        });
        // 根据区域id回显区域名称
        if (areaIds && areaIds.length > 0) {
          AlarmUtil.getAreaName(this.$alarmService, areaIds).then((result: AreaModel[]) => {
            AlarmUtil.joinAlarmWorkOrderForwardRuleAreaName(this.dataSet, result);
          });
        }
      } else {
        // 请求错误
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 启用弹框 弹框
   */
  private enablePopUpConfirm(): void {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.isNoAllEnable,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.checkDisableEnable(AlarmEnableStatusEnum.enable);
      },
    });
  }
  /**
   * 禁用弹框
   */
  private disablePopUpConfirm(): void {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.isNoAllDisable,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.checkDisableEnable(AlarmEnableStatusEnum.disable);
      },
    });
  }
  /**
   * 批量禁用与启用
   * param {any | any} type
   */
  private checkDisableEnable(type: AlarmEnableStatusEnum) {
    const ids = this.checkDisableEnableData.map(item => item.id);
    this.$alarmService.updateWorkStatus(type, ids)
      .subscribe((res: ResultModel<string>) => {
        if (res.code === 0) {
          this.$message.success(this.language.editAlarmTurnOrderEnableStatus);
          this.refreshData(this.filterEvent);
        } else {
          this.$message.error(res.msg);
        }
      }, err => {
        this.$message.error(err.msg);
      });
  }
  /**
   *  区域配置
   */
  private initAreaConfig(): void {
    const clear = !this.areaList.ids.length;
    this.areaConfig = {
      clear: clear,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
      }
    };
  }

  /**
   *  责任单位配置
   */
  private initUnitConfig(): void {
    const clear = !this.unitList.ids.length;
    this.unitConfig = {
      clear: clear,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.unitList = event;
      }
    };
  }

  /**
   *  告警名称配置
   */
  private initAlarmName(): void {
    const clear = !this.checkAlarmName.ids.length;
    this.alarmNameConfig = {
      clear: clear,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
      }
    };
  }
  /**
   * 切换权限
   * param item
   */
  private switchStatusRole(item: AlarmOrderModel): void {
    // 启/禁用权限
    item.appAccessPermission = item.status === AlarmEnableStatusEnum.disable ? '02-3-5-2' : '02-3-5-3';
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSelectorConfig = {
      title: this.facilityLanguage.accountabilityUnit,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': '', 'N': ''},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'deptFatherId',
            rootPid: null
          },
          key: {
            name: 'deptName',
            children: 'childDepartmentList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.facilityLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.facilityLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.facilityLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }
  /**
   * 设置默认过滤条件
   */
  private getDefaultFilterCondition(): void {
    if (!_.isEmpty(this.deviceRoleTypes)) {
      const labelValue = [];
      this.deviceRoleTypes.forEach(item => {
        labelValue.push(item.code);
      });
      this.defaultFilterCondition = labelValue;
    }
  }
  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      primaryKey: '02-3-5',
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 名称
          title: this.language.name, key: 'orderName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // 告警名称
          title: this.language.alarmName, key: 'alarmName', searchKey: 'alarmOrderRuleNames',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            selectInfo: this.checkAlarmName.alarmNames,
            renderTemplate: this.alarmName
          }
        },
        {
          // 工单类型
          title: this.language.workOrderType, key: 'orderTypeName',
          searchKey: 'orderTypeList',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 1 是巡检工单 2 是销障工单
              {label: this.language.eliminateWork, value: AlarmWorkOrderTypeEnum.eliminateWork},
            ]
          },
        },
        {
          // 区域
          title: this.language.area,
          key: 'areaName',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            selectInfo: this.areaList.ids,
            renderTemplate: this.areaSelectorTemp
          },
        },
        {
          // 设施类型
          title: this.language.alarmSourceType, key: 'alarmOrderRuleDeviceTypeList', width: 230, isShowSort: true,
          type: 'render',
          searchKey: 'deviceTypeId',
          configurable: true,
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.deviceRoleTypes, label: 'label', value: 'code'
          }
        },
        {
          // 设备类型
          title: this.language.equipmentType, key: 'alarmOrderRuleEquipmentTypeList', width: 230, isShowSort: true,
          configurable: true,
          searchKey: 'equipmentTypeId',
          searchable: true,
          type: 'render',
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        {
          // 触发条件
          title: this.language.triggerCondition, key: 'triggerTypeName', isShowSort: true,
          searchKey: 'triggerTypeArray',
          width: 180,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 0 是告警发生时触发 1 是启用状态时触发
              {label: this.language.alarmHappenedTrigger, value: AlarmTriggerTypeEnum.alarmHappenedTrigger},
            ]
          },
        },
        {
          // 创建时间
          title: this.language.createTime, key: 'createTime',
          width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 期待完工时长(天)
          title: this.language.expectAccomplishTime, key: 'completionTime', isShowSort: true,
          width: 140,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.expectTimeTemp},
        },
        {
          // 责任单位
          title: this.language.responsibleUnit,
          key: 'departmentName',
          width: 200,
          configurable: true,
          searchable: true,
          searchKey: 'departmentIdList',
          searchConfig: {
            type: 'render',
            selectInfo: this.unitList.ids,
            renderTemplate: this.unitNameSearch
          },
        },
        {
          // 启用 和 禁用
          title: this.language.openStatus, key: 'status', width: 150, isShowSort: true,
          searchKey: 'statusArray',
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 1 是启用 2 是关闭
              {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
              {label: this.language.enable, value: AlarmEnableStatusEnum.enable}
            ]
          },
          handleFilter: ($event) => {
          },
        },
        {
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [
        {
          // 编辑
          text: this.language.update,
          className: 'fiLink-edit',
          permissionCode: '02-3-5-4',
          handle: (currentIndex: AlarmOrderModel) => {
            this.$router.navigate(['business/alarm/alarm-work-order/update'], {
              queryParams: {id: currentIndex.id}
            }).then();
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          permissionCode: '02-3-5-5',
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data: AlarmOrderModel) => {
            if (data.status === AlarmEnableStatusEnum.enable) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.id;
              if (ids) {
                this.delTemplate([ids]);
              }
            }
          }
        }
      ],
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-5-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-work-order/add']).then();
          }
        }, {
          // 批量删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-5-5',
          handle: (data: AlarmOrderModel[]) => {
            if (data.find(item => item.status === AlarmEnableStatusEnum.enable)) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.map(item => item.id);
              if (ids) {
                this.delTemplate(ids);
              }
            }
          }
        }
      ],
      moreButtons: [
        {
          text: this.language.enable,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-5-2',
          canDisabled: true,
          handle: (e: AlarmOrderModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.enablePopUpConfirm();
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        },
        {
          text: this.language.disable,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-5-3',
          canDisabled: true,
          handle: (e: AlarmOrderModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.disablePopUpConfirm();
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        }
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmOrderRuleDeviceTypeList') {
          this.queryCondition.sortCondition.sortField = 'deviceTypeId';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData(this.filterEvent);
      },
      handleSearch: (event: FilterCondition[]) => {
        // 重置告警名称
        if (!event.length) {
          this.filterEvent = null;
          // 清除告警名称和区域
          this.checkAlarmName = new AlarmSelectorInitialValueModel();
          this.initAlarmName();
          this.areaList = new AlarmSelectorInitialValueModel();
          // 区域
          this.initAreaConfig();
          this.unitList = new AlarmSelectorInitialValueModel();
          this.selectUnitName = '';
          this.initUnitConfig();
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          const filterEvent = new AlarmOrderModel();
          event.forEach((item, index) => {
            filterEvent[item.filterField] = item.filterValue;
            if (item.filterField === 'createTime') {
              //  创建时间
              event.forEach(itemTime => {
                if (itemTime.operator === OperatorEnum.gte) {
                  filterEvent.createTime = itemTime.filterValue;
                }
                if (itemTime.operator === OperatorEnum.lte) {
                  filterEvent.createTimeEnd = itemTime.filterValue;
                }
              });
            }
            // 期待完工时长
            if (item.filterField === 'completionTime') {
              filterEvent.completionTime = Number(item.filterValue) ? Number(item.filterValue) : 0;
              filterEvent.completionTimeOperate = OperatorEnum.lte;
            }
          });
          // 设施总数
          if (this.areaList && this.areaList.ids && this.areaList.ids.length) {
            // 区域
            filterEvent.alarmOrderRuleArea = this.areaList.ids;
          }
          if (this.checkAlarmName && this.checkAlarmName.ids && this.checkAlarmName.ids.length) {
            // 告警名称
            // filterEvent.alarmOrderRuleNameList = this.checkAlarmName.ids;
          }
          if (this.checkAlarmName && this.checkAlarmName.alarmNames && this.checkAlarmName.alarmNames.length) {
            // 告警名称
            filterEvent.alarmOrderRuleNames = this.checkAlarmName.alarmNames;
          }
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      }
    };
  }
}
