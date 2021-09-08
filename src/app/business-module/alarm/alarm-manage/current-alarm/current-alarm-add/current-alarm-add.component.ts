import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HISTORY_GO_STEP_CONST} from '../../../share/const/alarm-common.const';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmService} from '../../../share/service/alarm.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {NzI18nService, toBoolean} from 'ng-zorro-antd';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../shared-module/model/alarm-selector-config.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import { AlarmSelectorConfigTypeEnum } from '../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {AlarmConfirmStatusEnum} from '../../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {AlarmCleanStatusEnum} from '../../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmTemplateModel} from '../../../share/model/alarm-template.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {EquipmentModel} from '../../../../../core-module/model/equipment.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';

/**
 * 当前告警、历史告警页面 模板 新增和编辑
 */

@Component({
  selector: 'app-current-alarm-add',
  templateUrl: './current-alarm-add.component.html',
  styleUrls: ['./current-alarm-add.component.scss']
})
export class CurrentAlarmAddComponent implements OnInit {
  // 首次发生时间表单项模板
  @ViewChild('firstTimeTemp') private firstTimeTemp: TemplateRef<any>;
  // 告警名称表单项模板
  @ViewChild('alarmName') private alarmName: TemplateRef<any>;
  // 告警对象选择表单项模板
  @ViewChild('equipmentTemp') private equipmentTemp: TemplateRef<any>;
  // 区域表单项模板
  @ViewChild('areaSelector') private areaSelector: TemplateRef<any>;
  // 责任单位
  @ViewChild('unitTemp') private unitTemp: TemplateRef<any>;
  // 设施名称
  @ViewChild('facilityTemp') private facilityTemp: TemplateRef<any>;
  // 标题
  public title: string = '';
  // 表单项配置
  public formColumn: FormItem[] = [];
  // 表单对象
  public formStatus: FormOperate;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 默认新增页面标志
  public pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel;
  // 告警名称
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 告警对象
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // 责任单位
  public unitConfig: AlarmSelectorConfigModel;
  // 设备勾选容器
  public selectEquipments: EquipmentModel[] = [];
  // 时间model
  public timeModel = {
    firstTimeModel: [],
  };
  // 加载状态
  public isLoading: boolean = false;
  // 表单校验
  public isDisabled: boolean;
  // 设施名称
  public alarmFacilityConfig: AlarmSelectorConfigModel;
  // 勾选的设施名称
  public checkDeviceObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 告警类别
  private alarmTypeList: SelectModel[] = [];
  // 勾选的责任单位
  private checkUnit: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 勾选的告警对象
  private checkAlarmObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 勾选的告警名称
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 区域容器
  private areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 编辑id
  private updateParamsId: string;
  // 是否历史告警模板
  private isHistoryAlarmTemplateTable: boolean = false;
  // 创建信息
  private createData;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $active: ActivatedRoute,
    private $router: Router,
    private $alarmService: AlarmService,
    private $ruleUtil: RuleUtil,
    private $alarmForCommonService: AlarmForCommonService
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 表单初始化
    this.initForm();
    if (this.$active.snapshot.queryParams.isHistoryAlarmTemplateTable) {
      this.isHistoryAlarmTemplateTable = this.$active.snapshot.queryParams.isHistoryAlarmTemplateTable;
    }
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      data.forEach(item => this.alarmTypeList.push(item));
    });
    // 路由参数
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === OperateTypeEnum.add) {
      // 新建
      this.title = this.language.addAtPresentAlarm;
    } else {
      // 编辑
      this.title = this.language.updateAtPresentAlarm;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        setTimeout(() => {
          this.getAlarmData(params.id, params.isHistoryAlarmTemplateTable);
        }, 200);
      });
    }
    // 区域
    this.initAreaConfig();
    // 告警名称
    this.initAlarmName();
    // 责任单位
    this.initUnitConfig();
    // 设施名称
    this.initDeviceObjectConfig();
  }

  /**
   * 表单初始化
   */
  public initForm(): void {
    this.formColumn = [
      {
        // 模板名称
        label: this.language.templateName,
        key: 'templateName',
        type: 'input',
        col: 12,
        require: true,
        width: 300,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$alarmService.checkTempName(value, this.updateParamsId),
            res => res.code === ResultCodeEnum.success)
        ],
      },
      {
        // 频次
        label: this.language.alarmHappenCount,
        key: 'alarmHappenCount',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          {maxLength: 8},
          {pattern: /^\+?[1-9][0-9]*$/, msg: this.language.enterAlarmHappenCount},
          {min: 1, msg: this.language.enterAlarmHappenCount},
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 告警级别
        label: this.language.alarmFixedLevel,
        key: 'alarmFixedLevel',
        type: 'select',
        width: 300,
        col: 12,
        rule: [],
        asyncRules: [],
        allowClear: true,
        selectType: 'multiple',
        selectInfo: {
          data: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null),
          label: 'label',
          value: 'code'
        },
      },
      { // 告警类别
        label: this.language.AlarmType,
        key: 'alarmClassification',
        type: 'select',
        width: 300,
        col: 12,
        allowClear: true,
        selectInfo: {
          data: this.alarmTypeList,
          label: 'label',
          value: 'code'
        },
        rule: [],
      },
      {
        // 首次发生时间
        label: this.language.alarmBeginTime,
        key: 'alarmBeginTime',
        type: 'custom',
        col: 12,
        template: this.firstTimeTemp,
        rule: [],
        asyncRules: []
      },
      {
        // 设施类型
        label: this.language.alarmSourceType,
        key: 'alarmDeviceTypeId',
        type: 'select',
        col: 12,
        selectType: 'multiple',
        width: 300,
        selectInfo: {
          data: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        allowClear: true,
        rule: [],
      },
      {
        // 确认状态
        label: this.language.alarmConfirmStatus,
        key: 'alarmConfirmStatus',
        type: 'select',
        width: 300,
        col: 12,
        allowClear: true,
        selectInfo: {
          data: [
            {label: this.language.isConfirm, value: AlarmConfirmStatusEnum.isConfirm},
            {label: this.language.noConfirm, value: AlarmConfirmStatusEnum.noConfirm},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [
          RuleUtil.getNamePatternRule()
        ],
      },
      {// 设施名称
        label: this.language.deviceName,
        key: 'alarmDeviceNameList',
        type: 'custom',
        rule: [],
        width: 300,
        col: 12,
        inputType: '',
        template: this.facilityTemp,
      },
      {
        // 告警名称
        label: this.language.alarmName,
        key: 'alarmNameList',
        col: 12,
        width: 300,
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.alarmName
      },
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 区域
        label: this.language.area,
        key: 'areaNameList',
        type: 'custom',
        width: 300,
        col: 12,
        rule: [],
        asyncRules: [],
        template: this.areaSelector,
      },
      {
        // 设备类型
        label: this.language.equipmentType,
        key: 'alarmSourceTypeId',
        col: 12,
        width: 300,
        type: 'select',
        selectType: 'multiple',
        selectInfo: {
          data: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
          label: 'label',
          value: 'code',
        },
        allowClear: true,
        rule: [],
      },
      {
        // 责任单位
        label: this.language.responsibleDepartment,
        key: 'departmentList',
        type: 'custom',
        width: 300,
        col: 12,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        template: this.unitTemp
      },
      {
        // 告警对象
        label: this.language.alarmobject,
        key: 'alarmObjectList',
        type: 'custom',
        width: 300,
        col: 12,
        rule: [],
        asyncRules: [],
        template: this.equipmentTemp
      },
      {
        // 清除状态
        label: this.language.alarmCleanStatus,
        key: 'alarmCleanStatus',
        type: 'select',
        width: 300,
        col: 12,
        allowClear: true,
        selectInfo: {
          data: [
            {label: this.language.noClean, value: AlarmCleanStatusEnum.noClean},
            {label: this.language.isClean, value: AlarmCleanStatusEnum.isClean},
            {label: this.language.deviceClean, value: AlarmCleanStatusEnum.deviceClean}
          ],
          label: 'label',
          value: 'value'
        },
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
      },
    ];
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   * 取消提交
   */
  public cancel(): void {
    window.history.go(HISTORY_GO_STEP_CONST);
  }

  /**
   * 首次发生时间
   */
  public firstTimeChange(event: Date[]): void {
    this.timeModel.firstTimeModel = event;
  }

  /**
   * 打开日历，关闭日历校验
   */
  public firstTimeOnOpenChange(event: boolean): void {
    if (event) {
      return;
    }
    if (+this.timeModel.firstTimeModel[0] > +this.timeModel.firstTimeModel[1]) {
      this.timeModel.firstTimeModel = [];
      this.$message.warning(this.language.timeMsg);
    }
    // 关闭时 避免时间控件的一些非常规操作 重新赋值下
    this.timeModel.firstTimeModel = this.timeModel.firstTimeModel.slice();
  }


  /**
   * 表单提交
   */
  public submit(): void {
    this.isLoading = true;
    const alarmObj = this.formStatus.getData();
    alarmObj.templateName = alarmObj.templateName.trim();
    if (alarmObj.remark) {
      alarmObj.remark = alarmObj.remark.trim();
    }
    // 首次发生时间
    if (this.timeModel.firstTimeModel.length) {
      const times = this.timestamp(this.timeModel.firstTimeModel);
      alarmObj.alarmBeginFrontTime = times[0];
      alarmObj.alarmBeginQueenTime = times[1];
    } else {
      alarmObj.alarmBeginFrontTime = null;
      alarmObj.alarmBeginQueenTime = null;
      alarmObj.alarmBeginTime = null;
    }
    // 频次
    alarmObj.alarmHappenCount = alarmObj.alarmHappenCount ? Number(alarmObj.alarmHappenCount) : null;
    if (alarmObj.alarmFixedLevel) {
      alarmObj.alarmFixedLevel = (alarmObj.alarmFixedLevel as string[]).join();
    }
    // 设备类型
    if (alarmObj.alarmSourceTypeId) {
      alarmObj.alarmSourceTypeId = alarmObj.alarmSourceTypeId.join();
    }
    // 设施类型
    if (alarmObj.alarmDeviceTypeId) {
      alarmObj.alarmDeviceTypeId = alarmObj.alarmDeviceTypeId.join();
    }
    let addUrl, updateUrl, path;
    if (!toBoolean(this.isHistoryAlarmTemplateTable)) {
      addUrl = 'addAlarmTemplate';
      updateUrl = 'updateAlarmTemplate';
      path = 'current';
    } else {
      addUrl = 'addHistoryAlarmTemplate';
      updateUrl = 'updateHistoryAlarmTemplate';
      path = 'history';
    }
    if (this.pageType === OperateTypeEnum.add) {
      this.$alarmService[addUrl](alarmObj).subscribe((res) => {
        this.requestPath(res, path);
      });
    } else {
      alarmObj.id = this.updateParamsId;
      alarmObj.createTime = this.createData.createTime;
      alarmObj.createUser = this.createData.createUser;
      alarmObj.responsibleId = this.createData.responsibleId;
      this.$alarmService[updateUrl](alarmObj).subscribe((res) => {
        this.requestPath(res, path);
      });
    }
  }

  /**
   * 请求路径
   * param res
   * param path
   */
  public requestPath(res: ResultModel<string>, path: string): void {
    this.isLoading = false;
    if (res && res.code === 0) {
      this.$message.success(res.msg);
      this.$router.navigate([`business/alarm/${path}-alarm`]).then();
    } else {
      this.$message.error(res.msg);
    }
  }
  /**
   * 告警对象过滤
   */
  public onSelectEquipment(event: EquipmentModel[]): void {
    this.selectEquipments = event;
    this.checkAlarmObject = new AlarmSelectorInitialValueModel(
      event.map(v => v.equipmentName).join(',') || '', event.map(v => v.equipmentId) || []
    );
    const names = this.checkAlarmObject.name.split(',');
    const alarmObjectList = this.checkAlarmObject.ids.map((id, index) => {
      return {'equipmentName': names[index], 'equipmentId': id};
    });
    this.formStatus.resetControlData('alarmObjectList', alarmObjectList);
  }
  /**
   * 责任单位配置初始化
   */
  private initUnitConfig(): void {
    this.unitConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.checkUnit,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkUnit = event;
        const names = this.checkUnit.name.split(',');
        const departmentList = this.checkUnit.ids.map((id, index) => {
          return {'departmentName': names[index], 'departmentId': id};
        });
        this.formStatus.resetControlData('departmentList', departmentList);
      }
    };
  }

  /**
   * 告警名称初始化
   */
  private initAlarmName(): void {
    this.alarmNameConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.checkAlarmName,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
        const names = this.checkAlarmName.name.split(',');
        const alarmNameList = this.checkAlarmName.ids.map((id, index) => {
          return {'alarmName': names[index], 'alarmNameId': id};
        });
        this.formStatus.resetControlData('alarmNameList', alarmNameList);
      }
    };
  }
  /**
   * 设施选择器
   */
  private initDeviceObjectConfig(): void {
    this.alarmFacilityConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.checkDeviceObject,
      clear: !this.checkDeviceObject.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkDeviceObject = event;
        const names = this.checkDeviceObject.name.split(',');
        const DeviceObjectList = this.checkDeviceObject.ids.map((id, index) => {
          return {'deviceName': names[index], 'deviceId': id};
        });
        this.formStatus.resetControlData('alarmDeviceNameList', DeviceObjectList);
      },
    };
  }
  /**
   * 区域配置初始化
   */
  private initAreaConfig(): void {
    this.areaConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.areaList,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
        const names = this.areaList.name.split(',');
        const areaNameList = this.areaList.ids.map((id, index) => {
          return {'areaName': names[index], 'areaId': id};
        });
        this.formStatus.resetControlData('areaNameList', areaNameList);
      }
    };
  }

  /**
   * 通过编辑id, 查询要编辑的数据
   */
  private getAlarmData(id: string, isHistoryAlarmTemplateTable): void {
    let url;
    if (!JSON.parse(isHistoryAlarmTemplateTable)) {
      url = 'queryAlarmTemplateById';
    } else {
      url = 'queryHistoryAlarmTemplateById';
    }
    this.$alarmService[url]([id]).subscribe((res: ResultModel<AlarmTemplateModel>) => {
      if (res.code === 0) {
        const alarmData = res.data;
        this.createData = {
          createTime: alarmData.createTime,
          createUser: alarmData.createUser,
          responsibleId: alarmData.responsibleId
        };
        // 首次发生时间
        if (alarmData.alarmBeginFrontTime && alarmData.alarmBeginQueenTime) {
          alarmData.alarmBeginTime = [this.timeAnalysis(alarmData.alarmBeginFrontTime), this.timeAnalysis(alarmData.alarmBeginQueenTime)];
          this.timeModel.firstTimeModel = [this.timeAnalysis(alarmData.alarmBeginFrontTime),
            this.timeAnalysis(alarmData.alarmBeginQueenTime)];
        }
        // 告警名称
        if (alarmData.alarmNameList && alarmData.alarmNameList.length) {
          this.checkAlarmName = {
            ids: alarmData.alarmNameList.map(item => item.alarmNameId),
            name: alarmData.alarmNameList.map(item => item.alarmName).join(',')
          };
          this.initAlarmName();
        }
        // 区域
        if (alarmData.areaNameList && alarmData.areaNameList.length) {
          this.areaList = {
            ids: alarmData.areaNameList.map(item => item.areaId),
            name: alarmData.areaNameList.map(item => item.areaName).join(',')
          };
          this.initAreaConfig();
        }
        // 告警对象
        if (alarmData.alarmObjectList && alarmData.alarmObjectList.length) {
          this.checkAlarmObject = {
            ids: alarmData.alarmObjectList.map(item => item.equipmentId),
            name: alarmData.alarmObjectList.map(item => item.equipmentName).join(',')
          };
          this.selectEquipments = res.data.alarmObjectList;
        }
        // 设施名称
        if (alarmData.alarmDeviceNameList && alarmData.alarmDeviceNameList.length) {
          this.checkDeviceObject = {
            ids: alarmData.alarmDeviceNameList.map(item => item.deviceId),
            name: alarmData.alarmDeviceNameList.map(item => item.deviceName).join(',')
          };
          this.initDeviceObjectConfig();
        }
        // 责任单位
        if (alarmData.departmentList && alarmData.departmentList.length) {
          this.checkUnit = {
            ids: alarmData.departmentList.map(item => item.departmentId),
            name: alarmData.departmentList.map(item => item.departmentName).join(',')
          };
          this.initUnitConfig();
        }
        if (alarmData.alarmFixedLevel) {
          alarmData.alarmFixedLevel = (alarmData.alarmFixedLevel as string).split(',');
        }
        // 设备类型
        if (alarmData.alarmSourceTypeId) {
          alarmData.alarmSourceTypeId = (alarmData.alarmSourceTypeId as string).split(',');
        }
        // 设施类型
        if (alarmData.alarmDeviceTypeId) {
          alarmData.alarmDeviceTypeId = (alarmData.alarmDeviceTypeId as string).split(',');
        }
        this.formStatus.resetData(alarmData);
      }
    });
  }

  /**
   * 时间戳转化为时间格式
   */
  private timeAnalysis(time: number): Date {
    return new Date(CommonUtil.convertTime(time));
  }

  /**
   * 时间格式转换时间戳
   */
  private timestamp(timeRange: Date[]): number[] {
    // 去除随机的毫秒值补000
    const start = Math.floor(CommonUtil.sendBackEndTime(timeRange[0].getTime()) / 1000) * 1000;
    // 去除随机的毫秒值补999
    const end = Math.floor(CommonUtil.sendBackEndTime(timeRange[1].getTime()) / 1000) * 1000 + 999;
    return [start, end];
  }
}
