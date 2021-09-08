import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmService} from '../../../share/service/alarm.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {AlarmEnableStatusEnum} from '../../../share/enum/alarm.enum';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {AlarmWarningModel} from '../../../share/model/alarm-warning.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {AlarmOperationModel} from '../../../share/model/alarm-operation.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../shared-module/model/alarm-selector-config.model';
import {AlarmLevelEnum} from '../../../../../core-module/enum/alarm/alarm-level.enum';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 告警预警设置
 */
@Component({
  selector: 'app-alarm-warning-setting',
  templateUrl: './alarm-warning-setting.component.html',
  styleUrls: ['./alarm-warning-setting.component.scss']
})
export class AlarmWarningSettingComponent implements OnInit {
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // 越限次数
  @ViewChild('crossCountTemp') crossCountTemp: TemplateRef<any>;
  // 越限时长
  @ViewChild('crossDurationTemp') crossDurationTemp: TemplateRef<any>;
  // 告警名称
  @ViewChild('alarmWarmingTemp') alarmWarmingTemp: TemplateRef<any>;
  // 告警等级
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  public language: AlarmLanguageInterface;
  // 表格数据源
  public dataSet: AlarmWarningModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 是否禁启用
  public isStatus = AlarmEnableStatusEnum;
  // 告警名称配置
  public alarmNameSelectConfig: AlarmSelectorConfigModel;
  // 勾选的告警名称
  private selectAlarmObj: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化语言初始化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表格
    this.initTableConfig();
    this.refreshData();
    this.initAlarmWarningName();
  }

  constructor(
    private $message: FiLinkModalService,
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $alarmStoreService: AlarmStoreService,
  ) { }

  /**
   * 获取当前告警列表信息
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    let index = -1;
    this.queryCondition.filterConditions.forEach((item, i) => {
      if (item.filterField === 'limitNum' || item.filterField === 'limitTime') {
        item.operator = OperatorEnum.lte;
      }
      if (item.filterField === 'alarmCodeList') {
        item.operator = OperatorEnum.in;
        if (!item.filterValue || item.filterValue.length === 0) {
          index = i;
        } else {
          item.filterValue = this.selectAlarmObj.alarmCodes;
        }
      }
    });
    if (index > -1) {
      this.queryCondition.filterConditions.splice(index, 1);
    }
    this.$alarmService.queryWaringList(this.queryCondition).subscribe((result: ResultModel<AlarmWarningModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const list = result.data ? result.data : [];
        list.forEach(item => {
          /*if (item.alarmNameList && item.alarmNameList.length > 0) {
            item.alarmNames = item.alarmNameList.toString();
          }*/
          const arr = [];
          if (item.alarmCodeList && item.alarmCodeList.length) {
            item.alarmCodeList.forEach((v, i) => {
              const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, v);
              if (name) {
                arr.push(name);
              } else {
                arr.push(item.alarmNameList[i]);
              }
            });
            item.alarmNames = arr.toString();
          }
          if (item.alarmWarningLevel) {
            item.alarmWarningLevelName = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, item.alarmWarningLevel);
            item.levelStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmWarningLevel);
          }
          item.isDisabled = false;
          this.switchStatusRole(item);
        });
        this.dataSet = list;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
        this.tableConfig.isLoading = false;
      } else {
        this.$message.error(result.msg);
      }
    }, (err) => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 切换权限
   * param item
   */
  public switchStatusRole(item) {
    item.statusName = AlarmUtil.translateDisableAndEnable(this.$nzI18n, Number(item.status));
    // 启/禁用权限
    // item.appAccessPermission = item.status === AlarmDisableStatusEnum.disable ? '02-3-3-2' : '02-3-3-3';
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
   *  启用和禁用 的开关
   *  param data
   */
  public clickSwitch(data: AlarmWarningModel) {
    data.isDisabled = true;
    const param = new AlarmOperationModel();
    param.idArray = [data.id];
    if (data.status === AlarmEnableStatusEnum.enable) {
      param.status = AlarmEnableStatusEnum.disable;
    } else {
      param.status = AlarmEnableStatusEnum.enable;
    }
    this.$alarmService.batchWarning(param).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        if (data.status === AlarmEnableStatusEnum.enable) {
          data.status = AlarmEnableStatusEnum.disable;
          this.$message.success(this.language.disabledSuccess);
        } else {
          data.status = AlarmEnableStatusEnum.enable;
          this.$message.success(this.language.enabledSuccess);
        }
        data.isDisabled = false;
      } else {
        this.$message.error(result.msg);
        data.isDisabled = false;
      }
    });
  }
  /**
   * 批量禁启用处理
   */
  public checkDisableEnable(data: AlarmWarningModel[], type: AlarmEnableStatusEnum): void {
    const ids = [];
    data.forEach(item => {
      item.isDisabled = true;
      ids.push(item.id);
    });
    const param = new AlarmOperationModel();
    param.status = type;
    param.idArray = ids;
    this.$alarmService.batchWarning(param).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        if (type === AlarmEnableStatusEnum.enable) {
          this.$message.success(this.language.enabledSuccess);
        } else {
          this.$message.success(this.language.disabledSuccess);
        }
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    }, res => {
      data.forEach(item => item.isDisabled = false);
    });
  }

  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-6-0',
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: false,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        {
          // 名称
          title: this.language.name, key: 'alarmWarningSettingName', width: 200,
          configurable: true,
          isShowSort: true, searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '122px'}}
        },
        {
          // 告警代码
          title: this.language.AlarmCode, key: 'alarmWarningCode', width: 150,
          configurable: true,
          isShowSort: true, searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 启用状态
          title: this.language.openStatus, key: 'status', width: 150,
          configurable: true, isShowSort: true,
          type: 'render', searchable: true, searchKey: 'statusArray',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: [
              {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
              {label: this.language.enable, value: AlarmEnableStatusEnum.enable}
            ]
          }
        },
        {
          // 预警等级
          title: this.language.alarmFixedLevel, key: 'alarmWarningLevelName',
          configurable: true, width: 120, searchKey: 'levelArray',
          isShowSort: true, searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmUtil.enumToArray(this.language, AlarmLevelEnum)
          },
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
        },
        {
          // 越限次数
          title: this.language.crossCount, key: 'limitNum', width: 120,
          configurable: true,
          isShowSort: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.crossCountTemp,
          },
        },
        {
          // 越限时常（分）
          title: this.language.crossDuration, key: 'limitTime', width: 120,
          configurable: true,
          isShowSort: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.crossDurationTemp,
          },
        },
        {
          // 越限告警
          title: this.language.crossAlarm, key: 'alarmNames', width: 290,
          configurable: true, searchKey: 'alarmCodeList',
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.alarmWarmingTemp,
          },
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 90, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-6-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-warning-setting/add-alarm-warning'],
              {queryParams: {type: OperateTypeEnum.add}}).then();
          }
        },
        {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-6-3',
          handle: (data: AlarmWarningModel[]) => {
            if (data.find(item => item.status === AlarmEnableStatusEnum.enable)) {
              this.$message.warning(this.language.deleteWars);
            } else {
              const ids = data.map(item => item.id);
              this.deleteWarn(ids);
            }
          }
        }
      ],
      // 更多操作
      moreButtons: [
        {
          // 启用
          text: this.language.enable,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-6-4',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllEnable,
          handle: (e: AlarmWarningModel[]) => {
            if (e && e.length) {
              this.checkDisableEnable(e, AlarmEnableStatusEnum.enable);
            }
          }
        },
        {
          // 禁用
          text: this.language.disable,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-6-4',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllDisable,
          handle: (e: AlarmWarningModel[]) => {
            if (e && e.length) {
              this.checkDisableEnable(e, AlarmEnableStatusEnum.disable);
            }
          }
        }
      ],
      operation: [
        {
          // 修改
          text: this.language.update,
          permissionCode: '02-3-6-2',
          className: 'fiLink-edit',
          handle: (data: AlarmWarningModel) => {
            this.$router.navigate(['business/alarm/alarm-warning-setting/edit-alarm-warning'],
              {queryParams: {type: OperateTypeEnum.update, warnId: data.id}}).then();
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          permissionCode: '02-3-6-3',
          className: 'fiLink-delete red-icon',
          handle: (data: AlarmWarningModel) => {
            if (data.status === AlarmEnableStatusEnum.enable) {
              this.$message.warning(this.language.deleteWars);
            } else {
              this.deleteWarn([data.id]);
            }
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        if (!event.length) {
          this.selectAlarmObj = new AlarmSelectorInitialValueModel();
          this.initAlarmWarningName();
        }
        this.refreshData();
      }
    };
  }


  /**
   * 告警名称配置
   */
  private initAlarmWarningName(): void {
    this.alarmNameSelectConfig = {
      type: AlarmSelectorConfigTypeEnum.table,
      clear: !this.selectAlarmObj.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.selectAlarmObj = event;
      }
    };
  }

  /**
   * 删除
   */
  private deleteWarn(ids: string[]): void {
    this.$alarmService.deleteWarning(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.deleteSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
