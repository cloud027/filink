import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OperationButtonEnum} from '../../share/enum/operation-button.enum';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {StrategyPermissionModel} from '../../share/model/strategy.permission.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-policy-basic-operation',
  templateUrl: './policy-basic-operation.component.html',
  styleUrls: ['./policy-basic-operation.component.scss']
})
export class PolicyBasicOperationComponent implements OnInit {
  /**
   * 批量控制枚举 此处any是因为每个地方枚举命名不一样
   */
  @Input() operatePermissionEnum: any;
  // 发送操作事件
  @Output() operationNotify = new EventEmitter<string>();
  /**
   * 批量操作权限码
   */
  public strategyPermissionModel: StrategyPermissionModel = new StrategyPermissionModel();
  // 选中的操作
  public isActive: string = '';
  // 操作枚举
  public OperationButtonEnum = OperationButtonEnum;
  // 设备列表多语言
  public languageTable: ApplicationInterface;

  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 提示
    private $message: FiLinkModalService,
  ) {
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  public ngOnInit(): void {
    if (this.operatePermissionEnum) {
      // 获取批量操作的权限码
      Object.keys(this.operatePermissionEnum).forEach(v => {
        this.strategyPermissionModel[v] = this.operatePermissionEnum[v];
      });
    }
  }

  /**
   * 选择操作方式
   * @ param type
   */
  public handleOperation(type: OperationButtonEnum): void {
    this.isActive = type;
    this.operationNotify.emit(type);
  }
}
