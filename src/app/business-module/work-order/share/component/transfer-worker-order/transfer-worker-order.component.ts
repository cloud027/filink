import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {ClearBarrierOrInspectEnum} from '../../enum/clear-barrier-work-order.enum';
import {TransferOrderParamModel} from '../../model/clear-barrier-model/transfer-order-param.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ClearBarrierWorkOrderService} from '../../service/clear-barrier';
import {InspectionWorkOrderService} from '../../service/inspection';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AlarmConfirmWorkOrderService} from '../../service/alarm-confirm';
import {InstallWorkOrderService} from '../../service/installation';
import {DismantleBarrierWorkOrderService} from '../../service/dismantle-barrier/dismantle-barrier-work-order.service';

/**
 * 工单转派组件
 */
@Component({
  selector: 'app-transfer-worker-order',
  templateUrl: './transfer-worker-order.component.html',
  styleUrls: ['./transfer-worker-order.component.scss']
})
export class TransferWorkerOrderComponent implements OnInit {
  @Input() public modalData: TransferOrderParamModel;
  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }
  get xcVisible() {
    return this._xcVisible;
  }
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<TransferOrderParamModel | boolean>();
  public InspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 表单校验
  public isFormDisabled: boolean = true;
  // 转派表单
  public transFormColumn: FormItem[] = [];
  private tranFormStatus: FormOperate;
  // 用户列表
  private userList: RoleUnitModel[] = [];
  // 用户id
  private userId: string;
  // 原因
  private reasons: string = '';
  // 查询销障巡检
  private queryType: string;
  // 显示隐藏
  private _xcVisible: boolean = false;

  constructor(
    private $nzI18n: NzI18nService,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
    private $alarmWorkOrderService: AlarmConfirmWorkOrderService,
    private $installService: InstallWorkOrderService,
    private $removeService: DismantleBarrierWorkOrderService,
    private $ruleUtil: RuleUtil,
  ) { }

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    if (this.modalData) {
      this.queryType = this.modalData.type;
      if (this.modalData.type === ClearBarrierOrInspectEnum.clearBarrier) {
        // 销障工单
        this.queryClearDeptUser();
      } else if (this.modalData.type === ClearBarrierOrInspectEnum.inspection) {
        // 巡检工单
        this.queryInspectDeptUser();
      } else if (this.modalData.type === ClearBarrierOrInspectEnum.alarmConfirmOrder) {
        // 告警确认工单
        this.queryAlarmOrderUser();
      } else if (this.modalData.type === ClearBarrierOrInspectEnum.remove) {
        // 拆除工单
        this.getRemoveUserList();
      } else {
        // 安装工单
        this.queryInstallUser();
      }
    }
    this.initTemplateColumn();
  }
  /**
   * 转派表单初始化
   */
  private initTemplateColumn(): void {
    this.transFormColumn = [
      { // 转派对象
        label: this.InspectionLanguage.transferObject,
        key: 'userId',
        type: 'select',
        col: 24, width: 1000, require: true,
        labelWidth: 170,
        placeholder: this.InspectionLanguage.pleaseChoose,
        selectInfo: {
          data: this.userList,
          label: 'label', value: 'code',
        },
        rule: [],
        modelChange: (controls, event, key, formOperate) => {
          if (event) {
            this.userId = event;
          }
        }
      },
      {// 转派原因
        label: this.InspectionLanguage.transReason,
        key: 'turnReason',
        type: 'textarea', require: true,
        width: 1000, col: 24,
        labelWidth: 170,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          this.$ruleUtil.getRemarkMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        modelChange: (controls, event, key, formOperate) => {
          if (event ) {
            this.reasons = event;
          }
        }
      },
    ];
  }

  /**
   * 表单提交按钮校验
   */
  public transFormInstance(event: {instance: FormOperate}): void {
    this.tranFormStatus = event.instance;
    this.tranFormStatus.group.valueChanges.subscribe((param) => {
      const reason = CommonUtil.trim(param.turnReason);
      if (reason && param.userId) {
        if (reason.length > 255) {
          this.isFormDisabled = true;
        } else {
          this.isFormDisabled = false;
        }
      } else {
        this.isFormDisabled = true;
      }
    });
  }
  /**
   * 转派
   */
  public transferOrder(): void {
    const formData = this.tranFormStatus.group.getRawValue();
    formData.procId = this.modalData.procId;
    formData.turnReason = CommonUtil.trim(formData.turnReason);
    if (formData.userId && formData.turnReason) {
      this.selectDataChange.emit(formData);
      this.handleClose();
    }
  }

  /**
   * 关闭
   */
  public handleClose(): void {
    this.selectDataChange.emit(false);
    this.xcVisible = false;
  }

  /**
   * 查询销障单位下责任人
   */
  private queryClearDeptUser(): void {
    this.$clearBarrierWorkOrderService.getClearUserList(this.modalData).subscribe((result: ResultModel<RoleUnitModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          this.userList.push({label: item.userName, code: item.id});
        });
      }
    });
  }
  /**
   * 查询巡检单位下责任人
   */
  private queryInspectDeptUser(): void {
    this.$inspectionWorkOrderService.getInspectUser(this.modalData).subscribe((result: ResultModel<RoleUnitModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          this.userList.push({label: item.userName, code: item.id});
        });
      }
    });
  }

  /**
   * 查询告警确认工单下责任人
   */
  private queryAlarmOrderUser(): void {
    this.$alarmWorkOrderService.getAlarmUser(this.modalData).subscribe((res: ResultModel<RoleUnitModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const list = res.data || [];
        list.forEach(item => {
          this.userList.push({label: item.userName, code: item.id});
        });
      }
    });
  }
  /**
   * 查询安装工单下责任人
   */
  private queryInstallUser(): void {
    this.$installService.queryTurnUser(this.modalData.procId).subscribe((res: ResultModel<RoleUnitModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const list = res.data || [];
        list.forEach(item => {
          this.userList.push({label: item.userName, code: item.id});
        });
      }
    });
  }
  /**
   * 查询安装工单下责任人
   */
  private getRemoveUserList(): void {
    this.$removeService.getRemoveUserList({procId : this.modalData.procId}).subscribe((res: ResultModel<RoleUnitModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const list = res.data || [];
        list.forEach(item => {
          this.userList.push({label: item.userName, code: item.id});
        });
      }
    });
  }
}
