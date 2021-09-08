import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../../shared-module/util/session-util';

/**
 * 退单确认弹窗组件
 */
@Component({
  selector: 'app-chargeback-work-order',
  templateUrl: './chargeback-work-order.component.html',
  styleUrls: ['./chargeback-work-order.component.scss']
})
export class ChargebackWorkOrderComponent implements OnInit {

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }
  get xcVisible() {
    return this._xcVisible;
  }
  @Input() permissionCode: string;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 权限
  public isPermission: boolean = false;
  // 显示隐藏
  private _xcVisible: boolean = false;

  constructor(
    private $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
  ) { }

  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.isPermission = SessionUtil.checkHasRole(this.permissionCode);
  }

  /**
   * 关闭
   */
  public handleClose(): void {
    this.xcVisible = false;
  }

  /**
   * 重新生成
   */
  public regenerateOrder(): void {
    this.selectDataChange.emit(false);
  }
  /**
   * 退单确认
   */
  public confirmOrder(): void {
    this.selectDataChange.emit(true);
  }
}
