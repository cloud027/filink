import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {AlarmService} from '../../../../share/service/alarm.service';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {
  AlarmModalTypeEnum,
  AlarmPathEnum,
  IsTurnTroubleEnum,
  SelectedIndexEnum,
} from '../../../../share/enum/alarm.enum';
import {AlarmTurnTroubleService} from '../../../../../../core-module/mission/alarm-turn-trouble.service';
import {PageTypeEnum} from '../../../../../../core-module/enum/alarm/alarm-page-type.enum';
import {TroubleUtil} from '../../../../../../core-module/business-util/trouble/trouble-util';
import {AlarmListModel} from '../../../../../../core-module/model/alarm/alarm-list.model';
import {SessionUtil} from '../../../../../../shared-module/util/session-util';
import {TroubleRoleEnum} from '../../../../../../core-module/enum/alarm/trouble-role.enum';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {AlarmToTroubleModel} from '../../../../../../core-module/model/trouble/alarm-to-trouble.model';

/**
 * 告警操作
 */
@Component({
  selector: 'app-alarm-operation',
  templateUrl: './alarm-operation.component.html',
  styleUrls: ['./alarm-operation.component.scss']
})
export class AlarmOperationComponent implements OnInit {
  // 页面类型
  @Input() pageType: PageTypeEnum;
  // 告警详情
  @Input() alarmInfo: AlarmListModel;
  // 转派工单弹窗是否展示
  @Input() reloadClearBarrierData: boolean;
  // 处理进度状态
  @Output() processStatus = new EventEmitter();
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 通用语言
  public commonLanguage: CommonLanguageInterface;
  // 弹窗标题
  public addOrderTitle: string;
  // 提交loading
  public isLoading: boolean = false;
  // 已处理弹窗展示和隐藏
  public dealTable: boolean = false;
  // 列表
  public formColumnDeal: FormItem[] = [];
  // 列表操作
  public formStatusDeal: FormOperate;
  // 弹窗title
  public confirmTitle: string;
  // 详情标识位
  public isDealDis: boolean;
  // 工单展示标志位
  public isShowWorkOrder: boolean = false;
  // 告警操作类型枚举
  public pageTypeEnum = PageTypeEnum;
  // 控制转故障按钮是否展示
  public turnTroubleShow: boolean = false;
  // 故障列表权限
  public troubleListRole: boolean;
  // 故障新增权限
  public addTroubleRole: boolean;
  // 故障转换
  private isTurnTrouble: IsTurnTroubleEnum;
  // 备注
  private remark: string;
  // 弹窗类型
  private modalType: string;
  constructor(
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $modal: NzModalService,
    private $alarmTurnTroubleService: AlarmTurnTroubleService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
    // 故障列表权限
    this.troubleListRole = SessionUtil.checkHasRole(TroubleRoleEnum.troubleList);
    // 新增故障权限
    this.addTroubleRole = SessionUtil.checkHasRole(TroubleRoleEnum.addTrouble);
    // 所有电子锁相关的设施类型
    const filterDeviceType = TroubleUtil.filterDeviceType();
    // 是电子锁类型或者没有故障列表，新增故障权限不展示故障转工单按钮
    if ((this.troubleListRole || this.addTroubleRole) && filterDeviceType.includes(this.alarmInfo.alarmDeviceTypeId)) {
      this.turnTroubleShow = true;
    }
    this.$alarmTurnTroubleService.troubleEmit.subscribe((isTurn: IsTurnTroubleEnum) => {
      this.isTurnTrouble = isTurn;
    });
    this.$alarmTurnTroubleService.showClearBarrierEmit.subscribe((isShow: boolean) => {
      this.reloadClearBarrierData = isShow;
    });
  }

  /**
   * 转故障处理
   */
  public turnTrouble(): void {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.whetherPassTroubleDispose,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
        // 所有电子锁相关的设施类型
        const filterDeviceType = TroubleUtil.filterDeviceType();
        if (filterDeviceType.indexOf(this.alarmInfo.alarmDeviceTypeId) === -1) {
          this.$message.info(this.commonLanguage.nonsupportTrouble);
          return;
        }
        if (this.isTurnTrouble === IsTurnTroubleEnum.canTurn) {
          let data = new AlarmToTroubleModel();
          data.alarmId = this.alarmInfo.id;
          // 获取资产数据
          this.getAssetsData({
            deviceId: this.alarmInfo.alarmDeviceId,
            equipmentId: this.alarmInfo.alarmSource
          }).then((res: AlarmToTroubleModel) => {
            if (res) {
              data = Object.assign(data, res);
            }
            this.handleTurn(data);
          });
        } else if (this.isTurnTrouble === IsTurnTroubleEnum.noTurn) {
          this.$message.info(this.language.getUnderway);
        } else {
          this.$message.error(this.commonLanguage.serverError);
        }
      }
    });
  }

  /**
   * 转故障
   */
  private handleTurn(data: AlarmToTroubleModel): void {
    this.$alarmService.alarmToTrouble(data).subscribe((result) => {
      if (result.code === 0) {
        this.$alarmTurnTroubleService.eventEmit.emit(SelectedIndexEnum.trouble);
        this.$message.success(this.commonLanguage.handleSuccessMsg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 派单销障
   */
  public clickOrdersCancelAccount(): void {
    if (this.reloadClearBarrierData) {
      this.$message.info(this.language.turnWork);
      return;
    }
    this.addOrderTitle = this.language.addEliminateWork;
    this.isShowWorkOrder = true;
  }

  /**
   * 误判
   */
  public erroneousJudgement(): void {
    this.modalType = AlarmModalTypeEnum.judge;
    this.confirmTitle = this.language.isConfirmJudge;
    this.dealTable = true;
    this.initFormDeal();
  }

  /**
   * 已处理
   */
  public processed(): void {
    this.modalType = AlarmModalTypeEnum.handle;
    this.confirmTitle = this.language.isConfirmDispose;
    this.dealTable = true;
    this.initFormDeal();
  }

  /**
   * 查看类似案例
   */
  public lookSimilarCases(): void {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.lookSimilarCases,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
      }
    });
  }

  /**
   * 保存到知识库
   */
  public saveRepository(): void {
    // 组件中的确定取消按钮是反的所以反着用
    this.$modal.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.saveRepository,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {
      },
      nzOnCancel: () => {
      }
    });
  }

  /**
   * 已处理
   * param event
   */
  public formInstanceDeal(event: { instance: FormOperate }): void {
    this.formStatusDeal = event.instance;
    this.formStatusDeal.group.statusChanges.subscribe(() => {
      this.isDealDis = this.formStatusDeal.getValid();
    });
  }

  /**
   * 已处理确定
   */
  public deal(): void {
    let urlPath;
    const data = this.formStatusDeal.group.getRawValue();
    this.remark = null;
    if (this.modalType === AlarmModalTypeEnum.handle) {
      // 已处理
      urlPath = AlarmPathEnum.alarmProcessed;
    } else if (this.modalType === AlarmModalTypeEnum.judge) {
      // 误判
      urlPath = AlarmPathEnum.alarmMisJudgment;
    }
    // 已处理
    this.$alarmService[urlPath](this.alarmInfo.id, data.remark).subscribe((result) => {
      if (result.code === 0) {
        if (urlPath === AlarmPathEnum.alarmProcessed) {
          this.$message.success(this.commonLanguage.handleSuccessMsg);
        } else {
          this.$message.success(result.msg);
        }
        this.processStatus.emit();
        this.formStatusDeal.resetControlData('remark', '');
      } else {
        this.$message.error(result.msg);
      }
    });
    this.dealTable = false;
  }

  /**
   * 取消
   */
  public cancel(): void {
    this.isDealDis = false;
    this.dealTable = false;
    this.remark = null;
    this.initFormDeal();
  }

  /**
   * 已处理配置
   */
  public initFormDeal(): void {
    this.formColumnDeal = [
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'textarea',
        col: 24,
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 关闭工单弹框
   */
  public closeClearBarrier(): void {
    this.isShowWorkOrder = false;
  }

  /**
   * 获取资产数据
   */
  private getAssetsData(param): Promise<AlarmToTroubleModel> {
    return new Promise((resolve, reject) => {
      this.$alarmService.getAssetDataForFault(param).subscribe((res) => {
        if (res.code === ResultCodeEnum.success && res.data.deviceInfo) {
          const data: AlarmToTroubleModel = {
            projectId: res.data.deviceInfo.projectId,
            deviceProductId: res.data.deviceInfo.productId,
            deviceAreaId: res.data.deviceInfo.areaId,
            deviceAreaCode: res.data.deviceInfo.areaCode,
            equipment: []
          };
          if (res.data.equipmentInfoVO) {
            data.equipment.push({
              equipmentProductId: res.data.equipmentInfoVO.productId,
              equipmentAreaId: res.data.equipmentInfoVO.areaId,
              equipmentAreaCode: res.data.equipmentInfoVO.areaCode,
              equipmentModel: res.data.equipmentInfoVO.equipmentModel
            });
          }
          resolve(data);
        } else {
          resolve(null);
        }
      }, () => {
        resolve(null);
      });
    });
  }

}
