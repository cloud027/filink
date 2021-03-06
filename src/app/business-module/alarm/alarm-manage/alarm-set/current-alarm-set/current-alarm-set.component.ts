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
 * ???????????? ??????????????????
 */
@Component({
  selector: 'app-current-alarm-set',
  templateUrl: './current-alarm-set.component.html',
  styleUrls: ['./current-alarm-set.component.scss']
})
export class CurrentAlarmSetComponent implements OnInit {
  // ??????????????????????????????
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('alarmConfirmTemp') alarmConfirmTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('alarmName') private alarmName;
  // ???????????????
  public dataSet: AlarmNameListModel[] = [];
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ???????????????
  public language: AlarmLanguageInterface;
  // ??????
  public modalTitle: string;
  // ??????????????????
  public isVisibleEdit: boolean = false;
  // ???????????????????????????
  public tableColumnEdit: FormItem[];
  // ?????????????????????
  public isLoading: boolean = false;
  // ??????????????????
  public alarmNameConfig: AlarmSelectorConfigModel;
  // ?????????????????????
  public isCurrentAlarmSet: boolean;
  // ??????????????????
  public alarmLevelEnum = AlarmLevelEnum;
  // ???????????????
  public languageEnum = LanguageEnum;
  // ????????????????????????
  public alarmIsConfirmEnum = AlarmIsConfirmEnum;
  // ????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????
  private modalType: OperateTypeEnum = OperateTypeEnum.add;
  // ????????????
  private alarmLevelArray: SelectModel[] = [];
  // ????????????????????????
  private formStatusEdit: FormOperate;
  // ????????????
  private alarmTypeList: SelectModel[] = [];
  // ????????????List??????
  private editData: AlarmNameListModel;
  // ?????????????????????
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????id
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
   * ?????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ????????????
    this.getAlarmType();
    // ????????????
    this.initAlarmName();
    // ?????????????????????
    this.initTableConfig();
    // ???????????????
    this.initEditForm();
    // ??????????????????
    this.refreshData();
  }

  /**
   * ??????????????????
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ????????????????????????????????????
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$alarmForCommonService.queryAlarmCurrentSetList(this.queryCondition).subscribe((res: ResultModel<AlarmNameListModel[]>) => {
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
      this.tableConfig.isLoading = false;
      this.dataSet = res.data.map(item => {
        // ????????????
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
   *  ??????????????????
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
   * ?????????????????????????????????
   */
  public clearData(): void {
    this.checkAlarmName = new AlarmSelectorInitialValueModel();
    this.initAlarmName();
  }

  /********* ???????????? ??????????????? **********/
  // /**
  //  * ??????????????????
  //  */
  // handleFilter(filters) {
  //   const filterEvent = [];
  //   filters.forEach(item => {
  //     switch (item.filterField) {
  //       case 'alarmName':
  //         // ????????????
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
   * ??????????????????
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
   * ??????????????????????????????
   * param event
   */
  public formInstanceSecond(event: { instance: FormOperate }) {
    this.formStatusEdit = event.instance;
    this.formStatusEdit.group.statusChanges.subscribe(() => {
      this.isCurrentAlarmSet = this.formStatusEdit.getValid();
    });
  }

  /**
   * ??????????????????
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
   * ??????????????????
   */
  public editHandleCancel(): void {
    this.isVisibleEdit = false;
    this.alarmLevelArray = [];
  }

  /**
   * ?????????????????????
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
          // ????????????
          title: this.language.alarmName, key: 'alarmName', width: width,
          configurable: true,
          isShowSort: true,
          searchable: true,
          /***** ??????????????? ???????????? ********/
          // searchConfig: {
          //   type: 'render',
          //   renderTemplate: this.alarmName
          // },
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '122px'}}
        },
        {
          // ????????????
          title: this.language.AlarmCode, key: 'alarmCode', width: width,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // ????????????
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
          // ??????????????????
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
          // ????????????
          title: this.language.AlarmType, key: 'alarmClassification', width: width, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'alarmClassification',
          searchConfig: {
            type: 'select', selectType: 'multiple',
          },
        },
        {
          // ????????????
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
          // ??????
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-1-2',
          handle: () => {
            this.$router.navigate(['business/alarm/add-alarm-set']).then();
          }
        },
        {
          // ??????
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
          // ?????????????????????????????????
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
            // ????????????????????????????????????
            this.$alarmService.queryAlarmLevelSetById(this.alarmId).subscribe((res: ResultModel<AlarmNameListModel>) => {
              const item = res.data[0];
              this.editData = item;
              // ?????????????????????
              this.formStatusEdit.group.controls['alarmName'].disable();
              this.formStatusEdit.group.controls['alarmDefaultLevel'].disable();
              this.formStatusEdit.group.controls['alarmCode'].disable();
              this.formStatusEdit.resetData(item);
              this.isVisibleEdit = true;
            });
          }
        },
        {
          // ??????
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
   * ????????????
   */
  private getAlarmType(): void {
    // ??????????????????
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
  }
  /**
   * ??????
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
