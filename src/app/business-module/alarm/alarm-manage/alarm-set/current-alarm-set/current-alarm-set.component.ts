import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {AlarmNameListModel} from '../../../../../core-module/model/alarm/alarm-name-list.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../shared-module/model/alarm-selector-config.model';
import {AlarmSetFormUtil} from '../../../share/util/alarm-set-form.util';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {AlarmService} from '../../../share/service/alarm.service';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm/alarm-for-common.service';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {AlarmLevelEnum} from '../../../../../core-module/enum/alarm/alarm-level.enum';
import {AlarmIsConfirmEnum} from '../../../share/enum/alarm.enum';
declare const $: any;
/**
 * 告警设置 当前告警设置
 */
@Component({
  selector: 'app-current-alarm-set',
  templateUrl: './current-alarm-set.component.html',
  styleUrls: ['./current-alarm-set.component.scss']
})
export class CurrentAlarmSetComponent implements OnInit {
  // 表格告警级别过滤模板
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  // 表格定制级别过滤模板
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // 表格确认状态过滤模板
  @ViewChild('alarmConfirmTemp') alarmConfirmTemp: TemplateRef<any>;
  // 告警名称
  @ViewChild('alarmName') private alarmName;
  // 表格数据源
  public dataSet: AlarmNameListModel[] = [];
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 标题
  public modalTitle: string;
  // 编辑页面弹窗
  public isVisibleEdit: boolean = false;
  // 告警编辑页面表单项
  public tableColumnEdit: FormItem[];
  // 保存按钮加载中
  public isLoading: boolean = false;
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 提交按钮禁启用
  public isCurrentAlarmSet: boolean;
  // 告警等级枚举
  public alarmLevelEnum = AlarmLevelEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 是否自动确认枚举
  public alarmIsConfirmEnum = AlarmIsConfirmEnum;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 类型
  private modalType: OperateTypeEnum = OperateTypeEnum.add;
  // 告警级别
  private alarmLevelArray: SelectModel[] = [];
  // 告警编辑表单实例
  private formStatusEdit: FormOperate;
  // 告警类别
  private alarmTypeList: SelectModel[] = [];
  // 告警名称List模型
  private editData: AlarmNameListModel;
  // 勾选的告警名称
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 告警id
  private alarmId: string = '';

  constructor(
    private $message: FiLinkModalService,
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $alarmForCommonService: AlarmForCommonService,
    private $ruleUtil: RuleUtil,
    private $alarmStoreService: AlarmStoreService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 告警类别
    this.getAlarmType();
    // 告警名称
    this.initAlarmName();
    // 初始化表格配置
    this.initTableConfig();
    // 初始化表单
    this.initEditForm();
    // 查询列表数据
    this.refreshData();
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
   * 获取当前告警设置列表信息
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$alarmForCommonService.queryAlarmCurrentSetList(this.queryCondition).subscribe((res: ResultModel<AlarmNameListModel[]>) => {
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
      this.tableConfig.isLoading = false;
      this.dataSet = res.data.map(item => {
        // 等级样式
        item.defaultStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmDefaultLevel);
        item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmLevel);
        item.alarmClassification = AlarmForCommonUtil.showAlarmTypeInfo(this.alarmTypeList, item.alarmClassification);
        const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.alarmCode);
        if (name) {
          item.alarmName = name;
        }
        return item;
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   *  告警名称配置
   */
  public initAlarmName(): void {
    this.alarmNameConfig = {
      clear: !this.checkAlarmName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
      }
    };
  }


  /**
   * 区域告警等模板数据清除
   */
  public clearData(): void {
    this.checkAlarmName = new AlarmSelectorInitialValueModel();
    this.initAlarmName();
  }

  /********* 暂不删除 一期是弹框 **********/
  // /**
  //  * 过滤条件处理
  //  */
  // handleFilter(filters) {
  //   const filterEvent = [];
  //   filters.forEach(item => {
  //     switch (item.filterField) {
  //       case 'alarmName':
  //         // 告警名称
  //         if (this.checkAlarmName.name) {
  //           filterEvent.push({
  //             'filterField': 'id',
  //             'filterValue': this.checkAlarmName.ids,
  //             'operator': 'in',
  //           });
  //         }
  //         break;
  //       default:
  //         filterEvent.push(item);
  //     }
  //   });
  //   return filterEvent;
  // }
  /**
   * 编辑告警设置
   */
  public initEditForm(): void {
    this.tableColumnEdit = AlarmSetFormUtil.initEditForm(
      this.language,
      this.commonLanguage,
      this.$ruleUtil,
      this.$alarmService,
      this.alarmLevelArray,
      this.alarmTypeList
    );
  }

  /**
   * 告警编辑弹窗表单实例
   * param event
   */
  public formInstanceSecond(event: { instance: FormOperate }) {
    this.formStatusEdit = event.instance;
    this.formStatusEdit.group.statusChanges.subscribe(() => {
      this.isCurrentAlarmSet = this.formStatusEdit.getValid();
    });
  }

  /**
   * 编辑告警设置
   */
  public editHandle(): void {
    this.isLoading = true;
    const resultData: AlarmNameListModel = this.formStatusEdit.getData();
    resultData.alarmCode = this.editData.alarmCode;
    resultData.alarmDefaultLevel = this.editData.alarmDefaultLevel;
    resultData.id = this.alarmId;
    this.$alarmService.updateAlarmCurrentSet(resultData).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.isVisibleEdit = false;
        this.refreshData();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 告警编辑取消
   */
  public editHandleCancel(): void {
    this.isVisibleEdit = false;
    this.alarmLevelArray = [];
  }

  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    const width = ($('.current-alarm-set-box').width() - 124) / 7;
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-1',
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1000px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        {
          // 告警名称
          title: this.language.alarmName, key: 'alarmName', width: width,
          configurable: true,
          isShowSort: true,
          searchable: true,
          /***** 一期是弹窗 暂不删除 ********/
          // searchConfig: {
          //   type: 'render',
          //   renderTemplate: this.alarmName
          // },
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '122px'}}
        },
        {
          // 告警代码
          title: this.language.AlarmCode, key: 'alarmCode', width: width,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 告警级别
          title: this.language.alarmDefaultLevel, key: 'alarmDefaultLevel', width: width,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null), label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
        },
        {
          // 告警定制级别
          title: this.language.alarmLevel, key: 'alarmLevel', width: width,
          configurable: true,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null), label: 'label', value: 'code'
          },
        },
        {
          // 告警类别
          title: this.language.AlarmType, key: 'alarmClassification', width: width, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'alarmClassification',
          searchConfig: {
            type: 'select', selectType: 'multiple',
          },
        },
        {
          // 自动确认
          title: this.language.alarmAutomaticConfirmation, key: 'alarmAutomaticConfirmation', width: width,
          configurable: true,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmConfirmTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.yes, value: AlarmIsConfirmEnum.yes},
              {label: this.language.no, value: AlarmIsConfirmEnum.no},
            ]
          }
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 72, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'array',
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-1-2',
          handle: () => {
            this.$router.navigate(['business/alarm/add-alarm-set']).then();
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
          permissionCode: '02-3-1-3',
          handle: (data: AlarmNameListModel[]) => {
            const ids = data.map(item => item.id);
            if (ids) {
              this.delAlarmSet(ids);
            }
          }
        },
        {
          // 跳转到告警级别设置页面
          text: this.language.alarmLevelSet,
          className: 'alarm-level-set-btn',
          iconClassName: 'fiLink-setup',
          permissionCode: '02-3-1-4',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-level-set']).then();
          }
        }
      ],
      operation: [
        {
          text: this.language.update,
          permissionCode: '02-3-1-1',
          className: 'iconfont fiLink-edit',
          handle: (data: AlarmNameListModel) => {
            this.alarmLevelArray = [];
            AlarmUtil.queryAlarmLevel(this.$alarmService).then((list: SelectModel[]) => {
               list.forEach(item => {
                 this.alarmLevelArray.push({
                   label: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, item.value),
                   code: item.value,
                   value: item.value
                 });
               });
            });
            this.initEditForm();
            this.modalTitle = this.language.editAlertSettings;
            this.modalType = OperateTypeEnum.update;
            this.alarmId = data.id;
            // 当前告警设置弹窗数据回显
            this.$alarmService.queryAlarmLevelSetById(this.alarmId).subscribe((res: ResultModel<AlarmNameListModel>) => {
              const item = res.data[0];
              this.editData = item;
              // 控制表单项禁用
              this.formStatusEdit.group.controls['alarmName'].disable();
              this.formStatusEdit.group.controls['alarmDefaultLevel'].disable();
              this.formStatusEdit.group.controls['alarmCode'].disable();
              this.formStatusEdit.resetData(item);
              this.isVisibleEdit = true;
            });
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          permissionCode: '02-3-1-3',
          className: 'fiLink-delete red-icon',
          handle: (data: AlarmNameListModel) => {
            this.tableConfig.isLoading = false;
            const ids = data.id;
            if (ids) {
              this.delAlarmSet([ids]);
            }
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      openTableSearch: () => {
        this.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item.searchConfig.selectInfo = this.alarmTypeList;
          }
        });
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.filterConditions = [];
        if (!event.length) {
          this.clearData();
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          this.pageBean = new PageModel(this.queryCondition.pageCondition.pageSize, 1, 1);
          this.queryCondition.filterConditions = event;
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: this.pageBean.pageIndex};
          this.refreshData();
        }
      }
    };
  }
  /**
   * 告警类别
   */
  private getAlarmType(): void {
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
  }
  /**
   * 删除
   */
  private delAlarmSet(ids: string[]): void {
    this.$alarmService.deleteAlarmSet(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.success(this.commonLanguage.operateSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
