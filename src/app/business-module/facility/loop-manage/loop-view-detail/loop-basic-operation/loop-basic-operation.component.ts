import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LoopApiService} from '../../../share/service/loop/loop-api.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {LoopPullCloseBreakModel} from '../../../share/model/loop-pull-close-break.model';
import {InstructSendRequestModel} from '../../../../../core-module/model/group/instruct-send-request.model';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LoopStatusEnum} from '../../../../../core-module/enum/loop/loop.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
/**
 * 回路详情操作模块
 */
@Component({
  selector: 'app-loop-basic-operation',
  templateUrl: './loop-basic-operation.component.html',
  styleUrls: ['./loop-basic-operation.component.scss']
})
export class LoopBasicOperationComponent implements OnInit {
  // 回路编号
  @Input() public loopCode: string;
  // 集中控制器id
  @Input() public equipmentId: string;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 回路状态枚举
  public loopStatusEnum = LoopStatusEnum;
  // 页面是否loading
  public loading: boolean = false;

  constructor(
    private $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
    private $message: FiLinkModalService,
    private $router: Router,
    private $loopService: LoopApiService,
    private $modalService: NzModalService,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   *拉合闸操作
   */
  public loopStatusChange(event: LoopStatusEnum): void {
    // 回路拉合闸操作提示
    let msgTip;
    if (event === LoopStatusEnum.brake) {
      msgTip = this.assetLanguage.pullBrakeOperateTip;
    } else {
      msgTip = this.assetLanguage.closeBrakeOperateTip;
    }
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: `<span>${msgTip}</span>`,
      nzOkText: this.language.handleCancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.handleOk,
      nzOnCancel: () => {
        // 回路无控制对象，回路编号，不支持拉合闸操作
        if (this.equipmentId && this.loopCode) {
          this.loading = true;
          // 区分拉合闸指令枚举
          const commandId = event === LoopStatusEnum.brake ? ControlInstructEnum.closeBreak : ControlInstructEnum.openBreak;
          const param = new LoopPullCloseBreakModel([{equipmentId: this.equipmentId, loopCode: this.loopCode}]);
          const operateRequest = new InstructSendRequestModel<LoopPullCloseBreakModel>(commandId, [this.equipmentId], param);
          this.$loopService.pullBrakeOperate(operateRequest).subscribe((result: ResultModel<string>) => {
            if (result.code === ResultCodeEnum.success) {
              this.$message.success(`${this.languageTable.contentList.distribution}!`);
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(result.msg);
            }
          }, () => {
            this.loading = false;
          });
        } else {
          this.$message.info(this.assetLanguage.noCommandInfoTip);
        }

      }
    });
  }

}
