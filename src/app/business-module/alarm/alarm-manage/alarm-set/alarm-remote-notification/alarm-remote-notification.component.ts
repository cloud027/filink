import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
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
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {AlarmEnableStatusEnum} from '../../../share/enum/alarm.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AlarmRemoteModel} from '../../../share/model/alarm-remote.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {AreaModel} from '../../../../../core-module/model/facility/area.model';

/**
 * 告警设置-告警远程通知
 */
@Component({
  selector: 'app-alarm-remote-notification',
  templateUrl: './alarm-remote-notification.component.html',
  styleUrls: ['./alarm-remote-notification.component.scss'],
})

export class AlarmRemoteNotificationComponent implements OnInit {
  // 设备对象
  @ViewChild('equipmentObjectTemp') equipmentObjectTemp: TemplateRef<any>;
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // 告警级别
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  // 设施类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 通知人
  @ViewChild('notifierTemp') notifierTemp: TemplateRef<any>;
  // 设施对象
  @ViewChild('alarmDeviceObject') alarmDeviceObject: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // 设施名称
  @ViewChild('deviceNameTemp') deviceNameTemp: TemplateRef<any>;
  // 设备名称
  @ViewChild('equipmentNameTemp') equipmentNameTemp: TemplateRef<any>;
  // 区域
  @ViewChild('areaSelector') private areaSelectorTemp: TemplateRef<any>;
  // 设施选择器配置
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // 勾选的设备
  public checkTroubleObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备选择器显示
  public equipmentFilterValue: FilterCondition;
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 勾选的设施对象
  public checkDeviceObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 过滤条件
  public filterObj: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 表格数据源
  public dataSet: AlarmRemoteModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 过滤条件
  public filterEvent: AlarmRemoteModel = new AlarmRemoteModel();
  // 区域
  public areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel;
  // 勾选的通知人
  public checkAlarmNotifier: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 通知人配置
  public alarmUserConfig: AlarmSelectorConfigModel;
  // 启用，禁用数据
  public checkDisableEnableData: AlarmRemoteModel[] = [];
  // 启用状态
  public isStatus = AlarmEnableStatusEnum;
  // 登录有权限设施类型
  private deviceRoleTypes: SelectModel[];

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService) {

  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // 设施权限
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 初始化表格
    this.initTableConfig();
    // 获取数据
    this.refreshData();
    // 通知人
    this.initAlarmUserConfig();
    // 区域
    this.initAreaConfig();
    // 设施对象初始化
    this.initDeviceObjectConfig();
  }

  /**
   * 批量禁用与启用
   * param type
   */
  public checkDisableEnable(type: AlarmEnableStatusEnum): void {
    const ids = this.checkDisableEnableData.map(item => item.id);
    this.$alarmService.updateRemoteStatus(type, ids)
      .subscribe((res: ResultModel<string>) => {
        if (res.code === 0) {
          this.$message.success(this.language.editAlarmRemoteEnableStatus);
          this.refreshData(this.filterEvent);
        }
      }, error => {
        this.$message.success(error.msg);
      });
  }

  /**
   *  启用和禁用 的开关
   *  param data
   */
  public clickSwitch(data: AlarmRemoteModel): void {
    if (data && data.id) {
      let statusValue;
      // 禁启用状态
      this.dataSet = this.dataSet.map(item => {
        if (data.id === item.id) {
          item.status = data.status === AlarmEnableStatusEnum.enable ? AlarmEnableStatusEnum.disable : AlarmEnableStatusEnum.enable;
          statusValue = item.status;
          this.switchStatusRole(item);
          return item;
        } else {
          return item;
        }
      });
      this.$alarmService.updateRemoteStatus(statusValue, [data.id])
        .subscribe((res: ResultModel<string>) => {
          if (res.code === 0) {
            this.$message.success(this.language.editAlarmRemoteEnableStatus);
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  }

  /**
   * 删除模板
   * param ids
   */
  public delTemplate(ids: string[]): void {
    this.$alarmService.deleteAlarmRemote(ids).subscribe((result: ResultModel<string>) => {
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
   * 分页数据查询
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   *  区域配置
   */
  public initAreaConfig(): void {
    this.areaConfig = {
      clear: !this.areaList.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
      },
    };
  }

  /**
   *  通知人配置
   */
  public initAlarmUserConfig(): void {
    this.alarmUserConfig = {
      clear: !this.checkAlarmNotifier.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmNotifier = event;
        this.initAreaConfig();
      },
    };
  }

  /**
   * 切换权限
   * param item
   */
  public switchStatusRole(item: AlarmRemoteModel): void {
    item.statusName = AlarmUtil.translateDisableAndEnable(this.$nzI18n, item.status);
    // 启/禁用权限
    item.appAccessPermission = item.status === AlarmEnableStatusEnum.disable ? '02-3-4-2' : '02-3-4-3';
  }

  /**
   * 选择设备过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkTroubleObject = {
      ids: event.map(v => v.equipmentId) || [],
      name: event.map(v => v.equipmentName).join(',') || '',
    };
    this.equipmentFilterValue.filterValue = this.checkTroubleObject.ids;
    this.equipmentFilterValue.filterName = this.checkTroubleObject.name;
  }

  /**
   * 显示设备过滤
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * 设施选择器
   */
  private initDeviceObjectConfig(): void {
    this.deviceObjectConfig = {
      clear: !this.filterObj.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkDeviceObject = event;
        this.filterObj.ids = event.ids;
        this.filterObj.name = event.name;
      },
    };
  }

  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      primaryKey: '02-3-4',
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}},
        },
        {
          // 名称
          title: this.language.name, key: 'ruleName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        {
          // 通知人
          title: this.language.notifier, key: 'user',
          searchKey: 'alarmForwardRuleUserList',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            selectInfo: this.checkAlarmNotifier.ids,
            renderTemplate: this.notifierTemp,
          },
        },
        {
          // 区域
          title: this.language.area,
          key: 'areaName',
          searchKey: 'areaId',
          configurable: true,
          width: 200,
          searchable: true,
          searchConfig: {
            type: 'render',
            selectInfo: this.areaList.ids,
            renderTemplate: this.areaSelectorTemp,
          },
        },
        {
          // 设施类型
          title: this.language.alarmSourceType, key: 'alarmForwardRuleDeviceTypeList', width: 230, isShowSort: true,
          type: 'render',
          searchKey: 'deviceTypeId',
          configurable: true,
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.deviceRoleTypes, label: 'label', value: 'code',
          },
        },
        {
          // 设施对象
          title: this.language.deviceObject, key: 'alarmForwardRuleDeviceObjectList', width: 230, isShowSort: true,
          configurable: true,
          searchKey: 'deviceId',
          searchable: true,
          type: 'render',
          renderTemplate: this.deviceNameTemp,
          searchConfig: {
            type: 'render',
            renderTemplate: this.alarmDeviceObject,
          },
        },
        {
          // 设备类型
          title: this.language.equipmentType, key: 'alarmForwardRuleEquipmentTypeList', width: 230, isShowSort: true,
          configurable: true,
          searchKey: 'equipmentTypeId',
          searchable: true,
          type: 'render',
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n), label: 'label', value: 'code',
          },
        },
        {
          // 设备对象
          title: this.language.equipmentObject,
          key: 'alarmForwardRuleEquipmentObjectList',
          width: 230,
          isShowSort: true,
          configurable: true,
          searchKey: 'equipmentId',
          searchable: true,
          type: 'render',
          renderTemplate: this.equipmentNameTemp,
          searchConfig: {
            type: 'render',
            renderTemplate: this.equipmentObjectTemp,
          },
        },
        {
          // 启用状态
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
              {label: this.language.enable, value: AlarmEnableStatusEnum.enable},
            ],
          },
          handleFilter: ($event) => {
          },
        },
        {
          // 告警级别
          title: this.language.alarmFixedLevel, key: 'alarmForwardRuleLevels',
          width: 220, isShowSort: true,
          searchKey: 'alarmLevelId',
          configurable: true,
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null), label: 'label', value: 'code',
          },
        },
        {
          // 创建时间
          title: this.language.createTime, key: 'createTime',
          width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'},
        },
        {
          // 备注
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}},
        },
      ],
      bordered: false,
      showSearch: false,
      showPagination: true,
      searchReturnType: 'Array',
      operation: [
        {
          // 编辑
          text: this.language.update,
          permissionCode: '02-3-4-4',
          className: 'fiLink-edit',
          handle: (currentIndex: AlarmRemoteModel) => {
            this.$router.navigate(['business/alarm/alarm-remote-notification/update'], {
              queryParams: {id: currentIndex.id},
            }).then();
          },
        },
        {
          text: this.language.deleteHandle,
          permissionCode: '02-3-4-5',
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data: AlarmRemoteModel) => {
            if (data.status === AlarmEnableStatusEnum.enable) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.id;
              if (ids) {
                this.delTemplate([ids]);
              }
            }
          },
        },
      ],
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-4-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-remote-notification/add']).then();
          },
        }, {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-4-5',
          handle: (data: AlarmRemoteModel[]) => {
            if (data.find(item => item.status === AlarmEnableStatusEnum.enable)) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.map(item => item.id);
              if (ids) {
                this.delTemplate(ids);
              }
            }
          },
        },
      ],
      moreButtons: [
        {
          // 启用
          text: this.language.enable,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-4-2',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllEnable,
          handle: (e: AlarmRemoteModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.checkDisableEnable(AlarmEnableStatusEnum.enable);
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          },
        },
        {
          // 禁用
          text: this.language.disable,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-4-3',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllDisable,
          handle: (e: AlarmRemoteModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.checkDisableEnable(AlarmEnableStatusEnum.disable);
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          },
        },
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmForwardRuleLevels') {
          this.queryCondition.sortCondition.sortField = 'alarmLevelId';
        } else if (event.sortField === 'alarmForwardRuleDeviceTypeList') {
          this.queryCondition.sortCondition.sortField = 'deviceTypeId';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData(this.filterEvent);
      },
      handleSearch: (event: FilterCondition[]) => {
        // 重置区域和通知人
        if (!event.length) {
          this.areaList = new AlarmSelectorInitialValueModel();
          // 区域
          this.initAreaConfig();
          // 通知人置空
          this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
          // 设备置空
          this.checkTroubleObject = new AlarmSelectorInitialValueModel();
          // 设施置空
          this.filterObj = new AlarmSelectorInitialValueModel();
          this.initAlarmUserConfig();
          this.filterEvent = null;
          this.selectEquipments = [];
          this.initDeviceObjectConfig();
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          const filterEvent: AlarmRemoteModel = new AlarmRemoteModel();
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
          });
          if (this.areaList && this.areaList.ids && this.areaList.ids.length) {
            // 区域
            filterEvent.areaId = this.areaList.ids;
          }
          if (this.checkAlarmNotifier && this.checkAlarmNotifier.ids && this.checkAlarmNotifier.ids.length) {
            // 通知人
            filterEvent.alarmForwardRuleUserList = this.checkAlarmNotifier.ids;
          }
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      },
    };
  }

  /**
   * 获取告警列表信息
   */
  private refreshData(filterEvent?: AlarmRemoteModel) {
    this.tableConfig.isLoading = true;
    const data = filterEvent ? {'bizCondition': filterEvent} : {'bizCondition': {}};
    data.bizCondition = {
      ...data.bizCondition,
      'sortProperties': this.queryCondition.sortCondition.sortField,
      'sort': this.queryCondition.sortCondition.sortRule,
    };
    data['pageCondition'] = this.queryCondition.pageCondition;
    this.$alarmService.queryAlarmRemote(data).subscribe((res: ResultModel<AlarmRemoteModel[]>) => {
      if (res.code === 0) {
        this.tableConfig.isLoading = false;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
        this.pageBean.pageIndex = res.pageNum;
        const areaIds = [];
        this.dataSet = res.data.map(item => {
          // 通知人
          if (item.alarmForwardRuleUserName && item.alarmForwardRuleUserName.length) {
            item.user = item.alarmForwardRuleUserName.join(',');
          }
          // 区域名称
          item.alarmForwardRuleAreaList.forEach(v => {
            if (areaIds.indexOf(v.areaId) === -1) {
              areaIds.push(v.areaId);
            }
          });
          item.alarmForwardRuleAreaName = [];
          if (item.alarmForwardRuleLevels && item.alarmForwardRuleLevels.length) {
            // 告警级别
            item.alarmForwardRuleLevels.forEach(levels => {
              levels.defaultStyle = this.$alarmStoreService.getAlarmColorByLevel(levels.alarmLevelId);
              levels.style = this.$alarmStoreService.getAlarmColorByLevel(levels.alarmLevelId);
              levels.name = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, levels.alarmLevelId) as string;
            });
          }
          // 设施类型
          if (item.alarmForwardRuleDeviceTypeList && item.alarmForwardRuleDeviceTypeList[0]
            && item.alarmForwardRuleDeviceTypeList[0].deviceTypeId) {
            const resultDeviceData = AlarmUtil.setDeviceTypeList(item.alarmForwardRuleDeviceTypeList, this.$nzI18n);
            item.deviceTypeArr = resultDeviceData.resultInfo;
            item.deviceTypeNames = resultDeviceData.resultNames.join(',');
          }
          // 设备类型
          if (item.alarmForwardRuleEquipmentTypeList && item.alarmForwardRuleEquipmentTypeList[0]
            && item.alarmForwardRuleEquipmentTypeList[0].equipmentType) {
            const resultDeviceData = AlarmUtil.setEquipmentTypeList(item.alarmForwardRuleEquipmentTypeList, 'equipmentType', this.$nzI18n);
            item.equipmentTypeArr = resultDeviceData.resultInfo;
            item.equipmentTypeNames = resultDeviceData.resultNames.join(',');
          }
          // 切换启用禁用权限
          this.switchStatusRole(item);
          // 设施对象
          if (item.alarmForwardRuleDeviceList && item.alarmForwardRuleDeviceList.length > 0) {
            const resultDevice = [];
            item.alarmForwardRuleDeviceList.forEach(name => {
              resultDevice.push(name.deviceName);
            });
            item.deviceNames = resultDevice.join(',');
          }
          // 设备对象
          if (item.alarmForwardRuleEquipmentList && item.alarmForwardRuleEquipmentList.length > 0) {
            const resultEquipment = [];
            item.alarmForwardRuleEquipmentList.forEach(name => {
              resultEquipment.push(name.equipmentName);
            });
            item.equipmentNames = resultEquipment.join(',');
          }
          return item;
        });
        // 根据区域id回显区域名称
        if (areaIds && areaIds.length > 0) {
          AlarmUtil.getAreaName(this.$alarmService, areaIds).then((result: AreaModel[]) => {
            AlarmUtil.joinAlarmForwardRuleAreaName(this.dataSet, result);
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
}
