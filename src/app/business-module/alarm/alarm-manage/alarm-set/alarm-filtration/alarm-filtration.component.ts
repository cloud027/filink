import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {AlarmService} from '../../../share/service/alarm.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../shared-module/model/alarm-selector-config.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {AlarmInventoryEnum} from '../../../share/enum/alarm.enum';
import {AlarmFiltrationModel} from '../../../share/model/alarm-filtration.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import { AlarmEnableStatusEnum } from '../../../share/enum/alarm.enum';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
/**
 * 告警过滤页面
 */
@Component({
  selector: 'alarm-filtration',
  templateUrl: './alarm-filtration.component.html',
  styleUrls: ['./alarm-filtration.component.scss']
})

export class AlarmFiltrationComponent implements OnInit {
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // 表格是否去库存模板
  @ViewChild('isNoStorageTemp') isNoStorageTemp: TemplateRef<any>;
  // 表格过滤条件模板
  @ViewChild('filtrationConditionTemp') filtrationConditionTemp: TemplateRef<any>;
  // 表格告警名称过滤模板
  @ViewChild('alarmName') private alarmName;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 表格数据源
  public dataSet: AlarmFiltrationModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 弹窗数据
  public alarmFilterRuleName: string;
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 过滤条件
  public filterEvent: AlarmFiltrationModel = new AlarmFiltrationModel();
  // 详情弹窗
  public particulars: boolean = false;
  // 启用，禁用数据
  public checkDisableEnableData: AlarmFiltrationModel[] = [];
  // 是否禁启用
  public isStatus = AlarmEnableStatusEnum;
  // 是否库存
  public isInventory = AlarmInventoryEnum;
  // 勾选的告警名称
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 告警对象设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 告警对象弹窗显示
  public equipmentVisible: boolean = false;
  // 告警对象弹窗标题
  public tableTitle: string;
  // 告警对象设备禁止选择
  public forbidSelect: boolean = true;
  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $alarmService: AlarmService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $alarmStoreService: AlarmStoreService) {
  }

  /**
   * 初始化
   */
 public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.tableTitle = this.language.alarmobject;
    // 初始化表格配置
    this.initTableConfig();
    // 查询表格数据
    this.refreshData();
    // 告警名称配置初始化
    this.initAlarmName();
  }

  /**
   * 点击过滤 弹框，显示告警详情
   * param data
   */
  public clickFiltration(data: AlarmFiltrationModel): void {
    this.particulars = true;
    // 告警设备勾选
    if (data.alarmFilterRuleSourceList && data.alarmFilterRuleSourceList.length > 0) {
      this.selectEquipments = data.alarmFilterRuleSourceList.map(item => {
        const selectEquipment = new EquipmentListModel();
        selectEquipment.equipmentId = item;
        return selectEquipment;
      });
    }
    // 详情弹窗数据
    this.alarmFilterRuleName = data.alarmName;
  }

  /**
   * 查看告警对象详情
   */
  public openAlarmObjectDetail() {
    this.equipmentVisible = true;
  }

  /**
   * 批量禁用与启用
   * param {any | any} type
   */
  public checkDisableEnable(type: AlarmEnableStatusEnum) {
    const ids = this.checkDisableEnableData.map(item => item.id);
    this.$alarmService.updateStatus(type, ids)
      .subscribe((res: ResultModel<string>) => {
        if (res.code === 0) {
          this.$message.success(this.language.editAlarmFiltrationEnableStatus);
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
  public clickSwitch(data: AlarmFiltrationModel) {
    if (data && data.id) {
      let statusValue;
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
      this.$alarmService.updateStatus(statusValue, [data.id])
        .subscribe((res: ResultModel<string>) => {
          if (res.code === 0) {
            this.$message.success(this.language.editAlarmFiltrationEnableStatus);
          } else {
            this.$message.error( res.msg);
          }
        });
    }
  }

  /**
   * 是否入库点击，刷新数据
   * param data
   * param {any | any} type
   */
  public clickIsNoStorageTemp(data: AlarmFiltrationModel, type: AlarmInventoryEnum) {
    if (data && data.id) {
      this.$alarmService.updateAlarmStorage(Number(type), [data.id]).subscribe((result: ResultModel<string>) => {
        this.refreshData(this.filterEvent);
      });
    }
  }

  /**
   * 切换权限
   * param item
   */
  public switchStatusRole(item: AlarmFiltrationModel) {
    item.statusName = AlarmUtil.translateDisableAndEnable(this.$nzI18n, item.status);
    // 启/禁用权限
    item.appAccessPermission = item.status === AlarmEnableStatusEnum.disable ? '02-3-3-2' : '02-3-3-3';
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
   * 删除模板
   * param ids
   */
  public delTemplate(ids: string[]) {
    this.$alarmService.deleteAlarmFiltration(ids).subscribe((result: ResultModel<string>) => {
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
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-3',
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      setColumnPlacement: 'bottomCenter',
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: this.language.name, key: 'ruleName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        {
          // 过滤条件
          title: this.language.alarmName,
          key: 'alarmName',
          searchKey: 'alarmFilterRuleNames',
          configurable: true,
          width: 200,
          searchable: true,
          type: 'render',
          searchConfig: {
            type: 'render',
            selectInfo: this.checkAlarmName.alarmNames,
            renderTemplate: this.alarmName
          },
          renderTemplate: this.filtrationConditionTemp,
        },
        {
          title: this.language.opertionUser, key: 'operationUser', width: 120, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.openStatus, key: 'status', width: 150, isShowSort: true,
          searchKey: 'statusArray',
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
              {label: this.language.enable, value: AlarmEnableStatusEnum.enable}
            ]
          },
          handleFilter: ($event) => {
          },
        },
        {
          title: this.language.createTime, key: 'createTime',
          width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 起始时间
          title: this.language.startTime, key: 'beginTime', isShowSort: true,
          width: 180,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 结束时间
          title: this.language.endTime, key: 'endTime', isShowSort: true,
          width: 180,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 是否库存
          title: this.language.isNoStored, key: 'storeDatabase', width: 140, isShowSort: true,
          searchKey: 'storedArray',
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStorageTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.yes, value: AlarmInventoryEnum.yes},
              {label: this.language.no, value: AlarmInventoryEnum.no}
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
          // 详情
          text: this.language.particulars,
          permissionCode: '02-3-3-6',
          className: 'icon-fiLink iconfont fiLink-view-detail',
          handle: (data: AlarmFiltrationModel) => {
            this.clickFiltration(data);
          }
        },
        {
          // 编辑
          text: this.language.update,
          permissionCode: '02-3-3-4',
          className: 'fiLink-edit',
          handle: (currentIndex: AlarmFiltrationModel) => {
            this.$router.navigate(['business/alarm/alarm-filtration/update'], {
              queryParams: {id: currentIndex.id}
            }).then();
          }
        },
        {
          text: this.language.deleteHandle,
          permissionCode: '02-3-3-5',
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data: AlarmFiltrationModel) => {
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
          permissionCode: '02-3-3-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-filtration/add']).then();
          }
        }, {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-3-5',
          handle: (data: AlarmFiltrationModel[]) => {
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
          // 启用
          text: this.language.enable,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-3-2',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllEnable,
          handle: (e: AlarmFiltrationModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.checkDisableEnable(AlarmEnableStatusEnum.enable);
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        },
        {
          // 禁用
          text: this.language.disable,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-3-3',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllDisable,
          handle: (e: AlarmFiltrationModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.checkDisableEnable(AlarmEnableStatusEnum.disable);
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        }
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData(this.filterEvent);
      },
      handleSearch: (event: FilterCondition[]) => {
        if (!event.length) {
          // 清除告警名称和区域
          this.checkAlarmName = new AlarmSelectorInitialValueModel();
          this.filterEvent = null;
          this.initAlarmName();
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          const filterEvent: AlarmFiltrationModel = new AlarmFiltrationModel();
          event.forEach((item, index) => {
            filterEvent[item.filterField] = item.filterValue;
            // 创建时间，起始时间，结束时间筛选
            const searchTimeArr = ['createTime', 'beginTime', 'endTime'];
            if (searchTimeArr.includes(item.filterField)) {
              this.handleSearchTime(event, item.filterField, filterEvent);
            }
            if (this.checkAlarmName && this.checkAlarmName.ids && this.checkAlarmName.ids.length) {
              // 告警名称
              // filterEvent.alarmFilterRuleNameList = this.checkAlarmName.ids;
            }
            if (this.checkAlarmName && this.checkAlarmName.alarmNames && this.checkAlarmName.alarmNames.length) {
              // 告警名称
              filterEvent.alarmFilterRuleNames = this.checkAlarmName.alarmNames;
            }
          });
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      }
    };
  }

  /**
   * 时间过滤处理
   */
  private handleSearchTime(handleEvent: FilterCondition[], searchKey: string, filterEvent: AlarmFiltrationModel): void {
    //  创建时间
    handleEvent.forEach(itemTime => {
      if (itemTime.operator === OperatorEnum.gte) {
        filterEvent[searchKey] = itemTime.filterValue;
      }
      if (itemTime.operator === OperatorEnum.lte) {
        filterEvent[searchKey + 'End'] = itemTime.filterValue;
      }
    });
  }

  /**
   * 获取告警过滤列表信息
   */
  private refreshData(filterEvent?: AlarmFiltrationModel): void {
    this.tableConfig.isLoading = true;
    const data = filterEvent ? {'bizCondition': filterEvent} : {'bizCondition': {}};
    this.queryCondition.bizCondition  = {
      ...data.bizCondition,
      'sortProperties': this.queryCondition.sortCondition.sortField,
      'sort': this.queryCondition.sortCondition.sortRule
    };
    this.$alarmService.queryAlarmFiltration(this.queryCondition).subscribe((res: ResultModel<AlarmFiltrationModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.dataSet = [];
        res.data.forEach(item => {
          item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
          if (item.alarmFilterRuleNames && item.alarmFilterRuleNames.length) {
            item.alarmName = item.alarmFilterRuleNames.join();
          }
          // 切换启用禁用权限
          this.switchStatusRole(item);
          this.dataSet.push(item);
        });
      } else {
        // 请求错误
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 告警名称配置
   */
  private initAlarmName(): void {
    this.alarmNameConfig = {
      clear: !this.checkAlarmName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
      }
    };
  }
}
