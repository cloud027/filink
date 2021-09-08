import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../form/form-config';
import {FormOperate} from '../../../form/form-operate.service';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {CommonUtil} from '../../../../util/common-util';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../util/rule-util';
import {WorkOrderForCommonService} from '../../../../../core-module/api-service/work-order';
import {LanguageEnum} from '../../../../enum/language.enum';
import {AbstractControl} from '@angular/forms';
import {differenceInCalendarDays} from 'date-fns';
import {TreeSelectorConfigModel} from '../../../../model/tree-selector-config.model';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {AccountabilityUnitModel} from '../../../../../core-module/model/trouble/accountability-unit.model';
import {AreaDeviceParamModel} from '../../../../../core-module/model/work-order/area-device-param.model';
import {SessionUtil} from '../../../../util/session-util';
import {AlarmTurnTroubleService} from '../../../../../core-module/mission/alarm-turn-trouble.service';
import {TroubleForCommonService} from '../../../../../core-module/api-service/trouble/trouble-for-common.service';
import { AlarmListModel } from '../../../../../core-module/model/alarm/alarm-list.model';
import {AlarmWorkResourceEnum} from '../../../../../core-module/enum/alarm/alarm-work-resource.enum';
import { UserForCommonUtil } from '../../../../../core-module/business-util/user/user-for-common.util';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WhetherEnum} from '../../../../../core-module/enum/work-order/work-order.enum';

/**
 * 销障转工单
 */
@Component({
  selector: 'app-add-work-order',
  templateUrl: './add-work-order.component.html',
  styleUrls: ['./add-work-order.component.scss']
})
export class AddWorkOrderComponent implements OnInit {
  @Input() modalTitle: string;
  @Input()
  set alarmInfo(alarmInfo: AlarmListModel) {
    if (alarmInfo) {
      this.creationWorkOrderData = alarmInfo;
      this.isShowModal = true;
      this.procTypeName = this.language.clearBarrier;
      this.initSetForm();
    }
  }
  // 新增派单和销障弹窗
  @Input() public isShowModal: boolean = false;
  @Output() close = new EventEmitter();
  // 责任单位
  @ViewChild('department') department: TemplateRef<any>;
  // 完成时间选择模板
  @ViewChild('ecTimeTemp') ecTimeTemp: TemplateRef<any>;
  // 创建工单的数据
  public creationWorkOrderData: AlarmListModel = new AlarmListModel();
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 通用语言
  public commonLanguage: CommonLanguageInterface;
  // 工单语言
  public inspectionLanguage: InspectionLanguageInterface;
  // 提交loading
  public isLoading: boolean = false;
  // 新增派单和销障表单
  public tableColumnSet: FormItem[] = [];
  // 工单类型
  public procTypeName: string;
  // 备注
  public remark: string;
  // 用户id
  public userId: string;
  // 工单确认按钮禁启用
  public isOrderDis: boolean;
  // 单位名称
  public deptName: string = '';
  // 单位选择节点
  private areaNodes:  DepartmentUnitModel[] = [];
  // 单位选择器配置信息
  public unitSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 单位弹窗展示
  public unitSelectVisible: boolean = false;
  // 单位code
  private deptCode: string = '';
  // 责任单位选择器
  private selectorData: AccountabilityUnitModel = new AccountabilityUnitModel();
  private formStatusSet: FormOperate;
  constructor(
    private $nzI18n: NzI18nService,
    private $troubleService: TroubleForCommonService,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $modal: NzModalService,
    private $clearBarrierService: WorkOrderForCommonService,
    private $alarmTurnTroubleService: AlarmTurnTroubleService,
  ) {
    // 初始化国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
  }

  ngOnInit() {
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.userId = SessionUtil.getUserInfo().id;
    }
    this.queryDeptList(this.creationWorkOrderData.areaCode);
    this.initUnitSelectorConfig();
  }

  /**
   * 销障工单表单初始化事件
   * param event
   */
  public formInstanceSet(event: { instance: FormOperate }): void {
    this.formStatusSet = event.instance;
    // 监听确定按钮是否可以点击
    this.formStatusSet.group.statusChanges.subscribe(() => {
      this.isOrderDis = this.formStatusSet.getValid();
    });
  }

  /**
   * 取消新增销障和核实弹窗
   */
  public setHandleCancel(): void {
    this.isShowModal = false;
    this.close.emit();
  }

  /**
   * 新增销障和核实确认
   */
  public setHandle(): void {
    this.isLoading = true;
    const data = this.formStatusSet.group.getRawValue();
    const paramsData = new ClearBarrierWorkOrderModel();
    // 数据组装及转换，转为后台所需要的模型结构
    paramsData.title = data.title;
    paramsData.refAlarm = this.creationWorkOrderData.id;
    paramsData.refAlarmName = data.refAlarmName;
    paramsData.deviceId = this.creationWorkOrderData.alarmDeviceId;
    paramsData.deviceName = this.creationWorkOrderData.alarmDeviceName;
    paramsData.deviceType = this.creationWorkOrderData.alarmDeviceTypeId;
    paramsData.deviceAreaId = this.creationWorkOrderData.areaId;
    paramsData.deviceAreaName = this.creationWorkOrderData.areaName;
    paramsData.remark = data.remark;
    paramsData.refAlarmCode = this.creationWorkOrderData.alarmCode;
    paramsData.accountabilityDept = this.deptCode;
    paramsData.accountabilityDeptName = this.deptName;
    paramsData.procResourceType = AlarmWorkResourceEnum.alarm;
    paramsData.deviceAreaCode = this.creationWorkOrderData.areaCode;
    paramsData.autoDispatch = data.autoDispatch;
    paramsData.equipment = [
      {
        'deviceId': this.creationWorkOrderData.alarmDeviceId,
        'equipmentId': this.creationWorkOrderData.alarmSource,
        'equipmentName': this.creationWorkOrderData.alarmObject,
        'equipmentType': this.creationWorkOrderData.alarmSourceTypeId
      }
    ];
    if (data.expectedCompletedTime) {
      paramsData.expectedCompletedTime = CommonUtil.sendBackEndTime(new Date(data.expectedCompletedTime).getTime());
    }
    this.$clearBarrierService.addWorkOrder(paramsData).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        // 请求成功后 通知转派信息组件刷新其表格数据
        this.$alarmTurnTroubleService.reloadClearBarrierEmit.emit(true);
        this.setHandleCancel();
        this.$message.success(this.commonLanguage.createSuccess);
      } else {
        this.$message.error(result.msg);
      }
    }, () => this.isLoading = false);
  }

  /**
   * 日期禁用
   */
  public disabledEndDate(current: Date): boolean {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 打开单位选择器
   */
  public showUnitSelectorModal(): void {
    this.unitSelectorConfig.treeNodes = this.areaNodes;
    this.unitSelectVisible = true;
  }
  /**
   * 单位选中结果
   * param event
   */
  public unitSelectChange(event: DepartmentUnitModel[]): void {
    if (event[0]) {
      UserForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].id);
      this.deptName = event[0].deptName;
      this.deptCode = event[0].deptCode;
      this.selectorData.parentId = event[0].id;
      this.formStatusSet.resetControlData('accountabilityDept', event[0].id);
    } else {
      UserForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
      this.deptName = '';
      this.deptCode = '';
      this.selectorData.parentId = null;
      this.formStatusSet.resetControlData('accountabilityDept', null);
    }
  }

  /**
   * 初始化新增销障弹窗表单
   */
  private initSetForm(): void {
    this.tableColumnSet = [
      {  // 工单名称
        label: this.language.workOrderName,
        key: 'title',
        type: 'input',
        col: 24,
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$clearBarrierService.checkClearName(CommonUtil.trim(value), null),
            res => res.code === ResultCodeEnum.success)
        ],
      },
      { // 工单类型
        label: this.language.workOrderType, key: 'procType', type: 'input',
        require: true,
        disabled: true,
        col: 24,
        initialValue: this.procTypeName, rule: [],
      },
      {  // 关联告警
        label: this.language.relevancyAlarm, key: 'refAlarmName', type: 'input',
        require: true,
        disabled: true,
        col: 24,
        initialValue: this.creationWorkOrderData.alarmName,
        rule: [{required: true}], asyncRules: [],
      },
      { // 是否自动派单
        label: this.inspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'radio',
        require: true, rule: [{required: true}],
        initialValue: WhetherEnum.deny,
        radioInfo: {
          data: [
            {label: this.inspectionLanguage.right, value: WhetherEnum.right}, // 是
            {label: this.inspectionLanguage.deny, value: WhetherEnum.deny}, // 否
          ],
          label: 'label', value: 'value'
        }
      },
      { // 责任单位
        label: this.language.responsibleDepartment, key: 'accountabilityDept', type: 'custom',
        col: 24,
        template: this.department,
        rule: [], asyncRules: [],
      },
      { // 期望完工时间
        label: this.language.lastDays,
        key: 'expectedCompletedTime',
        type: 'custom',
        template: this.ecTimeTemp,
        require: true,
        rule: [{required: true}],
        customRules: [{
          code: 'isTime',
          msg: null,
          validator: (control: AbstractControl): { [key: string]: boolean } => {
            if (control.value && CommonUtil.sendBackEndTime(new Date(control.value).getTime()) < new Date().getTime()) {
              if (this.formStatusSet.group.controls['expectedCompletedTime'].dirty) {
                this.$message.info(this.commonLanguage.expectCompleteTimeMoreThanNowTime);
                return {isTime: true};
              }
            } else {
              return null;
            }
          }
        }],
      },
      {  // 备注
        label: this.language.remark,
        key: 'remark', type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 查询责任单位
   */
  private queryDeptList(code: string): void {
    const param = new AreaDeviceParamModel();
    param.areaCodes = [code];
    param.userId = this.userId;
    this.$troubleService.queryUnitListByArea(param).subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.areaNodes = result.data || [];
      }
    });
  }

  /**
   * 初始化单位选择器配置
   * param nodes
   */
  private initUnitSelectorConfig() {
    this.unitSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.responsibleDepartment,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
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
      treeNodes: this.areaNodes
    };
  }
}
