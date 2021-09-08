import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from 'src/app/shared-module/model/query-condition.model';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../model/alarm-selector-config.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {AlarmSelectorConfigTypeEnum} from '../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {AlarmNameListModel} from '../../../../../core-module/model/alarm/alarm-name-list.model';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {AlarmLevelEnum} from '../../../../../core-module/enum/alarm/alarm-level.enum';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {TableComponent} from '../../../table/table.component';

/**
 * 告警名称选择器
 */
@Component({
  selector: 'app-alarm-name',
  templateUrl: './alarm-name.component.html',
  styleUrls: ['./alarm-name.component.scss']
})

export class AlarmNameComponent implements OnInit {
  /** 父组件传入的告警名称配置项*/
  @Input() set alarmNameConfig(alarmNameConfig: AlarmSelectorConfigModel) {
    if (alarmNameConfig) {
      this.initAlarmNameTableConfig();
      // 备份配置项
      this.alarmNameConfigBackups = alarmNameConfig;
      // 获取使用类型
      if (this.alarmNameConfigBackups.type) {
        this.useType = this.alarmNameConfigBackups.type;
      } else {
        this.useType = AlarmSelectorConfigTypeEnum.table;
      }
      this.handleInputConfigData();
    }
  }
  /** 判断是否需要添加过滤条件来查询告警名称列表*/
  @Input() isFilter = false;
  /** 表格过滤条件输入框中使用时，传入的过滤条件*/
  @Input() filterCondition: FilterCondition;
  /** 判断是否为单选*/
  @Input() isRadio: boolean = false;
  /** 告警名称中的默认级别模板*/
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  /** 告警名称中的定制级别模板*/
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  /** 单选列模板*/
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  /**列表组件*/
  @ViewChild('restTableComponent') restTableComponent: TableComponent;
  /** 控制是否展示告警名称列表弹框*/
  public isShowAlarmNameList: boolean = false;
  /** 当在表单中使用时，判断点击则展示告警列表的搜索按钮是否可点击*/
  public isDisabledAlarmSearchBtn: boolean = false;
  /** 告警名称列表数据源*/
  public alarmNameListData: AlarmNameListModel[] = [];
  /** 告警国际化*/
  public language: AlarmLanguageInterface;
  /** 公共部分国际化*/
  public commonLanguage: CommonLanguageInterface;
  /** 勾选的告警名称*/
  public checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 勾选的告警名称备份*/
  public checkAlarmNameBackups: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 告警名称表格配置项*/
  public alarmNameTableConfig: TableConfigModel;
  /** 告警名称表格分页参数*/
  public pageBeanName: PageModel = new PageModel();
  /** 该组件被使用的类型 表单/表格*/
  public useType: AlarmSelectorConfigTypeEnum;
  /** 被使用的类型枚举*/
  public alarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum;
  /** 告警级别枚举*/
  public alarmLevelEnum = AlarmLevelEnum;
  /** 告警名称表格查询参数*/
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  /** 父组件传入的告警名称配置项备份*/
  private alarmNameConfigBackups: AlarmSelectorConfigModel;

  constructor(
    public $nzI18n: NzI18nService,
    public $alarmCommonService: AlarmForCommonService,
    public $alarmStoreService: AlarmStoreService
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  ngOnInit() {
    this.initAlarmNameTableConfig();
  }

  /**
   * 点击按钮，展示告警名称选择器
   */
  public showAlarmNameSelector(): void {
    this.isShowAlarmNameList = true;
    this.refreshNameData();
  }

  /**
   * 点击弹框中的确定按钮事件
   */
  public handleConfirm(): void {
    // this.resetParam();
    this.isShowAlarmNameList = false;
    this.checkAlarmName = _.cloneDeep(this.checkAlarmNameBackups);
    if (this.useType === AlarmSelectorConfigTypeEnum.table) {
      this.filterCondition.filterValue = this.checkAlarmName.alarmNames;
      this.filterCondition.filterName = this.checkAlarmName.name;
      this.filterCondition.operator = OperatorEnum.in;
    }
    // 执行父组件中选择了告警名称后的方法
    this.alarmNameConfigBackups.handledCheckedFun(this.checkAlarmName);
  }

  /**
   * 关闭弹框事件/取消按钮事件
   */
  public closeAlarmNameSelector(): void {
    this.checkAlarmNameBackups = _.cloneDeep(this.checkAlarmName);
    // this.resetParam();
    this.isShowAlarmNameList = false;
  }

  /**
   * 告警名称列表 弹框分页
   * param event
   */
  public pageNameChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshNameData();
  }

  /**
   * 清空按钮事件
   * 选择器里面清空已选数据
   * 只清空选择器数据
   */
  public clearSelectData(): void {
    this.checkAlarmNameBackups = new AlarmSelectorInitialValueModel();
    this.refreshNameData();
  }
  /**
   * 选择设施(单选时)
   * param event
   * param data
   */
  public selectedChange(data: AlarmNameListModel): void {
    this.checkAlarmNameBackups = new AlarmSelectorInitialValueModel();
    this.checkData(data);
  }

  /**
   * 勾选表格中的数据时，对该条勾选的数据的名称做拼接，并记录该条数据的id
   * param currentItem
   */
  private checkData(currentItem: AlarmNameListModel): void {
    this.checkAlarmNameBackups.ids.push(currentItem.id);
    this.checkAlarmNameBackups.alarmNames.push(currentItem.alarmName);
    if (this.checkAlarmNameBackups.alarmCodes) {
      this.checkAlarmNameBackups.alarmCodes.push(currentItem.alarmCode);
    }
    const names = this.checkAlarmNameBackups.name + ',' + currentItem.alarmName;
    this.checkAlarmNameBackups.name = this.checkAlarmNameBackups.name === '' ? currentItem.alarmName : names;
  }

  /**
   * 取消勾选事件
   * param currentItem
   */
  private cancelCheck(currentItem: AlarmNameListModel): void {
    // 删除保存在记录中的id
    this.checkAlarmNameBackups.ids = this.checkAlarmNameBackups.ids.filter(id => {
      return currentItem.id !== id && id;
    });
    this.checkAlarmNameBackups.alarmNames = this.checkAlarmNameBackups.alarmNames.filter(v => {
      return currentItem.alarmName !== v && v;
    });
    // 删除
    if (this.checkAlarmNameBackups.alarmCodes) {
      this.checkAlarmNameBackups.alarmCodes = this.checkAlarmNameBackups.alarmCodes.filter(v => {
        return currentItem.alarmCode !== v && v;
      });
    }
    // 删除拼接在告警名称中该条数据的告警名称，并重新拼接
    const names = this.checkAlarmNameBackups.name.split(',');
    this.checkAlarmNameBackups.name = names.filter(name => currentItem.alarmName !== name && name).join(',');
  }

  /**
   * 查询告警名称选择器列表数据
   */
  private refreshNameData(): void {
    this.alarmNameTableConfig.isLoading = true;
    if (this.isFilter) {
      // 判断过滤条件中是否存在对alarmCode的过滤，若不存在则添加
      if (!this.queryCondition.filterConditions.some(item => item.filterField === 'alarmCode' && item.operator === OperatorEnum.neq)) {
        this.queryCondition.filterConditions.push(new FilterCondition('alarmCode', OperatorEnum.neq, 'orderOutOfTime'));
      }
    }
    // 调用查询接口，获取告警名称列表数据
    this.$alarmCommonService.queryAlarmCurrentSetList(this.queryCondition).subscribe((res) => {
      this.pageBeanName = new PageModel(res.size, res.pageNum, res.totalCount);
      this.alarmNameTableConfig.isLoading = false;
      this.alarmNameListData = res.data.map(item => {
        item.defaultStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmDefaultLevel);
        item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmLevel);
        const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.alarmCode);
        if (name) {
          item.alarmName = name;
        }
        this.checkAlarmNameBackups.ids.forEach(_item => {
          if (item.id === _item) {
            // 用于回显
            item.checked = true;
          }
        });
        return item;
      });
    }, () => {
      this.alarmNameTableConfig.isLoading = false;
    });
  }

  /**
   * 对传入的配置项做相应的处理
   */
  private handleInputConfigData(): void {
    // 对初始值(需要回显的数据)做备份
    if (this.alarmNameConfigBackups.initialValue && this.alarmNameConfigBackups.initialValue.ids
      && this.alarmNameConfigBackups.initialValue.ids.length) {
      this.checkAlarmName = _.cloneDeep(this.alarmNameConfigBackups.initialValue);
      this.checkAlarmNameBackups = _.cloneDeep(this.alarmNameConfigBackups.initialValue);
    }
    // 控制搜索按钮是否可点击
    this.isDisabledAlarmSearchBtn = this.alarmNameConfigBackups.disabled;
    if (this.alarmNameConfigBackups.clear) {
      // 清空选中的数据
      this.queryCondition.pageCondition.pageNum = 1;
      this.checkAlarmName = new AlarmSelectorInitialValueModel();
      this.checkAlarmNameBackups = new AlarmSelectorInitialValueModel();
    }
  }

  /**
   * 告警名称弹框宽度配置
   * 告警名称列表表格初始化配置
   */
  private initAlarmNameTableConfig(): void {
    this.alarmNameTableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '820', y: '450px'},
      columnConfig: [
        // isRaido为true时，使用单选框，否则为复选框
        /**
        this.isRadio ? {type: 'render', key: 'selectedTroubleId', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50, renderTemplate: this.radioTemp} :
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50},
        */
        {
          type: this.isRadio ? 'render' : 'select',
          key: 'selectedTroubleId',
          width: 50, title: '',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          renderTemplate: this.isRadio ? this.radioTemp : null
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '50px'}}
        },
        // 告警名称
        {
          title: this.language.alarmName, key: 'alarmName', isShowSort: true,
          searchable: true, width: 180,
          searchConfig: {type: 'input'}
        },
        // 告警级别
        {
          title: this.language.alarmDefaultLevel, key: 'alarmDefaultLevel',
          searchable: true, isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null),
            label: 'label', value: 'code'

          },
        },
        // 定制级别
        {
          title: this.language.alarmLevel, key: 'alarmLevel',
          searchable: true, minWidth: 180,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null),
            label: 'label', value: 'code'
          },
        },
        {
          title: this.language.operate, searchable: true,
          width: 100,
          searchConfig: {type: 'operate'}, key: '',
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [],
      handleSelect: (data: AlarmNameListModel[], currentItem: AlarmNameListModel) => {
        if (!currentItem) {
          // 当前页面全选 获取全部取消时
          if (data && data.length) {
            data.forEach(checkData => {
              if (this.checkAlarmNameBackups.ids.indexOf(checkData.id) === -1) {
                // 不存在时 添加进去
                this.checkData(checkData);
              }
            });
          } else {
            // 取消当前页面的全部勾选
            this.alarmNameListData.forEach(item => {
              if (this.checkAlarmNameBackups.ids.indexOf(item.id) !== -1) {
                // 当该条数据存在于 勾选信息中时 将其移除
                this.cancelCheck(item);
              }
            });
          }
        } else {
          if (currentItem.checked) {
            // 勾选
            this.checkData(currentItem);
          } else {
            // 取消勾选
            this.cancelCheck(currentItem);
          }
        }

      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        if (event.length) {
          const obj = {};
          event.forEach(item => {
            obj[item.filterField] = item.filterValue;
          });
        }
        if (this.isFilter) {
          // 若需要过滤，则添加过滤条件：告警代码不等于'orderOutOfTime'(工单超时)
          event.push({filterValue: 'orderOutOfTime', filterField: 'alarmCode', operator: OperatorEnum.neq});
        }
        this.queryCondition.filterConditions = event;
        this.refreshNameData();
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshNameData();
      },
    };
  }
  /**
   * 重置查询条件
   */
  private resetParam(): void {
    this.restTableComponent.handleRest();
    this.alarmNameListData = [];
    this.restTableComponent.queryTerm = null;
    this.restTableComponent.tableQueryTermStoreService.clearQueryTerm();
  }
}
