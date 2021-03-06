import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {NzI18nService} from 'ng-zorro-antd';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {Router} from '@angular/router';
import {ApplicationService} from '../../../share/service/application.service';
import {AlarmLevelModel} from '../../../share/model/lighting.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {ExecStatusConst} from '../../../share/const/application-system.const';
import {LightIntensityModel} from '../../../share/model/light.intensity.model';
import {AlarmModel} from '../../../share/model/alarm.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {StrategyStatusEnum, SwitchStatus} from '../../../share/enum/policy.enum';
import {InstructUtil} from '../../../share/util/instruct-util';
import {StrategyListModel} from '../../../share/model/policy.control.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FilterSelectEnum} from '../../../../../shared-module/enum/operator.enum';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {AlarmColorUtil} from '../../../share/util/alarm-color-util';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import * as lodash from 'lodash';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {AlarmForCommonService} from '../../../../../core-module/api-service';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {SunriseOrSunsetEnum} from '../../../share/enum/sunrise-or-sunset.enum';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public stepsFirstParams: StrategyListModel = new StrategyListModel();
  @Output()
  public strategyDetailValidChange = new EventEmitter<boolean>();
  // ???????????????
  @ViewChild('radioReportTemp') radioReportTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  //  ????????????
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('alarmTypeTemp') alarmTypeTemp: TemplateRef<any>;
  //  ????????????
  @ViewChild('alarmConfirmTemp') alarmConfirmTemp: TemplateRef<HTMLDocument>;
  // ??????
  public dateRange: Array<Date>;
  // ????????????
  public isEditIndex: number = -1;
  // ???????????????id
  public selectedEquipmentId: string = '';
  // ?????????id
  public selectedReportId: string = '';
  // ???????????????
  public selectEquipment: EquipmentListModel = new EquipmentListModel();
  // ???????????????
  public selectReport: AlarmModel = new AlarmModel();
  // ????????????
  public execStatus = ExecStatusConst;
  public switchStatus = SwitchStatus;
  // ????????????
  public instructLightList = [];
  // ????????????
  public params: LightIntensityModel = new LightIntensityModel({});
  // ??????????????????
  public typeStatus: SelectModel = new SelectModel();
  // ???????????????
  public alarmName: string = '';
  // ??????????????????
  public isShowDetails: boolean = false;
  // ????????????
  public isStrategy: boolean = false;
  // ????????????
  public isSource: boolean = false;
  // ??????????????????
  public reportData: AlarmListModel[] = [];
  // ????????????
  public alarmTypeList: SelectModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public eventTableConfig: TableConfigModel;
  // ???????????????????????????
  public multiEquipmentTable: TableConfigModel;
  // ???????????????
  public language: OnlineLanguageInterface;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ???????????????
  public alarmLanguage: AlarmLanguageInterface;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public reportQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public sunriseOrSunsetEnum = SunriseOrSunsetEnum;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public filterSelect = Object.entries(FilterSelectEnum);
  // ???????????????
  public max: number = 99;
  // ???????????????
  public min: number = 1;

  constructor(
    // ???????????????
    public $nzI18n: NzI18nService,
    private $alarmService: AlarmForCommonService,
    // ??????
    private $message: FiLinkModalService,
    // ??????
    public $router: Router,
    // ????????????
    public $applicationService: ApplicationService,
  ) {
    // ?????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.initTableConfig();
    this.initEventTable();
    // ????????????
    this.getAlarmTypeList();
    this.initMultiEquipment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.stepsFirstParams.instructLightList) {
      this.instructLightList = this.stepsFirstParams.instructLightList;
      InstructUtil.instructLight(this.instructLightList, this.languageTable);
      Promise.resolve().then(() => {
        this.strategyDetailValid();
      });
    }
  }

  /**
   * ??????
   */
  public ngOnDestroy(): void {
    this.radioReportTemp = null;
    this.alarmDefaultLevelTemp = null;
    this.alarmLevelTemp = null;
    this.alarmTypeTemp = null;
    this.alarmConfirmTemp = null;
  }

  /**
   * ????????????
   * @ param result
   */
  public onChange(result: number[]): void {
    this.params.startTime = result[0];
    this.params.endTime = result[1];
  }

  /**
   * ??????????????????
   * @ param event
   */
  public reportPageChange(event: PageModel): void {
    this.reportQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.reportQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getAlarmLevelList();
  }

  /**
   * ????????????
   */
  public getAlarmTypeList(): void {
    this.$alarmService.getAlarmTypeList().subscribe((res: ResultModel<SelectModel[]>) => {
      if (res.code === 0) {
        const data = res.data;
        // ?????????
        const resultData = data.map(item => {
          return {label: String(item.value), code: item.key, value: item.key};
        });
        // ??????????????????
        if (data && data.length > 0) {
          data.forEach(item => {
            this.typeStatus[item.key] = item.value;
          });
        }
        this.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item['searchConfig']['selectInfo'] = resultData;
          }
        });
        this.alarmTypeList = resultData;
      }
    });
  }

  /**
   * ???????????????
   * param event
   * param data
   */
  public selectedReportChange(event: string, data: AlarmLevelModel): void {
    this.selectReport.alarmName = data.alarmName;
    this.selectReport.id = data.id;
  }

  /**
   * ??????????????????
   * param event
   */
  public switchLightChange(event) {
    // ???????????????????????????????????????
    // ?????????????????????????????????????????????0
    if (this.params.switchLight === SwitchStatus.off) {
      this.min = 0;
      this.params.light = 0;
    } else {
      // ?????????????????????????????????????????????100??????????????????1~100
      this.max = 100;
      this.min = 1;
      this.params.light = 100;
    }
  }

  handleSwitchLightClear() {
    // ??????????????????????????????????????????1~99
    this.params.switchLight = null;
    this.params.light = null;
    this.max = 99;
    this.min = 1;
  }

  handleLightClose() {
    this.params.light = null;
  }

  /**
   * ??????????????????
   * param event
   */
  public lightSliderChange(event) {
    // ?????????????????????????????????????????????
    if (this.params.switchLight === SwitchStatus.off) {
      this.params.switchLight = null;
    }
  }

  /**
   * ????????????
   */
  public getAlarmLevelList(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.queryAlarmNamePage(this.reportQueryCondition).subscribe((res: ResultModel<AlarmListModel[]>) => {
      if (res.code === 0) {
        this.tableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.reportData = data || [];
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        if (this.reportData.length) {
          AlarmColorUtil.alarmFmt(this.reportData, this.alarmLanguage, this.$nzI18n);
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ??????
   */
  public handleCancel(): void {
    this.isStrategy = false;
    this.isSource = false;
  }

  /**
   * ????????????
   */
  public handleClickStrategy(): void {
    this.isStrategy = true;
    this.selectEquipment.equipmentId = this.params.sensor;
  }

  /**
   * ?????????
   */
  public handleSource(): void {
    this.isSource = true;
    this.selectReport.alarmName = this.params.refObjectName;
    this.selectReport.id = this.params.alarmId;
    if (!this.reportData.length) {
      this.getAlarmLevelList();
    }
  }

  /**
   * ??????????????????
   */
  public handleEquipmentOk(selectEquipment): void {
    this.params.sensor = selectEquipment.equipmentId;
    this.params.sensorName = selectEquipment.equipmentName;
    this.isStrategy = false;
  }

  /**
   * ????????????
   */
  public instructLightEdit(index: number): void {
    this.isEditIndex = index;
    this.params = lodash.cloneDeep(this.instructLightList[index]);
    this.selectEquipment.equipmentName = this.params.sensorName;
    this.alarmName = StrategyStatusEnum.lighting;
    this.isShowDetails = true;
  }


  /**
   * ???????????????
   */
  public handleReportOk(): void {
    this.params.refType = StrategyStatusEnum.lighting;
    this.params.alarmId = this.selectReport.id;
    this.params.refObjectName = this.selectReport.alarmName;
    this.isSource = false;
  }

  /**
   * ????????????
   */
  public handSave(): void {
    if (this.params.lightIntensity) {
      const value = String(this.params.lightIntensity);
      if (value.length > 0 && !/^[1-9]\d*$/.test(value)) {
        this.$message.warning(this.languageTable.equipmentTable.strategyLightIntensity);
        return;
      }
    }
    if (this.params.sensorName && !this.params.lightIntensity) {
      this.$message.warning(this.languageTable.strategyList.lightValueErrorTip);
      return;
    }
    if (this.params.endTime && !this.params.startTime) {
      this.$message.warning(this.languageTable.strategyList.onlyEndTime);
      return;
    }
    // ?????????????????????????????????
    if (!this.params.endTime && this.params.startTime && this.params.switchLight === SwitchStatus.off) {
      this.$message.warning(this.languageTable.strategyList.canNotChooseOff);
      return;
    }

    // ???????????????????????????????????????
    let actionKey;
    if (this.params.sunriseOrSunset === SunriseOrSunsetEnum.custom) {
      actionKey = ['startTime', 'endTime', 'alarmId', 'sensor'];
    } else {
      actionKey = ['startTime', 'sunriseOrSunset', 'sensor'];
    }
    if (!actionKey.some(item => this.params[item])) {
      return;
    }
    if (!this.params.switchLight && this.params.light === null) {
      return;
    }

    // ????????????????????????????????????????????????(????????????????????????????????????????????????????????????)
    if (this.isOperationConflict()) {
      return;
    }

    this.params.sensorName = this.selectEquipment.equipmentName;
    // ????????????
    if (this.isEditIndex !== -1) {
      this.instructLightList.splice(this.isEditIndex, 1, lodash.cloneDeep(this.params));
      this.instructLightList = this.instructLightList.slice();
    } else {
      // ???????????????????????????id
      this.params.instructId = CommonUtil.getUUid();
      this.instructLightList.splice(this.instructLightList.length, 0, lodash.cloneDeep(this.params));
      this.instructLightList = this.instructLightList.slice();
      this.alarmName = '';
    }
    this.params = new LightIntensityModel({});
    InstructUtil.instructLight(this.instructLightList, this.languageTable);
    this.stepsFirstParams.instructLightList = this.instructLightList;
    this.isShowDetails = false;
    this.isEditIndex = -1;
    this.strategyDetailValid();

  }

  public handleClose(): void {
    this.isShowDetails = false;
    this.isEditIndex = -1;
    this.params = new LightIntensityModel({});
  }

  /**
   * ??????????????????(?????????????????????????????????)
   */
  isOperationConflict() {
    return this.stepsFirstParams.instructLightList.some(item => {
      if (item.instructId && this.params.instructId && item.instructId === this.params.instructId) {
        return false;
      }
      // ??????????????????????????????????????????????????????
      if (item.startTime && item.endTime && this.params.startTime && this.params.endTime) {
        // ??????????????????
        if (item.startTime <= this.params.endTime && item.endTime >= this.params.startTime) {
          return this.judgeIfSwitchLight(item);
        }
      }

      if (this.params.startTime && !this.params.endTime && item.startTime && item.endTime) {
        // ?????????????????????????????? ????????????????????????????????????
        if (item.startTime <= this.params.startTime && this.params.startTime <= item.endTime) {
          return this.judgeIfSwitchLight(item);
        }
      }

      if (this.params.startTime && !this.params.endTime && item.startTime && !item.endTime) {
        // ???????????????????????????????????????????????????????????? ??????????????????????????????????????????
        if (this.params.startTime === item.startTime) {
          this.$message.warning(this.languageTable.strategyList.conflictTip);
          return true;
        } else {
          return  false;
        }
      }

      if (this.params.startTime && this.params.endTime && item.startTime && !item.endTime) {
        // ???????????????????????????, ?????????????????????????????? ,???????????????
        if (this.params.startTime <= item.startTime && item.startTime <= this.params.endTime) {
          return this.judgeIfSwitchLight(item);
        }
      }
    });
  }

  /**
   * ???????????????????????????
   * @item ?????????????????????
   */
  private judgeIfSwitchLight(item): boolean {
    if (this.params.switchLight === null && this.params.light) {
      // ??????????????????????????????????????????
      return false;
    } else if (this.params.switchLight && this.params.light !== null && item.light && item.switchLight === null) {
      // ???????????????????????????????????????????????????????????????
      return false;
    } else {
      // ????????????????????????????????????
      this.$message.warning(this.languageTable.strategyList.sameTimeErrorTip);
      return true;
    }
  }

  /**
   * ??????????????????????????????
   */
  private strategyDetailValid() {
    this.strategyDetailValidChange.emit(Boolean(this.stepsFirstParams.instructLightList.length));
  }

  /**
   * ?????????????????????
   */
  private initMultiEquipment(): void {
    this.multiEquipmentTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '500px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        // ??????
        {
          title: this.languageTable.strategyList.timeInterval,
          key: 'timeInterval',
          width: 100,
        },
        // ??????
        {
          title: this.languageTable.strategyList.switch,
          key: 'switches',
          width: 80,
        },
        // ??????
        {
          title: this.languageTable.strategyList.dimming,
          key: 'light',
          width: 100,
        },
        // todo ???????????? // ???????????????
        // {
        //   title: this.languageTable.strategyList.eventSources,
        //   key: 'refObjectName',
        //   width: 130,
        // },
        // ????????????
        {
          title: this.languageTable.strategyList.lightIntensity,
          key: 'sensorList',
          width: 200,
        },
        // ??????
        {
          title: this.language.operate,
          searchConfig: {type: 'operate'},
          key: '',
          width: 80,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [
        // ??????
        {
          text: this.languageTable.strategyList.strategyEdit,
          className: 'fiLink-edit',
          handle: (data) => {
            const idx = this.instructLightList.findIndex(item => item.instructId === data.instructId);
            this.instructLightEdit(idx);
          },
        },
        {
          text: this.languageTable.strategyList.strategyDelete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          confirmContent: `${this.languageTable.strategyList.confirmDelete}?`,
          handle: (data) => {
            const index = this.instructLightList.findIndex(item => item.instructId === data.instructId);
            this.instructLightList.splice(index, 1);
            this.instructLightList = this.instructLightList.slice();
            // ????????????stepsFirstParams
            this.stepsFirstParams.instructLightList = this.instructLightList;
            this.stepsFirstParams.instructLightList = this.stepsFirstParams.instructLightList.slice();
            this.strategyDetailValid();
          }
        }
      ],
    };
  }

  /**
   * ??????????????????????????????
   */
  private initEventTable(): void {
    this.eventTableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedReportId',
          renderTemplate: this.radioReportTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 42
        },
        // ??????
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        // ????????????
        {
          title: this.languageTable.strategyList.operationUser,
          key: 'alarmName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.languageTable.strategyList.operationTime,
          key: 'alarmObject',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.languageTable.strategyList.operationResult,
          key: 'alarmDeviceName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.languageTable.strategyList.operationDetails,
          key: 'areaName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {right: '0px'}}
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
    };
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedReportId',
          renderTemplate: this.radioReportTemp,
          width: 42
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
        },
        // ????????????
        {
          title: this.alarmLanguage.alarmName, key: 'alarmName', width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // ????????????
        {
          title: this.alarmLanguage.AlarmCode, key: 'alarmCode', width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // ????????????
        {
          title: this.alarmLanguage.alarmDefaultLevel, key: 'alarmDefaultLevel', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n), label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
        },
        // ????????????
        {
          title: this.alarmLanguage.alarmLevel, key: 'alarmLevel', width: 150,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          // ????????????
          title: this.alarmLanguage.AlarmType, key: 'alarmClassification', width: 150, isShowSort: true,
          searchable: true,
          searchKey: 'alarmClassification',
          type: 'render',
          searchConfig: {
            type: 'select', selectType: 'multiple',
          },
          renderTemplate: this.alarmTypeTemp
        },
        { // ????????????
          title: this.alarmLanguage.alarmAutomaticConfirmation, key: 'alarmAutomaticConfirmation', width: 150,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmConfirmTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.alarmLanguage.yes, value: '1'},
              {label: this.alarmLanguage.no, value: '0'},
            ]
          }
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.getAlarmLevelList();
      },
      // ??????
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.getAlarmLevelList();
      }
    };
  }

}
