import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ApplicationService} from '../../../share/service/application.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {workOrderStatus} from '../../../share/util/application.util';
import {ContentExamineDetailModel} from '../../../share/model/content.examine.detail.model';
import {WorkOrderActTypeEnum, WorkOrderResultStatusEnum} from '../../../share/enum/work.order.enum';
import {WorkOrderStateStatusEnum} from '../../../../../core-module/enum/work-order/work-order.enum';
import {WorkOrderOperationModel} from '../../../share/model/work.order.operation.model';
import {CheckUserModel} from '../../../share/model/check.user.model';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ContentWorkWordEnum} from '../../../share/enum/auth.code.enum';
import {FileTypeEnum} from '../../../share/enum/program.enum';
import {SystemCommonUtil} from '../../../share/util/system-common-util';


/**
 * 审核详情页面
 */
@Component({
  selector: 'app-content-examine-details',
  templateUrl: './content-examine-details.component.html',
  styleUrls: ['./content-examine-details.component.scss']
})
export class ContentExamineDetailsComponent implements OnInit {
  /**
   * 退单模拟框
   */
  public isChargeBack: boolean = false;
  /**
   * 转派模拟框
   */
  public isTransfer: boolean = false;
  /**
   * 删除模拟框
   */
  public isDelete: boolean = false;
  /**
   * 确认模拟框
   */
  public isCancel: boolean = false;
  /**
   * 审核信息数据
   */
  public informationData: ContentExamineDetailModel;
  /**
   * 工单操作数据
   */
  public workOrderData: WorkOrderOperationModel = new WorkOrderOperationModel([]);
  /**
   * 工单操作类型
   */
  public workOrderActTypeEnum = WorkOrderActTypeEnum;
  /**
   * 指定人ID
   */
  public designee: string;
  /**
   * 指定人列表
   */
  public designeeArr: CheckUserModel[] = [];
  /**
   * 节目地址
   */
  public programPath: string;
  /**
   * 国际化
   */
  public language: ApplicationInterface;

  /**
   * loading状态
   */
  public isLoading: boolean = false;
  /**
   * 是否是视屏
   */
  public isVideo: boolean = true;
  /**
   * 按钮是否展示
   */
  public buttonShow: boolean = false;
  /**
   * 节目信息是否展示
   */
  public isProgramShow: boolean = false;
  /**
   * 提交建议提示
   */
  public tipsShow: boolean = false;
  /**
   * 退单原因提示
   */
  public tipsChargeBack: boolean = false;
  /**
   * 转派原因提示
   */
  public tipsTransfer: boolean = false;
  /**
   * 是否自己的工单页面
   */
  public isMyWorkOrder: boolean = true;
  /**
   * 工单权限枚举
   */
  public contentWorkWordEnum = ContentWorkWordEnum;
  /**
   * 当前语言环境
   */
  public currentLangType: boolean = false;
  /**
   * @param $applicationService 后台接口服务
   * @param $activatedRoute 路由传参服务
   * @param $router 路由跳转服务
   * @param $message 提示信息服务
   * @param $nzI18n 国际化服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
    private $nzI18n: NzI18nService,
  ) {
  }

  public ngOnInit(): void {
    this.currentLangType = localStorage.getItem('localId') === 'en_US';
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.workOrderId) {
        this.initialization(params.workOrderId);
      }
    });
  }

  /**
   * 初始化
   * @param workOrderId 工单ID
   */
  private initialization(workOrderId: string): void {
    this.$applicationService.lookReleaseWorkOrder(workOrderId)
      .subscribe((result: ResultModel<ContentExamineDetailModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.informationData = result.data;
          this.isMyWorkOrder = SessionUtil.getUserId() === this.informationData.personLiable;
          // 审核建议
          this.workOrderData.examineAdvise = result.data.examineAdvise;
          // 审核结果
          this.workOrderData.auditResults = this.isMyWorkOrder ? result.data.auditResults ||
            WorkOrderResultStatusEnum.pass : result.data.auditResults;
          // 期望完工时间
          this.informationData.expectCompTime = SystemCommonUtil.processingTime(this.informationData.expectCompTime);
          // 实际完工时间
          this.informationData.actualCompTime = SystemCommonUtil.processingTime(this.informationData.actualCompTime);
          // 创建时间
          this.informationData.createTime = SystemCommonUtil.processingTime(this.informationData.createTime);
          // 判断按钮是否展示
          this.buttonShow = this.informationData.workOrderStatus === WorkOrderStateStatusEnum.assigned;
          // 判断节目信息是否展示
          this.isProgramShow = this.informationData.workOrderStatus === WorkOrderStateStatusEnum.assigned || this.informationData.workOrderStatus === WorkOrderStateStatusEnum.completed;
          // 工单状态
          this.informationData.workOrderStatus = workOrderStatus(this.$nzI18n, this.informationData.workOrderStatus) as WorkOrderStateStatusEnum;
          this.isVideo = this.informationData.program.programFileType === FileTypeEnum.video;
          // 将'\'换成'/'
          this.programPath = this.informationData.program.programPath.replace(/\\/g, '/');
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 工单操作
   * @param actType 操作动作 0:删除 1:取消 2:转派 3:退单 4:提交
   */
  public onWorkOrderOperation(actType: WorkOrderActTypeEnum): void {
    this.isLoading = true;
    const parameterObject = new WorkOrderOperationModel([this.informationData.workOrderId], this.informationData.workOrderId, actType, this.workOrderData.examineAdvise,
      this.workOrderData.transferReason, this.workOrderData.causeReason, this.workOrderData.auditResults, this.designee, this.informationData.workOrderName);
    this.$applicationService.releaseWorkOrder(parameterObject)
      .subscribe((result: ResultModel<ContentExamineDetailModel[]>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.frequentlyUsed.operationSuccess);
          this.$router.navigate(['business/application/release/content-examine'], {}).then();
        } else {
          this.$message.warning(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
  }

  /**
   * open模态框方法
   * @param actType  操作动作 0:删除 1:取消 2:转派 3:退单 4:提交
   */
  public onChargeback(actType: WorkOrderActTypeEnum): void {
    // 当不是自己的页面时进入
    if (!this.isMyWorkOrder) {
      return;
    }
    switch (actType) {
      case WorkOrderActTypeEnum.delete :
        if (this.informationData.workOrderStatus === workOrderStatus(this.$nzI18n, WorkOrderStateStatusEnum.assigned)) {
          // 已指派的工单不可删除
          this.$message.warning(`${this.language.auditContent.cannotBeDeleted}!`);
          return;
        }
        this.isDelete = true;
        break;
      case WorkOrderActTypeEnum.cancel :
        if (this.informationData.workOrderStatus === workOrderStatus(this.$nzI18n, WorkOrderStateStatusEnum.assigning)) {
          // 工单不可取消
          this.$message.warning(`${this.language.auditContent.cannotBeCancel}!`);
          return;
        }
        this.isCancel = true;
        break;
      case WorkOrderActTypeEnum.transfer :
        this.isTransfer = true;
        this.getDesigneeList();
        break;
      case WorkOrderActTypeEnum.chargeback :
        this.isChargeBack = true;
        break;
    }
  }

  /**
   * 获取指定人列表
   */
  private getDesigneeList(): void {
    this.$applicationService.getCheckUsers(this.informationData.program.addUser)
      .subscribe((result: ResultModel<CheckUserModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          if (!_.isEmpty(result.data)) {
            this.designeeArr = result.data;
            this.designee = this.designeeArr[0].id;
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 模态框确定方法
   * @param actType  操作动作 0:删除 1:取消 2:转派 3:退单 4:提交
   */
  public onHandleOk(actType: WorkOrderActTypeEnum): void {
    this.onHandleCancel();
    this.onWorkOrderOperation(actType);
  }

  /**
   * 模态框取消方法
   */
  public onHandleCancel(): void {
    this.isChargeBack = false;
    this.isTransfer = false;
    this.isDelete = false;
    this.isCancel = false;
  }

  /**
   * 备注长度提示
   */
  public inputEvent(): void {
    this.tipsShow = this.workOrderData.examineAdvise ? this.workOrderData.examineAdvise.length > 255 : false;
    this.tipsChargeBack = this.workOrderData.causeReason ? this.workOrderData.causeReason.length > 255 : false;
    this.tipsTransfer = this.workOrderData.transferReason ? this.workOrderData.transferReason.length > 255 : false;
  }

}
