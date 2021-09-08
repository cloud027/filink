import { Component, Input, OnInit } from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {TroubleService} from '../../../../share/service';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TROUBLE_FLOW} from '../../../../share/const/trouble-process.const';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {HandleStatusEnum} from '../../../../../../core-module/enum/trouble/trouble-common.enum';
import {IsShowUintEnum} from '../../../../share/enum/trouble.enum';
import {LanguageTypeEnum} from '../../../../../../core-module/enum/language-type.enum';
/**
 * 基本故障操作
 */
@Component({
  selector: 'app-fault-operation',
  templateUrl: './fault-operation.component.html',
  styleUrls: ['./fault-operation.component.scss']
})
export class FaultOperationComponent implements OnInit {
  // 故障id
  @Input() troubleId: string;
  // 处理状态
  @Input() handleStatus: string;
  // 流程节点
  @Input() flowId: string;
  // 流程实例id
  @Input() instanceId: string;
  // 故障来源
  @Input() troubleSource: string;
  // 区域code
  @Input() areaCode: string;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 是否编辑
  public isEditFlag: boolean = false;
  // 是否可删除
  public isDeleteFlag: boolean = false;
  // 是否可指派
  public isShowAssignFlag: boolean = false;
  // 是否可查看流程
  public isViewFlowFlag: boolean = false;

  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    private $modal: NzModalService,
    public $troubleService: TroubleService,
    private $message: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 是否编辑
    this.isEditFlag = this.isEdit();
    // 是否可删除
    this.isDeleteFlag = this.isDelete();
    // 是否可指派
    this.isShowAssignFlag = this.isShowAssign();
    // 是否可查看流程
    this.isViewFlowFlag = this.isViewFlow();
  }

  /**
   * 编辑
   */
  public clickUpdate(): void {
    this.$router.navigate(['business/trouble/trouble-list/update'],
      {queryParams: {type: OperateTypeEnum.update, id: this.troubleId, sourceType: this.troubleSource}}).then();
  }

  /**
   * 删除
   */
  public clickDelete(): void {
      // 组件中的确定取消按钮是反的所以反着用
      this.$modal.confirm({
        nzTitle: this.language.prompt,
        nzContent: this.language.troubleAffirmDelete,
        nzMaskClosable: false,
        nzKeyboard: false,
        nzOkText: this.language.cancelText,
        nzCancelText: this.language.okText,
        nzOkType: 'danger',
        nzOnOk: () => {
        },
        nzOnCancel: () => {
          this.$troubleService.deleteTrouble([this.troubleId]).subscribe((result: ResultModel<string>) => {
            if (result.code === ResultCodeEnum.success) {
                this.$message.success(result.msg);
                this.$router.navigate(['business/trouble/trouble-list']).then();
          } else {
              this.$message.error(result.msg);
            }
          });
        }
      });
    }

  /**
   * 指派
   */
  public clickAssign(): void {
    this.$router.navigate(['business/trouble/trouble-list/assign'],
      {queryParams: {
          id: this.troubleId,
          handleStatus: this.handleStatus,
          areaCode: this.areaCode,
          // 指派页是否展示单位
          isAssignShowUnit: IsShowUintEnum.yes,
      }}).then();
  }

  /**
   * 是否可指派
   * desc 未提交或者处理中且流程节点为五，七，八，十才可指派
   */
  public isShowAssign(): boolean {
    if (this.handleStatus === HandleStatusEnum.uncommit) {
      return true;
    } else if (this.handleStatus === HandleStatusEnum.processing && (
      this.flowId === TROUBLE_FLOW.five || this.flowId === TROUBLE_FLOW.seven ||
      this.flowId === TROUBLE_FLOW.eight || this.flowId === TROUBLE_FLOW.ten)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 是否可删除  只能删除未提交和已完成以及已打回的
   */
  public isDelete(): boolean {
    return (this.handleStatus !== HandleStatusEnum.commit && this.handleStatus !== HandleStatusEnum.processing);
  }

  /**
   * 是否可编辑  只有未提交的才可编辑
   */
  public isEdit(): boolean {
    return this.handleStatus === HandleStatusEnum.uncommit;
  }

  /**
   * 是否可查看流程  除了未提交都可查看
   */
  public isViewFlow(): boolean {
    const lang = localStorage.getItem('localId');
    if (lang === LanguageTypeEnum.en) {
      return false;
    } else {
      return this.handleStatus !== HandleStatusEnum.uncommit;
    }
  }

  /**
   * 流程
   */
  public clickFlow(): void {
    this.$router.navigate(['business/trouble/trouble-list/flow'],
      {queryParams: {instanceId: this.instanceId, id: this.troubleId}}).then();
  }
}
