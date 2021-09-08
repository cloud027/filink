import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RouterJumpConst} from '../../../../../business-module/application-system/share/const/application-system.const';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {Router} from '@angular/router';
import {SessionUtil} from '../../../../util/session-util';

@Component({
  selector: 'app-application-operate',
  templateUrl: './application-operate.component.html',
  styleUrls: ['./application-operate.component.scss']
})
export class ApplicationOperateComponent implements OnInit {
  @Input() operationList;
  // 操作按钮事件
  @Output() operationNotify = new EventEmitter();
  // 亮度值
  public convenientVal: number = 0;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 操作按钮标题
  public title: string = '';

  constructor(
    // 提示
    private $message: FiLinkModalService,
    // 路由
    private $router: Router,
    // 多语言配置
    private $nzI18n: NzI18nService
  ) {
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit() {
    const url = this.$router.url;
    if (url.includes(RouterJumpConst.groupDetails) || url.includes(RouterJumpConst.releaseGroupDetails)) {
      this.title = this.languageTable.equipmentTable.groupStatue;
    } else {
      this.title = this.languageTable.controlType.equipment;
    }
  }

  /**
   * 调整亮度
   */
  public handleConvenientChange($event, item): void {
    console.log($event);
    if (!SessionUtil.checkHasRole(item.code)) {
      this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
      return;
    }
    const data = {
      type: item.id,
      convenientVal: item.value,
      paramId: item.paramId
    };
    this.operationNotify.emit(data);
  }

  /**
   * 设备操作按钮
   * @ param type 开,关,亮度
   */
  public handleEquipmentOperation(type: string, code: string): void {
    if (!SessionUtil.checkHasRole(code)) {
      this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
      return;
    }
    const data = {
      type: type
    };
    this.operationNotify.emit(data);
  }
}
